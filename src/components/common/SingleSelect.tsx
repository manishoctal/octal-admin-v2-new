"use client";

import * as React from "react";
import { ChevronDown, Search,Check } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

type Option = {
  label: string;
  value: string;
};

interface SingleSelectProps {
 readonly options: Option[];
 readonly value: string | null;
 readonly onChange: (value: string | null) => void;
 readonly placeholder?: string;
 readonly disabled?: boolean;
}

export function SingleSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled,
}: SingleSelectProps) {
  const [search, setSearch] = React.useState("");

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (val: string) => {
    if (value === val) {
      onChange(null); // deselect if clicked again
    } else {
      onChange(val);
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
            {value
              ? options.find((opt) => opt.value === value)?.label
              : placeholder}
          </span>
          <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="p-2 w-[320px] md:w-[260px] lg:w-[300px] xl:w-[520px]">
        {/* Search */}
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
        <div className="flex flex-col gap-1 max-h-48 overflow-y-auto mt-2">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`flex items-center justify-between px-2 py-1 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer ${
                  value === opt.value ? "bg-gray-100 dark:bg-gray-800" : ""
                }`}
              >
                <span>{opt.label}</span>
                {value === opt.value && <Check className="w-4 h-4 text-gray-500" />}
              </button>
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
