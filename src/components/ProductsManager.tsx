import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, ArrowUpDown, Eye, MoreHorizontal, RotateCcw, Package, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { toast } from "sonner";
import { useRouter } from './Router';
import { StatisticsCards } from './common/StatisticsCards';
import { DateRangePicker } from './common/DateRangePicker';
import { useSettings } from './SettingsContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  sku: string;
  stock: number;
  status: 'active' | 'inactive' | 'draft' | 'out_of_stock';
  images: string[];
  tags: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  totalSales: number;
  revenue: number;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

// Mock data
const generateMockProducts = (): Product[] => {
  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Food', 'Automotive', 'Health'];
  const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG', 'HP', 'Dell', 'Canon', 'Bosch'];
  const statuses: Product['status'][] = ['active', 'inactive', 'draft', 'out_of_stock'];
  
  const productNames = [
    'Wireless Bluetooth Headphones', 'Smartphone Case', 'Running Shoes', 'Coffee Maker',
    'Gaming Laptop', 'Fitness Tracker', 'Air Fryer', 'Backpack', 'Tablet Stand',
    'Electric Toothbrush', 'Yoga Mat', 'Desk Lamp', 'Water Bottle', 'Phone Charger',
    'Bluetooth Speaker', 'Kitchen Scale', 'Monitor', 'Keyboard', 'Mouse Pad', 'Power Bank'
  ];
  
  return Array.from({ length: 75 }, (_, i) => {
    const basePrice = Math.floor(Math.random() * 500) + 20;
    const stock = Math.floor(Math.random() * 200);
    const sales = Math.floor(Math.random() * 1000);
    
    return {
      id: `product-${i + 1}`,
      name: productNames[i % productNames.length] + ` ${Math.floor(i / productNames.length) + 1}`,
      description: `High-quality ${productNames[i % productNames.length].toLowerCase()} with premium features and excellent performance.`,
      price: basePrice,
      originalPrice: Math.random() > 0.7 ? Math.floor(basePrice * 1.2) : undefined,
      category: categories[Math.floor(Math.random() * categories.length)],
      brand: brands[Math.floor(Math.random() * brands.length)],
      sku: `SKU-${String(i + 1).padStart(4, '0')}`,
      stock: stock,
      status: stock === 0 ? 'out_of_stock' : statuses[Math.floor(Math.random() * (statuses.length - 1))],
      images: [`https://images.unsplash.com/photo-${1500000000000 + i}?w=400&h=400&fit=crop`],
      tags: ['featured', 'bestseller', 'new'].slice(0, Math.floor(Math.random() * 3) + 1),
      weight: Math.random() > 0.5 ? Math.floor(Math.random() * 5000) + 100 : undefined,
      dimensions: Math.random() > 0.5 ? {
        length: Math.floor(Math.random() * 50) + 10,
        width: Math.floor(Math.random() * 30) + 5,
        height: Math.floor(Math.random() * 20) + 2,
      } : undefined,
      rating: Number((Math.random() * 2 + 3).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 500),
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalSales: sales,
      revenue: sales * basePrice,
    };
  });
};

const ProductSkeleton = () => (
  <TableRow>
    <TableCell><div className="h-4 w-4 bg-muted rounded animate-pulse" /></TableCell>
    <TableCell><div className="h-12 w-12 bg-muted rounded animate-pulse" /></TableCell>
    <TableCell><div className="h-4 w-32 bg-muted rounded animate-pulse" /></TableCell>
    <TableCell><div className="h-4 w-20 bg-muted rounded animate-pulse" /></TableCell>
    <TableCell><div className="h-4 w-24 bg-muted rounded animate-pulse" /></TableCell>
    <TableCell><div className="h-4 w-16 bg-muted rounded animate-pulse" /></TableCell>
    <TableCell><div className="h-6 w-16 bg-muted rounded animate-pulse" /></TableCell>
    <TableCell><div className="h-4 w-12 bg-muted rounded animate-pulse" /></TableCell>
    <TableCell><div className="h-4 w-16 bg-muted rounded animate-pulse" /></TableCell>
    <TableCell><div className="h-4 w-20 bg-muted rounded animate-pulse" /></TableCell>
    <TableCell><div className="h-8 w-8 bg-muted rounded animate-pulse" /></TableCell>
  </TableRow>
);

