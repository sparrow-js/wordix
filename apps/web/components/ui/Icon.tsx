import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { memo } from "react";

export type IconProps = {
  name: keyof typeof Icons;
  className?: string;
  strokeWidth?: number;
};

export const Icon = memo(({ name, className, strokeWidth }: IconProps) => {
  const IconComponent = Icons[name] as LucideIcon;

  if (!IconComponent) {
    return null;
  }

  return <IconComponent className={cn("w-4 h-4", className)} strokeWidth={strokeWidth || 2.5} />;
});

Icon.displayName = "Icon";
