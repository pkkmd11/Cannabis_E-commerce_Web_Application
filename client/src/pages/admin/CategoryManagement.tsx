import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Category, InsertCategory } from '@shared/schema';
import { Plus, Edit, Trash2, X } from 'lucide-react';

interface CategoryManagementProps {
  categories: Category[];
  isLoading: boolean;
  onCreateCategory: (category: InsertCategory) => Promise<void>;
  onUpdateCategory: (id: string, category: InsertCategory) => Promise<void>;
  onDeleteCategory: (id: string) => void;
}

export function CategoryManagement({
  categories,
  isLoading,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory
}: CategoryManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    nameEn: '',
    nameMy: '',
    slug: '',
    className: '',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        nameEn: (editingCategory.name as any)?.en || '',
        nameMy: (editingCategory.name as any)?.my || '',
        slug: editingCategory.slug,
        className: editingCategory.className || '',
        order: editingCategory.order ?? 0,
        isActive: editingCategory.isActive ?? true,
      });
    }
  }, [editingCategory]);

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleNameEnChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      nameEn: value,
      slug: editingCategory ? prev.slug : generateSlug(value),
    }));
  };

  const resetForm = () => {
    setFormData({ nameEn: '', nameMy: '', slug: '', className: '', order: 0, isActive: true });
    setEditingCategory(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const categoryData: InsertCategory = {
      name: { en: formData.nameEn, my: formData.nameMy },
      slug: formData.slug,
      className: formData.className || null,
      order: formData.order,
      isActive: formData.isActive,
    };

    if (editingCategory) {
      await onUpdateCategory(editingCategory.id, categoryData);
    } else {
      await onCreateCategory(categoryData);
    }
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Categories Management</h2>
        <Button onClick={() => { setEditingCategory(null); setFormData({ nameEn: '', nameMy: '', slug: '', className: '', order: 0, isActive: true }); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
                <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name (English)</label>
                  <Input
                    value={formData.nameEn}
                    onChange={(e) => handleNameEnChange(e.target.value)}
                    placeholder="Category name in English"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 font-myanmar">Name (မြန်မာ)</label>
                  <Input
                    value={formData.nameMy}
                    onChange={(e) => setFormData(prev => ({ ...prev, nameMy: e.target.value }))}
                    placeholder="Category name in Myanmar"
                    className="font-myanmar"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="category-slug"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">CSS Class Name</label>
                  <Input
                    value={formData.className}
                    onChange={(e) => setFormData(prev => ({ ...prev, className: e.target.value }))}
                    placeholder="quality-high"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Display Order</label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <label className="text-sm font-medium">Active</label>
                  <p className="text-xs text-muted-foreground">Show this category on the public site</p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit">{editingCategory ? 'Update Category' : 'Create Category'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-8">Loading categories...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {categories.map((cat) => (
            <Card key={cat.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{(cat.name as any).en}</h3>
                    <p className="text-sm text-muted-foreground font-myanmar">{(cat.name as any).my}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">slug: {cat.slug}</Badge>
                      <Badge variant="outline">order: {cat.order}</Badge>
                      <Badge variant={cat.isActive ? "default" : "secondary"}>
                        {cat.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setEditingCategory(cat); setShowForm(true); }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteCategory(cat.id)}
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
