import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from './LanguageToggle';
import { Language } from '@/types';
import { Shield } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { SiteSettings } from '@shared/schema';

interface HeaderProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
  onAdminLogin: () => void;
}

export function Header({ currentLanguage, onLanguageChange, onAdminLogin }: HeaderProps) {
  const [activeSection, setActiveSection] = useState('products');
  
  const { data: siteSettings } = useQuery<SiteSettings>({
    queryKey: ['/api/settings'],
  });

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -66%',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sections = ['products', 'about', 'how-to-order', 'faq'];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            {siteSettings?.logoUrl ? (
              <>
                <img 
                  src={siteSettings.logoUrl} 
                  alt={siteSettings.siteName || 'Logo'} 
                  className="h-8 sm:h-12 object-contain"
                  data-testid="img-site-logo"
                />
                {siteSettings.tagline && (
                  <span className="ml-2 text-xs sm:text-sm text-muted-foreground hidden sm:inline">
                    {siteSettings.tagline}
                  </span>
                )}
              </>
            ) : (
              <>
                <h1 className="text-xl sm:text-2xl font-bold text-primary">
                  {siteSettings?.siteName || 'Nyo'}
                </h1>
                <span className="ml-2 text-xs sm:text-sm text-muted-foreground hidden xs:inline">
                  {siteSettings?.tagline || 'Premium Cannabis'}
                </span>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <LanguageToggle 
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
            />
            
            <Button
              variant="ghost"
              size="sm"
              className="text-xs sm:text-sm text-primary hover:text-secondary font-medium ml-[0px] mr-[0px]"
              onClick={onAdminLogin}
              data-testid="button-admin-login"
            >
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">Login</span>
              <span className="sm:hidden">Admin</span>
            </Button>
          </div>
        </div>
        
        <nav className="flex space-x-4 sm:space-x-6 md:space-x-8 pb-3 sm:pb-4 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => scrollToSection('products')}
            className={`pb-2 text-xs sm:text-sm whitespace-nowrap transition-colors ${
              activeSection === 'products'
                ? 'text-primary font-medium'
                : 'text-muted-foreground hover:text-primary'
            }`}
            data-testid="nav-products"
          >
            Products
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className={`pb-2 text-xs sm:text-sm whitespace-nowrap transition-colors ${
              activeSection === 'about'
                ? 'text-primary font-medium'
                : 'text-muted-foreground hover:text-primary'
            }`}
            data-testid="nav-about"
          >
            About Us
          </button>
          <button
            onClick={() => scrollToSection('how-to-order')}
            className={`pb-2 text-xs sm:text-sm whitespace-nowrap transition-colors ${
              activeSection === 'how-to-order'
                ? 'text-primary font-medium'
                : 'text-muted-foreground hover:text-primary'
            }`}
            data-testid="nav-how-to-order"
          >
            How to Order
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className={`pb-2 text-xs sm:text-sm whitespace-nowrap transition-colors ${
              activeSection === 'faq'
                ? 'text-primary font-medium'
                : 'text-muted-foreground hover:text-primary'
            }`}
            data-testid="nav-faq"
          >
            FAQ
          </button>
        </nav>
      </div>
    </header>
  );
}
