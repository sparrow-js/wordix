import type { Range } from "@tiptap/core";
import { Command } from "cmdk";
import { useAtom, useSetAtom } from "jotai";
import { createContext, forwardRef, useEffect } from "react";
import type { ComponentPropsWithoutRef, FC } from "react";
import type tunnel from "tunnel-rat";
import { queryAtom, rangeAtom } from "../utils/atoms";
import { novelStore } from "../utils/store";

export const EditorAtCommandTunnelContext = createContext({} as ReturnType<typeof tunnel>);

interface EditorCommandOutProps {
  readonly query: string;
  readonly range: Range;
}

export const EditorAtCommandOut: FC<EditorCommandOutProps> = ({ query, range }) => {
  const setQuery = useSetAtom(queryAtom, { store: novelStore });
  // @ts-ignore
  const setRange = useSetAtom(rangeAtom, { store: novelStore });

  useEffect(() => {
    setQuery(query);
  }, [query, setQuery]);

  useEffect(() => {
    setRange(range);
  }, [range, setRange]);

  useEffect(() => {
    const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];
    const onKeyDown = (e: KeyboardEvent) => {
      if (navigationKeys.includes(e.key)) {
        e.preventDefault();
        const commandRef = document.querySelector("#at-command");

        if (commandRef)
          commandRef.dispatchEvent(
            new KeyboardEvent("keydown", {
              key: e.key,
              cancelable: true,
              bubbles: true,
            }),
          );

        return false;
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <EditorAtCommandTunnelContext.Consumer>
      {(tunnelInstance) => <tunnelInstance.Out key={"atcommand"} />}
    </EditorAtCommandTunnelContext.Consumer>
  );
};

export const EditorAtCommand = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof Command>>(
  ({ children, className, ...rest }, ref) => {
    const [query, setQuery] = useAtom(queryAtom);

    return (
      <EditorAtCommandTunnelContext.Consumer>
        {(tunnelInstance) => (
          <tunnelInstance.In key={"atcommand"}>
            <Command
              key={"atcommand"}
              ref={ref}
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
              id="at-command"
              className={className}
              {...rest}
            >
              <Command.Input value={query} onValueChange={setQuery} style={{ display: "none" }} />
              {children}
            </Command>
          </tunnelInstance.In>
        )}
      </EditorAtCommandTunnelContext.Consumer>
    );
  },
);
export const EditorCommandAtList = Command.List;

EditorAtCommand.displayName = "EditoAtCommand";
