"use client";
import { VariableInput } from "@/components/common/VariableInput";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"; // Add this import at the top
import useStores from "@/hooks/useStores";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Equal, Hash, ListEnd, Trash2, WholeWord } from "lucide-react";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";

type LoopType = "count" | "match" | "contains" | "relative" | "list";
const typeOptions: { title: string; value: LoopType; icon: React.ReactNode }[] = [
  { title: "Count", value: "count", icon: <Hash className="h-8 w-8" /> },
  { title: "Match", value: "match", icon: <Equal className="h-8 w-8" /> },
  { title: "Contains", value: "contains", icon: <WholeWord className="h-8 w-8" /> },
  { title: "Relative", value: "relative", icon: <ChevronRight className="h-8 w-8" /> },
  { title: "List", value: "list", icon: <ListEnd className="h-8 w-8" /> },
];

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

const LoopSetting = ({ onDelete, editor }) => {
  const { loopsNode, mentions } = useStores();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div>
          <div>
            <div className="font-default">
              <div>
                <div className="w-full overflow-x-hidden">
                  <div className="space-y-6">
                    <p className="font-default text-xl font-bold">Loop</p>
                    <p className="mt-2">Configure the properties of this loop</p>
                    <div className="mb-9 mt-5 @container">
                      <p className="font-bold">
                        Name
                        <span className="ml-1 text-xs font-normal text-stone-700" />
                      </p>
                      <p className="mb-1 mt-1 text-sm text-stone-400">Name this loop</p>
                      <input
                        className="w-full border border-b-4 border-transparent p-2 transition-colors duration-200 hover:bg-stone-50 focus:mb-[3px] focus:rounded-lg focus:border focus:bg-white focus:shadow-lg focus:outline-0 border-b-stone-200 focus:border-stone-100"
                        placeholder="Empty"
                        type="text"
                        value={loopsNode.loop.label}
                        onChange={(e) => {
                          loopsNode.updateDataSyncToNode("label", e.target.value);
                        }}
                      />
                    </div>

                    <div className="mb-9 mt-5 @container">
                      <p className="font-bold">
                        Type
                        <span className="ml-1 text-xs font-normal text-stone-700" />
                      </p>
                      <p className="mb-1 mt-1 text-sm text-stone-400">Decide when the loop will terminate</p>
                      <div className="mt-4 grid w-full grid-cols-2 gap-2 @sm:grid-cols-3 @md:grid-cols-5">
                        {/* First Grid Item */}
                        {typeOptions.map((option) => (
                          <div
                            key={option.value}
                            className={cn(
                              "relative aspect-square min-w-[75px] max-w-[180px] flex-1 rounded-xl border border-stone-200 hover:shadow-xl ",
                              loopsNode.loop.type === option.value && "bg-stone-100 border-stone-200",
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              loopsNode.updateDataSyncToNode("type", option.value);
                            }}
                          >
                            <div className="absolute right-1 top-1 flex gap-2"></div>
                            <div className="grid h-full w-full place-content-center">
                              <div className="mb-2 ml-auto mr-auto mt-2 w-fit">{option.icon}</div>
                              <div className="px-0.5 text-center leading-3">
                                <span className="select-none text-xs font-bold uppercase">{option.title}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {loopsNode.loop.type === "count" && (
                      <div className="space-y-4">
                        <div className="mb-9 mt-5 @container">
                          <p className="font-bold">
                            Count
                            <span className="ml-1 text-xs font-normal text-stone-700"></span>
                          </p>
                          <p className="mb-1 mt-1 text-sm text-stone-400">The loop will repeat this many times</p>
                          <input
                            className="w-full border border-b-4 border-transparent p-2 transition-colors duration-200 hover:bg-stone-50 focus:mb-[3px] focus:rounded-lg focus:border focus:bg-white focus:shadow-lg focus:outline-0 border-b-stone-200 focus:border-stone-100"
                            placeholder="Pick a number"
                            min="1"
                            max="100"
                            type="number"
                            value={loopsNode.loop.count}
                            onChange={(e) => {
                              loopsNode.updateDataSyncToNode("count", e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {loopsNode.loop.type === "match" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <p className="text-sm text-stone-400">
                            The loop will terminate when this expression evaluates to true
                          </p>
                          <div className="mt-3">
                            <div>
                              <div className="mb-9 mt-5 @container">
                                <p className="font-bold">
                                  First value
                                  <span className="ml-1 text-xs font-normal text-stone-700" />
                                </p>
                                <VariableInput
                                  value={loopsNode.loop.expression.match?.firstValue?.value || ""}
                                  type={loopsNode.loop.expression.match?.firstValue?.type}
                                  placeholder="Type '@' to use a variable"
                                  variables={mentions.atList}
                                  onChange={(value, type) => {
                                    loopsNode.updateDataSyncToNode("expression.match.firstValue", { type, value });
                                  }}
                                />
                              </div>

                              <div className="mb-9 mt-5 @container">
                                <p className="font-bold">
                                  Second value
                                  <span className="ml-1 text-xs font-normal text-stone-700"></span>
                                </p>
                                <VariableInput
                                  value={loopsNode.loop.expression.match?.secondValue?.value || ""}
                                  type={loopsNode.loop.expression.match?.secondValue?.type}
                                  placeholder="Type '@' to use a variable"
                                  variables={mentions.atList}
                                  onChange={(value, type) => {
                                    loopsNode.updateDataSyncToNode("expression.match.secondValue", { type, value });
                                  }}
                                />
                              </div>
                              <div className="mb-9 mt-5">
                                <p className="font-bold">Additional settings</p>
                                <div>
                                  <label className="relative mt-4 inline-flex cursor-pointer items-center">
                                    <Switch
                                      checked={loopsNode.loop.expression.match?.ignoreCase || false}
                                      onCheckedChange={(checked) => {
                                        loopsNode.updateDataSyncToNode("expression.match.ignoreCase", checked);
                                      }}
                                    />
                                    <span className="ml-3 text-sm font-medium text-stone-900">Ignore case</span>
                                  </label>
                                </div>
                                <div>
                                  <label className="relative mt-4 inline-flex cursor-pointer items-center">
                                    <Switch
                                      checked={loopsNode.loop.expression.match?.ignoreWhitespace || false}
                                      onCheckedChange={(checked) => {
                                        loopsNode.updateDataSyncToNode("expression.match.ignoreWhitespace", checked);
                                      }}
                                    />
                                    <span className="ml-3 text-sm font-medium text-stone-900">Ignore whitespace</span>
                                  </label>
                                </div>
                                <div>
                                  <label className="relative mt-4 inline-flex cursor-pointer items-center">
                                    <Switch
                                      checked={loopsNode.loop.expression.match?.ignoreSymbols || false}
                                      onCheckedChange={(checked) => {
                                        loopsNode.updateDataSyncToNode("expression.match.ignoreSymbols", checked);
                                      }}
                                    />
                                    <span className="ml-3 text-sm font-medium text-stone-900">Ignore symbols</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {loopsNode.loop.type === "contains" && (
                      <div>
                        <div className="mb-9">
                          <p className="font-bold">Input</p>
                          <div className="mt-4">
                            <VariableInput
                              value={loopsNode.loop.expression.contains?.value?.value}
                              type={loopsNode.loop.expression.contains?.value?.type}
                              placeholder="Type '@' to use a variable"
                              variables={mentions.atList}
                              onChange={(value, type) => {
                                loopsNode.updateDataSyncToNode("expression.contains.value", { type, value });
                              }}
                            />
                          </div>
                        </div>

                        <div className="mb-9">
                          <p className="font-bold">Search value</p>
                          <div className="mt-4">
                            <VariableInput
                              value={loopsNode.loop.expression.contains?.searchValue?.value}
                              type={loopsNode.loop.expression.contains?.searchValue?.type}
                              placeholder="Type '@' to use a variable"
                              variables={mentions.atList}
                              onChange={(value, type) => {
                                loopsNode.updateDataSyncToNode("expression.contains.searchValue", { type, value });
                              }}
                            />
                          </div>
                        </div>

                        <div className="mb-9">
                          <p className="font-bold">Additional settings</p>
                          <div>
                            <label className="relative mt-4 inline-flex cursor-pointer items-center">
                              <Switch
                                checked={loopsNode.loop.expression.contains?.ignoreCase || false}
                                onCheckedChange={(checked) => {
                                  loopsNode.updateDataSyncToNode("expression.contains.ignoreCase", checked);
                                }}
                              />
                              <span className="ml-3 text-sm font-medium text-stone-900">Ignore case</span>
                            </label>
                          </div>
                          <div>
                            <label className="relative mt-4 inline-flex cursor-pointer items-center">
                              <Switch
                                checked={loopsNode.loop.expression.contains?.ignoreWhitespace || false}
                                onCheckedChange={(checked) => {
                                  loopsNode.updateDataSyncToNode("expression.contains.ignoreWhitespace", checked);
                                }}
                              />
                              <span className="ml-3 text-sm font-medium text-stone-900">Ignore whitespace</span>
                            </label>
                          </div>
                          <div>
                            <label className="relative mt-4 inline-flex cursor-pointer items-center">
                              <Switch
                                checked={loopsNode.loop.expression.contains?.ignoreSymbols || false}
                                onCheckedChange={(checked) => {
                                  loopsNode.updateDataSyncToNode("expression.contains.ignoreSymbols", checked);
                                }}
                              />
                              <span className="ml-3 text-sm font-medium text-stone-900">Ignore symbols</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {loopsNode.loop.type === "relative" && (
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
                                  value={loopsNode.loop.expression.relative?.firstValue?.value || ""}
                                  type={loopsNode.loop.expression.relative?.firstValue?.type}
                                  placeholder="Type '@' to use a variable"
                                  variables={mentions.atList}
                                  onChange={(value, type) => {
                                    loopsNode.updateDataSyncToNode("expression.relative.firstValue", { type, value });
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
                                        loopsNode.loop.expression.relative?.comparator === option.value &&
                                          "bg-stone-100",
                                      )}
                                      onClick={() =>
                                        loopsNode.updateDataSyncToNode("expression.relative.comparator", option.value)
                                      }
                                    >
                                      <div className="grid h-full w-full place-content-center">
                                        <div className="mb-2 ml-auto mr-auto mt-2 w-fit">{option.icon}</div>
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
                                  value={loopsNode.loop.expression.relative?.secondValue?.value || ""}
                                  type={loopsNode.loop.expression.relative?.secondValue?.type}
                                  placeholder="Type '@' to use a variable"
                                  variables={mentions.atList}
                                  onChange={(value, type) => {
                                    loopsNode.updateDataSyncToNode("expression.relative.secondValue", { type, value });
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {loopsNode.loop.type === "list" && (
                      <div className="space-y-4">
                        <div className="mb-9 mt-5 @container">
                          <p className="font-bold">
                            List
                            <span className="ml-1 text-xs font-normal text-stone-700" />
                          </p>
                          <p className="mb-1 mt-1 text-sm text-stone-400">Text in which to search</p>
                          <input
                            className="w-full overflow-hidden overscroll-none border border-b-4 border-transparent p-2 transition-colors duration-200 hover:bg-stone-50 focus:mb-[3px] focus:rounded-lg focus:border focus:bg-white focus:shadow-lg focus:outline-0 border-b-stone-200 focus:border-stone-100"
                            placeholder="Type '@' to use a variable"
                            type="text"
                            value={loopsNode.loop.expression.list?.value || ""}
                            onChange={(e) => {
                              loopsNode.updateDataSyncToNode("expression.list.value", e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-12 flex w-full justify-center">
                  <Button
                    variant="outline"
                    className="hover:bg-red-500 hover:text-white active:bg-red-600"
                    onClick={() => {
                      loopsNode.removeLoop(editor);
                    }}
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    <span className="mr-1">Delete</span>
                  </Button>
                </div>
              </div>
            </div>
            <p className="mt-16 align-bottom font-mono text-xs text-stone-200">Selected id: {loopsNode.loop.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(LoopSetting);
