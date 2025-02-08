import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useStores from "@/hooks/useStores";
import { ImageConfig } from "@/workflow/ai/config/flux-config";
import { ChevronDown, ExternalLink, Trash2 } from "lucide-react";
import { observer } from "mobx-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const ImageGeneration = observer(() => {
  const { generations } = useStores();
  const { currentGeneration } = generations;
  const [currentModel, setCurrentModel] = useState<any>(null);
  const [openModel, setOpenModel] = useState(false);
  const [openAspectRatio, setOpenAspectRatio] = useState(false);

  if (!currentGeneration) {
    return null;
  }

  useEffect(() => {
    const currentModelConfig = ImageConfig.find((config) => config.model === currentGeneration?.model);
    if (currentModelConfig) {
      setCurrentModel(currentModelConfig);
    }
  }, [currentGeneration?.model]);

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="font-default">
        <div className="flex flex-col items-start space-y-2">
          <div className="mb-4 flex flex-col items-start gap-1">
            <h1 className="font-default text-xl font-bold">{currentGeneration?.label}</h1>
            <Link href="/nodes/tool#image-generation" target="_blank">
              <Button variant="ghost" size="sm">
                Docs
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="mt-2">
            <p>Generate an image using Flux or Stable Diffusion 3</p>
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
              value={currentGeneration?.label}
              onChange={(e) => {
                generations.updateDataSyncToNode("label", e.target.value);
              }}
            />
          </div>

          <div className="px-2">
            <div className="mb-9 mt-5">
              <p className="font-bold">Aspect ratio or size</p>
              <p className="mb-1 mt-1 text-sm text-stone-400">Aspect ratio or size for the generated image.</p>
              <Popover open={openAspectRatio} onOpenChange={setOpenAspectRatio}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between">
                    <span>{currentGeneration?.aspect_ratio}</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandList>
                      <CommandEmpty>No aspect ratio found.</CommandEmpty>
                      <CommandGroup>
                        {currentModel?.sizeOptions.map((ratio) => (
                          <CommandItem
                            key={ratio.value}
                            value={ratio.value}
                            onSelect={(value) => {
                              generations.updateDataSyncToNode("aspect_ratio", value);
                              setOpenAspectRatio(false);
                            }}
                          >
                            {ratio.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="mb-9 mt-5">
              <p className="font-bold">Model</p>
              <p className="mb-1 mt-1 text-sm text-stone-400">The model to use for image generation.</p>
              <Popover open={openModel} onOpenChange={setOpenModel}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between">
                    <span>{currentGeneration?.model}</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandList>
                      <CommandEmpty>No model found.</CommandEmpty>
                      <CommandGroup>
                        {ImageConfig.map((item) => (
                          <CommandItem
                            key={item?.model}
                            value={item?.model}
                            onSelect={(value) => {
                              setOpenModel(false);
                              generations.updateDataSyncToNode("model", value);
                              generations.updateDataSyncToNode("aspect_ratio", item.sizeOptions[0].value);
                            }}
                          >
                            {item.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="mt-12 flex w-full justify-center">
          <Button
            variant="outline"
            onClick={() => {
              generations.removeGeneration(currentGeneration.id);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span className="mr-1">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
});

export default ImageGeneration;
