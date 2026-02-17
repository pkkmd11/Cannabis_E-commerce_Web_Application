import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Leaf, 
  Images, 
  Edit, 
  BookOpen, 
  HelpCircle,
  Menu,
  LogOut,
  Settings,
  Tags
} from 'lucide-react';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'products', label: 'Products', icon: Leaf },
  { id: 'categories', label: 'Categories', icon: Tags },
  { id: 'media', label: 'Media', icon: Images },
  { id: 'content', label: 'Content', icon: Edit },
  { id: 'contacts', label: 'Contacts', icon: BookOpen },
  { id: 'faq', label: 'FAQ Management', icon: HelpCircle },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar({ 
  activeSection, 
  onSectionChange, 
  onLogout,
  isOpen,
  onToggle 
}: AdminSidebarProps) {
  const handleMenuItemClick = (sectionId: string) => {
    onSectionChange(sectionId);
    // Close sidebar on mobile after selection
    if (isOpen && window.innerWidth < 768) {
      onToggle();
    }
  };

  const handleLogoutClick = () => {
    onLogout();
    // Close sidebar on mobile after logout
    if (isOpen && window.innerWidth < 768) {
      onToggle();
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm hover:bg-white shadow-md"
        onClick={onToggle}
        data-testid="button-toggle-sidebar"
      >
        <Menu className="w-5 h-5" />
      </Button>
      <aside className={`admin-sidebar w-64 bg-white shadow-sm fixed md:static inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Overlay for mobile */}
        {isOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={onToggle}
          />
        )}
        
        <div className="relative z-40 bg-white h-full">
          <div className="p-4 border-b">
            <h2 className="text-lg font-bold text-primary text-center">Admin</h2>
          </div>
          
          <nav className="mt-8 px-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => handleMenuItemClick(item.id)}
                    data-testid={`button-nav-${item.id}`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
            
            <div className="mt-8 pt-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogoutClick}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </Button>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
