import useStores from "@/hooks/useStores";
import { observer } from "mobx-react";

const StableDiffusionComponent = observer((props) => {
  const { tools, mentions } = useStores();

  const tool = tools.get(props.node.attrs.id);

  return (
    <div className="flex-0 mt-2 w-full px-2">
      <div>
        {tool?.inputs.map((input) => {
          return (
            <span
              key={input.value}
              className="my-4 inline-flex shrink align-middle text-sm font-semibold text-stone-700"
            >
              <span className="cursor-pointer break-normal rounded-full border border-stone-100 bg-stone-50 px-3 py-1.5 hover:bg-stone-100 active:bg-stone-200">
                {input.label}
              </span>
              <span className="mt-0.5 text-lg">:</span>
              <span className="mx-2 mr-4 mt-0.5 h-full max-w-xs py-1">
                <div className="inline-block max-w-fit truncate align-bottom w-full">
                  {tool.parameters[input.value].type === "variable"
                    ? mentions.getMetion(tool.parameters[input.value].value)?.title
                    : tool.parameters[input.value].value || ""}
                </div>
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
});

export default StableDiffusionComponent;