export function ProductsManager() {
  const { navigate } = useRouter();
  const { formatDate, formatCurrency } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<{min: string; max: string}>({min: '', max: ''});
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  // Simulate data loading
  React.useEffect(() => {
    setTimeout(() => {
      setProducts(generateMockProducts());
      setLoading(false);
    }, 1500);
  }, []);

  // Check if any filters are applied
  const hasActiveFilters = searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || 
                          priceRange.min || priceRange.max || dateRange.from || dateRange.to;

  // Get unique categories for filter
  const categories = useMemo(() => {
    return Array.from(new Set(products.map(product => product.category))).sort();
  }, [products]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalProducts = products.length;
    const activeProducts = products.filter(product => product.status === 'active').length;
    const outOfStockProducts = products.filter(product => product.status === 'out_of_stock').length;
    const totalInventoryValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
    const lowStockProducts = products.filter(product => product.stock <= 10 && product.stock > 0).length;

    return {
      totalProducts,
      activeProducts,
      outOfStockProducts: outOfStockProducts + lowStockProducts,
      totalInventoryValue,
    };
  }, [products]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      
      let matchesPriceRange = true;
      if (priceRange.min && product.price < Number(priceRange.min)) matchesPriceRange = false;
      if (priceRange.max && product.price > Number(priceRange.max)) matchesPriceRange = false;
      
      let matchesDateRange = true;
      if (dateRange.from || dateRange.to) {
        const productDate = new Date(product.createdAt);
        if (dateRange.from && productDate < dateRange.from) matchesDateRange = false;
        if (dateRange.to && productDate > dateRange.to) matchesDateRange = false;
      }
      
      return matchesSearch && matchesCategory && matchesStatus && matchesPriceRange && matchesDateRange;
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
  }, [products, searchTerm, categoryFilter, statusFilter, priceRange, dateRange, sortField, sortDirection]);

  // Paginated products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  const handleSort = (field: keyof Product) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(paginatedProducts.map(product => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(product => product.id !== productId));
    setDeleteProductId(null);
    toast.success('Product deleted successfully');
  };

  const handleBulkDelete = () => {
    setProducts(products.filter(product => !selectedProducts.includes(product.id)));
    setSelectedProducts([]);
    toast.success(`${selectedProducts.length} products deleted successfully`);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setPriceRange({min: '', max: ''});
    setDateRange({ from: undefined, to: undefined });
    setCurrentPage(1);
    toast.success('Filters reset');
  };

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'draft': return 'outline';
      case 'out_of_stock': return 'destructive';
      default: return 'outline';
    }
  };

  const formatStatus = (status: Product['status']) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'destructive' as const };
    if (stock <= 10) return { label: 'Low Stock', color: 'secondary' as const };
    return { label: 'In Stock', color: 'default' as const };
  };

  const handleViewProduct = (productId: string) => {
    navigate('products/view', { productId });
  };

  const handleEditProduct = (productId: string) => {
    navigate('products/edit', { productId });
  };

  const handleCreateProduct = () => {
    navigate('products/create');
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Products Management</h2>
          <p className="text-muted-foreground">Manage your product catalog and inventory</p>
        </div>
        <Button onClick={handleCreateProduct} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <div className="text-2xl font-bold">{statistics.totalProducts.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Active Products</p>
                <div className="text-2xl font-bold">{statistics.activeProducts.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Stock Issues</p>
                <div className="text-2xl font-bold">{statistics.outOfStockProducts.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Inventory Value</p>
                <div className="text-2xl font-bold">{formatCurrency(statistics.totalInventoryValue)}</div>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products by name, SKU, brand, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex gap-2 flex-1">
                <Input
                  placeholder="Min price"
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({...prev, min: e.target.value}))}
                  className="w-full sm:w-32"
                />
                <Input
                  placeholder="Max price"
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({...prev, max: e.target.value}))}
                  className="w-full sm:w-32"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <DateRangePicker
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                  placeholder="Filter by creation date"
                  className="w-full sm:w-[280px]"
                />

                {hasActiveFilters && (
                  <Button variant="outline" onClick={handleResetFilters} className="w-full sm:w-auto">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                )}

                {selectedProducts.length > 0 && (
                  <Button variant="destructive" onClick={handleBulkDelete} className="w-full sm:w-auto">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete ({selectedProducts.length})
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead className="cursor-pointer min-w-[200px]" onClick={() => handleSort('name')}>
                    <div className="flex items-center">
                      <span className={sortField === 'name' ? 'font-bold' : ''}>Product Name</span>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer min-w-[100px]" onClick={() => handleSort('category')}>
                    <div className="flex items-center">
                      <span className={sortField === 'category' ? 'font-bold' : ''}>Category</span>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer min-w-[100px]" onClick={() => handleSort('brand')}>
                    <div className="flex items-center">
                      <span className={sortField === 'brand' ? 'font-bold' : ''}>Brand</span>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer min-w-[100px]" onClick={() => handleSort('price')}>
                    <div className="flex items-center">
                      <span className={sortField === 'price' ? 'font-bold' : ''}>Price</span>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer min-w-[100px]" onClick={() => handleSort('status')}>
                    <div className="flex items-center">
                      <span className={sortField === 'status' ? 'font-bold' : ''}>Status</span>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer min-w-[80px]" onClick={() => handleSort('stock')}>
                    <div className="flex items-center">
                      <span className={sortField === 'stock' ? 'font-bold' : ''}>Stock</span>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer min-w-[100px]" onClick={() => handleSort('totalSales')}>
                    <div className="flex items-center">
                      <span className={sortField === 'totalSales' ? 'font-bold' : ''}>Sales</span>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer min-w-[120px]" onClick={() => handleSort('createdAt')}>
                    <div className="flex items-center">
                      <span className={sortField === 'createdAt' ? 'font-bold' : ''}>Created</span>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: pageSize }).map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))
                ) : (
                  paginatedProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center overflow-hidden">
                          <Package className="w-6 h-6 text-muted-foreground" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.sku}</div>
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.brand}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{formatCurrency(product.price)}</div>
                          {product.originalPrice && (
                            <div className="text-sm text-muted-foreground line-through">
                              {formatCurrency(product.originalPrice)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(product.status)}>
                          {formatStatus(product.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.stock}</div>
                          <Badge variant={getStockStatus(product.stock).color} className="text-xs">
                            {getStockStatus(product.stock).label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{product.totalSales}</TableCell>
                      <TableCell>{formatDate(product.createdAt)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewProduct(product.id)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditProduct(product.id)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => setDeleteProductId(product.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredProducts.length)} of {filteredProducts.length} products
              </span>
              <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                <SelectTrigger className="w-20">
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

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {(() => {
                  const maxVisiblePages = 5;
                  const pages = [];
                  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                  
                  // Adjust start page if we're near the end
                  if (endPage - startPage + 1 < maxVisiblePages) {
                    startPage = Math.max(1, endPage - maxVisiblePages + 1);
                  }
                  
                  // Show first page if not in range
                  if (startPage > 1) {
                    pages.push(
                      <Button
                        key={1}
                        variant={1 === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        className="w-10 h-8"
                      >
                        1
                      </Button>
                    );
                    if (startPage > 2) {
                      pages.push(
                        <span key="start-ellipsis" className="text-muted-foreground px-2">
                          ...
                        </span>
                      );
                    }
                  }
                  
                  // Show page range
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <Button
                        key={i}
                        variant={i === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(i)}
                        className="w-10 h-8"
                      >
                        {i}
                      </Button>
                    );
                  }
                  
                  // Show last page if not in range
                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      pages.push(
                        <span key="end-ellipsis" className="text-muted-foreground px-2">
                          ...
                        </span>
                      );
                    }
                    pages.push(
                      <Button
                        key={totalPages}
                        variant={totalPages === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-10 h-8"
                      >
                        {totalPages}
                      </Button>
                    );
                  }
                  
                  return pages;
                })()}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product and remove all its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => deleteProductId && handleDeleteProduct(deleteProductId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}