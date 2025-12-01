import React from 'react';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { CalendarIcon } from 'lucide-react';
import { cn } from '../ui/utils';
import helpers from '@/utils/helpers';
import { useSettings } from '../SettingsContext';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangePickerProps {
  readonly dateRange: DateRange;
  readonly onDateRangeChange: (range: DateRange) => void;
  readonly placeholder?: string;
  readonly className?: string;
  readonly maxDate?: Date;
}

export function DateRangePicker({ 
  dateRange, 
  onDateRangeChange, 
  placeholder = "Pick a date range",
  className,
  maxDate
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const {settings}=useSettings()
  const formatDateRange = (range: DateRange) => {
    if (!range.from) return placeholder;
    if (!range.to) return `${helpers.showFormattedDate(range?.from?.toLocaleDateString(), `${settings?.dateFormat}`)} - ...`;
    return `${helpers.showFormattedDate(range?.from?.toLocaleDateString(), `${settings?.dateFormat}`)} - ${helpers.showFormattedDate(range?.to?.toLocaleDateString(), `${settings?.dateFormat}`)}`;
  };

  const handleSelect = (range: DateRange | undefined) => {
    if (range) {
      onDateRangeChange(range);
      if (range.from && range.to) {
        setIsOpen(false);
      }
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full sm:w-[280px] sm:!h-[35px] h-[30px] justify-start text-left font-normal",
            !dateRange.from && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateRange(dateRange)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={dateRange.from}
          selected={dateRange}
          onSelect={handleSelect}
          numberOfMonths={2}
          disabled={(date) => maxDate ? date > maxDate : date > new Date()}
        />
      </PopoverContent>
    </Popover>
  );
}