import { Command } from "cmdk";
import { X } from "lucide-react";
import { useState } from "react";

interface VariableInputProps {
  value: string;
  type?: "variable" | "literal";
  onChange: (value: string, type: "variable" | "literal") => void;
  placeholder?: string;
  variables?: Array<{ label: string; value: string }>;
  className?: string;
}

export const VariableInput = ({
  value,
  type = "literal",
  onChange,
  placeholder = "Type '@' to use a variable",
  variables = [
    { label: "@number", value: "@number" },
    { label: "@text", value: "@text" },
    { label: "@boolean", value: "@boolean" },
  ],
  className,
}: VariableInputProps) => {
  const [open, setOpen] = useState(false);

  const handleClear = () => {
    onChange("", "literal");
  };

  return (
    <div className="relative">
      {type === "variable" ? (
        <div className="my-2 flex w-full items-center rounded-2xl border-2 py-2 pl-4 border-stone-100">
          <div className="overflow-hidden font-mono text-stone-700">
            @{variables.find((v) => v.value === value)?.label || value}
          </div>{" "}
          <X
            className="ml-auto mr-2.5 w-fit shrink-0 pl-3 text-stone-400 hover:text-stone-500 active:text-stone-600 cursor-pointer"
            onClick={handleClear}
          />
        </div>
      ) : (
        <input
          className={`w-full overflow-hidden overscroll-none border border-b-4 border-transparent p-2 transition-colors duration-200 hover:bg-stone-50 focus:mb-[3px] focus:rounded-lg focus:border focus:bg-white focus:shadow-lg focus:outline-0 border-b-stone-200 focus:border-stone-100 ${className}`}
          placeholder={placeholder}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value, "literal");
            if (e.target.value === "@") {
              setOpen(true);
            } else {
              setOpen(false);
            }
          }}
        />
      )}
      {open && type === "literal" && (
        <div className="absolute left-0 right-0 top-full mt-1 rounded-lg border border-stone-200 bg-white shadow-lg z-50">
          <Command>
            <Command.List>
              <Command.Empty>No results found.</Command.Empty>
              <Command.Group>
                {variables.map((variable) => (
                  <Command.Item
                    key={variable.value}
                    className="flex items-center px-2 py-1.5 text-sm hover:bg-stone-100 cursor-pointer"
                    onSelect={() => {
                      onChange(variable.value, "variable");
                      setOpen(false);
                    }}
                  >
                    {variable.label}
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>
          </Command>
        </div>
      )}
    </div>
  );
};
