export default function OverviewPage() {
  return (
    <div className="flex gap-4">
      {/* Info Card */}
      <div
        className="rounded-lg border bg-card text-card-foreground shadow-sm flex-1"
        data-sentry-element="Card"
        data-sentry-component="AppInfoCard"
        data-sentry-source-file="AppInfoCard.tsx"
      >
        {/* Card Header */}
        <div
          className="flex items-start justify-between p-6"
          data-sentry-element="CardHeader"
          data-sentry-source-file="AppInfoCard.tsx"
        >
          <div className="mt-1 flex flex-1 flex-col gap-1.5">
            <h3
              className="text-2xl font-semibold leading-none tracking-tight"
              data-sentry-element="CardTitle"
              data-sentry-source-file="AppInfoCard.tsx"
            >
              Info
            </h3>
          </div>
          <div className="flex gap-2">
            <button
              className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground p-2 rounded-md aspect-square h-fit"
              data-state="closed"
              style={{ pointerEvents: "auto" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-pencil h-4 w-4"
              >
                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                <path d="M15 5l4 4" />
              </svg>
            </button>
          </div>
        </div>
        {/* Card Content */}
        <div className="p-6 pt-0" data-sentry-element="CardContent" data-sentry-source-file="AppInfoCard.tsx">
          <div
            data-sentry-element="FieldCollection"
            data-sentry-source-file="AppInfoCard.tsx"
            className="flex flex-col gap-6"
          >
            {/* Link */}
            <div
              data-sentry-element="LabelGroup"
              data-sentry-source-file="AppInfoCard.tsx"
              className="flex flex-col gap-2"
            >
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                data-sentry-element="Label"
                data-sentry-source-file="AppInfoCard.tsx"
              >
                Link
              </label>
              <div
                className="flex items-center justify-between gap-1 rounded-md border px-2 py-2 text-xs border-blue-300 bg-blue-100 text-blue-400"
                data-sentry-component="CopyLink"
                data-sentry-source-file="CopyLink.tsx"
              >
                <span className="flex items-center gap-2.5 truncate">
                  <code>/explore/apps/3574c11c-9c19-4b96-b963-3e678e73b481</code>
                </span>
                <div className="flex gap-1">
                  <button
                    className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border hover:bg-accent hover:text-accent-foreground rounded-md aspect-square h-fit p-1 bg-background border-blue-300"
                    data-state="closed"
                    style={{ pointerEvents: "auto" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-copy"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                  </button>
                  <button
                    className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border hover:bg-accent hover:text-accent-foreground rounded-md aspect-square h-fit p-1 bg-background border-blue-300"
                    data-state="closed"
                    style={{ pointerEvents: "auto" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-external-link"
                    >
                      <path d="M15 3h6v6" />
                      <path d="M10 14L21 3" />
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            {/* Visibility */}
            <div
              data-sentry-element="LabelGroup"
              data-sentry-source-file="AppInfoCard.tsx"
              className="flex flex-col gap-2"
            >
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                data-sentry-element="Label"
                data-sentry-source-file="AppInfoCard.tsx"
              >
                Visibility
              </label>
              <div
                className="border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent flex w-fit items-center gap-1 rounded-sm bg-green-50 text-green-700 hover:bg-green-50"
                data-sentry-component="Badge"
                data-sentry-source-file="badge.tsx"
              >
                Published
              </div>
            </div>
            {/* Banner Image */}
            <div
              className="flex flex-col gap-2 max-w-[400px]"
              data-sentry-element="LabelGroup"
              data-sentry-source-file="AppInfoCard.tsx"
            >
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                data-sentry-element="Label"
                data-sentry-source-file="AppInfoCard.tsx"
              >
                Banner Image
              </label>
              <div
                data-radix-aspect-ratio-wrapper=""
                style={{ position: "relative", width: "100%", paddingBottom: "20%" }}
              >
                <div
                  className="mt-2 bg-muted"
                  data-sentry-element="AspectRatio"
                  data-sentry-source-file="AppInfoCard.tsx"
                  style={{ position: "absolute", inset: 0 }}
                >
                  <img
                    alt="App banner"
                    loading="lazy"
                    decoding="async"
                    data-nimg="fill"
                    className="rounded-md object-cover"
                    sizes="100vw"
                    srcSet="/_next/image?url=https%3A%2F%2Fuvdxvgggjphy9pqb.public.blob.vercel-storage.com%2Fgradient-woOUxEEnzoCn3oRv0NoosjoNIQqlDn.png&w=640&q=75 640w, /_next/image?url=https%3A%2F%2Fuvdxvgggjphy9pqb.public.blob.vercel-storage.com%2Fgradient-woOUxEEnzoCn3oRv0NoosjoNIQqlDn.png&w=750&q=75 750w, /_next/image?url=https%3A%2F%2Fuvdxvgggjphy9pqb.public.blob.vercel-storage.com%2Fgradient-woOUxEEnzoCn3oRv0NoosjoNIQqlDn.png&w=828&q=75 828w, /_next/image?url=https%3A%2F%2Fuvdxvgggjphy9pqb.public.blob.vercel-storage.com%2Fgradient-woOUxEEnzoCn3oRv0NoosjoNIQqlDn.png&w=1080&q=75 1080w, /_next/image?url=https%3A%2F%2Fuvdxvgggjphy9pqb.public.blob.vercel-storage.com%2Fgradient-woOUxEEnzoCn3oRv0NoosjoNIQqlDn.png&w=1200&q=75 1200w, /_next/image?url=https%3A%2F%2Fuvdxvgggjphy9pqb.public.blob.vercel-storage.com%2Fgradient-woOUxEEnzoCn3oRv0NoosjoNIQqlDn.png&w=1920&q=75 1920w, /_next/image?url=https%3A%2F%2Fuvdxvgggjphy9pqb.public.blob.vercel-storage.com%2Fgradient-woOUxEEnzoCn3oRv0NoosjoNIQqlDn.png&w=2048&q=75 2048w, /_next/image?url=https%3A%2F%2Fuvdxvgggjphy9pqb.public.blob.vercel-storage.com%2Fgradient-woOUxEEnzoCn3oRv0NoosjoNIQqlDn.png&w=3840&q=75 3840w"
                    src="/_next/image?url=https%3A%2F%2Fuvdxvgggjphy9pqb.public.blob.vercel-storage.com%2Fgradient-woOUxEEnzoCn3oRv0NoosjoNIQqlDn.png&w=3840&q=75"
                    style={{
                      position: "absolute",
                      height: "100%",
                      width: "100%",
                      inset: 0,
                      color: "transparent",
                    }}
                  />
                </div>
              </div>
            </div>
            {/* Title */}
            <div
              data-sentry-element="LabelGroup"
              data-sentry-source-file="AppInfoCard.tsx"
              className="flex flex-col gap-2"
            >
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                data-sentry-element="Label"
                data-sentry-source-file="AppInfoCard.tsx"
              >
                Title
              </label>
              <p className="text-sm">Hello world 👋🌍 - EXTENSION</p>
            </div>
            {/* Description */}
            <div
              data-sentry-element="LabelGroup"
              data-sentry-source-file="AppInfoCard.tsx"
              className="flex flex-col gap-2"
            >
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                data-sentry-element="Label"
                data-sentry-source-file="AppInfoCard.tsx"
              >
                Description
              </label>
              <div
                className="flex w-full gap-2"
                data-sentry-component="DescriptionExpandable"
                data-sentry-source-file="DescriptionExpandable.tsx"
              >
                <h3 className="text-sm whitespace-pre-wrap font-light text-muted-foreground">
                  An example of the extension, ...
                  <button className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background underline-offset-4 hover:underline text-primary rounded-md ml-2 h-auto self-start p-0">
                    Show more
                  </button>
                </h3>
              </div>
            </div>
            {/* Active Version */}
            <div
              data-sentry-element="LabelGroup"
              data-sentry-source-file="AppInfoCard.tsx"
              className="flex flex-col gap-2"
            >
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                data-sentry-element="Label"
                data-sentry-source-file="AppInfoCard.tsx"
              >
                Active Version
              </label>
              <div
                className="inline-flex items-center rounded-full border px-2.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 w-fit py-0"
                data-sentry-element="Badge"
                data-sentry-source-file="badge.tsx"
                data-sentry-component="Badge"
              >
                1.0
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Files Card */}
      <div
        className="rounded-lg border bg-card text-card-foreground shadow-sm h-fit w-[500px] shrink-0"
        data-sentry-element="Card"
        data-sentry-component="PromptLinksCard"
        data-sentry-source-file="PromptLinksCard.tsx"
      >
        {/* Card Header */}
        <div
          className="flex flex-col gap-1.5 p-6"
          data-sentry-element="CardHeader"
          data-sentry-source-file="PromptLinksCard.tsx"
        >
          <h3
            className="text-2xl font-semibold leading-none tracking-tight"
            data-sentry-element="CardTitle"
            data-sentry-source-file="PromptLinksCard.tsx"
          >
            Files
          </h3>
        </div>
        {/* Card Content */}
        <div className="p-6 pt-0" data-sentry-element="CardContent" data-sentry-source-file="PromptLinksCard.tsx">
          <div
            data-sentry-element="FieldCollection"
            data-sentry-source-file="PromptLinksCard.tsx"
            className="flex flex-col gap-6"
          >
            {/* Entrypoint */}
            <div
              data-sentry-element="LabelGroup"
              data-sentry-source-file="PromptLinksCard.tsx"
              className="flex flex-col gap-2"
            >
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                data-sentry-element="Label"
                data-sentry-source-file="PromptLinksCard.tsx"
              >
                Entrypoint
              </label>
              <div
                data-sentry-element="Container"
                data-sentry-component="LinkBox"
                data-sentry-source-file="LinkBox.tsx"
                className="h-[36px] items-center rounded cursor-pointer justify-between flex w-full border-border border bg-[#FAFAFA] dark:bg-muted px-2.5 gap-8"
              >
                <div
                  data-sentry-element="LeftPart"
                  data-sentry-source-file="LinkBox.tsx"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  Hello world 👋🌍 - EXTENSION
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-right h-4 w-4"
                  data-sentry-element="ChevronRight"
                  data-sentry-source-file="LinkBox.tsx"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </div>
            {/* Sub-flows */}
            <div
              data-sentry-element="LabelGroup"
              data-sentry-source-file="PromptLinksCard.tsx"
              className="flex flex-col gap-2"
            >
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                data-sentry-element="Label"
                data-sentry-source-file="PromptLinksCard.tsx"
              >
                Sub-flows
              </label>
              <p className="text-sm text-muted-foreground">This deployment doesn't use any subflows</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
