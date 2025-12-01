import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { cn } from '../ui/utils';
import { countries, Country, searchCountries } from './countriesData';

interface CountrySelectProps {
 readonly value: string;
 readonly onChange: (value: string) => void;
 readonly placeholder?: string;
 readonly disabled?: boolean;
 readonly className?: string;
 readonly error?: string;
}

export function CountrySelect({ 
  value, 
  onChange, 
  placeholder = "Select country...", 
  disabled = false,
  className,
  error 
}: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCountry = countries.find(country => country.name === value);
  const filteredCountries = searchQuery 
    ? searchCountries(searchQuery)
    : countries;

  const handleCountrySelect = (country: Country) => {
    onChange(country.name);
    setOpen(false);
    setSearchQuery('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !selectedCountry && "text-muted-foreground",
            error && "border-destructive",
            className
          )}
          disabled={disabled}
        >
          <div className="flex items-center gap-2 min-w-0">
            {selectedCountry ? (
              <>
                <span className="text-lg leading-none">{selectedCountry.flag}</span>
                <span className="truncate">{selectedCountry.name}</span>
              </>
            ) : (
              <>
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>{placeholder}</span>
              </>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Search countries..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {filteredCountries.map((country) => (
                <CommandItem
                  key={country.code}
                  value={`${country.name} ${country.code}`}
                  onSelect={() => handleCountrySelect(country)}
                  className="flex items-center gap-3"
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="flex-1 truncate">{country.name}</span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedCountry?.code === country.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}