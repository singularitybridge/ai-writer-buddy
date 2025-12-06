import Link from 'next/link';
import Image from 'next/image';
import { getBooks } from '@/lib/data';
import { getTranslations, getLocale } from 'next-intl/server';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import type { Locale } from '@/i18n/config';
import {
  BookOpen,
  Plus,
  Bot,
  GraduationCap
} from 'lucide-react';

export default async function HomePage() {
  const books = getBooks();
  const t = await getTranslations();
  const locale = await getLocale() as Locale;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">{t('home.appName')}</h1>
                <p className="text-xs text-slate-500 font-medium">AI Agent Experience by Singularity Bridge</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher currentLocale={locale} />
              <Link
                href="/academy"
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium"
              >
                <GraduationCap className="w-4 h-4" />
                <span>{t('nav.academy')}</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Books Section */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">{t('home.bookLibrary')}</h3>
              <p className="text-slate-500">{t('home.bookLibraryDesc')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <Link
                key={book.id}
                href={`/book/${book.id}`}
                className="book-card bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all"
              >
                {/* Cover Image */}
                <div className="aspect-[3/4] bg-slate-100 relative">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <span className="inline-block px-2 py-1 bg-white/90 text-slate-700 text-xs rounded-full">
                      {book.genre}
                    </span>
                  </div>
                </div>

                {/* Book Info */}
                <div className="p-4">
                  <h3 className="font-medium text-slate-900 text-lg mb-1 line-clamp-1 tracking-tight book-title">
                    {book.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-3 line-clamp-1 font-normal">
                    {book.subtitle}
                  </p>
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                    <BookOpen className="w-4 h-4" />
                    <span>{book.author}</span>
                  </div>
                </div>
              </Link>
            ))}

            {/* Add New Book Card */}
            <Link
              href="/academy/challenges/ch-002"
              className="book-card bg-white rounded-xl border-2 border-dashed border-slate-300 overflow-hidden hover:border-purple-400 hover:bg-purple-50/50 min-h-[400px] flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-purple-600 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                <Plus className="w-8 h-8" />
              </div>
              <div className="text-center">
                <p className="font-medium">{t('home.addNewBook')}</p>
                <p className="text-sm mt-1">{t('home.academyChallenge')}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{t('home.appName')}</p>
                <p className="text-xs text-slate-500">{t('home.footerTagline')} {t('home.footerBy')}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <Link href="/academy" className="hover:text-slate-900">{t('nav.academy')}</Link>
              <Link href="/academy/guides" className="hover:text-slate-900">{t('academy.guides')}</Link>
              <a href="https://github.com/singularitybridge/ai-writer-buddy" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
