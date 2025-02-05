"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useStores from "@/hooks/useStores";
import { AlertTriangle, Plus } from "lucide-react";
import { observer } from "mobx-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const TeamPage = observer(() => {
  const { workspaces } = useStores();
  const [members, setMembers] = useState<any[]>([]);
  useEffect(() => {
    async function fetchMembers() {
      const workspace = await workspaces.fetch(workspaces.selectedWorkspaceId, { force: true });

      setMembers(workspace.members);
    }

    if (workspaces.selectedWorkspaceId) {
      fetchMembers();
    }
  }, [workspaces.selectedWorkspaceId]);

  return (
    <div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm mt-10 p-4">
        <div className="grid items-start gap-8 pb-10">
          <div className="flex items-center justify-between px-2">
            <div className="grid gap-1">
              <h1 className="text-3xl font-bold md:text-4xl">Team</h1>
              <p className="text-lg text-muted-foreground">Add and manage your team members within's Projects.</p>
            </div>
            <div className="mr-6">
              <Button disabled>
                <Plus className="h-4 w-4 mr-2" />
                Add team member
              </Button>
            </div>
          </div>

          <div
            role="alert"
            className="relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 text-warning dark:border-warning [&>svg]:text-warning border-warning"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            <h5 className="mb-1 font-medium leading-none tracking-tight">Upgrade your plan</h5>
            <div className="text-sm [&_p]:leading-relaxed">
              <div className="mr-4 flex justify-between">
                <div className="py-1.5 pt-3">
                  Your current plan has only one seat. To add more team members, please upgrade your plan
                </div>
                <Link href="/settings/billing">
                  <Button>Upgrade now</Button>
                </Link>
              </div>
            </div>
          </div>

          <div>
            <div className="relative w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.createdAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default TeamPage;
