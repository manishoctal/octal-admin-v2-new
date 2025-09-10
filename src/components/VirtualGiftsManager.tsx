import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, ArrowUpDown, Eye, MoreHorizontal, RotateCcw, Gift, Heart, Star, Sparkles, ToggleLeft, ToggleRight } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { StatisticsCards } from './common/StatisticsCards';
import { useSettings } from './SettingsContext';
import { useTranslation } from './TranslationContext';
import { usePermissions, PermissionGate, MODULES, ACTIONS } from './PermissionContext';

export interface VirtualGift {
  id: string;
  name: string;
  description: string;
  category: 'flowers' | 'chocolates' | 'jewelry' | 'romantic' | 'special' | 'seasonal';
  price: number;
  imageUrl: string;
  gifUrl: string;
  status: 'active' | 'inactive';
  popularity: number;
  totalSent: number;
  createdAt: string;
  updatedAt?: string;
}

// Mock data for virtual gifts
const MOCK_VIRTUAL_GIFTS: VirtualGift[] = [
  {
    id: 'gift-1',
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
  },
  {
    id: 'gift-2',
    name: 'Heart Chocolates',
    description: 'Sweet heart-shaped chocolates for your sweetheart',
    category: 'chocolates',
    price: 30,
    imageUrl: 'https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=400',
    gifUrl: 'https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif',
    status: 'active',
    popularity: 88,
    totalSent: 980,
    createdAt: '2024-01-10T14:30:00Z'
  },
  {
    id: 'gift-3',
    name: 'Diamond Ring',
    description: 'Sparkling diamond ring for special moments',
    category: 'jewelry',
    price: 200,
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
    gifUrl: 'https://media.giphy.com/media/3ohzdKvLT1DxFxhZaU/giphy.gif',
    status: 'active',
    popularity: 75,
    totalSent: 342,
    createdAt: '2024-01-08T09:15:00Z'
  },
  {
    id: 'gift-4',
    name: 'Romantic Candles',
    description: 'Set the mood with romantic candles',
    category: 'romantic',
    price: 25,
    imageUrl: 'https://images.unsplash.com/photo-1602911051159-655a476cc741?w=400',
    gifUrl: 'https://media.giphy.com/media/26BRz8MPcLpDfOdLW/giphy.gif',
    status: 'active',
    popularity: 82,
    totalSent: 567,
    createdAt: '2024-01-05T16:45:00Z'
  },
  {
    id: 'gift-5',
    name: 'Teddy Bear Hug',
    description: 'Cute teddy bear sending virtual hugs',
    category: 'special',
    price: 40,
    imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
    gifUrl: 'https://media.giphy.com/media/3o6Zt6KHxhL7yLrEiQ/giphy.gif',
    status: 'inactive',
    popularity: 65,
    totalSent: 289,
    createdAt: '2024-01-01T12:00:00Z'
  },
  {
    id: 'gift-6',
    name: 'Christmas Wreath',
    description: 'Festive Christmas wreath for holiday season',
    category: 'seasonal',
    price: 35,
    imageUrl: 'https://images.unsplash.com/photo-1545334646-df0bb2a027be?w=400',
    gifUrl: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif',
    status: 'active',
    popularity: 45,
    totalSent: 123,
    createdAt: '2024-12-01T08:30:00Z'
  }
];

// Mock API functions
const virtualGiftsAPI = {
  getVirtualGifts: async (): Promise<VirtualGift[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...MOCK_VIRTUAL_GIFTS];
  },

  createVirtualGift: async (giftData: Omit<VirtualGift, 'id' | 'createdAt' | 'updatedAt' | 'totalSent' | 'popularity'>): Promise<VirtualGift> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newGift: VirtualGift = {
      ...giftData,
      id: `gift-${Date.now()}`,
      createdAt: new Date().toISOString(),
      totalSent: 0,
      popularity: 0
    };
    MOCK_VIRTUAL_GIFTS.push(newGift);
    return newGift;
  },

  updateVirtualGift: async (id: string, updates: Partial<VirtualGift>): Promise<VirtualGift> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const giftIndex = MOCK_VIRTUAL_GIFTS.findIndex(gift => gift.id === id);
    if (giftIndex === -1) throw new Error('Gift not found');
    
    const updatedGift = {
      ...MOCK_VIRTUAL_GIFTS[giftIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    MOCK_VIRTUAL_GIFTS[giftIndex] = updatedGift;
    return updatedGift;
  },

  deleteVirtualGift: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const giftIndex = MOCK_VIRTUAL_GIFTS.findIndex(gift => gift.id === id);
    if (giftIndex === -1) throw new Error('Gift not found');
    MOCK_VIRTUAL_GIFTS.splice(giftIndex, 1);
  },

  getVirtualGift: async (id: string): Promise<VirtualGift> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const gift = MOCK_VIRTUAL_GIFTS.find(g => g.id === id);
    if (!gift) throw new Error('Gift not found');
    return gift;
  }
};

