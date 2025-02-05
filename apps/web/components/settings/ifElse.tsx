import { VariableInput } from "@/components/common/VariableInput";
import { Button } from "@/components/ui/button"; // Add this import at the top
import { Switch } from "@/components/ui/switch";
import useStores from "@/hooks/useStores";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronLeft, ChevronRight, Equal, Plus, Trash2, WholeWord } from "lucide-react";
import { observer } from "mobx-react";
const comparatorOptions: { label: string; value: string; icon: React.ReactNode }[] = [
  { label: "GREATER THAN", value: "gt", icon: <ChevronRight className="h-4 w-4" /> },
  {
    label: "GREATER OR EQUAL",
    value: "gte",
    icon: (
      <div className="flex items-center">
        <ChevronRight className="h-4 w-4" />
        <Equal className="h-4 w-4" />
      </div>
    ),
  },
  { label: "SMALLER THAN", value: "lt", icon: <ChevronLeft className="h-4 w-4" /> },
  {
    label: "SMALLER OR EQUAL",
    value: "lte",
    icon: (
      <div className="flex items-center">
        <ChevronLeft className="h-4 w-4" />
        <Equal className="h-4 w-4" />
      </div>
    ),
  },
];

const expressionTypes = [
  {
    label: "Match",
    value: "match",
    icon: <Equal />,
  },
  {
    label: "Contains",
    value: "contains",
    icon: <WholeWord />,
  },
  {
    label: "Relative",
    value: "relative",
    icon: <ChevronRight />,
  },
];

