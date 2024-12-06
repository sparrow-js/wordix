import { Slider } from "@/components/ui/slider";
import useStores from "@/hooks/useStores";
import { cn } from "@/lib/utils";
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
                          <div className="absolute right-1 top-1 flex gap-2"></div>
                          <div className="grid h-full w-full place-content-center">
                            <div className="mb-2 ml-auto mr-auto mt-2 w-fit">{item.avatar}</div>
                            <div className="px-0.5 text-center leading-3">
                              <span className="select-none text-xs font-bold uppercase">{item.name}</span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* <div className="relative aspect-square min-w-[75px] max-w-[180px] flex-1 rounded-xl border border-stone-200 hover:shadow-xl">
                        <div className="absolute right-1 top-1 flex gap-2"></div>
                        <div className="grid h-full w-full place-content-center">
                          <div className="mb-2 ml-auto mr-auto mt-2 w-fit">
                            <svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" height="24">
                              <path d="m297.06 130.97c7.26-21.79 4.76-45.66-6.85-65.48-17.46-30.4-52.56-46.04-86.84-38.68-15.25-17.18-37.16-26.95-60.13-26.81-35.04-.08-66.13 22.48-76.91 55.82-22.51 4.61-41.94 18.7-53.31 38.67-17.59 30.32-13.58 68.54 9.92 94.54-7.26 21.79-4.76 45.66 6.85 65.48 17.46 30.4 52.56 46.04 86.84 38.68 15.24 17.18 37.16 26.95 60.13 26.8 35.06.09 66.16-22.49 76.94-55.86 22.51-4.61 41.94-18.7 53.31-38.67 17.57-30.32 13.55-68.51-9.94-94.51zm-120.28 168.11c-14.03.02-27.62-4.89-38.39-13.88.49-.26 1.34-.73 1.89-1.07l63.72-36.8c3.26-1.85 5.26-5.32 5.24-9.07v-89.83l26.93 15.55c.29.14.48.42.52.74v74.39c-.04 33.08-26.83 59.74v74.39c-.04 33.08-26.83 59.9-59.91 59.97zm-128.84-55.03c-7.03-12.14-9.56-26.37-7.15-40.18.47.28 1.3.79 1.89 1.13l63.72 36.8c3.23 1.89 7.23 1.89 10.47 0l77.79-44.92v31.1c.02.32-.13.63-.38.83l-64.41 37.19c-28.69 16.52-65.33 6.7-81.92-21.95zm-16.77-139.09c7-12.16 18.05-21.46 31.21-26.29 0 .55-.03 1.52-.03 2.2v73.61c-.02 3.74 1.98 7.21 5.23 9.06l77.79 44.91-26.93 15.55c-.27.18-.61.21-.91.08l-64.42-37.22c-28.63-16.58-38.45-53.21-21.95-81.89zm221.26 51.49-77.79-44.92 26.93-15.54c.27-.18.61-.21.91-.08l64.42 37.19c28.68 16.57 38.51 53.26 21.94 81.94-7.01 12.14-18.05 21.44-31.2 26.28v-75.81c.03-3.74-1.96-7.2-5.2-9.06zm26.8-40.34c-.47-.29-1.3-.79-1.89-1.13l-63.72-36.8c-3.23-1.89-7.23-1.89-10.47 0l-77.79 44.92v-31.1c-.02-.32.13-.63.38-.83l64.41-37.16c28.69-16.55 65.37-6.7 81.91 22 6.99 12.12 9.52 26.31 7.15 40.1zm-168.51 55.43-26.94-15.55c-.29-.14-.48-.42-.52-.74v-74.39c.02-33.12 26.89-59.96 60.01-59.94 14.01 0 27.57 4.92 38.34 13.88-.49.26-1.33.73-1.89 1.07l-63.72 36.8c-3.26 1.85-5.26 5.31-5.24 9.06l-.04 89.79zm14.63-31.54 34.65-20.01 34.65 20v40.01l-34.65 20-34.65-20z"></path></svg>
                          </div>
                          <div className="px-0.5 text-center leading-3"><span className="select-none text-xs font-bold uppercase">o1</span></div>
                        </div>
                      </div>
                      <div className="relative aspect-square min-w-[75px] max-w-[180px] flex-1 rounded-xl border border-stone-200 hover:shadow-xl">
                        <div className="absolute right-1 top-1 flex gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-image h-6 w-6 text-stone-300"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg></div>
                        <div className="grid h-full w-full place-content-center">
                          <div className="mb-2 ml-auto mr-auto mt-2 w-fit">
                            <svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" height="24">
                              <path d="m297.06 130.97c7.26-21.79 4.76-45.66-6.85-65.48-17.46-30.4-52.56-46.04-86.84-38.68-15.25-17.18-37.16-26.95-60.13-26.81-35.04-.08-66.13 22.48-76.91 55.82-22.51 4.61-41.94 18.7-53.31 38.67-17.59 30.32-13.58 68.54 9.92 94.54-7.26 21.79-4.76 45.66 6.85 65.48 17.46 30.4 52.56 46.04 86.84 38.68 15.24 17.18 37.16 26.95 60.13 26.8 35.06.09 66.16-22.49 76.94-55.86 22.51-4.61 41.94-18.7 53.31-38.67 17.57-30.32 13.55-68.51-9.94-94.51zm-120.28 168.11c-14.03.02-27.62-4.89-38.39-13.88.49-.26 1.34-.73 1.89-1.07l63.72-36.8c3.26-1.85 5.26-5.32 5.24-9.07v-89.83l26.93 15.55c.29.14.48.42.52.74v74.39c-.04 33.08-26.83 59.9-59.91 59.97zm-128.84-55.03c-7.03-12.14-9.56-26.37-7.15-40.18.47.28 1.3.79 1.89 1.13l63.72 36.8c3.23 1.89 7.23 1.89 10.47 0l77.79-44.92v31.1c.02.32-.13.63-.38.83l-64.41 37.19c-28.69 16.52-65.33 6.7-81.92-21.95zm-16.77-139.09c7-12.16 18.05-21.46 31.21-26.29 0 .55-.03 1.52-.03 2.2v73.61c-.02 3.74 1.98 7.21 5.23 9.06l77.79 44.91-26.93 15.55c-.27.18-.61.21-.91.08l-64.42-37.22c-28.63-16.58-38.45-53.21-21.95-81.89zm221.26 51.49-77.79-44.92 26.93-15.54c.27-.18.61-.21.91-.08l64.42 37.19c28.68 16.57 38.51 53.26 21.94 81.94-7.01 12.14-18.05 21.44-31.2 26.28v-75.81c.03-3.74-1.96-7.2-5.2-9.06zm26.8-40.34c-.47-.29-1.3-.79-1.89-1.13l-63.72-36.8c-3.23-1.89-7.23-1.89-10.47 0l-77.79 44.92v-31.1c-.02-.32.13-.63.38-.83l64.41-37.16c28.69-16.55 65.37-6.7 81.91 22 6.99 12.12 9.52 26.31 7.15 40.1zm-168.51 55.43-26.94-15.55c-.29-.14-.48-.42-.52-.74v-74.39c.02-33.12 26.89-59.96 60.01-59.94 14.01 0 27.57 4.92 38.34 13.88-.49.26-1.33.73-1.89 1.07l-63.72 36.8c-3.26 1.85-5.26 5.31-5.24 9.06l-.04 89.79zm14.63-31.54 34.65-20.01 34.65 20v40.01l-34.65 20-34.65-20z"></path></svg>
                          </div>
                          <div className="px-0.5 text-center leading-3"><span className="select-none text-xs font-bold uppercase">GPT-4o mini</span></div>
                        </div>
                      </div>
                      <div className="relative aspect-square min-w-[75px] max-w-[180px] flex-1 rounded-xl border border-stone-200 hover:shadow-xl">
                        <div className="absolute right-1 top-1 flex gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-image h-6 w-6 text-stone-300"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg></div>
                        <div className="grid h-full w-full place-content-center">
                          <div className="mb-2 ml-auto mr-auto mt-2 w-fit">
                            <svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" height="24">
                              <path d="m297.06 130.97c7.26-21.79 4.76-45.66-6.85-65.48-17.46-30.4-52.56-46.04-86.84-38.68-15.25-17.18-37.16-26.95-60.13-26.81-35.04-.08-66.13 22.48-76.91 55.82-22.51 4.61-41.94 18.7-53.31 38.67-17.59 30.32-13.58 68.54 9.92 94.54-7.26 21.79-4.76 45.66 6.85 65.48 17.46 30.4 52.56 46.04 86.84 38.68 15.24 17.18 37.16 26.95 60.13 26.8 35.06.09 66.16-22.49 76.94-55.86 22.51-4.61 41.94-18.7 53.31-38.67 17.57-30.32 13.55-68.51-9.94-94.51zm-120.28 168.11c-14.03.02-27.62-4.89-38.39-13.88.49-.26 1.34-.73 1.89-1.07l63.72-36.8c3.26-1.85 5.26-5.32 5.24-9.07v-89.83l26.93 15.55c.29.14.48.42.52.74v74.39c-.04 33.08-26.83 59.9-59.91 59.97zm-128.84-55.03c-7.03-12.14-9.56-26.37-7.15-40.18.47.28 1.3.79 1.89 1.13l63.72 36.8c3.23 1.89 7.23 1.89 10.47 0l77.79-44.92v31.1c.02.32-.13.63-.38.83l-64.41 37.19c-28.69 16.52-65.33 6.7-81.92-21.95zm-16.77-139.09c7-12.16 18.05-21.46 31.21-26.29 0 .55-.03 1.52-.03 2.2v73.61c-.02 3.74 1.98 7.21 5.23 9.06l77.79 44.91-26.93 15.55c-.27.18-.61.21-.91.08l-64.42-37.22c-28.63-16.58-38.45-53.21-21.95-81.89zm221.26 51.49-77.79-44.92 26.93-15.54c.27-.18.61-.21.91-.08l64.42 37.19c28.68 16.57 38.51 53.26 21.94 81.94-7.01 12.14-18.05 21.44-31.2 26.28v-75.81c.03-3.74-1.96-7.2-5.2-9.06zm26.8-40.34c-.47-.29-1.3-.79-1.89-1.13l-63.72-36.8c-3.23-1.89-7.23-1.89-10.47 0l-77.79 44.92v-31.1c-.02-.32.13-.63.38-.83l64.41-37.16c28.69-16.55 65.37-6.7 81.91 22 6.99 12.12 9.52 26.31 7.15 40.1zm-168.51 55.43-26.94-15.55c-.29-.14-.48-.42-.52-.74v-74.39c.02-33.12 26.89-59.96 60.01-59.94 14.01 0 27.57 4.92 38.34 13.88-.49.26-1.33.73-1.89 1.07l-63.72 36.8c-3.26 1.85-5.26 5.31-5.24 9.06l-.04 89.79zm14.63-31.54 34.65-20.01 34.65 20v40.01l-34.65 20-34.65-20z"></path></svg>
                          </div>
                          <div className="px-0.5 text-center leading-3"><span className="select-none text-xs font-bold uppercase">GPT-4o</span></div>
                        </div>
                      </div>
                      <div className="relative aspect-square min-w-[75px] max-w-[180px] flex-1 rounded-xl border border-stone-200 hover:shadow-xl bg-stone-100">
                        <div className="absolute right-1 top-1 flex gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-image h-6 w-6 text-stone-300"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg></div>
                        <div className="grid h-full w-full place-content-center">
                          <div className="mb-2 ml-auto mr-auto mt-2 w-fit">
                            <svg viewBox="0 0 46 32" xmlns="http://www.w3.org/2000/svg" className="p-0.5" height="24">
                            <path d="M32.73 0h-6.945L38.73 16.27H45.67L32.73 0zM0 16.27h6.945L0 32.54H-6.945L0 16.27zM16.27 0h6.945L16.27 16.27H9.33L16.27 0zM16.27 16.27h6.945L16.27 32.54H9.33L16.27 16.27zM32.73 16.27h6.945L32.73 32.54H25.785L32.73 16.27zM0 0h6.945L0 16.27H-6.945L0 0z"></path>
                            </svg>
                          </div>
                          <div className="px-0.5 text-center leading-3"><span className="select-none text-xs font-bold uppercase">Mistral Medium</span></div>
                        </div>
                      </div>
                      <div className="relative aspect-square min-w-[75px] max-w-[180px] flex-1 rounded-xl border border-stone-200 hover:shadow-xl">
                        <div className="absolute right-1 top-1 flex gap-2"></div>
                        <div className="grid h-full w-full place-content-center">
                          <div className="mb-2 ml-auto mr-auto mt-2 w-fit">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 222 202" height="24">
                              <defs>
                                <clipPath id="A">
                                  <path d="M0 184.252h481.89V0H0z" transform="translate(-206.251 -140.139)"></path>
                                </clipPath>
                                <clipPath id="B">
                                  <path d="M0 184.252h481.89V0H0z" transform="translate(-247.436 -104.865)"></path>
                                </clipPath>
                                <clipPath id="C">
                                  <path d="M0 184.252h481.89V0H0z" transform="translate(-285.938 -102.089)"></path>
                                </clipPath>
                                <clipPath id="D">
                                  <path d="M0 184.252h481.89V0H0z" transform="translate(-337.769 -131.877)"></path>
                                </clipPath>
                                <clipPath id="E">
                                  <path d="M0 184.252h481.89V0H0z" transform="translate(-377.247 -132.319)"></path>
                                </clipPath>
                                <clipPath id="F">
                                  <path d="M0 184.252h481.89V0H0z" transform="translate(-418.107 -114.634)"></path>
                                </clipPath>
                                <clipPath id="G">
                                  <path d="M0 184.252h481.89V0H0z" transform="translate(-450.023 -140.139)"></path>
                                </clipPath>
                                <clipPath id="H">
                                  <path d="M0 184.252h481.89V0H0z" transform="translate(-217.694 -44.794)"></path>
                                </clipPath>
                                <clipPath id="I">
                                  <path d="M0 184.252h481.89V0H0z" transform="translate(-247.436 -35.025)"></path>
                                </clipPath>
                                <clipPath id="J">
                                  <path d="M0 184.252h481.89V0H0z"></path>
                                </clipPath>
                                <path id="K" d="M173.987 134.362h-37.795l9.633-37.776h37.796z"></path>
                              </defs>
                              <g transform="matrix(1 0 .254535 1 -49.975029 -14.360241)">
                                <g className="L">
                                  <path d="M98.397 134.362H60.602l9.633-37.776h37.796z"></path>
                                  <path d="M126.558 172.138H88.763l9.633-37.776h37.796z"></path>
                                  <path d="M136.192 134.362H98.397l9.633-37.776h37.796z"></path>
                                  <use href="#K"></use>
                                  <path d="M108.031 96.585H70.236l9.633-37.776h37.796z"></path>
                                  <use href="#K" x="9.634" y="-37.777"></use>
                                  <path d="M60.602 134.362H22.807l9.633-37.776h37.796z"></path>
                                  <path d="M70.236 96.585H32.441l9.633-37.776H79.87z"></path>
                                  <path d="M79.87 58.809H42.075l9.633-37.776h37.796z"></path>
                                  <use href="#K" x="57.063" y="-75.553"></use>
                                  <path d="M50.968 172.138H13.173l9.633-37.776h37.796z"></path>
                                  <path d="M41.334 209.915H3.539l9.633-37.776h37.796z"></path>
                                  <use href="#K" x="37.795"></use>
                                  <use href="#K" x="47.429" y="-37.777"></use>
                                  <use href="#K" x="28.161" y="37.776"></use>
                                  <use href="#K" x="18.527" y="75.553"></use>
                                </g>
                                <path d="M114.115 134.359H76.321l9.633-37.776h37.796z" fill="#ff7000"></path>
                                <use href="#K" x="-31.71" y="37.773" fill="#ff4900"></use>
                                <g fill="#ff7000">
                                  <use href="#K" x="-22.076" y="-.003"></use>
                                  <use href="#K" x="15.719" y="-.003"></use>
                                </g>
                                <g fill="#ffa300">
                                  <path d="M123.749 96.582H85.955l9.633-37.776h37.796z"></path>
                                  <use href="#K" x="25.353" y="-37.78"></use>
                                </g>
                                <path d="M76.32 134.359H38.526l9.633-37.776h37.796z" fill="#ff7000"></path>
                                <path d="M85.954 96.582H48.16l9.633-37.776h37.796z" fill="#ffa300"></path>
                                <g fill="#ffce00">
                                  <path d="M95.588 58.806H57.794l9.633-37.776h37.796z"></path>
                                  <use href="#K" x="72.782" y="-75.556"></use>
                                </g>
                                <path d="M66.686 172.135H28.892l9.633-37.776h37.796z" fill="#ff4900"></path>
                                <path d="M57.052 209.912H19.258l9.633-37.776h37.796z" fill="#ff0107"></path>
                                <use href="#K" x="53.514" y="-.003" fill="#ff7000"></use>
                                <path d="M237.135 96.582H199.34l9.633-37.776h37.796z" fill="#ffa300"></path>
                                <use href="#K" x="43.88" y="37.773" fill="#ff4900"></use>
                                <use href="#K" x="34.246" y="75.55" fill="#ff0107"></use>
                              </g>
                            </svg>
                          </div>
                          <div className="px-0.5 text-center leading-3"><span className="select-none text-xs font-bold uppercase">Mixtral 8x22B</span></div>
                        </div>
                      </div>
                      <div className="relative aspect-square min-w-[75px] max-w-[180px] flex-1 rounded-xl border border-stone-200 hover:shadow-xl">
                        <div className="absolute right-1 top-1 flex gap-2"></div>
                        <div className="grid h-full w-full place-content-center">
                          <div className="mb-2 ml-auto mr-auto mt-2 w-fit">
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40.1 42" height="24">
                              <g>
                                <path fill="#FF3621" d="M40.1,31.1v-7.4l-0.8-0.5L20.1,33.7l-18.2-10l0-4.3l18.2,9.9l20.1-10.9v-7.3l-0.8-0.5L20.1,21.2L2.6,11.6   L20.1,2l14.1,7.7l1.1-0.6V8.3L20.1,0L0,10.9V12L20.1,23l18.2-10v4.4l-18.2,10L0.8,16.8L0,17.3v7.4l20.1,10.9l18.2-9.9v4.3l-18.2,10   L0.8,29.5L0,30v1.1L20.1,42L40.1,31.1z"></path>
                              </g>
                            </svg>
                          </div>
                          <div className="px-0.5 text-center leading-3"><span className="select-none text-xs font-bold uppercase">DBRX</span></div>
                        </div>
                      </div> */}
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
