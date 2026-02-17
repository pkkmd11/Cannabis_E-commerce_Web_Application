import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Footer } from '@/components/Footer';
import { ContactManagement } from '@/components/ContactManagement';
import { AdminSettings } from '@/components/AdminSettings';
import { Dashboard } from '@/pages/admin/Dashboard';
import { ProductManagement } from '@/pages/admin/ProductManagement';
import { FaqManagement } from '@/pages/admin/FaqManagement';
import { CategoryManagement } from '@/pages/admin/CategoryManagement';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { useFaqItems, useCreateFaqItem, useUpdateFaqItem, useDeleteFaqItem } from '@/hooks/useFaq';
import { useAllCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useCategories';
import { useContactInfo, useUpdateContactInfo } from '@/hooks/useContacts';
import { InsertProduct, InsertFaqItem, InsertContactInfo, InsertCategory } from '@shared/schema';

/**
 * Admin Page Component
 * Main dashboard for managing the cannabis e-commerce application
 * Includes authentication check and delegates to section-specific components
 */
export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const adminAuth = sessionStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    } else {
      setLocation('/');
    }
  }, [setLocation]);

  // Data hooks
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const { data: faqItems = [], isLoading: faqLoading } = useFaqItems();
  const createFaqItem = useCreateFaqItem();
  const updateFaqItem = useUpdateFaqItem();
  const deleteFaqItem = useDeleteFaqItem();

  const { data: allCategories = [], isLoading: categoriesLoading } = useAllCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const { data: contactInfo = [], isLoading: contactLoading } = useContactInfo();
  const updateContactInfo = useUpdateContactInfo();

  // Handlers
  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    sessionStorage.removeItem('adminUsername');
    setLocation('/');
  };

  const handleCreateProduct = async (productData: InsertProduct) => {
    try {
      console.log('Creating product with data:', productData);
      await createProduct.mutateAsync(productData);
      console.log('Product created successfully');
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  };

  const handleUpdateProduct = async (id: string, productData: InsertProduct) => {
    try {
      console.log('Updating product with id:', id, 'data:', productData);
      await updateProduct.mutateAsync({ id, product: productData });
      console.log('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct.mutate(productId);
    }
  };

  const handleDeleteAllProducts = async () => {
    const userConfirmation = prompt(
      `⚠️ WARNING: This will delete ALL ${products.length} products permanently!\n\nThis action cannot be undone.\n\nType "DELETE ALL" to confirm:`
    );
    
    if (userConfirmation === 'DELETE ALL') {
      let successCount = 0;
      let failCount = 0;
      const failedProducts = [];

      for (const product of products) {
        try {
          await deleteProduct.mutateAsync(product.id);
          successCount++;
        } catch (error) {
          console.error(`Error deleting product ${product.id}:`, error);
          failCount++;
          failedProducts.push((product.name as any)?.en || product.id);
        }
      }

      if (failCount === 0) {
        alert(`✅ Success! All ${successCount} products have been deleted.`);
      } else if (successCount === 0) {
        alert(`❌ Failed to delete any products. Please try again or delete products individually.`);
      } else {
        alert(`⚠️ Partial success: ${successCount} products deleted, ${failCount} failed.\n\nFailed products: ${failedProducts.join(', ')}`);
      }
    }
  };

  const handleCreateFaqItem = async (faqData: InsertFaqItem) => {
    try {
      await createFaqItem.mutateAsync(faqData);
      console.log('FAQ item created successfully');
    } catch (error) {
      console.error('Error creating FAQ item:', error);
      throw error;
    }
  };

  const handleUpdateFaqItem = async (faqData: InsertFaqItem) => {
    try {
      await updateFaqItem.mutateAsync({ id: (faqData as any).id, faqItem: faqData });
      console.log('FAQ item updated successfully');
    } catch (error) {
      console.error('Error updating FAQ item:', error);
      throw error;
    }
  };

  const handleDeleteFaqItem = (id: string) => {
    deleteFaqItem.mutate(id);
  };

  const handleCreateCategory = async (categoryData: InsertCategory) => {
    try {
      await createCategory.mutateAsync(categoryData);
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  };

  const handleUpdateCategory = async (id: string, categoryData: Partial<InsertCategory>) => {
    try {
      await updateCategory.mutateAsync({ id, category: categoryData });
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteCategory.mutate(id);
    }
  };

  const handleUpdateContactInfo = async (platform: string, contactData: Partial<InsertContactInfo>) => {
    try {
      await updateContactInfo.mutateAsync({ platform, contactInfo: contactData });
      console.log('Contact info updated successfully');
    } catch (error) {
      console.error('Error updating contact info:', error);
      throw error;
    }
  };

  // Render the appropriate section based on activeSection state
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard products={products} />;
      
      case 'products':
        return (
          <ProductManagement
            products={products}
            isLoading={productsLoading}
            onCreateProduct={handleCreateProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onDeleteAllProducts={handleDeleteAllProducts}
          />
        );
      
      case 'categories':
        return (
          <CategoryManagement
            categories={allCategories}
            isLoading={categoriesLoading}
            onCreateCategory={handleCreateCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        );

      case 'faq':
        return (
          <FaqManagement
            faqItems={faqItems}
            isLoading={faqLoading}
            onCreateFaqItem={handleCreateFaqItem}
            onUpdateFaqItem={handleUpdateFaqItem}
            onDeleteFaqItem={handleDeleteFaqItem}
          />
        );
      
      case 'contacts':
        return (
          <ContactManagement
            contactInfo={contactInfo}
            isLoading={contactLoading}
            onUpdate={handleUpdateContactInfo}
          />
        );
      
      case 'settings':
        return <AdminSettings />;
      
      default:
        return <Dashboard products={products} />;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cannabis-bg flex">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
