export type Language = 'en' | 'my';

export interface MultilingualText {
  en: string;
  my: string;
}

export interface QualityTier {
  id: 'high' | 'medium' | 'smoking-accessories' | 'glass-bong';
  label: MultilingualText;
  className: string;
}

export const QUALITY_TIERS: QualityTier[] = [
  {
    id: 'high',
    label: { en: 'High Quality', my: 'အရည်အသွေးမြင့်' },
    className: 'quality-high'
  },
  {
    id: 'medium', 
    label: { en: 'Standard Quality', my: 'စံအရည်အသွေး' },
    className: 'quality-medium'
  },
  {
    id: 'smoking-accessories',
    label: { en: 'Smoking Accessories', my: 'ဆေးလိပ်သောက်စရာပစ္စည်းများ' },
    className: 'quality-accessories'
  },
  {
    id: 'glass-bong',
    label: { en: 'Glass Bong', my: 'ဖန်ခွက် Bong' },
    className: 'quality-glass-bong'
  }
];

export const CONTACT_PLATFORMS = [
  { id: 'telegram', name: 'Telegram', icon: 'fab fa-telegram-plane', color: 'bg-blue-500' },
  { id: 'messenger', name: 'Messenger', icon: 'fab fa-facebook-messenger', color: 'bg-blue-600' },
  { id: 'line', name: 'Line', icon: 'fab fa-line', color: 'bg-green-500' },
];
