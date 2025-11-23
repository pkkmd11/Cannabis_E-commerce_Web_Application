import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductForm } from '@/components/ProductForm';
import { Product, InsertProduct } from '@shared/schema';
import { QUALITY_TIERS } from '@/types';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

interface ProductManagementProps {
  products: Product[];
  isLoading: boolean;
  onCreateProduct: (product: InsertProduct) => Promise<void>;
  onUpdateProduct: (product: InsertProduct) => Promise<void>;
  onDeleteProduct: (productId: string) => void;
  onDeleteAllProducts: () => Promise<void>;
}

/**
 * Product Management Component
 * Handles all product-related operations in the admin panel
 */
export function ProductManagement({
  products,
  isLoading,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  onDeleteAllProducts
}: ProductManagementProps) {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleCreateProduct = async (productData: InsertProduct) => {
    await onCreateProduct(productData);
    setShowProductForm(false);
  };

  const handleUpdateProduct = async (productData: InsertProduct) => {
    await onUpdateProduct(productData);
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const transformProductToFormData = (product: Product | null) => {
    if (!product) return undefined;
    return {
      nameEn: (product.name as any)?.en || '',
      nameMy: (product.name as any)?.my || '',
      descriptionEn: (product.description as any)?.en || '',
      descriptionMy: (product.description as any)?.my || '',
      quality: product.quality as 'high' | 'medium' | 'smoking-accessories' | 'glass-bong',
      specificationsEn: (product.specifications as any)?.en?.join('\n') || '',
      specificationsMy: (product.specifications as any)?.my?.join('\n') || '',
      isActive: product.isActive ?? true,
      stockStatus: product.stockStatus ?? true,
      existingImages: product.images || [],
    };
  };

  const getQualityBadgeClass = (quality: string) => {
    const tier = QUALITY_TIERS.find(t => t.id === quality);
    return tier?.className || 'bg-muted text-muted-foreground';
  };

  const getQualityLabel = (quality: string) => {
    const tier = QUALITY_TIERS.find(t => t.id === quality);
    return tier?.label.en || quality;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products Management</h2>
        <div className="flex gap-2">
          <Button
            data-testid="button-add-product"
            variant="destructive"
            onClick={onDeleteAllProducts}
            disabled={products.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete All ({products.length})
          </Button>
          <Button
            data-testid="button-add-product"
            onClick={() => {
              setEditingProduct(null);
              setShowProductForm(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {showProductForm && (
        <ProductForm
          initialData={transformProductToFormData(editingProduct)}
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          onCancel={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {isLoading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {product.images && product.images.length > 0 && (
                    <img
                      src={product.images[0]}
                      alt={(product.name as any).en}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{(product.name as any).en}</h3>
                    <p className="text-sm text-muted-foreground">{(product.name as any).my}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge className={getQualityBadgeClass(product.quality)}>
                        {getQualityLabel(product.quality)}
                      </Badge>
                      <Badge variant={product.isActive ? "default" : "secondary"}>
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingProduct(product);
                        setShowProductForm(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteProduct(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
