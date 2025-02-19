"use client";
import { Button } from "@/components/ui/button";
import useStores from "@/hooks/useStores";
import { Trash2 } from "lucide-react";
import { observer } from "mobx-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { File } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const AgentToolSetting = observer(({ onDelete, editor }) => {
  const { collections, agentTools, documents, mentions } = useStores();

  const [open, setOpen] = useState(false);

  const { collectionId } = useParams();
  const documentList = collections.getDocuments(collectionId as string);
  const tool = agentTools.agentTool;
  //   useEffect(() => {
  //     if (prompt) {
  //       setValue(prompt.label);
  //     }
  //   }, [prompt?.id]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
      <div>
            <div className="font-default">
            <div className="mb-9 @container">
            <div className="mb-9">
              <p className="font-bold">
                Name<span className="ml-1 text-xs font-normal text-stone-700"></span>
              </p>
              <p className="mb-1 mt-1 text-sm text-stone-400">Name this workflow</p>
              <input
                className="w-full border border-b-4 border-transparent p-2 transition-colors duration-200 hover:bg-stone-50 focus:mb-[3px] focus:rounded-lg focus:border focus:bg-white focus:shadow-lg focus:outline-0 border-b-stone-200 focus:border-stone-100"
                placeholder="Empty"
                type="text"
                value={tool.label}
                onChange={(e) => {
                  agentTools.updateDataSyncToNode("label", e.target.value);
                }}
              />
            </div>


            <div className="mb-9">
              <p className="font-bold">
                Description<span className="ml-1 text-xs font-normal text-stone-700"></span>
              </p>
              <p className="mb-1 mt-1 text-sm text-stone-400">Describe this workflow</p>
              <Textarea
                placeholder="Empty"
                value={tool.description}
                onChange={(e) => {
                  agentTools.updateDataSyncToNode("description", e.target.value);
                }}
              />
            </div>


            <div className="mb-9">
              <div className="flex items-center justify-between">
                <p className="font-bold">
                  Flow <span className="ml-1 text-xs font-normal text-stone-700"></span>
                </p>
                <Link
                  href={`/${collectionId}/docs/${tool?.promptId}`}
                  className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 rounded-md hover:bg-blue-50 transition-colors"
                >
                  <File className="mr-2 h-4 w-4" />
                  <span>Open flow</span>
                </Link>
              </div>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between">
                    {tool?.flowLabel || "Select flow..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search flow..." />
                    <CommandList>
                      <CommandEmpty>No flow found.</CommandEmpty>
                      <CommandGroup>
                        {documentList.map((document) => (
                          <CommandItem
                            key={document.id}
                            value={document.name}
                            className="cursor-pointer"
                            onSelect={async () => {
                              if (prompt) {
                                setOpen(false);
                                const { document: documentInfo } = await documents.fetchWithSharedTree(document.id);

                                const inputs = documentInfo?.content?.content
                                  ?.find((item) => item.type === "inputs")
                                  .content?.map((input) => {
                                    return {
                                      ...input.attrs,
                                    };
                                  });
                                const parameters = {};

                                if (inputs) {
                                  inputs.map((input) => {
                                    parameters[input.id] = {
                                      type: "literal",
                                      value: "",
                                    };
                                  });
                                }

                                tool.update({
                                  flowLabel: document.title,
                                  promptId: document.id,
                                  parameters,
                                  inputs,
                                });
                              }
                            }}
                          >
                            <Check
                              className="mr-2 h-4 w-4"
                              style={{
                                opacity: tool?.flowLabel === document.title ? 1 : 0,
                              }}
                            />
                            {document.title}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="mt-8">
                <p className="font-bold">
                  Inputs describe
                </p>
                <div className="px-2">
                  {tool?.inputs?.map((input) => {
                    return (
                      <div key={input.id} className="mb-9 mt-5 @container">
                        <p className="font-bold">
                          {input.label}
                          <span className="ml-1 text-xs font-normal text-stone-700"></span>
                        </p>
                        {input.description && (
                          <p className="mb-1 mt-1 text-sm text-stone-400">{input.description}</p>
                        )}
                        <Textarea
                          value={tool.parameters[input.id].value}
                          placeholder="Description Field Purpose"
                          onChange={(e) => {
                            agentTools.updateDataSyncToNode(`parameters.${input.id}`, {
                              value: e.target.value,
                              type: 'literal',
                            });
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            

            <div className="mt-12 flex w-full justify-center">
              <button className="mt-6 flex items-center rounded border px-4 py-2 text-sm font-semibold uppercase tracking-tight text-stone-600 hover:bg-red-500 hover:text-white active:bg-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                <span className="mr-1">Delete</span>
              </button>
            </div>
            </div>
          </div>
      </div>
    </div>
  );
});

export default AgentToolSetting;
