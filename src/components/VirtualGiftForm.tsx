import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, Save, Upload, Eye, AlertCircle, Loader2, Gift, Image as ImageIcon } from 'lucide-react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { FormField } from './common/FormField';
import { useSettings } from './SettingsContext';
import { VirtualGift } from './VirtualGiftsManager';

interface VirtualGiftFormProps {
  mode: 'create' | 'edit';
  giftId?: string;
}

interface VirtualGiftFormData {
  name: string;
  description: string;
  category: 'flowers' | 'chocolates' | 'jewelry' | 'romantic' | 'special' | 'seasonal';
  price: number;
  imageUrl: string;
  gifUrl: string;
  status: 'active' | 'inactive';
}

// Mock API function - in real app, this would be actual API calls
const mockVirtualGiftAPI = {
  getVirtualGift: async (id: string): Promise<VirtualGift> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Mock data for editing
    return {
      id,
      name: 'Red Rose Bouquet',
      description: 'Beautiful red roses to show your affection',
      category: 'flowers',
      price: 50,
      imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400',
      gifUrl: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif',
      status: 'active',
      popularity: 95,
      totalSent: 1250,
      createdAt: '2024-01-15T10:00:00Z'
    };
  },

  createVirtualGift: async (data: VirtualGiftFormData): Promise<VirtualGift> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: `gift-${Date.now()}`,
      ...data,
      popularity: 0,
      totalSent: 0,
      createdAt: new Date().toISOString()
    };
  },

  updateVirtualGift: async (id: string, data: VirtualGiftFormData): Promise<VirtualGift> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      id,
      ...data,
      popularity: 95,
      totalSent: 1250,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: new Date().toISOString()
    };
  }
};

