import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Folder, LayoutDashboard, Rocket } from "lucide-react";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useSelectedLayoutSegments } from "next/navigation";
import { useState } from "react";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
];

const LeftSidebar = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

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
              {value ? frameworks.find((framework) => framework.value === value)?.label : "Select framework..."}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
            <Command>
              {/* <CommandInput placeholder="Search framework..." className="h-9" /> */}
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {frameworks.map((framework) => (
                    <CommandItem
                      key={framework.value}
                      value={framework.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      {framework.label}
                      <CheckIcon
                        className={cn("ml-auto h-4 w-4", value === framework.value ? "opacity-100" : "opacity-0")}
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
        <Link href="/app">
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
          <Link href="/app/projects">
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
          <Link href="/app/deployments">
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
        {/* 
        <div className="flex flex-col gap-1 h-fit">
          <h2 className="text-xl font-semibold text-primary px-2.5 pt-2.5 pb-1 truncate">Community</h2>
          <Link href="/explore" target="_blank">
            <div className="flex h-10 cursor-pointer items-center gap-2.5 rounded-md p-2.5 text-sm font-medium text-foreground hover:bg-muted/30">
              <Shapes className="h-4 w-4" />
              Explore
              <div className="ml-auto">
                <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
              </div>
            </div>
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default LeftSidebar;
