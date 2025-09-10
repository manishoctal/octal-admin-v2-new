


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { FormField } from './common/FormField';
import { validateForm, ValidationRules, hasValidationErrors } from './common/validation';
import { ArrowLeft, Save, X } from 'lucide-react';
import { toast } from "sonner";
import { useRouter } from './Router';
import { useTranslation } from './TranslationContext';
import { useLocation, useNavigate } from 'react-router-dom';
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastActive: string;
  orders: number;
  totalSpent: number;
  avatar?: string;
}

interface UserFormProps {
  user?: User;
  mode: 'create' | 'edit';
}

const validationRules: ValidationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    required: true,
    email: true,
    maxLength: 100,
  },
  phone: {
    required: true,
    custom: (value: string) => {
      // Phone validation for international format with country code
      if (!value.startsWith('+')) {
        return 'Phone number must include country code (e.g., +1 555-123-4567)';
      }
      // Remove formatting and check if it has at least 10 digits
      const digitsOnly = value.replace(/[^\d]/g, '');
      if (digitsOnly.length < 10) {
        return 'Phone number must have at least 10 digits';
      }
      if (digitsOnly.length > 15) {
        return 'Phone number cannot exceed 15 digits';
      }
      return undefined;
    },
  },
  address: {
    required: true,
    minLength: 10,
    maxLength: 200,
  },
  city: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  country: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  status: {
    required: true,
  },
};

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

export function UserForm({ user, mode }: UserFormProps) {
  const navigate = useNavigate();
  const params=useLocation()
  console.log('params',params)
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || '',
    status: user?.status || 'active',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        country: user.country,
        status: user.status,
      });
    } else if (mode === 'edit' && params.userId) {
      // In a real app, fetch user data here
      // For now, we'll use mock data
      const mockUser = {
        name: 'User ' + params.userId.split('-')[1],
        email: `user${params.userId.split('-')[1]}@example.com`,
        phone: '+1 555-123-4567',
        address: '123 Main St',
        city: 'New York',
        country: 'United States',
        status: 'active' as const,
      };
      setFormData(mockUser);
    }
  }, [user, mode, params.userId]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm(formData, validationRules);
    setErrors(validationErrors);
    
    if (hasValidationErrors(validationErrors)) {
      toast.error('Please fix the errors below');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (mode === 'create') {
        toast.success('User created successfully');
      } else {
        toast.success('User updated successfully');
      }
      
      navigate('users');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold">
            {mode === 'create' ? 'Create New User' : 'Edit User'}
          </h2>
          <p className="text-muted-foreground">
            {mode === 'create' ? 'Add a new user to the system' : 'Update user information'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                type="text"
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={(value) => handleFieldChange('name', value)}
                error={errors.name}
                required
                placeholder="Enter full name"
              />
              
              <FormField
                type="email"
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={(value) => handleFieldChange('email', value)}
                error={errors.email}
                required
                placeholder="Enter email address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                type="phone"
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={(value) => handleFieldChange('phone', value)}
                error={errors.phone}
                required
                placeholder="Enter phone number"
              />
              
              <FormField
                type="select"
                label="Status"
                name="status"
                value={formData.status}
                onChange={(value) => handleFieldChange('status', value)}
                error={errors.status}
                required
                options={statusOptions}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                type="country"
                label="Country"
                name="country"
                value={formData.country}
                onChange={(value) => handleFieldChange('country', value)}
                error={errors.country}
                required
                placeholder="Select country"
              />
              
              <FormField
                type="city"
                label="City"
                name="city"
                value={formData.city}
                onChange={(value) => handleFieldChange('city', value)}
                countryName={formData.country}
                error={errors.city}
                required
                placeholder="Select or enter city"
              />
            </div>

            <FormField
              type="textarea"
              label={t('address')}
              name="address"
              value={formData.address}
              onChange={(value) => handleFieldChange('address', value)}
              error={errors.address}
              required
              placeholder="Enter full address"
              rows={3}
            />
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto"
          >
            <X className="w-4 h-4 mr-2" />
            {t('cancel')}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? t('submitting') : mode === 'create'?t('save'): t('submitting')}
          </Button>
        </div>
      </form>
    </div>
  );
}