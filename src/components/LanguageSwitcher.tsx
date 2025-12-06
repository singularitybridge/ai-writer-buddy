'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Globe } from 'lucide-react';
import { locales, localeNames, type Locale } from '@/i18n/config';

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = async (newLocale: Locale) => {
    if (newLocale === currentLocale) return;

    await fetch('/api/locale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale: newLocale }),
    });

    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => handleLocaleChange(locale)}
          disabled={isPending}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            currentLocale === locale
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          } ${isPending ? 'opacity-50 cursor-wait' : ''}`}
        >
          {locale === locales[0] && <Globe className="w-3.5 h-3.5" />}
          <span>{localeNames[locale]}</span>
        </button>
      ))}
    </div>
  );
}
