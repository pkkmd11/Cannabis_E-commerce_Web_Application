import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FaqForm } from '@/components/FaqForm';
import { FaqTable } from '@/components/FaqTable';
import { FaqItem, InsertFaqItem } from '@shared/schema';
import { Plus } from 'lucide-react';

interface FaqManagementProps {
  faqItems: FaqItem[];
  isLoading: boolean;
  onCreateFaqItem: (faqData: InsertFaqItem) => Promise<void>;
  onUpdateFaqItem: (faqData: InsertFaqItem) => Promise<void>;
  onDeleteFaqItem: (id: string) => void;
}

/**
 * FAQ Management Component
 * Handles CRUD operations for FAQ items
 */
export function FaqManagement({
  faqItems,
  isLoading,
  onCreateFaqItem,
  onUpdateFaqItem,
  onDeleteFaqItem
}: FaqManagementProps) {
  const [showFaqForm, setShowFaqForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);

  const handleCreateFaqItem = async (faqData: InsertFaqItem) => {
    await onCreateFaqItem(faqData);
    setShowFaqForm(false);
  };

  const handleUpdateFaqItem = async (faqData: InsertFaqItem) => {
    await onUpdateFaqItem(faqData);
    setShowFaqForm(false);
    setEditingFaq(null);
  };

  const handleEditFaqItem = (faqItem: FaqItem) => {
    setEditingFaq(faqItem);
    setShowFaqForm(true);
  };

  const handleAddFaqItem = () => {
    setEditingFaq(null);
    setShowFaqForm(true);
  };

  const transformFaqToFormData = (faqItem: FaqItem | null) => {
    if (!faqItem) return undefined;
    return {
      questionEn: (faqItem.question as any)?.en || '',
      questionMy: (faqItem.question as any)?.my || '',
      answerEn: (faqItem.answer as any)?.en || '',
      answerMy: (faqItem.answer as any)?.my || '',
      order: faqItem.order ?? 0,
      isActive: faqItem.isActive ?? true,
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">FAQ Management</h2>
        <Button onClick={handleAddFaqItem}>
          <Plus className="w-4 h-4 mr-2" />
          Add FAQ Item
        </Button>
      </div>

      {showFaqForm && (
        <FaqForm
          initialData={transformFaqToFormData(editingFaq)}
          onSubmit={editingFaq ? handleUpdateFaqItem : handleCreateFaqItem}
          onCancel={() => {
            setShowFaqForm(false);
            setEditingFaq(null);
          }}
          isEditing={!!editingFaq}
        />
      )}

      {isLoading ? (
        <div className="text-center py-8">Loading FAQ items...</div>
      ) : (
        <FaqTable
          faqItems={faqItems}
          isLoading={isLoading}
          onEdit={handleEditFaqItem}
          onDelete={onDeleteFaqItem}
          onAdd={handleAddFaqItem}
        />
      )}
    </div>
  );
}
