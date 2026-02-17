import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Category, InsertCategory } from '@shared/schema';
import { Plus, Edit, Trash2, X, GripVertical } from 'lucide-react';

interface CategoryManagementProps {
  categories: Category[];
  isLoading: boolean;
  onCreateCategory: (category: InsertCategory) => Promise<void>;
  onUpdateCategory: (id: string, category: Partial<InsertCategory>) => Promise<void>;
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
  const [nameEn, setNameEn] = useState('');
  const [nameMy, setNameMy] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setNameEn('');
    setNameMy('');
    setIsActive(true);
    setEditingCategory(null);
    setShowForm(false);
  };

  const startEditing = (cat: Category) => {
    setEditingCategory(cat);
    setNameEn((cat.name as any)?.en || '');
    setNameMy((cat.name as any)?.my || '');
    setIsActive(cat.isActive ?? true);
    setShowForm(true);
  };

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn.trim()) return;

    setIsSaving(true);
    try {
      if (editingCategory) {
        await onUpdateCategory(editingCategory.id, {
          name: { en: nameEn.trim(), my: nameMy.trim() || nameEn.trim() },
          isActive,
        });
      } else {
        const nextOrder = categories.length > 0
          ? Math.max(...categories.map(c => c.order ?? 0)) + 1
          : 0;

        await onCreateCategory({
          name: { en: nameEn.trim(), my: nameMy.trim() || nameEn.trim() },
          slug: generateSlug(nameEn.trim()),
          order: nextOrder,
          isActive,
        });
      }
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (cat: Category) => {
    try {
      await onUpdateCategory(cat.id, {
        isActive: !cat.isActive,
      });
    } catch (error) {
      console.error('Error toggling category:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Categories</h2>
        {!showForm && (
          <Button onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {editingCategory ? 'Edit Category' : 'New Category'}
                </h3>
                <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name (English)</label>
                  <Input
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Indoor, Outdoor, Exotic"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 font-myanmar">Name (Myanmar)</label>
                  <Input
                    value={nameMy}
                    onChange={(e) => setNameMy(e.target.value)}
                    placeholder="Myanmar name (optional, will use English if empty)"
                    className="font-myanmar"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="text-sm font-medium">Active</p>
                  <p className="text-xs text-muted-foreground">Show on the website</p>
                </div>
                <Switch
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit" disabled={isSaving || !nameEn.trim()}>
                  {isSaving ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-8">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No categories yet. Add your first category above.
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <Card key={cat.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{(cat.name as any).en}</h3>
                    {(cat.name as any).my && (cat.name as any).my !== (cat.name as any).en && (
                      <p className="text-sm text-muted-foreground font-myanmar">{(cat.name as any).my}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {cat.isActive ? 'Active' : 'Hidden'}
                      </span>
                      <Switch
                        checked={cat.isActive ?? true}
                        onCheckedChange={() => handleToggleActive(cat)}
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditing(cat)}
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