export function VirtualGiftForm({ mode, giftId }: VirtualGiftFormProps) {
  const navigate = useNavigate();
  const { formatCurrency } = useSettings();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  const [formData, setFormData] = useState<VirtualGiftFormData>({
    name: '',
    description: '',
    category: 'flowers',
    price: 0,
    imageUrl: '',
    gifUrl: '',
    status: 'active'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof VirtualGiftFormData, string>>>({});

  // Load existing gift data for edit mode
  useEffect(() => {
    if (mode === 'edit' && giftId) {
      loadGiftData();
    }
  }, [mode, giftId]);

  const loadGiftData = async () => {
    if (!giftId) return;
    
    try {
      setLoading(true);
      const gift = await mockVirtualGiftAPI.getVirtualGift(giftId);
      setFormData({
        name: gift.name,
        description: gift.description,
        category: gift.category,
        price: gift.price,
        imageUrl: gift.imageUrl,
        gifUrl: gift.gifUrl,
        status: gift.status
      });
    } catch (error) {
      toast.error('Failed to load virtual gift data');
      console.error('Error loading gift:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof VirtualGiftFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Gift name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Gift name must be at least 2 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    } else if (formData.price > 10000) {
      newErrors.price = 'Price cannot exceed $10,000';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    } else if (!isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid image URL';
    }

    if (!formData.gifUrl.trim()) {
      newErrors.gifUrl = 'GIF URL is required';
    } else if (!isValidUrl(formData.gifUrl)) {
      newErrors.gifUrl = 'Please enter a valid GIF URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (field: keyof VirtualGiftFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    setSubmitLoading(true);

    try {
      if (mode === 'create') {
        await mockVirtualGiftAPI.createVirtualGift(formData);
        toast.success('Virtual gift created successfully!');
        navigate('/virtual-gifts');
      } else if (mode === 'edit' && giftId) {
        await mockVirtualGiftAPI.updateVirtualGift(giftId, formData);
        toast.success('Virtual gift updated successfully!');
        navigate('/virtual-gifts');
      }
    } catch (error) {
      setError('Failed to save virtual gift. Please try again.');
      toast.error('Failed to save virtual gift');
      console.error('Error saving gift:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/virtual-gifts');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'flowers': return '🌹';
      case 'chocolates': return '🍫';
      case 'jewelry': return '💎';
      case 'romantic': return '💕';
      case 'special': return '🎁';
      case 'seasonal': return '🎄';
      default: return '🎁';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'flowers': return 'text-pink-600 bg-pink-100 dark:bg-pink-900/20';
      case 'chocolates': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/20';
      case 'jewelry': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'romantic': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'special': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'seasonal': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={()=>navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold">Loading...</h2>
            <p className="text-muted-foreground">Please wait while we load the gift data</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={()=>navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold">
            {mode === 'create' ? 'Create Virtual Gift' : 'Edit Virtual Gift'}
          </h2>
          <p className="text-muted-foreground">
            {mode === 'create' 
              ? 'Create a new virtual gift that users can send as secret crush presents'
              : 'Update the virtual gift details and settings'
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className="hidden sm:flex"
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Gift Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Gift Name"
                    error={errors.name}
                    required
                    className="md:col-span-2"
                  >
                    <Input
                      placeholder="e.g., Red Rose Bouquet"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={submitLoading}
                    />
                  </FormField>

                  <FormField
                    label="Category"
                    error={errors.category}
                    required
                  >
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange('category', value)}
                      disabled={submitLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flowers">🌹 Flowers</SelectItem>
                        <SelectItem value="chocolates">🍫 Chocolates</SelectItem>
                        <SelectItem value="jewelry">💎 Jewelry</SelectItem>
                        <SelectItem value="romantic">💕 Romantic</SelectItem>
                        <SelectItem value="special">🎁 Special</SelectItem>
                        <SelectItem value="seasonal">🎄 Seasonal</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField
                    label="Price"
                    error={errors.price}
                    required
                  >
                    <Input
                      type="number"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      value={formData.price || ''}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                      disabled={submitLoading}
                    />
                  </FormField>
                </div>

                <FormField
                  label="Description"
                  error={errors.description}
                  required
                >
                  <Textarea
                    placeholder="Describe what makes this gift special..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    disabled={submitLoading}
                    rows={3}
                  />
                </FormField>

                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    label="Image URL"
                    error={errors.imageUrl}
                    required
                    description="URL for the static preview image"
                  >
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={formData.imageUrl}
                      onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                      disabled={submitLoading}
                    />
                  </FormField>

                  <FormField
                    label="GIF URL"
                    error={errors.gifUrl}
                    required
                    description="URL for the animated GIF that will be sent"
                  >
                    <Input
                      placeholder="https://media.giphy.com/media/example/giphy.gif"
                      value={formData.gifUrl}
                      onChange={(e) => handleInputChange('gifUrl', e.target.value)}
                      disabled={submitLoading}
                    />
                  </FormField>
                </div>

                <FormField
                  label="Status"
                  required
                >
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                    disabled={submitLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <div className="flex gap-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={submitLoading}
                    className="flex-1 sm:flex-none"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitLoading}
                    className="flex-1 sm:flex-none"
                  >
                    {submitLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {mode === 'create' ? 'Creating...' : 'Updating...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {mode === 'create' ? 'Create Gift' : 'Update Gift'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Gift Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Static Image Preview */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Static Image</Label>
                <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-muted/50">
                  {formData.imageUrl ? (
                    <img
                      src={formData.imageUrl}
                      alt="Gift preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Image preview</p>
                    </div>
                  )}
                  <div className="hidden text-center text-muted-foreground p-4">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Invalid image URL</p>
                  </div>
                </div>
              </div>

              {/* GIF Preview */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Animated GIF</Label>
                <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-muted/50">
                  {formData.gifUrl ? (
                    <img
                      src={formData.gifUrl}
                      alt="GIF preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Gift className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">GIF preview</p>
                    </div>
                  )}
                  <div className="hidden text-center text-muted-foreground p-4">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Invalid GIF URL</p>
                  </div>
                </div>
              </div>

              {/* Gift Details */}
              <div className="space-y-3 pt-2 border-t">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm text-muted-foreground">
                    {formData.name || 'Gift name'}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(formData.category)}`}>
                    <span>{getCategoryIcon(formData.category)}</span>
                    <span className="capitalize">{formData.category}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Price</Label>
                  <p className="text-lg font-semibold">
                    {formatCurrency(formData.price)}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground">
                    {formData.description || 'Gift description'}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    formData.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                  }`}>
                    {formData.status === 'active' ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}