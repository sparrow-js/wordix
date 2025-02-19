import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronRight, Folder, LayoutDashboard, Rocket, Shapes } from "lucide-react";

import Link from "next/link";

import useStores from "@/hooks/useStores";
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { observer } from "mobx-react";
import { useSelectedLayoutSegments } from "next/navigation";
import { useState } from "react";

const LeftSidebar = observer(() => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { workspaces, workbench } = useStores();

  const workspace = workspaces.get(workspaces.selectedWorkspaceId);
  const segments = useSelectedLayoutSegments();

  return (
    <div
      data-sentry-element="Root"
      data-sentry-component="LeftSidebar"
      className="flex h-full w-full flex-col self-stretch bg-background"
    >
      <div className="h-[60px] shrink-0 border-b border-border w-full flex justify-center p-2.5">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
              {workspace?.name || "Select workspace"}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
            <Command>
              <CommandList>
                <CommandEmpty>No workspace found.</CommandEmpty>
                <CommandGroup>
                  {workspaces.orderedList.map((workspace) => (
                    <CommandItem
                      key={workspace.id}
                      value={workspace.id}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        workspaces.setSelectedWorkspaceId(currentValue);
                        setOpen(false);
                      }}
                    >
                      {workspace.name}
                      <CheckIcon
                        className={cn("ml-auto h-4 w-4", value === workspace.id ? "opacity-100" : "opacity-0")}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-4 p-2.5 h-full">
        <Link href="/">
          <div
            className={cn(
              "flex h-10 cursor-pointer items-center gap-2.5 rounded-md p-2.5 text-sm font-medium text-foreground",
              segments[0] === "dashboard" || !segments[0] ? "bg-muted/80 hover:bg-muted/80" : "hover:bg-muted/30",
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </div>
        </Link>

        <div className="flex flex-col gap-1 h-fit">
          <h2 className="text-xl font-semibold text-primary px-2.5 pt-2.5 pb-1 truncate">Workspace</h2>
          <Link href="/projects">
            <div
              className={cn(
                "flex h-10 cursor-pointer items-center gap-2.5 rounded-md p-2.5 text-sm font-medium text-foreground hover:bg-muted/30",
                segments[0] === "projects" ? "bg-muted/80 hover:bg-muted/80" : "hover:bg-muted/30",
              )}
            >
              <Folder className="h-4 w-4" />
              Projects
            </div>
          </Link>
          <Link href="/deployments">
            <div
              className={cn(
                "flex h-10 cursor-pointer items-center gap-2.5 rounded-md p-2.5 text-sm font-medium text-foreground hover:bg-muted/30",
                segments[0] === "deployments" ? "bg-muted/80 hover:bg-muted/80" : "hover:bg-muted/30",
              )}
            >
              <Rocket className="h-4 w-4" />
              Deployments
            </div>
          </Link>
        </div>

        <div className="flex flex-col gap-1 h-fit">
          <h2 className="text-xl font-semibold text-primary px-2.5 pt-2.5 pb-1 truncate">Community</h2>
          <Link href="/explore">
            <div className="flex h-10 cursor-pointer items-center gap-2.5 rounded-md p-2.5 text-sm font-medium text-foreground hover:bg-muted/30">
              <Shapes className="h-4 w-4" />
              Explore
              <div className="ml-auto">
                <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
              </div>
            </div>
          </Link>
        </div>
      </div>


    </div>
  );
});

export default LeftSidebar;
