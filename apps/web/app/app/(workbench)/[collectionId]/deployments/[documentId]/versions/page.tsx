export default function VersionsPage() {
    return (
        <div
            className="border bg-card text-card-foreground shadow-sm h-full rounded-md"
            data-sentry-element="Card"
            data-sentry-source-file="VersionsView.tsx"
        >
            <div
            className="flex flex-col gap-1.5 p-6"
            data-sentry-element="CardHeader"
            data-sentry-source-file="VersionsView.tsx"
            >
            <h3
                className="text-2xl font-semibold leading-none tracking-tight"
                data-sentry-element="CardTitle"
                data-sentry-source-file="VersionsView.tsx"
            >
                Versions
            </h3>
            </div>
            <div
            className="p-6 pt-0 h-full"
            data-sentry-element="CardContent"
            data-sentry-source-file="VersionsView.tsx"
            >
            <div className="relative w-full overflow-auto">
                <table
                className="w-full caption-bottom text-sm"
                data-sentry-element="Table"
                data-sentry-source-file="VersionsView.tsx"
                >
                <thead
                    className="[&_tr]:border-b"
                    data-sentry-element="TableHeader"
                    data-sentry-source-file="VersionsView.tsx"
                >
                    <tr
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    data-sentry-element="TableRow"
                    data-sentry-source-file="VersionsView.tsx"
                    >
                    <th
                        className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0"
                        data-sentry-element="TableHead"
                        data-sentry-source-file="VersionsView.tsx"
                    >
                        Version
                    </th>
                    <th
                        className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0"
                        data-sentry-element="TableHead"
                        data-sentry-source-file="VersionsView.tsx"
                    >
                        Title
                    </th>
                    <th
                        className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0"
                        data-sentry-element="TableHead"
                        data-sentry-source-file="VersionsView.tsx"
                    >
                        Release Date
                    </th>
                    </tr>
                </thead>
                <tbody
                    className="[&_tr:last-child]:border-0 overflow-y-scroll"
                    data-sentry-element="TableBody"
                    data-sentry-source-file="VersionsView.tsx"
                >
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td
                        className="p-4 align-middle [&_:has([role=checkbox])]:pr-0"
                    >
                        <div
                        className="inline-flex items-center rounded-full border px-2.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-secondary/80 w-fit py-0 bg-blue-400 text-primary-foreground"
                        data-sentry-element="Badge"
                        data-sentry-component="Badge"
                        data-sentry-source-file="badge.tsx"
                        >
                        1.0
                        </div>
                    </td>
                    <td
                        className="p-4 align-middle [&_:has([role=checkbox])]:pr-0"
                    >
                        Hello world 👋🌍 - EXTENSION
                    </td>
                    <td
                        className="p-4 align-middle [&_:has([role=checkbox])]:pr-0"
                    >
                        27/10/2024
                    </td>
                    </tr>
                </tbody>
                </table>
            </div>
            </div>
        </div>
    )
}
