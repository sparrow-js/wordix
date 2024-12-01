export default function RunsPage() {
    return (
    <div className="w-full rounded-lg border border-border bg-background">
        <div className="relative w-full overflow-auto">
          <table
            className="w-full caption-bottom text-sm"
            data-sentry-element="Table"
            data-sentry-component="RunsTable"
            data-sentry-source-file="RunsTable.tsx"
          >
            <thead
              className="[&_tr]:border-b"
              data-sentry-element="TableHeader"
              data-sentry-source-file="RunsTable.tsx"
            >
              <tr
                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                data-sentry-element="TableRow"
                data-sentry-source-file="RunsTable.tsx"
              >
                <th
                  className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                  data-sentry-element="TableHead"
                  data-sentry-source-file="RunsTable.tsx"
                >
                  User
                </th>
                <th
                  className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                  data-sentry-element="TableHead"
                  data-sentry-source-file="RunsTable.tsx"
                >
                  Organization
                </th>
                <th
                  className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                  data-sentry-element="TableHead"
                  data-sentry-source-file="RunsTable.tsx"
                >
                  Time
                </th>
                <th
                  className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                  data-sentry-element="TableHead"
                  data-sentry-source-file="RunsTable.tsx"
                >
                  Duration
                </th>
                <th
                  className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                  data-sentry-element="TableHead"
                  data-sentry-source-file="RunsTable.tsx"
                >
                  Version
                </th>
              </tr>
            </thead>
            <tbody
              className="[&_tr:last-child]:border-0"
              data-sentry-element="TableBody"
              data-sentry-source-file="RunsTable.tsx"
            >
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer">
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">-</td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">-</td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <span
                    data-state="closed"
                    data-sentry-element="TooltipTrigger"
                    data-sentry-source-file="tooltip.tsx"
                  >
                    an hour ago
                  </span>
                </td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <span>1s</span>
                </td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <div
                    className="inline-flex items-center rounded-full border px-2.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 w-fit py-0"
                    data-sentry-element="Badge"
                    data-sentry-component="Badge"
                    data-sentry-source-file="badge.tsx"
                  >
                    1.0
                  </div>
                </td>
              </tr>
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer">
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">-</td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">-</td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <span
                    data-state="closed"
                    data-sentry-element="TooltipTrigger"
                    data-sentry-source-file="tooltip.tsx"
                  >
                    an hour ago
                  </span>
                </td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <span>1s</span>
                </td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <div
                    className="inline-flex items-center rounded-full border px-2.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 w-fit py-0"
                    data-sentry-element="Badge"
                    data-sentry-component="Badge"
                    data-sentry-source-file="badge.tsx"
                  >
                    1.0
                  </div>
                </td>
              </tr>
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer">
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">-</td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">-</td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <span
                    data-state="closed"
                    data-sentry-element="TooltipTrigger"
                    data-sentry-source-file="tooltip.tsx"
                  >
                    an hour ago
                  </span>
                </td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <span>1s</span>
                </td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <div
                    className="inline-flex items-center rounded-full border px-2.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 w-fit py-0"
                    data-sentry-element="Badge"
                    data-sentry-component="Badge"
                    data-sentry-source-file="badge.tsx"
                  >
                    1.0
                  </div>
                </td>
              </tr>
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer">
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">-</td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">-</td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <span
                    data-state="closed"
                    data-sentry-element="TooltipTrigger"
                    data-sentry-source-file="tooltip.tsx"
                  >
                    an hour ago
                  </span>
                </td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <span>1s</span>
                </td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <div
                    className="inline-flex items-center rounded-full border px-2.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 w-fit py-0"
                    data-sentry-element="Badge"
                    data-sentry-component="Badge"
                    data-sentry-source-file="badge.tsx"
                  >
                    1.0
                  </div>
                </td>
              </tr>
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer">
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">-</td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">-</td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <span
                    data-state="closed"
                    data-sentry-element="TooltipTrigger"
                    data-sentry-source-file="tooltip.tsx"
                  >
                    an hour ago
                  </span>
                </td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <span>2s</span>
                </td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <div
                    className="inline-flex items-center rounded-full border px-2.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 w-fit py-0"
                    data-sentry-element="Badge"
                    data-sentry-component="Badge"
                    data-sentry-source-file="badge.tsx"
                  >
                    1.0
                  </div>
                </td>
              </tr>
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer">
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">haitao wu</td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">haitao wu's Projects</td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <span
                    data-state="closed"
                    data-sentry-element="TooltipTrigger"
                    data-sentry-source-file="tooltip.tsx"
                  >
                    an hour ago
                  </span>
                </td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <span>2s</span>
                </td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <div
                    className="inline-flex items-center rounded-full border px-2.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 w-fit py-0"
                    data-sentry-element="Badge"
                    data-sentry-component="Badge"
                    data-sentry-source-file="badge.tsx"
                  >
                    1.0
                  </div>
                </td>
              </tr>
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer">
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">haitao wu</td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">haitao wu's Projects</td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <span
                    data-state="closed"
                    data-sentry-element="TooltipTrigger"
                    data-sentry-source-file="tooltip.tsx"
                  >
                    an hour ago
                  </span>
                </td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <span>3s</span>
                </td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <div
                    className="inline-flex items-center rounded-full border px-2.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 w-fit py-0"
                    data-sentry-element="Badge"
                    data-sentry-component="Badge"
                    data-sentry-source-file="badge.tsx"
                  >
                    1.0
                  </div>
                </td>
              </tr>
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer">
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">haitao wu</td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">haitao wu's Projects</td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <span
                    data-state="closed"
                    data-sentry-element="TooltipTrigger"
                    data-sentry-source-file="tooltip.tsx"
                  >
                    an hour ago
                  </span>
                </td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <span>2s</span>
                </td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <div
                    className="inline-flex items-center rounded-full border px-2.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 w-fit py-0"
                    data-sentry-element="Badge"
                    data-sentry-component="Badge"
                    data-sentry-source-file="badge.tsx"
                  >
                    1.0
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
}
