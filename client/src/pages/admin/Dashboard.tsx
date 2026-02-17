import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@shared/schema';
import { useCategories } from '@/hooks/useCategories';
import { Leaf, BarChart3 } from 'lucide-react';

interface DashboardProps {
  products: Product[];
}

export function Dashboard({ products }: DashboardProps) {
  const { data: categories = [] } = useCategories();

  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.isActive).length,
  };

  const categoryCounts = categories.map(cat => ({
    name: (cat.name as any).en,
    count: products.filter(p => p.quality === cat.slug).length,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {categoryCounts.map((cat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">{cat.name}</p>
                  <p className="text-2xl font-bold">{cat.count}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Product Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Products</span>
              <span className="font-semibold">{stats.activeProducts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Inactive Products</span>
              <span className="font-semibold">{stats.totalProducts - stats.activeProducts}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
