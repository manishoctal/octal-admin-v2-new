import{ useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ArrowLeft, Edit, Trash2, Calendar, TrendingUp, Users, DollarSign, Heart, Star, ToggleLeft, ToggleRight, ExternalLink, Copy, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { VirtualGift } from './VirtualGiftsManager';
import { useSettings } from './SettingsContext';
import { usePermissions, PermissionGate, MODULES, ACTIONS } from './PermissionContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

interface VirtualGiftDetailsProps {
  giftId: string;
}

// Mock API function
const mockVirtualGiftAPI = {
  getVirtualGift: async (id: string): Promise<VirtualGift> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock different gifts based on ID
    const mockGifts: Record<string, VirtualGift> = {
      'gift-1': {
        id: 'gift-1',
        name: 'Red Rose Bouquet',
        description: 'Beautiful red roses to show your affection. These stunning roses are perfect for expressing deep love and romantic feelings. Hand-picked and arranged with care.',
        category: 'flowers',
        price: 50,
        imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400',
        gifUrl: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif',
        status: 'active',
        popularity: 95,
        totalSent: 1250,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z'
      },
      'gift-2': {
        id: 'gift-2',
        name: 'Heart Chocolates',
        description: 'Sweet heart-shaped chocolates for your sweetheart. Made with premium Belgian chocolate and crafted in romantic heart shapes.',
        category: 'chocolates',
        price: 30,
        imageUrl: 'https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=400',
        gifUrl: 'https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif',
        status: 'active',
        popularity: 88,
        totalSent: 980,
        createdAt: '2024-01-10T14:30:00Z'
      }
    };

    const gift = mockGifts[id] || mockGifts['gift-1'];
    return { ...gift, id }; // Ensure the ID matches the requested one
  },

  updateVirtualGift: async (id: string, updates: Partial<VirtualGift>): Promise<VirtualGift> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // In real app, this would update the gift
    const currentGift = await mockVirtualGiftAPI.getVirtualGift(id);
    return { ...currentGift, ...updates, updatedAt: new Date().toISOString() };
  },

  deleteVirtualGift: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    // In real app, this would delete the gift
  }
};