const IfElseSetting = observer(({ onDelete, editor }) => {
  const { ifElses, mentions, workbench, setting } = useStores();
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div>
          <div>
            <div className="font-default">
              <div>
                <div>
                  <p className="font-default text-xl font-bold">If-Else</p>
                  <p className="mt-2">
                    This can be used for branching logic - i.e. running only certain blocks dependant on the value of a
                    variable
                  </p>
                  <br />
                  <div className="mb-9 mt-5 @container">
                    <p className="font-bold">
                      Name<span className="ml-1 text-xs font-normal text-stone-700"></span>
                    </p>
                    <p className="mb-1 mt-1 text-sm text-stone-400">Name this block</p>
                    <input
                      className="w-full border border-b-4 border-transparent p-2 transition-colors duration-200 hover:bg-stone-50 focus:mb-[3px] focus:rounded-lg focus:border focus:bg-white focus:shadow-lg focus:outline-0 border-b-stone-200 focus:border-stone-100"
                      placeholder="Empty"
                      type="text"
                      value={ifElses.ifElse.label}
                      onChange={(e) => {
                        ifElses.updateDataSyncToNode("label", e.target.value);
                      }}
                    />
                  </div>
                  <div className="mt-10">
                    <p className="font-bold">Expressions</p>
                    <p className="mb-1 mt-1 text-sm text-stone-400">Set the parameters for the condition expressions</p>
                    <div className="mt-5">
                      {ifElses.ifElse.list.map((item) => {
                        return (
                          <div key={item.id}>
                            {item.name === "if" ? (
                              <div className="mb-4 mt-2 select-none rounded-md border-2 border-stone-100">
                                <div
                                  onClick={() => {
                                    item.update({
                                      isOpen: !item.isOpen,
                                    });
                                  }}
                                  className={cn(
                                    "group flex items-center p-2 pl-3 font-semibold tracking-tight text-stone-600 transition-colors duration-200 hover:bg-stone-50 hover:text-stone-800 active:bg-stone-100 border-b border-b-stone-100 hover:shadow-sm",
                                    item.isOpen ? "border-b-stone-200 bg-stone-50" : "",
                                  )}
                                >
                                  <span className="whitespace-nowrap uppercase">if</span>
                                  <div className="ml-3 h-fit font-mono text-sm font-semibold text-stone-200 group-hover:text-stone-300 group-active:text-stone-400">
                                    {item.type === "match" && (
                                      <div className="w-fit">
                                        <div className="inline-block max-w-fit truncate align-bottom w-44">
                                          {mentions.parseMentionValue(item.expression.match?.firstValue)}
                                        </div>
                                        <span> == </span>
                                        <div className="inline-block max-w-fit truncate align-bottom w-44">
                                          {mentions.parseMentionValue(item.expression.match?.secondValue)}
                                        </div>
                                      </div>
                                    )}

                                    {item.type === "contains" && (
                                      <div className="w-fit">
                                        <div className="inline-block max-w-fit truncate align-bottom w-44">
                                          {mentions.parseMentionValue(item.expression.contains?.value)}
                                        </div>
                                        <span> in </span>
                                        <div className="inline-block max-w-fit truncate align-bottom w-44">
                                          {mentions.parseMentionValue(item.expression.contains?.searchValue)}
                                        </div>
                                      </div>
                                    )}

                                    {item.type === "relative" && (
                                      <div className="w-fit">
                                        <div className="inline-block max-w-fit truncate align-bottom w-44">
                                          {mentions.parseMentionValue(item.expression.relative?.firstValue)}
                                        </div>
                                        <span> {item.expression.relative?.comparator} </span>
                                        <div className="inline-block max-w-fit truncate align-bottom w-44">
                                          {mentions.parseMentionValue(item.expression.relative?.secondValue)}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <span
                                    className={cn(
                                      "ml-auto mr-0.5 transition-transform",
                                      item.isOpen ? "rotate-180" : "",
                                    )}
                                  >
                                    <ChevronDown />
                                  </span>
                                </div>
                                <div className={cn("px-4 pb-6", item.isOpen ? "block" : "hidden")}>
                                  <div className="mb-9 mt-5 @container">
                                    <p className="font-bold">
                                      Type<span className="ml-1 text-xs font-normal text-stone-700"></span>
                                    </p>
                                    <p className="mb-1 mt-1 text-sm text-stone-400">
                                      Set the type of expression that will be evaluated
                                    </p>
                                    <div className="mt-4 flex w-full justify-start gap-4 px-0">
                                      {expressionTypes.map((type) => {
                                        return (
                                          <div
                                            key={type.value}
                                            className={cn(
                                              "relative aspect-square min-w-[75px] max-w-[180px] flex-1 rounded-xl border border-stone-200 hover:shadow-xl",
                                              item.type === type.value && "bg-stone-100",
                                            )}
                                            onClick={() => {
                                              item.updateDataSyncToNode("type", type.value);
                                            }}
                                          >
                                            <div className="absolute right-1 top-1 flex gap-2"></div>
                                            <div className="grid h-full w-full place-content-center">
                                              <div className="mb-2 ml-auto mr-auto mt-2 w-fit">{type.icon}</div>
                                              <div className="px-0.5 text-center leading-3">
                                                <span className="select-none text-xs font-bold uppercase">
                                                  {type.label}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                  {item.type === "match" && (
                                    <div className="mt-3">
                                      <div>
                                        <div className="mb-9 mt-5 @container">
                                          <p className="font-bold">
                                            First value<span className="ml-1 text-xs font-normal text-stone-700"></span>
                                          </p>
                                          <VariableInput
                                            value={item.expression.match?.firstValue?.value || ""}
                                            type={item.expression.match?.firstValue?.type}
                                            placeholder="Type '@' to use a variable"
                                            variables={mentions.atList}
                                            onChange={(value, type) => {
                                              item.updateDataSyncToNode("expression.match.firstValue", { type, value });
                                            }}
                                          />
                                        </div>
                                        <div className="mb-9 mt-5 @container">
                                          <p className="font-bold">
                                            Second value
                                            <span className="ml-1 text-xs font-normal text-stone-700"></span>
                                          </p>
                                          <VariableInput
                                            value={item.expression.match?.secondValue?.value || ""}
                                            type={item.expression.match?.secondValue?.type}
                                            placeholder="Type '@' to use a variable"
                                            variables={mentions.atList}
                                            onChange={(value, type) => {
                                              item.updateDataSyncToNode("expression.match.secondValue", {
                                                type,
                                                value,
                                              });
                                            }}
                                          />
                                        </div>
                                        <div className="mb-9 mt-5">
                                          <p className="font-bold">Additional settings</p>
                                          <div>
                                            <label className="relative mt-4 inline-flex cursor-pointer items-center">
                                              <Switch
                                                checked={item.expression.match?.ignoreCase || false}
                                                onCheckedChange={(checked) => {
                                                  item.updateDataSyncToNode("expression.match.ignoreCase", checked);
                                                }}
                                              />
                                              <span className="ml-3 text-sm font-medium text-stone-900">
                                                Ignore case
                                              </span>
                                            </label>
                                          </div>
                                          <div>
                                            <label className="relative mt-4 inline-flex cursor-pointer items-center">
                                              <Switch
                                                checked={item.expression.match?.ignoreWhitespace || false}
                                                onCheckedChange={(checked) => {
                                                  item.updateDataSyncToNode(
                                                    "expression.match.ignoreWhitespace",
                                                    checked,
                                                  );
                                                }}
                                              />
                                              <span className="ml-3 text-sm font-medium text-stone-900">
                                                Ignore whitespace
                                              </span>
                                            </label>
                                          </div>
                                          <div>
                                            <label className="relative mt-4 inline-flex cursor-pointer items-center">
                                              <Switch
                                                checked={item.expression.match?.ignoreSymbols || false}
                                                onCheckedChange={(checked) => {
                                                  item.updateDataSyncToNode("expression.match.ignoreSymbols", checked);
                                                }}
                                              />
                                              <span className="ml-3 text-sm font-medium text-stone-900">
                                                Ignore symbols
                                              </span>
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {item.type === "contains" && (
                                    <div className="mt-3">
                                      <div>
                                        <div className="mb-9">
                                          <p className="font-bold">Input</p>
                                          <div className="mt-4">
                                            <VariableInput
                                              value={item.expression.contains?.value?.value}
                                              type={item.expression.contains?.value?.type}
                                              placeholder="Type '@' to use a variable"
                                              variables={mentions.atList}
                                              onChange={(value, type) => {
                                                item.updateDataSyncToNode("expression.contains.value", { type, value });
                                              }}
                                            />
                                          </div>
                                        </div>

                                        <div className="mb-9">
                                          <p className="font-bold">Search value</p>
                                          <div className="mt-4">
                                            <VariableInput
                                              value={item.expression.contains?.searchValue?.value}
                                              type={item.expression.contains?.searchValue?.type}
                                              placeholder="Type '@' to use a variable"
                                              variables={mentions.atList}
                                              onChange={(value, type) => {
                                                item.updateDataSyncToNode("expression.contains.searchValue", {
                                                  type,
                                                  value,
                                                });
                                              }}
                                            />
                                          </div>
                                        </div>

                                        <div className="mb-9">
                                          <p className="font-bold">Additional settings</p>
                                          <div>
                                            <label className="relative mt-4 inline-flex cursor-pointer items-center">
                                              <Switch
                                                checked={item.expression.contains?.ignoreCase || false}
                                                onCheckedChange={(checked) => {
                                                  item.updateDataSyncToNode("expression.contains.ignoreCase", checked);
                                                }}
                                              />
                                              <span className="ml-3 text-sm font-medium text-stone-900">
                                                Ignore case
                                              </span>
                                            </label>
                                          </div>
                                          <div>
                                            <label className="relative mt-4 inline-flex cursor-pointer items-center">
                                              <Switch
                                                checked={item.expression.contains?.ignoreWhitespace || false}
                                                onCheckedChange={(checked) => {
                                                  item.updateDataSyncToNode(
                                                    "expression.contains.ignoreWhitespace",
                                                    checked,
                                                  );
                                                }}
                                              />
                                              <span className="ml-3 text-sm font-medium text-stone-900">
                                                Ignore whitespace
                                              </span>
                                            </label>
                                          </div>
                                          <div>
                                            <label className="relative mt-4 inline-flex cursor-pointer items-center">
                                              <Switch
                                                checked={item.expression.contains?.ignoreSymbols || false}
                                                onCheckedChange={(checked) => {
                                                  item.updateDataSyncToNode(
                                                    "expression.contains.ignoreSymbols",
                                                    checked,
                                                  );
                                                }}
                                              />
                                              <span className="ml-3 text-sm font-medium text-stone-900">
                                                Ignore symbols
                                              </span>
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {item.type === "relative" && (
                                    <div className="space-y-4">
                                      <div className="space-y-2">
                                        <p className="text-sm text-stone-400">
                                          The loop will continue while the comparison evaluates to true
                                        </p>
                                        <div className="mt-3">
                                          <div>
                                            <div className="mb-9 mt-5 @container">
                                              <p className="font-bold">First value</p>
                                              <VariableInput
                                                value={item.expression.relative?.firstValue?.value || ""}
                                                type={item.expression.relative?.firstValue?.type}
                                                placeholder="Type '@' to use a variable"
                                                variables={mentions.atList}
                                                onChange={(value, type) => {
                                                  item.updateDataSyncToNode("expression.relative.firstValue", {
                                                    type,
                                                    value,
                                                  });
                                                }}
                                              />
                                            </div>

                                            <div className="mb-9 mt-5">
                                              <p className="font-bold">Comparison</p>
                                              <p className="mb-4 mt-1 text-sm text-stone-400">
                                                How the first value will be compared to the second
                                              </p>
                                              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                                                {comparatorOptions.map((option) => (
                                                  <div
                                                    key={option.value}
                                                    className={cn(
                                                      "relative aspect-square min-w-[75px] max-w-[180px] flex-1 rounded-xl border border-stone-200 hover:shadow-xl",
                                                      item.expression.relative?.comparator === option.value &&
                                                        "bg-stone-100",
                                                    )}
                                                    onClick={() =>
                                                      item.updateDataSyncToNode(
                                                        "expression.relative.comparator",
                                                        option.value,
                                                      )
                                                    }
                                                  >
                                                    <div className="grid h-full w-full place-content-center">
                                                      <div className="mb-2 ml-auto mr-auto mt-2 w-fit">
                                                        {option.icon}
                                                      </div>
                                                      <div className="px-0.5 text-center leading-3">
                                                        <span className="select-none text-xs font-bold uppercase">
                                                          {option.label}
                                                        </span>
                                                      </div>
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>

                                            <div className="mb-9 mt-5 @container">
                                              <p className="font-bold">Second value</p>
                                              <VariableInput
                                                value={item.expression.relative?.secondValue?.value || ""}
                                                type={item.expression.relative?.secondValue?.type}
                                                placeholder="Type '@' to use a variable"
                                                variables={mentions.atList}
                                                onChange={(value, type) => {
                                                  item.updateDataSyncToNode("expression.relative.secondValue", {
                                                    type,
                                                    value,
                                                  });
                                                }}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className={cn("px-4 pb-6", item.isOpen ? "block" : "hidden")}>
                                  <button
                                    className="mx-auto mt-5 flex items-center rounded border px-4 py-2 text-sm font-semibold uppercase tracking-tight text-stone-600 hover:bg-red-500 hover:text-white active:bg-red-600"
                                    onClick={() => {
                                      ifElses.ifElse.removeItem(item.id, editor);
                                    }}
                                  >
                                    <Trash2 />
                                    <span className="mr-1">Delete</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="mb-4 mt-2 select-none rounded-md border-2 border-stone-100">
                                <div
                                  onClick={() => {
                                    item.update({
                                      isOpen: !item.isOpen,
                                    });
                                  }}
                                  className={cn(
                                    "group flex items-center p-2 pl-3 font-semibold tracking-tight text-stone-600 transition-colors duration-200 hover:bg-stone-50 hover:text-stone-800 active:bg-stone-100 border-b border-b-stone-100 hover:shadow-sm",
                                    item.isOpen ? "border-b-stone-200 bg-stone-50" : "",
                                  )}
                                >
                                  <span className="whitespace-nowrap uppercase">else</span>
                                  <div className="ml-3 h-fit font-mono text-sm font-semibold text-stone-200 group-hover:text-stone-300 group-active:text-stone-400"></div>
                                  <span
                                    className={cn(
                                      "ml-auto mr-0.5 transition-transform",
                                      item.isOpen ? "rotate-180" : "",
                                    )}
                                  >
                                    <ChevronDown />
                                  </span>
                                </div>
                                <div className={cn("px-4 pb-6", item.isOpen ? "block" : "hidden")}>
                                  {/* Add your else content here */}
                                  <button
                                    className="mx-auto mt-5 flex items-center rounded border px-4 py-2 text-sm font-semibold uppercase tracking-tight text-stone-600 hover:bg-red-500 hover:text-white active:bg-red-600"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // @ts-ignore
                                      item.delete();
                                    }}
                                  >
                                    <Trash2 className="mr-2" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mx-auto mt-8 flex h-fit w-fit items-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-stone-50"
                        onClick={() => {
                          editor
                            .chain()
                            .focus()
                            .setIf({
                              selectedId: ifElses.selectedId,
                            })
                            .run();

                          ifElses.setSelectedId(ifElses.node.attrs.id);
                          ifElses.setNode(ifElses.node);
                          // Set editor selection to current node

                          // ifElses.ifElse.updateData({
                          //   content: ifElses.node.content.content.map((item) => {
                          //     return {
                          //       type: item.type.name,
                          //       id: item.attrs.id,
                          //       attrs: item.attrs,
                          //     };
                          //   }),
                          // });
                          setting.setSettingComponentName("ifElse");
                          workbench.setShowSidebar();
                        }}
                      >
                        <div className="mr-2 flex-1">Add if</div>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-12 flex w-full justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-6 hover:bg-red-500 hover:text-white active:bg-red-600"
                    onClick={() => {
                      ifElses.removeIfElse(ifElses.selectedId, editor);
                    }}
                  >
                    <Trash2 className="mr-2" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-16 align-bottom font-mono text-xs text-stone-200">
            Selected id: f92c7fe5-07e3-4771-9df0-0b99f5aef619
          </p>
        </div>
      </div>
    </div>
  );
});

export default IfElseSetting;
