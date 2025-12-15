
"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/components/ui/utils";
import { buttonVariants } from "@/components/ui/button";
import { useSettings } from "../SettingsContext";
import helpers from "@/utils/helpers";

interface DatePickerProps {
 readonly value?: Date;
  onChange?: (date: Date | undefined) => void;
 readonly placeholder?: string;
 readonly className?: string;
 readonly minDate?:string;
 readonly maxDate?:string;
 readonly disabled?:boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  dateFormat = "dd/MM/yyyy",
  minDate, 
  maxDate, 
  disabled
}: DatePickerProps) {
  const [internalDate, setInternalDate] = useState<Date | undefined>(value);
  const { settings } = useSettings();
  const handleSelect = (selectedDate?: Date) => {
    setInternalDate(selectedDate);
    onChange?.(selectedDate);
  };


  useEffect(()=>{
    setInternalDate(value)
  },[value])

  dateFormat=helpers.convertDateFormat(settings?.dateFormat)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-[240px] justify-start text-left font-normal",
            !internalDate && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {internalDate
            ? format(internalDate, dateFormat)
            : <span>{placeholder}</span>}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="bg-white border rounded-md p-0 shadow-lg z-20"
      >
        <Calendar
          mode="single"
          selected={internalDate}
          onSelect={handleSelect}
          disabled={(date) => {
            if (minDate && date < minDate) return true;
            if (maxDate && date > maxDate) return true;
            return false;
          }}
          initialFocus
          
        />
      </PopoverContent>
    </Popover>
  );
}
