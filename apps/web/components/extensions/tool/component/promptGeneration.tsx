import useStores from "@/hooks/useStores";
import { observer } from "mobx-react";

const PromptGenerationComponent = observer((props) => {
  const { tools } = useStores();

  const tool = tools.get(props.node.attrs.id);

  return (
    <div className="flex-0 mt-2 w-full px-2">
      <div>PromptGeneration</div>
    </div>
  );
});

export default PromptGenerationComponent;
