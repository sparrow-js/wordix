import { type ButtonHTMLAttributes, type HTMLProps, forwardRef } from "react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Surface } from "./Surface";
import { Button, type ButtonProps } from "./button";

export type ToolbarWrapperProps = {
  shouldShowContent?: boolean;
  isVertical?: boolean;
} & HTMLProps<HTMLDivElement>;

const ToolbarWrapper = forwardRef<HTMLDivElement, ToolbarWrapperProps>(
  ({ shouldShowContent = true, children, isVertical = false, className, ...rest }, ref) => {
    const toolbarClassName = cn(
      "text-black inline-flex h-full leading-none gap-0.5",
      isVertical ? "flex-col p-2" : "flex-row p-1 items-center",
      className,
    );

    return (
      shouldShowContent && (
        <Surface className={toolbarClassName} {...rest} ref={ref}>
          {children}
        </Surface>
      )
    );
  },
);

ToolbarWrapper.displayName = "Toolbar";

export type ToolbarDividerProps = {
  horizontal?: boolean;
} & HTMLProps<HTMLDivElement>;

const ToolbarDivider = forwardRef<HTMLDivElement, ToolbarDividerProps>(({ horizontal, className, ...rest }, ref) => {
  const dividerClassName = cn(
    "bg-neutral-200 dark:bg-neutral-800",
    horizontal
      ? "w-full min-w-[1.5rem] h-[1px] my-1 first:mt-0 last:mt-0"
      : "h-full min-h-[1.5rem] w-[1px] mx-1 first:ml-0 last:mr-0",
    className,
  );

  return <div className={dividerClassName} ref={ref} {...rest} />;
});

ToolbarDivider.displayName = "Toolbar.Divider";

export type ToolbarButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  activeClassname?: string;
  tooltip?: string;
  tooltipShortcut?: string[];
  // @ts-ignore
  buttonSize?: ButtonProps["buttonSize"];
  variant?: ButtonProps["variant"];
};

const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  (
    { children, buttonSize = "icon", variant = "ghost", className, tooltip, tooltipShortcut, activeClassname, ...rest },
    ref,
  ) => {
    const buttonClass = cn("gap-1 min-w-[1rem] px-1 w-auto", className);

    const content = (
      <Button
        // @ts-ignore
        activeClassname={activeClassname}
        className={buttonClass}
        variant={variant}
        buttonSize={buttonSize}
        ref={ref}
        {...rest}
      >
        {children}
      </Button>
    );

    if (tooltip) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>{content}</TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return content;
  },
);

ToolbarButton.displayName = "ToolbarButton";

export const Toolbar = {
  Wrapper: ToolbarWrapper,
  Divider: ToolbarDivider,
  Button: ToolbarButton,
};
