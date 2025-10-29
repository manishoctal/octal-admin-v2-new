import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { ArrowLeft, Edit, Trash2, Package, Star, TrendingUp, DollarSign, Eye, ShoppingCart, BarChart3 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { toast } from "sonner";
import { useRouter } from './Router';

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

interface ProductDetailsProps {
  productId: string;
}

// Mock function to get product by ID
const getProductById = (id: string): Product | null => {
  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'];
  const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony'];
  const statuses: Product['status'][] = ['active', 'inactive', 'draft', 'out_of_stock'];
  
  const basePrice = Math.floor(Math.random() * 500) + 20;
  const stock = Math.floor(Math.random() * 200);
  const sales = Math.floor(Math.random() * 1000);
  
  return {
    id,
    name: `Product ${id.split('-')[1]} - High Quality Item`,
    description: `This is a premium quality product with excellent features and outstanding performance. Perfect for daily use and built to last with superior materials and craftsmanship. The product offers great value for money and comes with comprehensive warranty coverage.`,
    price: basePrice,
    originalPrice: Math.random() > 0.5 ? Math.floor(basePrice * 1.3) : undefined,
    category: categories[Math.floor(Math.random() * categories.length)],
    brand: brands[Math.floor(Math.random() * brands.length)],
    sku: `SKU-${id.split('-')[1].padStart(4, '0')}`,
    stock: stock,
    status: stock === 0 ? 'out_of_stock' : statuses[Math.floor(Math.random() * (statuses.length - 1))],
    images: [`https://images.unsplash.com/photo-1500000000${id.split('-')[1]}?w=400&h=400&fit=crop`],
    tags: ['featured', 'bestseller', 'new'].slice(0, Math.floor(Math.random() * 3) + 1),
    weight: Math.floor(Math.random() * 2000) + 100,
    dimensions: {
      length: Math.floor(Math.random() * 50) + 10,
      width: Math.floor(Math.random() * 30) + 5,
      height: Math.floor(Math.random() * 20) + 2,
    },
    rating: Number((Math.random() * 2 + 3).toFixed(1)),
    reviewCount: Math.floor(Math.random() * 500),
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalSales: sales,
    revenue: sales * basePrice,
  };
};

export function ProductDetails({ productId }: ProductDetailsProps) {
  const { navigate, goBack } = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const productData = getProductById(productId);
      setProduct(productData);
      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  const handleEdit = () => {
    navigate('products/edit', { productId });
  };

  const handleDelete = () => {
    // In a real app, this would call an API to delete the product
    toast.success('Product deleted successfully');
    navigate('products');
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

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'destructive' as const, progress: 0 };
    if (stock <= 10) return { label: 'Low Stock', color: 'secondary' as const, progress: 25 };
    if (stock <= 50) return { label: 'Medium Stock', color: 'outline' as const, progress: 60 };
    return { label: 'In Stock', color: 'default' as const, progress: 100 };
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={goBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
            <div className="h-5 w-32 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="aspect-square bg-muted rounded animate-pulse mb-4" />
              <div className="space-y-2">
                <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                <div className="h-5 w-24 bg-muted rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
          <div className="lg:col-span-2 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="flex justify-between">
                      <div className="h-5 w-24 bg-muted rounded animate-pulse" />
                      <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-4 lg:p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={goBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold">Product Not Found</h2>
            <p className="text-muted-foreground">The requested product could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={goBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold">Product Details</h2>
            <p className="text-muted-foreground">View and manage product information</p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={handleEdit} className="flex-1 sm:flex-none">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} className="flex-1 sm:flex-none">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Image and Basic Info */}
        <Card>
          <CardContent className="p-6">
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-4 overflow-hidden">
              <Package className="w-16 h-16 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.sku}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor(product.status)}>
                  {product.status.replace('_', ' ')}
                </Badge>
                <Badge variant={stockStatus.color}>
                  {stockStatus.label}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviewCount} reviews)
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Name:</span>
                    <span className="text-sm text-muted-foreground">{product.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Brand:</span>
                    <span className="text-sm text-muted-foreground">{product.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Category:</span>
                    <span className="text-sm text-muted-foreground">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">SKU:</span>
                    <span className="text-sm text-muted-foreground font-mono">{product.sku}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Created:</span>
                    <span className="text-sm text-muted-foreground">{product.createdAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Updated:</span>
                    <span className="text-sm text-muted-foreground">{product.updatedAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge variant={getStatusColor(product.status)}>
                      {product.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium mb-2">Description:</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Current Price:</span>
                  <span className="text-lg font-bold">${product.price}</span>
                </div>
                {product.originalPrice && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Original Price:</span>
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  </div>
                )}
                {product.originalPrice && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Discount:</span>
                    <span className="text-sm text-green-600 font-medium">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Inventory
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Stock Quantity:</span>
                  <span className="text-lg font-bold">{product.stock}</span>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Stock Level:</span>
                    <span className="text-sm text-muted-foreground">{stockStatus.label}</span>
                  </div>
                  <Progress value={stockStatus.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Sales Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                    <p className="text-2xl font-bold">{product.totalSales}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold">${product.revenue.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg. Rating</p>
                    <p className="text-2xl font-bold">{product.rating}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {(product.weight || product.dimensions) && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.weight && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Weight:</span>
                    <span className="text-sm text-muted-foreground">{product.weight}g</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Dimensions:</span>
                    <span className="text-sm text-muted-foreground">
                      {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product "{product.name}" and remove all its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}