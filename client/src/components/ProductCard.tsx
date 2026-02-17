import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import { Product } from '@shared/schema';
import { Language } from '@/types';
import { useCategories } from '@/hooks/useCategories';

interface ProductCardProps {
  product: Product;
  language: Language;
  onClick: () => void;
}

const BADGE_COLORS = [
  'bg-emerald-600 text-white',
  'bg-blue-600 text-white',
  'bg-purple-600 text-white',
  'bg-amber-600 text-white',
  'bg-rose-600 text-white',
  'bg-teal-600 text-white',
  'bg-indigo-600 text-white',
  'bg-orange-600 text-white',
];

function getCategoryBadgeClass(slug: string, className: string | null | undefined): string {
  if (className) return className;
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  }
  return BADGE_COLORS[Math.abs(hash) % BADGE_COLORS.length];
}

export function ProductCard({ product, language, onClick }: ProductCardProps) {
  const name = (product.name as any)?.[language] || 'Product Name';
  const description = (product.description as any)?.[language] || 'Product Description';
  const { data: categories = [] } = useCategories();
  
  const qualityTier = categories.find(cat => cat.slug === product.quality);
  const qualityLabel = qualityTier ? (qualityTier.name as any)[language] : product.quality;
  const badgeClass = getCategoryBadgeClass(product.quality, qualityTier?.className);
  
  const previewImage = product.images?.[0] || 'https://images.unsplash.com/photo-1536939459926-301728717817?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600';

  const inStock = product.stockStatus ?? true;
  const stockStatusLabel = language === 'my' 
    ? (inStock ? 'ရရှိနိုင်သည်' : 'ကုန်သွားပါပြီ')
    : (inStock ? 'In Stock' : 'Out of Stock');

  return (
    <Card 
      className="product-card cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: product.images?.[0] ? 'auto' : '4/3', minHeight: '200px' }}>
        <img 
          src={previewImage} 
          alt={name}
          className="w-full h-full object-cover object-center"
          style={{ aspectRatio: 'auto' }}
        />
        <div className="absolute top-2 left-1/2 -translate-x-1/2">
          <Badge className={`${badgeClass} text-[10px] px-2 py-0.5 leading-none shadow-md whitespace-nowrap`}>
            {qualityLabel}
          </Badge>
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <Badge 
            className={`${inStock ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white text-[10px] px-2 py-0.5 leading-none shadow-md whitespace-nowrap ${language === 'my' ? 'font-myanmar' : ''}`}
            data-testid={`badge-stock-status-${product.id}`}
          >
            {stockStatusLabel}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-1">{name}</h3>
        <p className={`text-muted-foreground text-sm mb-3 line-clamp-2 ${
          language === 'my' ? 'font-myanmar' : ''
        }`}>
          {description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-primary font-bold">See More</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}
