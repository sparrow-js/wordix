"use client";

import { VariableInput } from "@/components/common/VariableInput";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useStores from "@/hooks/useStores";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { Check, ChevronsUpDown } from "lucide-react";
import { observer } from "mobx-react";
import { useState } from "react";

const searchTypes = [
  {
    label: "Search",
    value: "search",
  },
  {
    label: "Search with image",
    value: "image",
  },
  {
    label: "Search with audio",
    value: "audio",
  },
  {
    label: "Search with video",
    value: "video",
  },
];

const DuckDuckGo = ({ onDelete, editor }) => {
  const { tools, mentions } = useStores();
  const tool = tools.get(tools.selectedId);
  const [open, setOpen] = useState(false);
  console.log(tool);

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="font-default">
        <div className="flex flex-col items-start space-y-2">
          <div className="mb-4 flex flex-col items-start gap-1">
            <h1 className="font-default text-xl font-bold">label</h1>
          </div>
          <div className="mt-2">
            <p>Generate an audio using TextToSpeech</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-9 mt-5">
            <p className="font-bold">Label</p>
            <p className="mb-1 mt-1 text-sm text-stone-400">Override the default label for this tool.</p>
            <input
              className="w-full border border-b-4 border-transparent p-2 transition-colors duration-200 hover:bg-stone-50 focus:mb-[3px] focus:rounded-lg focus:border focus:bg-white focus:shadow-lg focus:outline-0 border-b-stone-200 focus:border-stone-100"
              placeholder="Empty"
              type="text"
              value={tool.label}
              onChange={(e) => {
                tools.updateDataSyncToNode("label", e.target.value);
              }}
            />
          </div>

          <div className="px-2">
            <div className="mb-9 mt-5">
              <p className="font-bold">Voice</p>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                    {tool.parameters.searchType.value || "Select search type..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 max-h-[200px] overflow-y-auto">
                  <Command>
                    <CommandEmpty>No voice found.</CommandEmpty>
                    <CommandGroup>
                      {searchTypes.map((search) => (
                        <CommandItem
                          key={search.label}
                          value={search.value}
                          onSelect={(currentValue) => {
                            tools.updateDataSyncToNode("parameters.searchType", {
                              type: "literal",
                              value: currentValue,
                            });
                            setOpen(false);
                          }}
                        >
                          {search.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              tool.parameters.searchType.value === search.value ? "opacity-100" : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="mb-9 mt-5">
            <p className="font-bold">Query</p>
            <p className="mb-1 mt-1 text-sm text-stone-400">Override the default query for this tool.</p>
            <VariableInput
              value={tool.parameters.query.value}
              type={tool.parameters.query.type}
              placeholder="Type '@' to use a variable"
              variables={mentions.atList}
              onChange={(value, type) => {
                tools.updateDataSyncToNode("parameters.query", { type, value });
              }}
            />
          </div>
        </div>

        <div className="mt-12 flex w-full justify-center">
          <Button variant="outline" onClick={onDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            <span className="mr-1">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default observer(DuckDuckGo);
