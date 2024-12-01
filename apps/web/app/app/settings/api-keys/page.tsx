import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ApiKeysPage() {
  return (
    <main className="flex-1 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">API Keys</h1>
        <p className="text-gray-500 mb-8">Create and manage your API keys within haitao wu&apos;s Projects.</p>
        <div className="bg-white rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last used</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{/* Add table rows here when you have data */}</TableBody>
          </Table>
        </div>

        <Button className="mt-6" size="lg">
          Create new key
        </Button>
      </div>
    </main>
  );
}
