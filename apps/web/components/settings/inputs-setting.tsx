"use client";

import useStores from "@/hooks/useStores";
import { cn } from "@/lib/utils";
import { FileText, Image, Text, Trash2 } from "lucide-react";
import { observer } from "mobx-react";
import type React from "react";

interface InputSettingProps {
  onDelete: () => void;
  editor: any;
}
const inputTypes = [
  { label: "Text", value: "text", icon: <Text className="w-4 h-4" /> },
  { label: "Long Text", value: "longText", icon: <FileText className="w-4 h-4" /> },
  { label: "Image", value: "image", icon: <Image className="w-4 h-4" /> },
  // { label: "File", value: "file", icon: <File className="w-4 h-4" /> },
  // { label: "Audio", value: "audio", icon: <FileAudio className="w-4 h-4" /> },
];

export const InputSetting: React.FC<InputSettingProps> = observer(({ onDelete, editor }) => {
  const { workbench, inputsNode } = useStores();

  return (
    <div className="p-8">
      <h2 className="font-default text-xl font-bold">Input</h2>
      <p className="mt-2">input blocks allow you to collect information from the user.</p>

      <div className="mb-9 mt-5">
        <p className="font-bold">Name</p>
        <p className="mb-1 mt-1 text-sm text-stone-400">Name this input</p>
        <input
          className="w-full border border-b-4 border-transparent p-2 transition-colors duration-200 hover:bg-stone-50 focus:mb-[3px] focus:rounded-lg focus:border focus:bg-white focus:shadow-lg focus:outline-0 border-b-stone-200 focus:border-stone-100"
          placeholder="Empty"
          type="text"
          value={inputsNode.input.label}
          onChange={(e) => {
            inputsNode.updateDataSyncToNode("label", e.target.value, editor);
          }}
        />
      </div>

      <div className="mb-9 mt-5">
        <p className="font-bold">
          Description<span className="ml-1 text-xs font-normal text-stone-700"> (optional)</span>
        </p>
        <p className="mb-1 mt-1 text-sm text-stone-400">Describe what data should be given</p>
        <input
          className="w-full border border-b-4 border-transparent p-2 transition-colors duration-200 hover:bg-stone-50 focus:mb-[3px] focus:rounded-lg focus:border focus:bg-white focus:shadow-lg focus:outline-0 border-b-stone-200 focus:border-stone-100"
          placeholder="Empty"
          type="text"
          value={inputsNode.input.description}
          onChange={(e) => {
            inputsNode.updateDataSyncToNode("description", e.target.value, editor);
          }}
        />
      </div>
      <div
        className="mb-9 mt-5 @container"
        data-sentry-component="BaseAttributeEditor"
        data-sentry-source-file="Base.tsx"
      >
        <p className="font-bold">
          Input type<span className="ml-1 text-xs font-normal text-stone-700"></span>
        </p>
        <p className="mb-1 mt-1 text-sm text-stone-400">Configure the input type</p>
        <div className="mt-4 grid w-full grid-cols-2 gap-4 @md:grid-cols-3 @lg:grid-cols-5">
          {inputTypes.map((type) => (
            <div
              key={type.value}
              className={cn(
                "relative aspect-square min-w-[75px] max-w-[180px] flex-1 rounded-xl border border-stone-200 hover:shadow-x",
                inputsNode.input.type === type.value && "bg-stone-100",
              )}
              onClick={() => {
                inputsNode.updateDataSyncToNode("type", type.value, editor);
              }}
            >
              <div className="absolute right-1 top-1 flex gap-2"></div>
              <div className="grid h-full w-full place-content-center">
                <div className="mb-2 ml-auto mr-auto mt-2 w-fit">
                  {/* Text Icon */}
                  {type.icon}
                </div>
                <div className="px-0.5 text-center leading-3">
                  <span className="select-none text-xs font-bold uppercase">{type.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 flex w-full justify-center">
        <button
          className="mt-6 flex items-center rounded border px-4 py-2 text-sm font-semibold uppercase tracking-tight text-stone-600 hover:bg-red-500 hover:text-white active:bg-red-600"
          onClick={() => {
            inputsNode.removeInput(editor);
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span className="mr-1">Delete</span>
        </button>
      </div>
    </div>
  );
});