export function VirtualGiftDetails({ giftId }: VirtualGiftDetailsProps) {
  const navigate = useNavigate();
  const { formatDate, formatCurrency } = useSettings();
  const { hasPermission } = usePermissions();
  const [gift, setGift] = useState<VirtualGift | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    loadGiftDetails();
  }, [giftId]);

  const loadGiftDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const giftData = await mockVirtualGiftAPI.getVirtualGift(giftId);
      setGift(giftData);
    } catch (error) {
      setError('Failed to load virtual gift details');
      toast.error('Failed to load virtual gift details');
      console.error('Error loading gift:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!gift) return;

    setActionLoading(true);
    try {
      const newStatus = gift.status === 'active' ? 'inactive' : 'active';
      const updatedGift = await mockVirtualGiftAPI.updateVirtualGift(gift.id, { status: newStatus });
      setGift(updatedGift);
      toast.success(`Virtual gift ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error('Failed to update gift status');
      console.error('Error updating status:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!gift) return;

    setActionLoading(true);
    try {
      await mockVirtualGiftAPI.deleteVirtualGift(gift.id);
      toast.success('Virtual gift deleted successfully');
      navigate('/virtual-gifts');
    } catch (error) {
      toast.error('Failed to delete virtual gift');
      console.error('Error deleting gift:', error);
      setActionLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/virtual-gifts/${giftId}/edit`);
  };

  const handleCopyUrl = (url: string, type: string) => {
    navigator.clipboard.writeText(url);
    toast.success(`${type} URL copied to clipboard`);
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
      case 'flowers': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      case 'chocolates': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'jewelry': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'romantic': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'special': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'seasonal': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'default' : 'secondary';
  };

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 90) return 'text-green-600';
    if (popularity >= 70) return 'text-blue-600';
    if (popularity >= 50) return 'text-yellow-600';
    return 'text-red-600';
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
            <p className="text-muted-foreground">Loading virtual gift details</p>
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

  if (error || !gift) {
    return (
      <div className="p-4 lg:p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={()=>navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold">Error</h2>
            <p className="text-muted-foreground">Failed to load virtual gift</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Gift Not Found</h3>
              <p className="text-muted-foreground mb-4">
                {error || 'The virtual gift you\'re looking for doesn\'t exist or has been deleted.'}
              </p>
              <Button onClick={() => navigate('/virtual-gifts')}>
                Back to Virtual Gifts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canEdit = hasPermission(MODULES.VIRTUAL_GIFTS, ACTIONS.EDIT);
  const canDelete = hasPermission(MODULES.VIRTUAL_GIFTS, ACTIONS.DELETE);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={()=>navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <span>{getCategoryIcon(gift.category)}</span>
              {gift.name}
            </h2>
            <p className="text-muted-foreground">Virtual gift details and analytics</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <PermissionGate module={MODULES.VIRTUAL_GIFTS} action={ACTIONS.EDIT}>
            <Button variant="outline" onClick={handleToggleStatus} disabled={actionLoading}>
              {gift.status === 'active' ? (
                <>
                  <ToggleLeft className="w-4 h-4 mr-2" />
                  Deactivate
                </>
              ) : (
                <>
                  <ToggleRight className="w-4 h-4 mr-2" />
                  Activate
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </PermissionGate>
          
          <PermissionGate module={MODULES.VIRTUAL_GIFTS} action={ACTIONS.DELETE}>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              disabled={actionLoading}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </PermissionGate>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Media Preview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Media Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Static Image */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Static Image</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyUrl(gift.imageUrl, 'Image')}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                  <img
                    src={gift.imageUrl}
                    alt={gift.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                    }}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.open(gift.imageUrl, '_blank')}
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  View Full Size
                </Button>
              </div>

              <Separator />

              {/* Animated GIF */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Animated GIF</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyUrl(gift.gifUrl, 'GIF')}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                  <img
                    src={gift.gifUrl}
                    alt={`${gift.name} GIF`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/300x300?text=GIF+Not+Found';
                    }}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.open(gift.gifUrl, '_blank')}
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  View Original GIF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gift Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Gift Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Name</span>
                    <p className="text-lg font-semibold">{gift.name}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Category</span>
                    <div className="mt-1">
                      <Badge className={`font-medium ${getCategoryColor(gift.category)}`}>
                        <span className="mr-1">{getCategoryIcon(gift.category)}</span>
                        {gift.category.charAt(0).toUpperCase() + gift.category.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Price</span>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(gift.price)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Status</span>
                    <div className="mt-1">
                      <Badge variant={getStatusColor(gift.status)} className="font-medium">
                        {gift.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Popularity Score</span>
                    <div className="flex items-center gap-2 mt-1">
                      <p className={`text-lg font-semibold ${getPopularityColor(gift.popularity)}`}>
                        {gift.popularity}%
                      </p>
                      {gift.popularity >= 80 && <Heart className="w-4 h-4 text-red-500" />}
                      {gift.popularity >= 90 && <Star className="w-4 h-4 text-yellow-500" />}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Total Sent</span>
                    <p className="text-lg font-semibold">{gift.totalSent.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <span className="text-sm font-medium text-muted-foreground">Description</span>
                <p className="mt-2 text-foreground leading-relaxed">{gift.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Analytics & Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Analytics & Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">{gift.totalSent.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Times Sent</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold">{formatCurrency(gift.price * gift.totalSent)}</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <Heart className={`w-8 h-8 mx-auto mb-2 ${getPopularityColor(gift.popularity)}`} />
                  <p className="text-2xl font-bold">{gift.popularity}%</p>
                  <p className="text-sm text-muted-foreground">Popularity</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-muted-foreground">Created</span>
                <span className="text-sm">{formatDate(gift.createdAt)}</span>
              </div>
              
              {gift.updatedAt && (
                <div className="flex justify-between items-center py-2 border-t">
                  <span className="text-sm font-medium text-muted-foreground">Last Updated</span>
                  <span className="text-sm">{formatDate(gift.updatedAt)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Virtual Gift</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{gift.name}"? This action cannot be undone. 
              The gift will be permanently removed and users will no longer be able to send it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={actionLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Gift'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}