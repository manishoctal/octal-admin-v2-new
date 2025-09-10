import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { PhoneInput } from './PhoneInput';
import { CountrySelect } from './CountrySelect';
import { CitySelect } from './CitySelect';
import { cn } from '../ui/utils';

interface BaseFieldProps {
  label: string;
  name?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
  hint?: string;
}

interface InputFieldProps extends BaseFieldProps {
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
}

interface TextareaFieldProps extends BaseFieldProps {
  type: 'textarea';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}

interface SelectFieldProps extends BaseFieldProps {
  type: 'select';
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

interface PhoneFieldProps extends BaseFieldProps {
  type: 'phone';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface CountryFieldProps extends BaseFieldProps {
  type: 'country';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface CityFieldProps extends BaseFieldProps {
  type: 'city';
  value: string;
  onChange: (value: string) => void;
  countryName?: string;
  placeholder?: string;
}

type FormFieldProps = InputFieldProps | TextareaFieldProps | SelectFieldProps | PhoneFieldProps | CountryFieldProps | CityFieldProps;

export function FormField(props: FormFieldProps) {
  const { label, name, error, required, disabled, className, description, hint } = props;

  const renderField = () => {
    switch (props.type) {
      case 'textarea':
        return (
          <Textarea
            id={name}
            name={name}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            rows={props.rows || 3}
            maxLength={props.maxLength}
            disabled={disabled}
            className={cn(error && 'border-destructive focus:border-destructive focus:ring-destructive')}
          />
        );
      
      case 'select':
        return (
          <Select value={props.value} onValueChange={props.onChange} disabled={disabled}>
            <SelectTrigger className={cn(error && 'border-destructive focus:border-destructive focus:ring-destructive')}>
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {props.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'phone':
        return (
          <PhoneInput
            value={props.value}
            onChange={props.onChange}
            placeholder={props.placeholder}
            disabled={disabled}
            error={error}
          />
        );

      case 'country':
        return (
          <CountrySelect
            value={props.value}
            onChange={props.onChange}
            placeholder={props.placeholder}
            disabled={disabled}
            error={error}
          />
        );

      case 'city':
        return (
          <CitySelect
            value={props.value}
            onChange={props.onChange}
            countryName={props.countryName}
            placeholder={props.placeholder}
            disabled={disabled}
            error={error}
          />
        );
      
      default:
        return (
          <Input
            id={name}
            name={name}
            type={props.type}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            maxLength={props.maxLength}
            minLength={props.minLength}
            pattern={props.pattern}
            disabled={disabled}
            className={cn(error && 'border-destructive focus:border-destructive focus:ring-destructive')}
          />
        );
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={name} className="flex items-center">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {(description || hint) && (
        <p className="text-sm text-muted-foreground">{description || hint}</p>
      )}
      {renderField()}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}