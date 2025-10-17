import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@shared/schema';
import { Language, QUALITY_TIERS } from '@/types';
import { useContactInfo } from '@/hooks/useContacts';

interface ProductDetailModalProps {
  product: Product | null;
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailModal({ product, language, isOpen, onClose }: ProductDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { data: contactInfo = [] } = useContactInfo();

  if (!product) return null;

  const name = (product.name as any)?.[language] || 'Product Name';
  const description = (product.description as any)?.[language] || 'Product Description';
  const specifications = (product.specifications as any)?.[language] || [];
  
  const qualityTier = QUALITY_TIERS.find(tier => tier.id === product.quality);
  const qualityLabel = qualityTier?.label[language] || product.quality;
  
  // Combine images and videos into a single media array
  const images = product.images || [];
  const videos = product.videos || [];
  const mediaItems = [...images, ...videos];
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mediaItems.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };
  
  // Helper function to check if a URL is a video
  const isVideoUrl = (url: string) => {
    return url.match(/\.(mp4|webm|ogg|mov)$/i) !== null;
  };

  const generateContactMessage = () => {
    const productName = (product.name as any)?.en || 'Product';
    return encodeURIComponent(`I'm interested in ${productName}`);
  };

  const getContactUrl = (contact: any) => {
    if (!contact.url) return '#';
    
    const message = generateContactMessage();
    const baseUrl = contact.url;
    
    // Add message parameter for platforms that support it
    if (contact.platform === 'telegram' && baseUrl.includes('t.me')) {
      return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}text=${message}`;
    } else if (contact.platform === 'whatsapp' && baseUrl.includes('wa.me')) {
      return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}text=${message}`;
    }
    
    return baseUrl;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0 overflow-hidden" aria-describedby="product-description">
        <DialogTitle className="sr-only">{name}</DialogTitle>
        <div className="flex flex-col md:flex-row h-full">
          {/* Media Gallery (Images and Videos) */}
          <div className="md:w-1/2 bg-gray-100 relative">
            <div className="h-64 md:h-full md:aspect-auto aspect-square">
              {mediaItems.length > 0 && (
                <>
                  {isVideoUrl(mediaItems[currentImageIndex]) ? (
                    <video
                      src={mediaItems[currentImageIndex]}
                      className="w-full h-full object-cover object-center"
                      controls
                      controlsList="nodownload"
                      playsInline
                      data-testid={`video-player-${currentImageIndex}`}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={mediaItems[currentImageIndex]}
                      alt={`${name} - Media ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover object-center"
                      data-testid={`image-viewer-${currentImageIndex}`}
                    />
                  )}
                  
                  {mediaItems.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={prevImage}
                        data-testid="button-prev-media"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={nextImage}
                        data-testid="button-next-media"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                      
                      {/* Media indicators */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {mediaItems.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentImageIndex 
                                ? 'bg-white' 
                                : 'bg-white/50'
                            }`}
                            data-testid={`indicator-${index}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-white/80 hover:bg-white"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 p-6 overflow-y-auto max-h-[60vh] md:max-h-full touch-pan-y">
            <div className="mb-4">
              <Badge className={qualityTier?.className || 'bg-muted text-muted-foreground'}>
                {qualityLabel}
              </Badge>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">{name}</h2>
            <p className={`text-muted-foreground mb-6 ${
              language === 'my' ? 'font-myanmar' : ''
            }`}>
              {description}
            </p>
            
            {specifications.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-2">Specifications</h4>
                <ul className="text-muted-foreground text-sm space-y-1">
                  {specifications.map((spec: string, index: number) => (
                    <li key={index} className={language === 'my' ? 'font-myanmar' : ''}>
                      • {spec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contact Action Buttons */}
            <div className="space-y-3">
              <h4 className="font-medium">Contact to Order</h4>
              <div className="grid grid-cols-1 gap-2">
                {contactInfo.filter(contact => contact.isActive && contact.url).map((contact) => {
                  const getPlatformConfig = () => {
                    switch(contact.platform) {
                      case 'telegram':
                        return { name: 'Telegram', icon: 'fab fa-telegram-plane', color: 'bg-blue-500' };
                      case 'whatsapp':
                        return { name: 'WhatsApp', icon: 'fab fa-whatsapp', color: 'bg-green-500' };
                      case 'messenger':
                        return { name: 'Messenger', icon: 'fab fa-facebook-messenger', color: 'bg-blue-600' };
                      default:
                        return { name: contact.platform, icon: 'fas fa-message', color: 'bg-gray-500' };
                    }
                  };
                  const platformConfig = getPlatformConfig();
                  
                  return (
                    <Button
                      key={contact.id}
                      asChild
                      className={`${platformConfig.color} hover:opacity-90 text-white`}
                    >
                      <a
                        href={getContactUrl(contact)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-2"
                      >
                        <i className={platformConfig.icon} />
                        <span>Order via {platformConfig.name}</span>
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
