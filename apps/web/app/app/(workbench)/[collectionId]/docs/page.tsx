export default function DocsPage() {
  return (
    <div className="flex h-full overflow-y-auto">
      <div className="w-full px-1 py-4 md:p-5">
        <div className="flex w-full sm:min-w-[300px] md:min-w-[450px] lg:min-w-[600px]">
          <div>
            <div className="m-6">
              {/* 模板部分 */}
              <div className="mb-6 mt-12 flex w-full justify-center">
                <div className="mx-auto text-sm font-semibold uppercase text-muted-foreground">
                  Start from a Template
                </div>
              </div>

              <div className="card-container flex flex-wrap justify-center gap-4">
                {/* 模板卡片1 */}
                <div className="text-card-foreground border border-border card rounded-lg shadow w-[280px] cursor-pointer bg-transparent hover:bg-background/70">
                  <div className="relative rounded-md p-6">
                    <div className="flex items-center">
                      <div className="w-full flex-auto space-y-1">
                        <p className="mb-2 truncate whitespace-nowrap text-sm font-medium leading-none text-muted-foreground">
                          Blank Flow
                        </p>
                        <p className="truncate whitespace-normal text-sm text-muted-foreground/50">
                          Start from scratch
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 模板卡片2 */}
                <div className="text-card-foreground border border-border card rounded-lg shadow w-[280px] cursor-pointer bg-transparent hover:bg-background/70">
                  <div className="relative rounded-md p-6">
                    <div className="flex items-center">
                      <div className="w-full flex-auto space-y-1">
                        <p className="mb-2 truncate whitespace-nowrap text-sm font-medium leading-none text-muted-foreground">
                          Customer Support Bot
                        </p>
                        <p className="truncate whitespace-normal text-sm text-muted-foreground/50">
                          Build a chatbot for customer support
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 模板卡片3 */}
                <div className="text-card-foreground border border-border card rounded-lg shadow w-[280px] cursor-pointer bg-transparent hover:bg-background/70">
                  <div className="relative rounded-md p-6">
                    <div className="flex items-center">
                      <div className="w-full flex-auto space-y-1">
                        <p className="mb-2 truncate whitespace-nowrap text-sm font-medium leading-none text-muted-foreground">
                          Sentiment Analysis
                        </p>
                        <p className="truncate whitespace-normal text-sm text-muted-foreground/50">
                          Analyze sentiment from text data
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 模板卡片4 */}
                <div className="text-card-foreground border border-border card rounded-lg shadow w-[280px] cursor-pointer bg-transparent hover:bg-background/70">
                  <div className="relative rounded-md p-6">
                    <div className="flex items-center">
                      <div className="w-full flex-auto space-y-1">
                        <p className="mb-2 truncate whitespace-nowrap text-sm font-medium leading-none text-muted-foreground">
                          Translation Service
                        </p>
                        <p className="truncate whitespace-normal text-sm text-muted-foreground/50">
                          Create a multilingual translation app
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
