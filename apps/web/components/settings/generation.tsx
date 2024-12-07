import { Slider } from "@/components/ui/slider";
import useStores from "@/hooks/useStores";
import { cn } from "@/lib/utils";
import { Image } from "lucide-react";
import { observer } from "mobx-react";
import { models } from "./const";

interface SettingProps {
  editor: any;
}
const Generation = ({ editor }: SettingProps) => {
  const { generations } = useStores();
  const { currentGeneration } = generations;
  if (!currentGeneration) {
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div data-sentry-component="AttributeEditor" data-sentry-source-file="AttributeEditor.tsx">
          <div>
            <div className="font-default">
              <div>
                <div>
                  <p className="font-default text-xl font-bold">Generation</p>
                  <p className="mt-2">
                    A generation is populated by the language model during program execution based on the parameters set
                    below. To generate the value all the text content that comes <strong>before</strong> this generation
                    is fed to the language model (with any variables replaced with their referenced value) and the
                    "completion" starts from there.
                  </p>
                  <br />
                  <div className="mb-9 mt-5 @container">
                    <p className="font-bold">
                      Name<span className="ml-1 text-xs font-normal text-stone-700"></span>
                    </p>
                    <p className="mb-1 mt-1 text-sm text-stone-400">Give an identifier to this generation</p>
                    <input
                      className="w-full border border-b-4 border-transparent p-2 transition-colors duration-200 hover:bg-stone-50 focus:mb-[3px] focus:rounded-lg focus:border focus:bg-white focus:shadow-lg focus:outline-0 border-b-stone-200 focus:border-stone-100"
                      placeholder="Empty"
                      type="text"
                      value={currentGeneration.label}
                      onChange={(e) => {
                        generations.updateDataSyncToNode("label", e.target.value, editor);
                      }}
                    />
                  </div>
                  <div className="mb-9 mt-5 @container">
                    <p className="font-bold">
                      Creativity<span className="ml-1 text-xs font-normal text-stone-700"></span>
                    </p>
                    <p className="mb-1 mt-1 text-sm text-stone-400">
                      Determine how creative the generated output will be. Larger values are best for expressive tasks
                      like copy writing and small values are preferred for predictable tasks such as format conversion
                    </p>
                    <Slider
                      min={0}
                      max={100}
                      value={[currentGeneration.temperature]}
                      onValueChange={(value) => {
                        generations.updateDataSyncToNode("temperature", value[0], editor);
                      }}
                    />
                    <ul className="flex w-full justify-between px-0">
                      <li className="select-none text-xs text-stone-400">
                        <span>consistent</span>
                      </li>
                      <li className="select-none text-xs text-stone-400">
                        <span>creative</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    {/* <div className="mb-9 mt-5 @container @container">
                      <p className="font-bold">
                        Generation type<span className="ml-1 text-xs font-normal text-stone-700"></span>
                      </p>
                      <p className="mb-1 mt-1 text-sm text-stone-400">Decide when the generation is complete</p>
                      <div className="mt-4 grid w-full grid-cols-2 gap-2 px-0 sm:grid-cols-4">
                        {generationType.map((item) => (
                          <div
                            className={cn(
                              "relative aspect-square min-w-[75px] max-w-[180px] flex-1 border-stone-200 rounded-xl border hover:shadow-xl",
                              currentGeneration.type === item.value ? "bg-stone-100" : "",
                            )}
                            onClick={() => {
                              generations.updateDataSyncToNode("type", item.value, editor);
                            }}
                          >
                            <div className="absolute right-1 top-1 flex gap-2"></div>
                            <div className="grid h-full w-full place-content-center">
                              <div className="mb-2 ml-auto mr-auto mt-2 w-fit">{item.icon}</div>
                              <div className="px-0.5 text-center leading-3">
                                <span className="select-none text-xs font-bold uppercase">{item.label}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div> */}
                    {/* {currentGeneration.type === "custom" && (
                      <div className="mb-8 px-4">
                        <p className="font-bold">Custom stop values</p>
                        <p className="mb-1 mt-1 text-sm text-stone-400">
                          The model will stop generating when any of these values appear. Set up to 4, use{" "}
                          <code className="font-mono text-sky-500">\n</code> for a newline
                        </p>
                        {currentGeneration.stopBefore.map((item, index) => (
                          <input
                            className="mt-2 w-full border border-b-4 border-transparent border-b-stone-200 p-2 transition-colors duration-200 hover:bg-stone-50 focus:mb-[3px] focus:rounded-lg focus:border focus:border-stone-100 focus:bg-white focus:shadow-lg focus:outline-0"
                            placeholder="Empty"
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const stopBefore = currentGeneration.stopBefore;
                              stopBefore[index] = e.target.value;
                              generations.updateDataSyncToNode("stopBefore", stopBefore, editor);
                            }}
                          />
                        ))}
                      </div>
                    )} */}
                  </div>
                  <div className="mb-9 mt-5 @container @container">
                    <p className="font-bold">
                      Model<span className="ml-1 text-xs font-normal text-stone-700"></span>
                    </p>
                    <p className="mb-1 mt-1 text-sm text-stone-400">
                      Choose which model should be used for this generation
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2 @sm:grid-cols-4 @lg:grid-cols-6">
                      {models.map((item) => (
                        <div
                          className={cn(
                            "relative aspect-square min-w-[75px] max-w-[180px] border-stone-200 flex-1 rounded-xl border hover:shadow-xl",
                            item.model === currentGeneration.model ? "bg-stone-100" : "",
                          )}
                          onClick={() => {
                            generations.updateDataSyncToNode("model", item.model, editor);
                          }}
                        >
                          <div className="absolute right-1 top-1 flex gap-2">{item.supportsImage && <Image />}</div>
                          <div className="grid h-full w-full place-content-center">
                            <div className="mb-2 ml-auto mr-auto mt-2 w-fit">{item.avatar}</div>
                            <div className="px-0.5 text-center leading-3">
                              <span className="select-none text-xs font-bold uppercase">{item.name}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <a
                      target="_blank"
                      className="text-sm text-sky-600 hover:underline"
                      href="https://www.notion.so/hey-daily/Models-615b76d7498f4e06ae522a329695da74"
                      rel="noreferrer"
                    >
                      Model documentation
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-12 flex w-full justify-center">
                <button className="mt-6 flex items-center rounded border px-4 py-2 text-sm font-semibold uppercase tracking-tight text-stone-600 hover:bg-red-500 hover:text-white active:bg-red-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-trash2 mr-2 h-4 w-4"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    <line x1="10" x2="10" y1="11" y2="17"></line>
                    <line x1="14" x2="14" y1="11" y2="17"></line>
                  </svg>
                  <span className="mr-1">Delete</span>
                </button>
              </div>
            </div>
          </div>
          <p className="mt-16 align-bottom font-mono text-xs text-stone-200">
            Selected id: 13c56322-a152-4e97-a0cd-6750a4b1756c
          </p>
        </div>
      </div>
    </div>
  );
};

export default observer(Generation);