const VirtualGiftSkeleton = () => (
  <TableRow className="hover:bg-muted/50">
    <TableCell className="w-12">
      <div className="h-4 w-4 bg-muted rounded animate-pulse" />
    </TableCell>
    <TableCell className="w-20">
      <div className="h-12 w-12 bg-muted rounded-lg animate-pulse" />
    </TableCell>
    <TableCell>
      <div className="space-y-2">
        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        <div className="h-3 w-48 bg-muted rounded animate-pulse" />
      </div>
    </TableCell>
    <TableCell>
      <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
    </TableCell>
    <TableCell>
      <div className="h-4 w-16 bg-muted rounded animate-pulse" />
    </TableCell>
    <TableCell>
      <div className="h-4 w-12 bg-muted rounded animate-pulse" />
    </TableCell>
    <TableCell>
      <div className="h-4 w-20 bg-muted rounded animate-pulse" />
    </TableCell>
    <TableCell className="w-12">
      <div className="h-8 w-8 bg-muted rounded animate-pulse" />
    </TableCell>
  </TableRow>
);

export function VirtualGiftsManager() {
  const navigate = useNavigate();
  const { formatDate, formatCurrency } = useSettings();
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const [gifts, setGifts] = useState<VirtualGift[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof VirtualGift>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedGifts, setSelectedGifts] = useState<string[]>([]);
  const [deleteGiftId, setDeleteGiftId] = useState<string | null>(null);

  // Load gifts
  useEffect(() => {
    loadGifts();
  }, []);

  const loadGifts = async () => {
    try {
      setLoading(true);
      const data = await virtualGiftsAPI.getVirtualGifts();
      setGifts(data);
    } catch (error) {
      toast.error('Failed to load virtual gifts');
      console.error('Error loading gifts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if any filters are applied
  const hasActiveFilters = searchTerm || categoryFilter !== 'all' || statusFilter !== 'all';

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalGifts = gifts.length;
    const activeGifts = gifts.filter(gift => gift.status === 'active').length;
    const inactiveGifts = gifts.filter(gift => gift.status === 'inactive').length;
    const totalRevenue = gifts.reduce((sum, gift) => sum + (gift.price * gift.totalSent), 0);

    return {
      totalGifts,
      activeGifts,
      inactiveGifts,
      totalRevenue: totalRevenue
    };
  }, [gifts]);

  // Filtered and sorted gifts
  const filteredGifts = useMemo(() => {
    let filtered = gifts.filter(gift => {
      const matchesSearch = gift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           gift.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || gift.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || gift.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * multiplier;
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * multiplier;
      }
      return 0;
    });

    return filtered;
  }, [gifts, searchTerm, categoryFilter, statusFilter, sortField, sortDirection]);

  // Paginated gifts
  const paginatedGifts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredGifts.slice(startIndex, startIndex + pageSize);
  }, [filteredGifts, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredGifts.length / pageSize);

  const handleSort = (field: keyof VirtualGift) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedGifts(paginatedGifts.map(gift => gift.id));
    } else {
      setSelectedGifts([]);
    }
  };

  const handleSelectGift = (giftId: string, checked: boolean) => {
    if (checked) {
      setSelectedGifts([...selectedGifts, giftId]);
    } else {
      setSelectedGifts(selectedGifts.filter(id => id !== giftId));
    }
  };

  const handleDeleteGift = async (giftId: string) => {
    try {
      await virtualGiftsAPI.deleteVirtualGift(giftId);
      setGifts(gifts.filter(gift => gift.id !== giftId));
      setDeleteGiftId(null);
      toast.success('Virtual gift deleted successfully');
    } catch (error) {
      toast.error('Failed to delete virtual gift');
      console.error('Error deleting gift:', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedGifts.map(id => virtualGiftsAPI.deleteVirtualGift(id)));
      setGifts(gifts.filter(gift => !selectedGifts.includes(gift.id)));
      setSelectedGifts([]);
      toast.success(`${selectedGifts.length} virtual gifts deleted successfully`);
    } catch (error) {
      toast.error('Failed to delete virtual gifts');
      console.error('Error deleting gifts:', error);
    }
  };

  const handleToggleStatus = async (gift: VirtualGift) => {
    try {
      const newStatus = gift.status === 'active' ? 'inactive' : 'active';
      const updatedGift = await virtualGiftsAPI.updateVirtualGift(gift.id, { status: newStatus });
      
      setGifts(gifts.map(g => g.id === gift.id ? updatedGift : g));
      toast.success(`Virtual gift ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error('Failed to update gift status');
      console.error('Error updating gift status:', error);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
    toast.success('Filters reset');
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

  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
  };

  // Navigation functions
  const handleViewGift = (giftId: string) => {
    navigate(`/virtual-gifts/${giftId}/view`);
  };

  const handleEditGift = (giftId: string) => {
    navigate(`/virtual-gifts/${giftId}/edit`);
  };

  const handleCreateGift = () => {
    navigate('/virtual-gifts/create');
  };

  const SortButton = ({ field, children }: { field: keyof VirtualGift; children: React.ReactNode }) => (
    <button
      className="flex items-center gap-1 hover:text-foreground transition-colors"
      onClick={() => handleSort(field)}
    >
      <span className={sortField === field ? 'font-semibold' : 'font-medium'}>{children}</span>
      <ArrowUpDown className="h-3 w-3 opacity-50" />
    </button>
  );

  // Check permissions
  const canCreate = hasPermission(MODULES.VIRTUAL_GIFTS, ACTIONS.CREATE);
  const canEdit = hasPermission(MODULES.VIRTUAL_GIFTS, ACTIONS.EDIT);
  const canDelete = hasPermission(MODULES.VIRTUAL_GIFTS, ACTIONS.DELETE);
  const canView = hasPermission(MODULES.VIRTUAL_GIFTS, ACTIONS.VIEW);

  if (!canView) {
    return (
      <div className="p-4 lg:p-6 flex flex-col items-center justify-center min-h-[400px]">
        <Gift className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground text-center">
          You don't have permission to access virtual gifts management.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Virtual Gifts Management</h2>
          <p className="text-muted-foreground">Manage virtual gifts that users can send as secret crush presents</p>
        </div>
        <PermissionGate module={MODULES.VIRTUAL_GIFTS} action={ACTIONS.CREATE}>
          <Button onClick={handleCreateGift} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Virtual Gift
          </Button>
        </PermissionGate>
      </div>

      {/* Statistics Cards */}
      <StatisticsCards data={statistics} loading={loading} />

      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search gifts by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-40 h-10">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="flowers">Flowers</SelectItem>
                    <SelectItem value="chocolates">Chocolates</SelectItem>
                    <SelectItem value="jewelry">Jewelry</SelectItem>
                    <SelectItem value="romantic">Romantic</SelectItem>
                    <SelectItem value="special">Special</SelectItem>
                    <SelectItem value="seasonal">Seasonal</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40 h-10">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button variant="outline" onClick={handleResetFilters} className="w-full sm:w-auto h-10">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                )}

                <PermissionGate module={MODULES.VIRTUAL_GIFTS} action={ACTIONS.DELETE}>
                  {selectedGifts.length > 0 && (
                    <Button variant="destructive" onClick={handleBulkDelete} className="w-full sm:w-auto h-10">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete ({selectedGifts.length})
                    </Button>
                  )}
                </PermissionGate>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="border-t">
            <Table>
              <TableHeader>
                <TableRow className="border-b bg-muted/30">
                  <TableHead className="w-12 h-12">
                    <Checkbox
                      checked={selectedGifts.length === paginatedGifts.length && paginatedGifts.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-20 h-12">Image</TableHead>
                  <TableHead className="min-w-[200px] h-12">
                    <SortButton field="name">Gift</SortButton>
                  </TableHead>
                  <TableHead className="min-w-[120px] h-12">
                    <SortButton field="category">Category</SortButton>
                  </TableHead>
                  <TableHead className="min-w-[100px] h-12">
                    <SortButton field="price">Price</SortButton>
                  </TableHead>
                  <TableHead className="min-w-[80px] h-12">
                    <SortButton field="totalSent">Sent</SortButton>
                  </TableHead>
                  <TableHead className="min-w-[100px] h-12">
                    <SortButton field="status">Status</SortButton>
                  </TableHead>
                  <TableHead className="w-12 h-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: pageSize }).map((_, i) => (
                    <VirtualGiftSkeleton key={i} />
                  ))
                ) : (
                  paginatedGifts.map((gift) => (
                    <TableRow 
                      key={gift.id} 
                      className="group hover:bg-muted/50 transition-colors duration-150"
                    >
                      <TableCell className="py-4">
                        <Checkbox
                          checked={selectedGifts.includes(gift.id)}
                          onCheckedChange={(checked) => handleSelectGift(gift.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted shadow-sm ring-1 ring-black/5">
                          <img
                            src={gift.imageUrl}
                            alt={gift.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/48x48?text=Gift';
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <div className="font-medium text-sm leading-none">{gift.name}</div>
                          <div className="text-xs text-muted-foreground line-clamp-2">{gift.description}</div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className={`font-medium ${getCategoryColor(gift.category)}`}>
                          {formatCategory(gift.category)}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="font-medium">
                          {formatCurrency(gift.price)}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="font-medium">
                          {gift.totalSent.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant={getStatusColor(gift.status)} className="font-medium">
                          {gift.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 opacity-60 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleViewGift(gift.id)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <PermissionGate module={MODULES.VIRTUAL_GIFTS} action={ACTIONS.EDIT}>
                              <DropdownMenuItem onClick={() => handleEditGift(gift.id)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Gift
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleStatus(gift)}>
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
                              </DropdownMenuItem>
                            </PermissionGate>
                            <DropdownMenuSeparator />
                            <PermissionGate module={MODULES.VIRTUAL_GIFTS} action={ACTIONS.DELETE}>
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => setDeleteGiftId(gift.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Gift
                              </DropdownMenuItem>
                            </PermissionGate>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Enhanced Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t bg-muted/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredGifts.length)} of {filteredGifts.length} gifts
              </span>
              <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-8"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-8"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteGiftId} onOpenChange={() => setDeleteGiftId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the virtual gift and it will no longer be available for users to send.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteGiftId && handleDeleteGift(deleteGiftId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}