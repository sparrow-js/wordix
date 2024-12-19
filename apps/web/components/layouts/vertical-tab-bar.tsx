"use client";
import { Button } from "@/components/ui/button";
import { Files, ListTree, MessageCircle, Rocket } from "lucide-react";
import Link from "next/link";
import { useParams, useSelectedLayoutSegment } from "next/navigation";

export function VerticalTabBar() {
  const { collectionId } = useParams();
  const selectedSegment = useSelectedLayoutSegment();

  const navItems = [
    {
      name: "docs",
      href: `/${collectionId}/docs`,
      segment: "docs",
      icon: Files,
    },
    {
      name: "runs",
      href: `/${collectionId}/runs`,
      segment: "runs",
      icon: ListTree,
    },
    {
      name: "deployments",
      href: `/${collectionId}/deployments`,
      segment: "deployments",
      icon: Rocket,
    },
  ];
  return (
    <div className="flex w-[60px] flex-col justify-between self-stretch border-r border-border bg-background p-2.5 shrink-0">
      <div className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link key={item.segment} href={item.href}>
            <Button
              variant={selectedSegment === item.segment ? "default" : "ghost"}
              size="icon"
              className="aspect-square h-fit relative"
            >
              <item.icon size={20} />
            </Button>
          </Link>
        ))}
      </div>
      <div className="flex-grow" />
      <div className="flex flex-col gap-2">
        {/* <Button variant="ghost" size="icon" className="aspect-square h-fit relative">
          <Shapes size={20} />
        </Button> */}
        <Link href="https://github.com/sparrow-js/wordix-discuss/discussions/" target="_blank">
          <Button variant="ghost" size="icon" className="aspect-square h-fit relative">
            <MessageCircle size={20} />
          </Button>
        </Link>
        {/* <Button variant="ghost" size="icon" className="aspect-square h-fit relative">
          <Book size={20} />
        </Button> */}
      </div>
    </div>
  );
}
