export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  custom?: (value: string) => string | undefined;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

export function validateField(value: string, rules: ValidationRule): string | undefined {
  if (rules.required && !value.trim()) {
    return 'This field is required';
  }

  if (value.trim() && rules.minLength && value.length < rules.minLength) {
    return `Must be at least ${rules.minLength} characters`;
  }

  if (value.trim() && rules.maxLength && value.length > rules.maxLength) {
    return `Must be no more than ${rules.maxLength} characters`;
  }

  if (value.trim() && rules.email && !isValidEmail(value)) {
    return 'Please enter a valid email address';
  }

  if (value.trim() && rules.pattern && !rules.pattern.test(value)) {
    return 'Please enter a valid value';
  }

  if (value.trim() && rules.custom) {
    const customError = rules.custom(value);
    if (customError) return customError;
  }

  return undefined;
}

export function validateForm(formData: Record<string, string>, rules: ValidationRules): ValidationErrors {
  const errors: ValidationErrors = {};

  Object.keys(rules).forEach((field) => {
    const value = formData[field] || '';
    const error = validateField(value, rules[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

// Individual validation functions for direct use
export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

export function validateNumber(value: string): boolean {
  const num = Number(value);
  return !isNaN(num) && isFinite(num);
}