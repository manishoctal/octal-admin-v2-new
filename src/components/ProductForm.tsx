import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  ArrowLeft,
  Save,
  Package,
  Upload,
  X,
  Plus,
} from "lucide-react";
import { FormField } from "./common/FormField";
import {
  validateRequired,
  validateNumber,
} from "./common/validation";
import { toast } from "sonner";
import { useRouter } from "./Router";

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
  status: "active" | "inactive" | "draft" | "out_of_stock";
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

interface ProductFormProps {
  product?: Product;
  mode: "create" | "edit";
}

interface FormData {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  category: string;
  brand: string;
  sku: string;
  stock: string;
  status: "active" | "inactive" | "draft";
  tags: string[];
  weight: string;
  length: string;
  width: string;
  height: string;
}

interface Errors {
  [key: string]: string;
}

const categories = [
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden",
  "Sports",
  "Beauty",
  "Toys",
  "Food",
  "Automotive",
  "Health",
];

const brands = [
  "Apple",
  "Samsung",
  "Nike",
  "Adidas",
  "Sony",
  "LG",
  "HP",
  "Dell",
  "Canon",
  "Bosch",
  "Generic",
  "Other",
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "draft", label: "Draft" },
];

export function ProductForm({
  product,
  mode,
}: ProductFormProps) {
  const { navigate, goBack, params } = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    originalPrice: product?.originalPrice?.toString() || "",
    category: product?.category || "",
    brand: product?.brand || "",
    sku: product?.sku || "",
    stock: product?.stock?.toString() || "",
    status:
      (product?.status === "out_of_stock"
        ? "inactive"
        : product?.status) || "draft",
    tags: product?.tags || [],
    weight: product?.weight?.toString() || "",
    length: product?.dimensions?.length?.toString() || "",
    width: product?.dimensions?.width?.toString() || "",
    height: product?.dimensions?.height?.toString() || "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || "",
        category: product.category,
        brand: product.brand,
        sku: product.sku,
        stock: product.stock.toString(),
        status:
          product.status === "out_of_stock"
            ? "inactive"
            : product.status,
        tags: product.tags,
        weight: product.weight?.toString() || "",
        length: product.dimensions?.length?.toString() || "",
        width: product.dimensions?.width?.toString() || "",
        height: product.dimensions?.height?.toString() || "",
      });
    } else if (mode === "edit" && params.productId) {
      // In a real app, fetch product data here
      const mockProduct = {
        name:
          "Sample Product " + params.productId.split("-")[1],
        description:
          "This is a sample product description with detailed information about the product features and benefits.",
        price: "99.99",
        originalPrice: "129.99",
        category: "Electronics",
        brand: "Samsung",
        sku:
          "SKU-" +
          params.productId.split("-")[1].padStart(4, "0"),
        stock: "50",
        status: "active" as const,
        tags: ["featured", "bestseller"],
        weight: "500",
        length: "20",
        width: "15",
        height: "5",
      };
      setFormData(mockProduct);
    }
  }, [product, mode, params.productId]);

  const handleInputChange = (
    field: keyof FormData,
    value: string | string[],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const addTag = () => {
    if (
      newTag.trim() &&
      !formData.tags.includes(newTag.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    // Required fields validation
    if (!validateRequired(formData.name))
      newErrors.name = "Product name is required";
    if (!validateRequired(formData.description))
      newErrors.description = "Description is required";
    if (!validateRequired(formData.price))
      newErrors.price = "Price is required";
    if (!validateRequired(formData.category))
      newErrors.category = "Category is required";
    if (!validateRequired(formData.brand))
      newErrors.brand = "Brand is required";
    if (!validateRequired(formData.sku))
      newErrors.sku = "SKU is required";
    if (!validateRequired(formData.stock))
      newErrors.stock = "Stock quantity is required";

    // Numeric validation
    if (formData.price && !validateNumber(formData.price)) {
      newErrors.price = "Price must be a valid number";
    } else if (
      formData.price &&
      parseFloat(formData.price) <= 0
    ) {
      newErrors.price = "Price must be greater than 0";
    }

    if (
      formData.originalPrice &&
      !validateNumber(formData.originalPrice)
    ) {
      newErrors.originalPrice =
        "Original price must be a valid number";
    }

    if (formData.stock && !validateNumber(formData.stock)) {
      newErrors.stock = "Stock must be a valid number";
    } else if (formData.stock && parseInt(formData.stock) < 0) {
      newErrors.stock = "Stock cannot be negative";
    }

    if (formData.weight && !validateNumber(formData.weight)) {
      newErrors.weight = "Weight must be a valid number";
    }

    // Dimensions validation
    if (formData.length && !validateNumber(formData.length)) {
      newErrors.length = "Length must be a valid number";
    }
    if (formData.width && !validateNumber(formData.width)) {
      newErrors.width = "Width must be a valid number";
    }
    if (formData.height && !validateNumber(formData.height)) {
      newErrors.height = "Height must be a valid number";
    }

    // Business logic validation
    if (formData.originalPrice && formData.price) {
      const price = parseFloat(formData.price);
      const originalPrice = parseFloat(formData.originalPrice);
      if (originalPrice <= price) {
        newErrors.originalPrice =
          "Original price should be higher than sale price";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const action = mode === "create" ? "created" : "updated";
      toast.success(`Product ${action} successfully`);
      navigate("products");
    } catch (error) {
      toast.error(`Failed to ${mode} product`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={goBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold">
            {mode === "create"
              ? "Create Product"
              : "Edit Product"}
          </h2>
          <p className="text-muted-foreground">
            {mode === "create"
              ? "Add a new product to your catalog"
              : "Update product information and settings"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Product Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Product Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  label="Product Name"
                  required
                  error={errors.name}
                >
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      handleInputChange("name", e.target.value)
                    }
                    placeholder="Enter product name"
                  />
                </FormField>

                <FormField
                  label="Description"
                  required
                  error={errors.description}
                >
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange(
                        "description",
                        e.target.value,
                      )
                    }
                    placeholder="Enter product description"
                    rows={4}
                  />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="SKU"
                    required
                    error={errors.sku}
                    hint="Unique product identifier"
                  >
                    <Input
                      value={formData.sku}
                      onChange={(e) =>
                        handleInputChange("sku", e.target.value)
                      }
                      placeholder="e.g., SKU-0001"
                    />
                  </FormField>

                  <FormField
                    label="Brand"
                    required
                    error={errors.brand}
                  >
                    <Select
                      value={formData.brand}
                      onValueChange={(value) =>
                        handleInputChange("brand", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>

                <FormField
                  label="Tags"
                  hint="Add tags to help categorize your product"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <X
                            className="w-3 h-3 cursor-pointer hover:text-destructive"
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) =>
                          setNewTag(e.target.value)
                        }
                        placeholder="Add a tag"
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addTag())
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addTag}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </FormField>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Price"
                    required
                    error={errors.price}
                  >
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange(
                          "price",
                          e.target.value,
                        )
                      }
                      placeholder="0.00"
                    />
                  </FormField>

                  <FormField
                    label="Original Price"
                    error={errors.originalPrice}
                    hint="For showing discounts"
                  >
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) =>
                        handleInputChange(
                          "originalPrice",
                          e.target.value,
                        )
                      }
                      placeholder="0.00"
                    />
                  </FormField>
                </div>

                <FormField
                  label="Stock Quantity"
                  required
                  error={errors.stock}
                >
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      handleInputChange("stock", e.target.value)
                    }
                    placeholder="0"
                  />
                </FormField>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  label="Weight (grams)"
                  error={errors.weight}
                  hint="Product weight for shipping calculations"
                >
                  <Input
                    type="number"
                    value={formData.weight}
                    onChange={(e) =>
                      handleInputChange(
                        "weight",
                        e.target.value,
                      )
                    }
                    placeholder="0"
                  />
                </FormField>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    label="Length (cm)"
                    error={errors.length}
                  >
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.length}
                      onChange={(e) =>
                        handleInputChange(
                          "length",
                          e.target.value,
                        )
                      }
                      placeholder="0"
                    />
                  </FormField>

                  <FormField
                    label="Width (cm)"
                    error={errors.width}
                  >
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.width}
                      onChange={(e) =>
                        handleInputChange(
                          "width",
                          e.target.value,
                        )
                      }
                      placeholder="0"
                    />
                  </FormField>

                  <FormField
                    label="Height (cm)"
                    error={errors.height}
                  >
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.height}
                      onChange={(e) =>
                        handleInputChange(
                          "height",
                          e.target.value,
                        )
                      }
                      placeholder="0"
                    />
                  </FormField>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  label="Category"
                  required
                  error={errors.category}
                >
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category}
                          value={category}
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Status" required>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag & drop images here, or click to select
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                  >
                    Choose Files
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Form Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {mode === "create"
                      ? "Create Product"
                      : "Update Product"}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}