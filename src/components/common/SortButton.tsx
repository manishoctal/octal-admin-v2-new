import React from 'react';
import { ArrowUpDown } from 'lucide-react'; // or any icon you're using

interface SortButtonProps<T> {
  field: keyof T;
  sortField: keyof T;
  onSort: (field: keyof T) => void;
  children: React.ReactNode;
}

const SortButton = <T,>({ field, sortField, onSort, children }: SortButtonProps<T>) => {
  const isActive = sortField === field;

  return (
    <button
      type="button"
      className="flex items-center gap-1 hover:text-foreground cursor-pointer transition-colors"
      onClick={() => onSort(field)}
    >
      <span className={isActive ? 'font-semibold' : 'font-medium'}>{children}</span>
      <ArrowUpDown className={`h-3 w-3 ${isActive ? 'opacity-100' : 'opacity-50'}`} />
    </button>
  );
};

export default SortButton;
