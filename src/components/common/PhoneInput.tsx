import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../ui/utils';
import { countries, Country, searchCountries } from './countriesData';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
}

export function PhoneInput({ 
  value, 
  onChange, 
  placeholder = "Enter phone number", 
  disabled = false,
  className,
  error 
}: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countries.find(c => c.code === 'US') || countries[0]
  );
  const [phoneNumber, setPhoneNumber] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize from value prop
  useEffect(() => {
    if (value && value !== selectedCountry.phoneCode + phoneNumber) {
      // Try to parse the existing phone number
      const country = countries.find(c => value.startsWith(c.phoneCode));
      if (country) {
        setSelectedCountry(country);
        setPhoneNumber(value.substring(country.phoneCode.length));
      } else {
        setPhoneNumber(value);
      }
    }
  }, [value, selectedCountry.phoneCode, phoneNumber]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setOpen(false);
    const newValue = country.phoneCode + phoneNumber;
    onChange(newValue);
    
    // Focus the input after country selection
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handlePhoneNumberChange = (newPhoneNumber: string) => {
    // Remove any non-digit characters except spaces and dashes
    const cleaned = newPhoneNumber.replace(/[^\d\s\-\(\)]/g, '');
    setPhoneNumber(cleaned);
    const newValue = selectedCountry.phoneCode + cleaned;
    onChange(newValue);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const filteredCountries = searchQuery 
    ? searchCountries(searchQuery)
    : countries;

  return (
    <div className={cn("flex", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-[120px] justify-between rounded-r-none border-r-0 px-3",
              error && "border-destructive"
            )}
            disabled={disabled}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-lg leading-none">{selectedCountry.flag}</span>
              <span className="text-sm font-mono truncate">{selectedCountry.phoneCode}</span>
            </div>
            <ChevronDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-0" align="start">
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
                    value={`${country.name} ${country.code} ${country.phoneCode}`}
                    onSelect={() => handleCountrySelect(country)}
                    className="flex items-center gap-3"
                  >
                    <span className="text-lg">{country.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="truncate">{country.name}</span>
                        <span className="text-sm text-muted-foreground font-mono ml-2">
                          {country.phoneCode}
                        </span>
                      </div>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedCountry.code === country.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      <Input
        ref={inputRef}
        type="tel"
        value={phoneNumber}
        onChange={(e) => handlePhoneNumberChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "rounded-l-none border-l-0 focus:border-l",
          error && "border-destructive"
        )}
      />
    </div>
  );
}