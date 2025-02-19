"use client";
import { VariableInput } from "@/components/common/VariableInput";
import { Button } from "@/components/ui/button";
import useStores from "@/hooks/useStores";
import { Trash2 } from "lucide-react";
import { observer } from "mobx-react";

const AgenticWorkflowSetting = observer(({ onDelete, editor }) => {
  const { agenticWorkflows } = useStores();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div>
          <div>
            <div className="font-default">
              <div>
                <div>
                  <p className="font-default text-xl font-bold">Agentic Workflow</p>
                  <p className="mt-2">Configure the properties of this agentic workflow</p>

                  <div className="mb-9 mt-5 @container">
                    <p className="font-bold">
                      Name<span className="ml-1 text-xs font-normal text-stone-700"></span>
                    </p>
                    <p className="mb-1 mt-1 text-sm text-stone-400">Name this workflow</p>
                    <input
                      className="w-full border border-b-4 border-transparent p-2 transition-colors duration-200 hover:bg-stone-50 focus:mb-[3px] focus:rounded-lg focus:border focus:bg-white focus:shadow-lg focus:outline-0 border-b-stone-200 focus:border-stone-100"
                      placeholder="Empty"
                      type="text"
                      value={agenticWorkflows.agenticWorkflow.label}
                      onChange={(e) => {
                        agenticWorkflows.updateDataSyncToNode("label", e.target.value);
                      }}
                    />
                  </div>

                  <div className="mt-12 flex w-full justify-center">
                    <Button
                      variant="outline"
                      className="hover:bg-red-500 hover:text-white active:bg-red-600"
                      onClick={() => {
                      }}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      <span className="mr-1">Delete</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AgenticWorkflowSetting;
