"use client";

import { observer } from "mobx-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import useStores from "@/hooks/useStores";
import { Trash2 } from "lucide-react";

const CodeExecutorEditor = ({ onDelete, editor }) => {
  const { workbench, codeExecutors } = useStores();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div>
          <div>
            <div className="font-default">
              <div>
                <p className="font-default text-xl font-bold">Code</p>
                <p className="mt-2">
                  Code execution blocks enable you to combine the natural language reasoning of language models with the
                  powerful symbolic computation of normal software.
                </p>
                <p className="mt-2">
                  During runtime code blocks are executed. All inputs and generations are available using a mention (
                  <code className="font-mono text-sky-500">@identifier</code>) just like in the rest of the prompt.
                </p>
                <p className="mt-2">
                  After execution any value that is returned from the code will be included in the prompt (unless
                  disabled with the toggle switch below).
                </p>
                <p className="mt-2">
                  e.g. If the code block contained the statement{" "}
                  <code className="font-mono text-sky-500">return "Operation completed successfully"</code> the code
                  block would be replaced by the text "Operation completed successfully" for the rest of the prompt
                  execution.
                </p>
                <p className="mt-2">
                  You can also decide not to terminate the prompt when an error occurs which can be useful if you want
                  to get the LLM to fix the code before trying again.
                </p>
                <br />
                <div className="mb-9 mt-5 @container">
                  <p className="font-bold">Name</p>
                  <p className="mb-1 mt-1 text-sm text-stone-400">Name this code block</p>
                  <input
                    className="w-full border border-b-4 border-transparent p-2 transition-colors duration-200 hover:bg-stone-50 focus:mb-[3px] focus:rounded-lg focus:border focus:bg-white focus:shadow-lg focus:outline-0 border-b-stone-200 focus:border-stone-100"
                    placeholder="Empty"
                    type="text"
                    value={codeExecutors.codeExecutor.label}
                    onChange={(e) => {
                      codeExecutors.updateDataSyncToNode("label", e.target.value);
                    }}
                  />
                </div>
                <div className="mb-9 mt-5 @container">
                  <p className="font-bold">Language</p>
                  <p className="mb-1 mt-1 text-sm text-stone-400">Pick the language to execute</p>
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    <div className="relative aspect-square min-w-[75px] max-w-[180px] flex-1 rounded-xl border border-stone-200 hover:shadow-xl bg-stone-100">
                      <div className="grid h-full w-full place-content-center">
                        <div className="mb-2 ml-auto mr-auto mt-2 w-fit">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 630 630" height="24">
                            <rect width="630" height="630" fill="#f7df1e"></rect>
                            <path d="m423.2 492.19c12.69 20.72 29.2 35.95 58.4 35.95 24.53 0 40.2-12.26 40.2-29.2 0-20.3-16.1-27.49-43.1-39.3l-14.8-6.35c-42.72-18.2-71.1-41-71.1-89.2 0-44.4 33.83-78.2 86.7-78.2 37.64 0 64.7 13.1 84.2 47.4l-46.1 29.6c-10.15-18.2-21.1-25.37-38.1-25.37-17.34 0-28.33 11-28.33 25.37 0 17.76 11 24.95 36.4 35.95l14.8 6.34c50.3 21.57 78.7 43.56 78.7 93 0 53.3-41.87 82.5-98.1 82.5-54.98 0-90.5-26.2-107.88-60.54zm-209.13 5.13c9.3 16.5 17.76 30.45 38.1 30.45 19.45 0 31.72-7.61 31.72-37.2v-201.3h59.2v202.1c0 61.3-35.94 89.2-88.4 89.2-47.4 0-74.85-24.53-88.81-54.075z"></path>
                          </svg>
                        </div>
                        <div className="px-0.5 text-center leading-3">
                          <span className="select-none text-xs font-bold uppercase">JavaScript</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="relative mt-4 inline-flex cursor-pointer items-center">
                    <Switch
                      checked={codeExecutors.codeExecutor.includeOutput}
                      onCheckedChange={(checked) => {
                        codeExecutors.updateDataSyncToNode("includeOutput", checked);
                      }}
                    />
                    <span className="ml-3 text-sm font-medium text-stone-900">Include output in prompt</span>
                  </label>
                </div>
                <div>
                  <label className="relative mt-4 inline-flex cursor-pointer items-center">
                    <Switch
                      checked={codeExecutors.codeExecutor.continueOnError}
                      onCheckedChange={(checked) => {
                        codeExecutors.updateDataSyncToNode("continueOnError", checked);
                      }}
                    />
                    <span className="ml-3 text-sm font-medium text-stone-900">Continue on error</span>
                  </label>
                </div>
              </div>
              <div className="mt-12 flex w-full justify-center">
                <Button
                  variant="destructive"
                  onClick={() => {
                    codeExecutors.removeCodeExecutor(editor);
                  }}
                >
                  <Trash2 className="mr-2" />
                  <span className="mr-1">Delete</span>
                </Button>
              </div>
            </div>
            <p className="mt-16 align-bottom font-mono text-xs text-stone-200">
              Selected id: {codeExecutors.selectedId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(CodeExecutorEditor);
