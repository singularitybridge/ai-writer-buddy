'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AcademyChat from '@/components/AcademyChat';
import type { Locale } from '@/i18n/config';
import {
  Bot,
  GraduationCap,
  Trophy,
  BookOpen,
  Wrench,
  Home,
  ChevronRight,
  ChevronLeft,
  Star,
  Pen,
  Github
} from 'lucide-react';

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const isRTL = locale === 'he';
  const BackChevron = isRTL ? ChevronRight : ChevronLeft;

  const sidebarLinks = [
    { href: '/academy', label: t('academy.dashboard'), icon: Home },
    { href: '/academy/challenges', label: t('academy.challenges'), icon: Trophy },
    { href: '/academy/guides', label: t('academy.guides'), icon: BookOpen },
    { href: '/academy/tools', label: t('academy.tools'), icon: Wrench },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm">
                <BackChevron className="w-4 h-4" />
                <span>{t('nav.singularityBridge')}</span>
              </Link>
              <div className="h-6 w-px bg-slate-200" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900 tracking-tight">{t('academy.title')}</h1>
                  <p className="text-xs text-slate-500">{t('academy.subtitle')}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher currentLocale={locale} />
              <div className="h-6 w-px bg-slate-200" />
              <Link
                href="/book/1"
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm"
              >
                <Pen className="w-4 h-4" />
                <span>{t('nav.openApp')}</span>
              </Link>
              <a
                href="https://github.com/singularitybridge/ai-writer-buddy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <div className="h-6 w-px bg-slate-200" />
              <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">0 {t('common.points')}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Content Area (2/3) */}
        <div className="flex-1 flex flex-col" style={{ width: '66.666%' }}>
          <div className="flex flex-1">
            {/* Sidebar (Navigation) */}
            <aside className="w-64 bg-white border-l border-slate-200 overflow-y-auto">
              <nav className="p-4">
                <div className="space-y-1">
                  {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href ||
                      (link.href !== '/academy' && pathname.startsWith(link.href));
                    const Icon = link.icon;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-purple-50 text-purple-700'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Progress Card */}
                <div className="mt-8 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-slate-900">{t('academy.yourProgress')}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">{t('academy.level')}</span>
                      <span className="font-medium text-slate-900">1 - {t('academy.beginner')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">{t('academy.challenges')}</span>
                      <span className="font-medium text-slate-900">0 / 7</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '0%' }} />
                    </div>
                  </div>
                </div>
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto bg-slate-50">
              {children}
            </main>
          </div>
        </div>

        {/* Chat Area (1/3) */}
        <div className="w-1/3 border-l border-slate-200 bg-white flex flex-col h-[calc(100vh-57px)]">
          <AcademyChat />
        </div>
      </div>
    </div>
  );
}
