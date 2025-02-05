import { VariableInput } from "@/components/common/VariableInput";
import { Button } from "@/components/ui/button";
import useStores from "@/hooks/useStores";
import { Trash2 } from "lucide-react";
import { observer } from "mobx-react";

const Webscrape = ({ onDelete, editor }) => {
  const { tools, mentions } = useStores();
  const tool = tools.get(tools.selectedId);

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="font-default">
        <div className="flex flex-col items-start space-y-2">
          <div className="mb-4 flex flex-col items-start gap-1">
            <h1 className="font-default text-xl font-bold">{tool.label}</h1>
            {/* <Link href="/nodes/tool#image-generation" target="_blank">
              <Button variant="ghost" size="sm">
                Docs
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </Link> */}
          </div>
          <div className="mt-2">
            <p>Scrape a website and return the content</p>
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
              <p className="font-bold">url</p>
              <p className="mb-1 mt-1 text-sm text-stone-400">The url to scrape.</p>
              <VariableInput
                value={tool.parameters.url.value}
                type={tool.parameters.url.type}
                placeholder="Type '@' to use a variable"
                variables={mentions.atList}
                onChange={(value, type) => {
                  tools.updateDataSyncToNode("parameters.url", { type, value });
                }}
              />
            </div>
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

export default observer(Webscrape);
