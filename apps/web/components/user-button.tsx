"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useStores from "@/hooks/useStores";
import { client } from "@/utils/ApiClient";
import { renderQuota } from "@/workflow/utils/token";
import { Activity, AlignJustify, CreditCard, Key, LogOut } from "lucide-react";
import { ChevronsUpDown } from "lucide-react";
import { observer } from "mobx-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UserButton = observer(() => {
  const [open, setOpen] = useState(false);
  const [tokenInfo, setTokenInfo] = useState({
    remain_quota: 0,
    used_quota: 0,
  });
  const { data: session, update } = useSession();
  if (!session?.user) return null;

  const { workspaces } = useStores();
  const fetchWorkspaces = async () => {
    const res = await workspaces.fetchPage();
    // @ts-ignore
    if (res.error) {
      router.push("/waitlist");
      return;
    }
    if (workspaces.orderedList.length > 0) {
      workspaces.setSelectedWorkspaceId(workspaces.orderedList[0].id);
    }
  };

  const router = useRouter();

  useEffect(() => {
    fetchWorkspaces();
  }, []);
  const workspace = workspaces.get(workspaces.selectedWorkspaceId);

  if (!workspace) return null;

  const getTokenInfo = async () => {
    const res = await client.get("/one-api/getTokenInfo", {
      workspaceId: workspaces.selectedWorkspaceId,
    });

    const { data } = res;
    if (data) {
      setTokenInfo(data);
    }
  };

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(open: boolean) => {
        if (open) {
          getTokenInfo();
        }
        setOpen(open);
      }}
    >
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border px-2.5 py-1 shadow-sm hover:bg-muted"
          aria-haspopup="menu"
          data-state="closed"
        >
          <AlignJustify className="mr-2 h-4 w-4" />
          <div className="relative cursor-pointer">
            <span className="relative flex h-7 w-7 shrink-0 overflow-hidden rounded-full">
              <img className="aspect-square h-full w-full" alt="Profile" src={session?.user?.image} />
            </span>
            <div className="absolute -bottom-0.5 -right-0.5 m-0 inline-flex h-3 w-3 flex-shrink-0 items-center justify-center rounded-[2px] bg-pink-300 text-[8px] leading-[10px]">
              <span className="text-white">{session?.user?.name?.charAt(0)}</span>
            </div>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          {workspace?.name}
          <div className="text-sm text-muted-foreground font-normal">{session?.user?.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <ChevronsUpDown className="mr-2 h-4 w-4" />

              <span>Switch Organization</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {workspaces.orderedList.map((workspace) => (
                  <DropdownMenuItem key={workspace.id} onClick={() => workspaces.setSelectedWorkspaceId(workspace.id)}>
                    <span>{workspace.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => router.push("/settings/api-keys")}>
            <Key className="mr-2 h-4 w-4" />
            <span>API Keys</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => router.push("/settings/billing")}>
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </div>
              <span>{renderQuota(tokenInfo.remain_quota, true)}</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => router.push("/settings/usage")}>
            <Activity className="mr-2 h-4 w-4" />
            <span>Usage</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await signOut();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export default UserButton;
