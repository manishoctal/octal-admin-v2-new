
"use client";

import * as React from "react";
import { ChevronDown, Search } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

type Option = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options",
  disabled
}: MultiSelectProps) {
  const [search, setSearch] = React.useState("");

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggleValue = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          disabled={disabled}
          className={`flex items-center justify-between w-full min-h-[40px] bg-input-background dark:bg-input/30 px-3 py-2 rounded-md text-sm text-left
            ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-gray-50"}
          `}
        >
          <span className="truncate">
            {value?.length > 0
              ? options?.filter((opt) => value?.includes(opt?.value))?.map((opt) => opt?.label)?.join(", ")
              : placeholder}
          </span>
          <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
        </button>
      </PopoverTrigger>

        <PopoverContent className="p-2 w-[320px] md:w-[260px] lg:w-[300px] xl:w-[520px]">
          <div className="flex w-full items-center gap-2 px-2 py-1 border-b">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full text-sm outline-none py-1"
            />
          </div>

          {/* Options */}
          <div className="flex flex-col gap-1 max-h-48  overflow-y-auto mt-2">
            {filteredOptions?.length > 0 ? (
              filteredOptions?.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer"
                >
                  <Checkbox
                    checked={value.includes(opt.value)}
                    onCheckedChange={() => toggleValue(opt.value)}
                  />
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-2">
                No results found
              </p>
            )}
          </div>
        </PopoverContent>
      
    </Popover>
  );
}
