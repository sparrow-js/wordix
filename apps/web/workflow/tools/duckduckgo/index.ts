import type { ToolResult } from "../../types";
import { BaseTool } from "../baseTool";

export class DuckDuckGoTool extends BaseTool {
  async execute(input: {
    query: string;
    type?: "text" | "image" | "news" | "video";
  }): Promise<ToolResult<string>> {
    const type = input.type || "text";
    let result;

    console.log("****************", input);

    try {
      switch (type) {
        case "text":
          result = await import("./search").then((mod) => mod.default({ query: input.query }));
          break;
        case "image":
          result = await import("./searchImg").then((mod) => mod.default({ query: input.query }));
          break;
        case "news":
          result = await import("./searchNews").then((mod) => mod.default({ query: input.query }));
          break;
        case "video":
          result = await import("./searchVideo").then((mod) => mod.default({ query: input.query }));
          break;
        default:
          throw new Error("Invalid search type");
      }

      return {
        type: "text",
        content: result.result,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        type: "text",
        content: error.message || "Search failed",
        timestamp: Date.now(),
      };
    }
  }

  async validate(input: any): Promise<boolean> {
    return (
      typeof input === "object" &&
      typeof input.query === "string" &&
      (!input.type || ["text", "image", "news", "video"].includes(input.type))
    );
  }
}
