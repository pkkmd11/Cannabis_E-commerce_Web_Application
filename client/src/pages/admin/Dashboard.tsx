import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@shared/schema';
import { QUALITY_TIERS } from '@/types';
import { Leaf, BarChart3 } from 'lucide-react';

interface DashboardProps {
  products: Product[];
}

/**
 * Admin Dashboard Component
 * Displays key statistics and overview of the application
 */
export function Dashboard({ products }: DashboardProps) {
  const stats = {
    totalProducts: products.length,
    highQuality: products.filter(p => p.quality === 'high').length,
    mediumQuality: products.filter(p => p.quality === 'medium').length,
    lowQuality: products.filter(p => p.quality === 'low').length,
    activeProducts: products.filter(p => p.isActive).length,
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">High Quality</p>
                <p className="text-2xl font-bold">{stats.highQuality}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Medium Quality</p>
                <p className="text-2xl font-bold">{stats.mediumQuality}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Low Quality</p>
                <p className="text-2xl font-bold">{stats.lowQuality}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
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
