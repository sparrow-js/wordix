export default function OverviewPage() {
  return (
    <div className="flex items-start gap-5 pb-20">
      <div
        className="rounded-lg border bg-card text-card-foreground shadow-sm flex-1"
        data-sentry-element="Card"
        data-sentry-source-file="ApiView.tsx"
      >
        {/* API Section */}
        <div
          className="flex flex-col gap-1.5 p-6"
          data-sentry-element="CardHeader"
          data-sentry-source-file="ApiView.tsx"
        >
          <h3
            className="text-2xl font-semibold leading-none tracking-tight"
            data-sentry-element="CardTitle"
            data-sentry-source-file="ApiView.tsx"
          >
            API
          </h3>
        </div>
        <div className="p-6 pt-0" data-sentry-element="CardContent" data-sentry-source-file="ApiView.tsx">
          <div
            data-sentry-element="Container"
            data-sentry-component="ApiSection"
            data-sentry-source-file="ApiDocumentation.tsx"
            className="flex flex-col gap-6"
          >
            <div
              className="flex flex-col gap-6"
              data-sentry-component="Section"
              data-sentry-source-file="ApiDocumentation.tsx"
            >
              <h2 className="text-lg font-bold">URL</h2>
              <div
                className="flex flex-col rounded-md border border-border"
                data-sentry-component="BashCommand"
                data-sentry-source-file="bashCommand.tsx"
              >
                <div className="flex items-center justify-between px-2 text-primary text-xs py-2">
                  <span className="flex items-center gap-2.5 text-xs">
                    <code>/api/released-app/3574c11c-9c19-4b96-b963-3e678e73b481/run</code>
                  </span>
                  <button
                    className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background underline-offset-4 hover:underline text-primary rounded-md aspect-square h-fit p-0"
                    data-sentry-element="Button"
                    data-sentry-source-file="bashCommand.tsx"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-copy"
                      data-sentry-element="Copy"
                      data-sentry-source-file="bashCommand.tsx"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div
              className="flex flex-col gap-6"
              data-sentry-component="Section"
              data-sentry-source-file="ApiDocumentation.tsx"
            >
              <h2 className="text-lg font-bold">Request Body</h2>
              <p data-sentry-component="Paragraph" data-sentry-source-file="ApiDocumentation.tsx">
                You have to pass two parameters to the request body:{" "}
                <span
                  className="text-orange-300"
                  data-sentry-component="HighLight"
                  data-sentry-source-file="ApiDocumentation.tsx"
                >
                  inputs
                </span>{" "}
                and{" "}
                <span
                  className="text-orange-300"
                  data-sentry-component="HighLight"
                  data-sentry-source-file="ApiDocumentation.tsx"
                >
                  version
                </span>
                .
              </p>

              {/* Inputs Section */}
              <div
                className="flex flex-col gap-2"
                data-sentry-component="SubSection"
                data-sentry-source-file="ApiDocumentation.tsx"
              >
                <h3 className="text-md font-bold">Inputs</h3>
                <p data-sentry-component="Paragraph" data-sentry-source-file="ApiDocumentation.tsx">
                  These are the inputs for this WordApp:
                </p>
                <ul className="list-inside list-disc">
                  <li>
                    name <span className="text-gray-400">(text)</span>
                  </li>
                  <li>
                    style <span className="text-gray-400">(text)</span>
                  </li>
                </ul>
              </div>

              {/* Version Section */}
              <div
                className="flex flex-col gap-2"
                data-sentry-component="SubSection"
                data-sentry-source-file="ApiDocumentation.tsx"
              >
                <h3 className="text-md font-bold">Version</h3>
                <p data-sentry-component="Paragraph" data-sentry-source-file="ApiDocumentation.tsx">
                  We use a simplified semantic versioning. All versions follow the format{" "}
                  <span
                    className="text-orange-300"
                    data-sentry-component="HighLight"
                    data-sentry-source-file="ApiDocumentation.tsx"
                  >
                    &lt;major&gt;.&lt;minor&gt;
                  </span>
                  , for example{" "}
                  <span
                    className="text-orange-300"
                    data-sentry-component="HighLight"
                    data-sentry-source-file="ApiDocumentation.tsx"
                  >
                    1.0
                  </span>
                  .
                </p>
                <p data-sentry-component="Paragraph" data-sentry-source-file="ApiDocumentation.tsx">
                  You have to pass the version number you want to use. You can use the caret syntax like this to get the
                  latest non-breaking version:{" "}
                  <span
                    className="text-orange-300"
                    data-sentry-component="HighLight"
                    data-sentry-source-file="ApiDocumentation.tsx"
                  >
                    ^1.0
                  </span>
                  . We recommend you use this syntax when you build your APIs. Example:
                </p>
                <div
                  className="flex flex-col rounded-md border border-border"
                  data-sentry-component="BashCommand"
                  data-sentry-source-file="bashCommand.tsx"
                >
                  <div className="flex items-center justify-between px-2 text-primary text-xs py-2">
                    <span className="flex items-center gap-2.5 text-xs">
                      <code>{'{"version": "^1.0"}'}</code>
                    </span>
                    <button
                      className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background underline-offset-4 hover:underline text-primary rounded-md aspect-square h-fit p-0"
                      data-sentry-element="Button"
                      data-sentry-source-file="bashCommand.tsx"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-copy"
                        data-sentry-element="Copy"
                        data-sentry-source-file="bashCommand.tsx"
                      >
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Complete Body Section */}
              <div
                className="flex flex-col gap-2"
                data-sentry-component="SubSection"
                data-sentry-source-file="ApiDocumentation.tsx"
              >
                <h3 className="text-md font-bold">Complete Body</h3>
                <p data-sentry-component="Paragraph" data-sentry-source-file="ApiDocumentation.tsx">
                  The whole request body looks like this:
                </p>
                <pre className="whitespace-pre-wrap">
                  <div
                    className="flex flex-col rounded-md border border-border"
                    data-sentry-component="BashCommand"
                    data-sentry-source-file="bashCommand.tsx"
                  >
                    <div className="flex items-center justify-between px-2 text-primary text-xs py-2">
                      <span className="flex items-center gap-2.5 text-xs">
                        <code>
                          {"{"}
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;"inputs": {"{"}
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "&lt;text_value&gt;",
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"style": "&lt;text_value&gt;"
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;{"}"},<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;"version": "^1.0"
                          <br />
                          {"}"}
                        </code>
                      </span>
                      <button
                        className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background underline-offset-4 hover:underline text-primary rounded-md aspect-square h-fit p-0"
                        data-sentry-element="Button"
                        data-sentry-source-file="bashCommand.tsx"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-copy"
                          data-sentry-element="Copy"
                          data-sentry-source-file="bashCommand.tsx"
                        >
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testing Section */}
      <div
        className="rounded-lg border bg-card text-card-foreground shadow-sm flex-1"
        data-sentry-element="Card"
        data-sentry-source-file="ApiView.tsx"
      >
        <div
          className="flex flex-col gap-1.5 p-6"
          data-sentry-element="CardHeader"
          data-sentry-source-file="ApiView.tsx"
        >
          <h3
            className="text-2xl font-semibold leading-none tracking-tight"
            data-sentry-element="CardTitle"
            data-sentry-source-file="ApiView.tsx"
          >
            Testing
          </h3>
        </div>
        <div className="p-6 pt-0">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-bold">Setup</h2>
              <p>
                To get started, export your API key in your terminal. You can generate a key{" "}
                <a
                  className="text-sky-400"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="/o/haitao-wu-f6261c/settings/api-keys"
                >
                  here
                </a>
                .
              </p>
              <p>You can then export it from your terminal:</p>
              <div
                className="flex flex-col rounded-md border border-border"
                data-sentry-component="BashCommand"
                data-sentry-source-file="bashCommand.tsx"
              >
                <div className="flex items-center justify-between px-2 text-primary text-xs py-2">
                  <span className="flex items-center gap-2.5 text-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-dollar-sign"
                    >
                      <line x1="12" x2="12" y1="2" y2="22"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    <code>export WORDSMITH_API_KEY=&lt;your_api_key&gt;</code>
                  </span>
                  <button
                    className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background underline-offset-4 hover:underline text-primary rounded-md aspect-square h-fit p-0"
                    data-sentry-element="Button"
                    data-sentry-source-file="bashCommand.tsx"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-copy"
                      data-sentry-element="Copy"
                      data-sentry-source-file="bashCommand.tsx"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* cURL Section */}
            <div
              className="flex flex-col gap-2"
              data-sentry-component="CurlSection"
              data-sentry-source-file="CurlSection.tsx"
            >
              <h2 className="text-xl font-bold">cURL</h2>
              <p>Use this cURL command to send your request:</p>
              <div
                className="flex flex-col rounded-md border border-border"
                data-sentry-component="BashCommand"
                data-sentry-source-file="bashCommand.tsx"
              >
                <div className="flex items-center justify-between px-2 text-primary text-xs py-2">
                  <span className="flex items-center gap-2.5 text-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-dollar-sign"
                    >
                      <line x1="12" x2="12" y1="2" y2="22"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    <code>curl -X POST /api/released-app/3574c11c-9c19-4b96-b963-3e678e73b481/run</code>
                  </span>
                  <button
                    className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background underline-offset-4 hover:underline text-primary rounded-md aspect-square h-fit p-0"
                    data-sentry-element="Button"
                    data-sentry-source-file="bashCommand.tsx"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-copy"
                      data-sentry-element="Copy"
                      data-sentry-source-file="bashCommand.tsx"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                    </svg>
                  </button>
                </div>
                <div className="flex items-center justify-between px-2 text-primary text-xs py-2 ml-11">
                  <code>-H "Authorization: Bearer $WORDSMITH_API_KEY"</code>
                </div>
                <div className="flex items-center justify-between px-2 text-primary text-xs py-2 ml-11">
                  <code>-d</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
