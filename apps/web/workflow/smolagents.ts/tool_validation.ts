import * as ts from "typescript";

type ClassAttributes = Set<string>;

class MethodChecker {
  private undefinedNames: Set<string>;
  private imports: Record<string, string>;
  private fromImports: Record<string, [string, string]>;
  private assignedNames: Set<string>;
  private argNames: Set<string>;
  private classAttributes: ClassAttributes;
  private _errors: string[];
  private checkImports: boolean;
  private typingNames: Set<string>;

  get errors(): string[] {
    return this._errors;
  }

  constructor(classAttributes: ClassAttributes, checkImports = true) {
    this.undefinedNames = new Set();
    this.imports = {};
    this.fromImports = {};
    this.assignedNames = new Set();
    this.argNames = new Set();
    this.classAttributes = classAttributes;
    this._errors = [];
    this.checkImports = checkImports;
    this.typingNames = new Set(["Any"]);
  }

  visitArguments(node: ts.FunctionDeclaration | ts.MethodDeclaration): void {
    // Collect function arguments
    node.parameters.forEach((param) => {
      if (ts.isIdentifier(param.name)) {
        this.argNames.add(param.name.text);
      }
    });
  }

  visitImport(node: ts.ImportDeclaration): void {
    const moduleName = (node.moduleSpecifier as ts.StringLiteral).text;
    if (node.importClause?.namedBindings && ts.isNamedImports(node.importClause.namedBindings)) {
      node.importClause.namedBindings.elements.forEach((element) => {
        const actualName = element.propertyName?.text || element.name.text;
        this.imports[actualName] = moduleName;
      });
    }
  }

  visitAssign(node: ts.VariableStatement): void {
    node.declarationList.declarations.forEach((declaration) => {
      if (ts.isIdentifier(declaration.name)) {
        this.assignedNames.add(declaration.name.text);
      }
    });
  }

  visitCall(node: ts.CallExpression): void {
    if (ts.isIdentifier(node.expression)) {
      const funcName = node.expression.text;
      if (
        !this.isBuiltin(funcName) &&
        !this.argNames.has(funcName) &&
        !this.classAttributes.has(funcName) &&
        !this.assignedNames.has(funcName) &&
        !Object.keys(this.imports).includes(funcName)
      ) {
        this._errors.push(`Name '${funcName}' is undefined.`);
      }
    }
  }

  visitName(node: ts.Identifier): void {
    const name = node.text;
    if (
      !this.isBuiltin(name) &&
      !this.argNames.has(name) &&
      !this.classAttributes.has(name) &&
      !this.assignedNames.has(name) &&
      !Object.keys(this.imports).includes(name)
    ) {
      this._errors.push(`Name '${name}' is undefined.`);
    }
  }

  private isBuiltin(name: string): boolean {
    const builtinNames = new Set<string>(["console", "Math", "Array", "String", "Number", "Object", "Set"]);
    return builtinNames.has(name);
  }

  // Additional visitor methods can be implemented as needed
}

function validateToolAttributes(cls: any, checkImports = true): void {
  const source = cls.toString(); // Assuming the class source is available as a string
  const sourceFile = ts.createSourceFile("temp.ts", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

  const errors: string[] = [];
  const classAttributes = new Set<string>();

  function visitClass(node: ts.ClassDeclaration): void {
    if (!node.name) {
      throw new Error("Source code must define a class");
    }

    const classLevelChecker = new ClassLevelChecker();
    ts.forEachChild(node, (child) => classLevelChecker.visit(child));

    const methodChecker = new MethodChecker(classLevelChecker.classAttributes, checkImports);

    node.members.forEach((member) => {
      if (ts.isMethodDeclaration(member)) {
        methodChecker.visitArguments(member);
        ts.forEachChild(member, (child) => {
          if (ts.isVariableStatement(child)) {
            methodChecker.visitAssign(child);
          } else if (ts.isCallExpression(child)) {
            methodChecker.visitCall(child);
          } else if (ts.isIdentifier(child)) {
            methodChecker.visitName(child);
          }
        });
        errors.push(...methodChecker.errors.map((err) => `- ${member.name?.getText()}: ${err}`));
      }
    });

    if (classLevelChecker.complexAttributes.size > 0) {
      errors.push(
        `Complex attributes should be defined in constructor, not as class attributes: ${[
          ...classLevelChecker.complexAttributes,
        ].join(", ")}`,
      );
    }
  }

  ts.forEachChild(sourceFile, (node) => {
    if (ts.isClassDeclaration(node)) {
      visitClass(node);
    }
  });

  if (errors.length > 0) {
    throw new Error("Tool validation failed:\n" + errors.join("\n"));
  }
}

class ClassLevelChecker {
  classAttributes: Set<string>;
  complexAttributes: Set<string>;

  constructor() {
    this.classAttributes = new Set();
    this.complexAttributes = new Set();
  }

  visit(node: ts.Node): void {
    if (ts.isPropertyDeclaration(node) && node.name) {
      if (ts.isIdentifier(node.name)) {
        this.classAttributes.add(node.name.text);
      }

      if (!this.isSimpleLiteral(node.initializer)) {
        if (ts.isIdentifier(node.name)) {
          this.complexAttributes.add(node.name.text);
        }
      }
    }
  }

  private isSimpleLiteral(node?: ts.Node): boolean {
    return (
      !node ||
      ts.isStringLiteral(node) ||
      ts.isNumericLiteral(node) ||
      ts.isObjectLiteralExpression(node) ||
      ts.isArrayLiteralExpression(node)
    );
  }
}
