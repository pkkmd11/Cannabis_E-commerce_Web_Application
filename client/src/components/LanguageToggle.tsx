import { Button } from '@/components/ui/button';
import { Language } from '@/types';

interface LanguageToggleProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageToggle({ currentLanguage, onLanguageChange }: LanguageToggleProps) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      <Button
        variant={currentLanguage === 'en' ? 'default' : 'ghost'}
        size="sm"
        className={`px-3 py-1 text-sm font-medium rounded-md ${
          currentLanguage === 'en' 
            ? 'bg-primary text-primary-foreground' 
            : 'text-gray-600 hover:text-primary'
        }`}
        onClick={() => onLanguageChange('en')}
        data-testid="button-language-en"
      >
        Eng
      </Button>
      <Button
        variant={currentLanguage === 'my' ? 'default' : 'ghost'}
        size="sm"
        className={`px-3 py-1 text-sm font-medium rounded-md ${
          currentLanguage === 'my' 
            ? 'bg-primary text-primary-foreground' 
            : 'text-gray-600 hover:text-primary'
        }`}
        onClick={() => onLanguageChange('my')}
        data-testid="button-language-my"
      >
        Myanmar
      </Button>
    </div>
  );
}
