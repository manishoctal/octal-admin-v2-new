import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DebouncedSearchInputProps {
  placeholder?: string;
  delay?: number;
  onSearch: (value: string) => void;
  defaultValue?: string;
  className?: string;
}

const DebouncedSearchInput: React.FC<DebouncedSearchInputProps> = ({
  placeholder = 'Search...',
  delay = 500,
  onSearch,
  defaultValue = '',
  className = '',
  setPage
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [isInitialized, setIsInitialized] = useState(false);
  const[debouncedSearchTerm,setDebouncedSearchTerm]=useState('')
  // Update internal input value when defaultValue changes (reset scenario)
  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);


  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
    } else{
      setPage(1);
    }
  }, [debouncedSearchTerm]);


  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(inputValue?.trim());
      setDebouncedSearchTerm(inputValue?.trim())
    }, delay);

    return () => clearTimeout(handler);
  }, [inputValue, delay, onSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={`pl-10 h-10 ${className}`}
      />
    </div>
  );
};

export default DebouncedSearchInput;
