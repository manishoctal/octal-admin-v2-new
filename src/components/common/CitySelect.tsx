import React, { useState, useMemo } from 'react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Check, ChevronDown, MapPin } from 'lucide-react';
import { cn } from '../ui/utils';
import { majorCities, City, searchCities, getCitiesByCountry, getCountryByCode } from './countriesData';

interface CitySelectProps {
 readonly value: string;
 readonly onChange: (value: string) => void;
 readonly countryName?: string;
 readonly placeholder?: string;
 readonly disabled?: boolean;
 readonly className?: string;
 readonly error?: string;
}

export function CitySelect({ 
  value, 
  onChange, 
  countryName,
  placeholder = "Select city...", 
  disabled = false,
  className,
  error 
}: CitySelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Get available cities based on selected country
  const availableCities = useMemo(() => {
    if (!countryName) return majorCities;
    
    // Find country code by name
    const country = countryName ? 
      [...new Set(majorCities.map(city => city.country))]
        .map(code => getCountryByCode(code))
        .find(c => c?.name === countryName) 
      : null;
    
    if (country) {
      return getCitiesByCountry(country.code);
    }
    
    return majorCities;
  }, [countryName]);

  const filteredCities = useMemo(() => {
    if (!searchQuery) return availableCities;
    return searchCities(searchQuery).filter(city => 
      availableCities.some(ac => ac.name === city.name && ac.country === city.country)
    );
  }, [searchQuery, availableCities]);

  const selectedCity = availableCities.find(city => city.name === value);

  const handleCitySelect = (city: City) => {
    onChange(city.name);
    setOpen(false);
    setSearchQuery('');
  };

  // Allow custom city input
  const handleCustomCity = () => {
    if (searchQuery.trim() && !filteredCities.some(city => 
      city.name.toLowerCase() === searchQuery.toLowerCase()
    )) {
      onChange(searchQuery.trim());
      setOpen(false);
      setSearchQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      e.preventDefault();
      handleCustomCity();
    }
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
            !value && "text-muted-foreground",
            error && "border-destructive",
            className
          )}
          disabled={disabled}
        >
          <div className="flex items-center gap-2 min-w-0">
            {value ? (
              <>
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{value}</span>
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{placeholder}</span>
              </>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0"   align="start">
        <Command>
          <CommandInput 
            placeholder="Search cities..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
            onKeyDown={handleKeyDown}
          />
          <CommandList>
            <CommandEmpty>
              <div className="p-4 text-center">
                {searchQuery ? (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      No city found matching "{searchQuery}"
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCustomCity}
                      className="text-xs"
                    >
                      Add "{searchQuery}" as custom city
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {countryName ? `No cities found for ${countryName}` : 'No cities found'}
                  </p>
                )}
              </div>
            </CommandEmpty>
            <CommandGroup>
              {filteredCities.map((city, index) => {
                const cityCountry = getCountryByCode(city.country);
                return (
                  <CommandItem
                    key={`${city.name}-${city.country}-${index}`}
                    value={`${city.name} ${cityCountry?.name || ''}`}
                    onSelect={() => handleCitySelect(city)}
                    className="flex items-center gap-3"
                  >
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="truncate">{city.name}</span>
                        {!countryName && cityCountry && (
                          <span className="text-xs text-muted-foreground ml-2 flex items-center gap-1">
                            <span>{cityCountry.flag}</span>
                            <span>{cityCountry.name}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedCity?.name === city.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}