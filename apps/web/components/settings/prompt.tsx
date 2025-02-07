"use client";
import { VariableInput } from "@/components/common/VariableInput";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useStores from "@/hooks/useStores";
import { Check, ChevronsUpDown, ExternalLink, File, Trash2 } from "lucide-react";
import { observer } from "mobx-react";
import { useParams } from "next/navigation";
import { useState } from "react";

const Prompt = ({ onDelete, editor }) => {
  const { workbench, collections, prompts, documents, mentions } = useStores();

  const [open, setOpen] = useState(false);

  const { collectionId } = useParams();
  const documentList = collections.getDocuments(collectionId as string);
  const prompt = prompts.prompt;
  //   useEffect(() => {
  //     if (prompt) {
  //       setValue(prompt.label);
  //     }
  //   }, [prompt?.id]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div data-sentry-component="AttributeEditor" data-sentry-source-file="AttributeEditor.tsx">
          <div>
            <div className="font-default">
              <div>
                <div
                  className="flex flex-col items-start space-y-2"
                  data-sentry-component="AttributeHeader"
                  data-sentry-source-file="AttributeHeader.tsx"
                >
                  <div className="mb-4 flex flex-col items-start gap-1">
                    <h1 className="font-default text-xl font-bold">Flow</h1>
                    <a href="/nodes/flow" target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="p-0 py-0 text-muted-foreground">
                        Docs
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    </a>
                  </div>
                  <div className="mt-2">
                    <p>Execute another flow from this flow</p>
                  </div>
                  <br />
                </div>

                <div className="mb-9 mt-5 @container">
                  <p className="font-bold">
                    Flow<span className="ml-1 text-xs font-normal text-stone-700"></span>
                  </p>
                  <p className="mb-1 mt-1 text-sm text-stone-400">Select the flow to run</p>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" className="w-full justify-between">
                        {prompt?.label || "Select flow..."}
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

                                    prompt.update({
                                      label: document.title,
                                      promptId: document.id,
                                      document: documentInfo,
                                      parameters,
                                      inputs,
                                    });
                                  }
                                }}
                              >
                                <Check
                                  className="mr-2 h-4 w-4"
                                  style={{
                                    opacity: prompt?.label === document.title ? 1 : 0,
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

                <div>
                  <div className="mb-8 flex w-full justify-center">
                    <a
                      className="flex items-center rounded border px-4 py-2 text-sm font-semibold uppercase tracking-tight text-stone-600 hover:bg-sky-400 hover:text-white active:bg-sky-500"
                      href="/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <File className="mr-2 h-[90%] w-fit" />
                      <span className="mr-1">Open flow</span>
                    </a>
                  </div>

                  <p className="font-bold">Flow description</p>
                  <p className="italic">
                    An example of the extension, try doing it yourself before peeking! We add a new 'style' input and
                    tell the model to use that style by referencing that value in the prompt using @style.
                  </p>

                  <div className="mt-8">
                    <div className="mb-9 mt-5 @container">
                      <p className="font-bold">
                        Inputs<span className="ml-1 text-xs font-normal text-stone-700"></span>
                      </p>
                      <p className="mb-1 mt-1 text-sm text-stone-400">
                        Set the input values to this flow. Values can be fixed or can be variables (e.g. outputs from
                        other nodes, inputs to this flow or generations)
                      </p>

                      <div className="px-2">
                        {prompt?.inputs?.map((input) => {
                          return (
                            <div key={input.id} className="mb-9 mt-5 @container">
                              <p className="font-bold">
                                {input.label}
                                <span className="ml-1 text-xs font-normal text-stone-700"></span>
                              </p>
                              {input.description && (
                                <p className="mb-1 mt-1 text-sm text-stone-400">{input.description}</p>
                              )}
                              <VariableInput
                                value={prompt.parameters[input.id].value}
                                type={prompt.parameters[input.id].type}
                                placeholder="Type '@' to use a variable"
                                variables={mentions.atList}
                                onChange={(value, type) => {
                                  prompts.updateDataSyncToNode(`parameters.${input.id}`, {
                                    value: value,
                                    type: type,
                                  });
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
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
            <p className="mt-16 align-bottom font-mono text-xs text-stone-200">Selected id: {prompts.selectedId}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(Prompt);
