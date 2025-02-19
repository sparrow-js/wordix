"use client";
import { Button } from "@/components/ui/button";
import useStores from "@/hooks/useStores";
import { Trash2 } from "lucide-react";
import { observer } from "mobx-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { agentModelOptions } from "@/workflow/ai/config/model-configs";

const AgentModelSetting = observer(({ onDelete, editor }) => {
  const { agentModels } = useStores();
  const [openModel, setOpenModel] = useState(false);

  const model = agentModels.agentModel;


  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
      <div>
        <p className="font-default text-xl font-bold">Agent Model</p>
        <p className="mt-2">Configure the properties of this agent model</p>

            <div className="mb-9 mt-5">
                <p className="font-bold">
                    Name<span className="ml-1 text-xs font-normal text-stone-700"></span>
                </p>
                <p className="mb-1 mt-1 text-sm text-stone-400">Name this model</p>
                <input
                    className="w-full border border-b-4 border-transparent p-2 transition-colors duration-200 hover:bg-stone-50 focus:mb-[3px] focus:rounded-lg focus:border focus:bg-white focus:shadow-lg focus:outline-0 border-b-stone-200 focus:border-stone-100"
                    placeholder="Empty"
                    type="text"
                    value={agentModels.agentModel?.label}
                    onChange={(e) => {
                    agentModels.updateDataSyncToNode("label", e.target.value);
                    }}
                />
            </div>

            <div className="mb-9 mt-5">
              <p className="font-bold">Model</p>
              <p className="mb-1 mt-1 text-sm text-stone-400">Model for the generated image.</p>
              <Popover open={openModel} onOpenChange={setOpenModel}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between">
                    {model.model ? <span>{model.model}</span> : <span>Select Model</span>}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandList>
                      <CommandEmpty>No aspect ratio found.</CommandEmpty>
                      <CommandGroup>
                        {agentModelOptions.map((model) => (
                          <CommandItem
                            key={model.value}
                            value={model.value}
                            onSelect={(value) => {
                              agentModels.updateDataSyncToNode("model", value);
                              setOpenModel(false);
                            }}
                          >
                            <model.avatar className="w-4 h-4 mr-2" /> {model.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>




            <div className="mt-12 flex w-full justify-center">
            <Button
                variant="outline"
                className="hover:bg-red-500 hover:text-white active:bg-red-600"
                onClick={() => {}}
            >
                <Trash2 className="mr-1 h-4 w-4" />
                <span className="mr-1">Delete</span>
            </Button>
            </div>
        </div>
      </div>
    </div>
  );
});

export default AgentModelSetting;
