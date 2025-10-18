import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { useProducts, useProduct } from '@/hooks/useProducts';
import { useFaqItems } from '@/hooks/useFaq';
import { useContactInfo } from '@/hooks/useContacts';
import { Language, QUALITY_TIERS } from '@/types';

export default function HomePage() {
  const [language, setLanguage] = useState<Language>('en');
  const [selectedQuality, setSelectedQuality] = useState<string>('all');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  const [, setLocation] = useLocation();

  const { data: products = [], isLoading } = useProducts(selectedQuality);
  const { data: selectedProduct } = useProduct(selectedProductId || '');
  const { data: faqItems = [] } = useFaqItems();
  const { data: contactInfo = [] } = useContactInfo();

  const handleAdminLogin = () => {
    setShowAdminLogin(true);
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminCredentials),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setShowAdminLogin(false);
        sessionStorage.setItem('adminAuth', 'true');
        sessionStorage.setItem('adminUsername', data.username);
        setLocation('/admin');
      } else {
        alert(data.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-cannabis-bg">
      <Header 
        currentLanguage={language}
        onLanguageChange={setLanguage}
        onAdminLogin={handleAdminLogin}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="md:text-6xl font-bold mb-4 font-myanmar text-[24px]">DeeDo ZeeYo</h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Premium Quality Cannabis Products
          </p>
          <p className="text-lg max-w-2xl mx-auto opacity-80">(အဖူးအပွင့်များ ဝေဝေဆာ "DeeDo ZeeYo"မှာ လိုအပ်ရာကို ရှာဖွေပါ လွယ်ကူရိုးရှင်းစွာ)</p>
        </div>
      </section>
      {/* Product Catalog */}
      <section id="products" className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Quality Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Button
              variant={selectedQuality === 'all' ? 'default' : 'outline'}
              size="sm"
              className={`px-4 py-2 text-sm font-medium ${language === 'my' ? 'font-myanmar' : ''}`}
              onClick={() => setSelectedQuality('all')}
            >
              {language === 'my' ? 'ကုန်ပစ္စည်းအားလုံး' : 'All Products'}
            </Button>
            {QUALITY_TIERS.map((tier) => (
              <Button
                key={tier.id}
                variant={selectedQuality === tier.id ? 'default' : 'outline'}
                size="sm"
                className={`px-4 py-2 text-sm font-medium ${language === 'my' ? 'font-myanmar' : ''}`}
                onClick={() => setSelectedQuality(tier.id)}
              >
                {tier.label[language]}
              </Button>
            ))}
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-300 rounded-lg mb-3" style={{ aspectRatio: '9/16', minHeight: '200px' }}></div>
                  <div className="h-3 bg-gray-300 rounded mb-2"></div>
                  <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  language={language}
                  onClick={() => setSelectedProductId(product.id)}
                />
              ))}
            </div>
          )}

          {products.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>
      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-3xl font-bold mb-8 ${language === 'my' ? 'font-myanmar' : ''}`}>
            {language === 'en' ? 'About Us' : 'ကျွန်ုပ်တို့အကြောင်း'}
          </h2>
          <div className="prose prose-lg mx-auto">
            <p className="text-muted-foreground mb-6">မင်္ဂလာပါ စတုန်နာအမျိုးတို့...
            DeeDo ZeeYoသည်၂၀၂၂ ခုနှစ် မှစတင်ကာ ဝိအဖူးအပွင့်များကိုစတင်ရောင်းချခဲ့ပြီး 
            Customersများအတွက်အကောင်းဆုံးCannabisထုတ်ကုန်များကိုသာ ရောင်းချနိုင်ရန်လည်း အမြဲတမ်းအစဥ်မပြတ်ကြိုးစားလျက်ရှိပါသည်။

            Customers များနှင့်လည်းခိုင်မာသော ယုံကြည်မှုကို တည်ဆောက်ထားနိုင်ပြီး
            အမြဲတမ်း အားပေးကူညီခဲ့ကြသော Customers များအားလုံးကို 
            အထူးပင် ကျေးဇူးတင်ရှိပါသည်။

            ဒီWebsite က
            ညိုရဲ့ (DeedoZeeyo)နဲ့ စတုန်နာအမျိုးတို့အမြဲတမ်းအဆက်အသွယ်ရှိနေနိုင်စေရန်ဖန်တီးထားတာကြောင့် Website Linkလေးကို မှတ်ထားဖို့လည်းစတုန်နာအမျိုးတွေကို Requestလုပ်ပါတယ်ရှင့်။

            ဆက်လက်၍လည်း အကောင်းဆုံးဝန်ဆောင်မှု၊အကောင်းဆုံးCannabisထုတ်ကုန်တွေသာ ပေးစွမ်းနိုင်အောင် ကြိုစားသွားပါမည်။</p>
            <p className="text-muted-foreground font-myanmar">ပထမဆုံး အွန်လိုင်း ကန်နဗစ်</p>
          </div>
        </div>
      </section>
      {/* How to Order Section */}
      <section id="how-to-order" className="py-16 bg-cannabis-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold text-center mb-12 ${language === 'my' ? 'font-myanmar' : ''}`}>
            {language === 'en' ? 'How to Order' : 'မှာယူပုံ'}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {contactInfo
              .filter(contact => contact.isActive && contact.platform !== 'whatsapp')
              .sort((a, b) => {
                const order = ['telegram', 'messenger', 'line'];
                return order.indexOf(a.platform) - order.indexOf(b.platform);
              })
              .map((contact) => {
              const getPlatformConfig = () => {
                switch(contact.platform) {
                  case 'telegram':
                    return { name: 'Telegram', icon: 'fab fa-telegram-plane', color: 'bg-blue-500', desc: 'Fast and secure messaging' };
                  case 'messenger':
                    return { name: 'Messenger', icon: 'fab fa-facebook-messenger', color: 'bg-blue-600', desc: 'Facebook messaging' };
                  case 'line':
                    return { name: 'Line', icon: 'fab fa-line', color: 'bg-green-500', desc: 'Quick messaging' };
                  default:
                    return { name: contact.platform, icon: 'fas fa-message', color: 'bg-gray-500', desc: 'Contact us' };
                }
              };
              const platformConfig = getPlatformConfig();
              
              return (
                <Card key={contact.platform} className="text-center shadow-lg">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 ${platformConfig.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <i className={`${platformConfig.icon} text-white text-2xl`} />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{platformConfig.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {platformConfig.desc}
                    </p>
                    <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      {contact.qrCode ? (
                        <img 
                          src={contact.qrCode} 
                          alt={`${platformConfig.name} QR Code`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">QR Code</span>
                      )}
                    </div>
                    <Button 
                      className={`${platformConfig.color} hover:opacity-90 text-white`}
                      onClick={() => contact.url && window.open(contact.url, '_blank')}
                      disabled={!contact.url}
                    >
                      Contact via {platformConfig.name}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold text-center mb-12 ${language === 'my' ? 'font-myanmar' : ''}`}>
            {language === 'my' ? 'မေးလေ့ရှိသောမေးခွန်းများ' : 'FAQ'}
          </h2>
          <Accordion type="single" collapsible>
            {faqItems.length > 0 ? (
              faqItems.map((faq, index) => (
                <AccordionItem key={faq.id} value={`item-${index + 1}`}>
                  <AccordionTrigger className={language === 'my' ? 'font-myanmar' : ''}>
                    {language === 'my' && (faq.question as any)?.my 
                      ? (faq.question as any).my 
                      : (faq.question as any)?.en || 'Question not available'}
                  </AccordionTrigger>
                  <AccordionContent className={language === 'my' ? 'font-myanmar' : ''}>
                    {language === 'my' && (faq.answer as any)?.my 
                      ? (faq.answer as any).my 
                      : (faq.answer as any)?.en || 'Answer not available'}
                  </AccordionContent>
                </AccordionItem>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No FAQ items available.</p>
              </div>
            )}
          </Accordion>
        </div>
      </section>
      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct || null}
        language={language}
        isOpen={!!selectedProductId}
        onClose={() => setSelectedProductId(null)}
      />
      {/* Admin Login Modal */}
      <Dialog open={showAdminLogin} onOpenChange={setShowAdminLogin}>
        <DialogContent className="max-w-md">
          <DialogTitle className="text-2xl font-bold text-primary text-center">Admin Login</DialogTitle>
          <DialogDescription className="text-muted-foreground text-center">
            Enter your credentials to access the admin panel
          </DialogDescription>
          
          <form onSubmit={handleAdminSubmit} className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
                value={adminCredentials.username}
                onChange={(e) => setAdminCredentials(prev => ({ ...prev, username: e.target.value }))}
                required 
                data-testid="input-admin-username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input 
                type="password" 
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
                value={adminCredentials.password}
                onChange={(e) => setAdminCredentials(prev => ({ ...prev, password: e.target.value }))}
                required 
                data-testid="input-admin-password"
              />
            </div>
            
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowAdminLogin(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Login
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
