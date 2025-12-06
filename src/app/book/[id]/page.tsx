'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import type { Locale } from '@/i18n/config';
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  ImageIcon,
  PenLine,
  Settings,
  User,
  Database,
  Volume2,
  Loader2,
  GraduationCap,
  Github
} from 'lucide-react';
import ChatAssistant from '@/components/ChatAssistant';
import { Book, Chapter, Page, ChatMessage, KnowledgeItem, Character } from '@/types';

interface BookWithDetails extends Book {
  chapters: (Chapter & { pages: Page[] })[];
  chatMessages: ChatMessage[];
  knowledgeItems: KnowledgeItem[];
  characters: Character[];
}

interface Props {
  params: Promise<{ id: string }>;
}

export default function BookPage({ params }: Props) {
  const [book, setBook] = useState<BookWithDetails | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [bookId, setBookId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const isRTL = locale === 'he';
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  useEffect(() => {
    params.then(p => setBookId(p.id));
  }, [params]);

  useEffect(() => {
    if (!bookId) return;

    // Fetch book data
    fetch(`/api/book/${bookId}`)
      .then(res => res.json())
      .then(data => {
        setBook(data);
        // Auto-select first chapter and page
        if (data.chapters.length > 0) {
          const firstChapter = data.chapters[0];
          setSelectedChapterId(firstChapter.id);
          setExpandedChapters(new Set([firstChapter.id]));
          if (firstChapter.pages.length > 0) {
            setSelectedPageId(firstChapter.pages[0].id);
          }
        }
      })
      .catch(err => console.error('Error fetching book:', err));
  }, [bookId]);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  const selectPage = (chapterId: string, pageId: string) => {
    setSelectedChapterId(chapterId);
    setSelectedPageId(pageId);
    setExpandedChapters(prev => new Set([...prev, chapterId]));
  };

  const getCurrentPage = (): Page | null => {
    if (!book || !selectedChapterId || !selectedPageId) return null;
    const chapter = book.chapters.find(c => c.id === selectedChapterId);
    if (!chapter) return null;
    return chapter.pages.find(p => p.id === selectedPageId) || null;
  };

  const currentPage = getCurrentPage();

  const handleVoiceOver = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    // Mock: simulate reading for 3 seconds then stop
    setTimeout(() => setIsPlaying(false), 3000);
  };

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-500">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
              >
                <BackArrow className="w-4 h-4" />
                <span className="text-sm">{t('common.back')}</span>
              </Link>
              <div className="h-6 w-px bg-slate-200" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                  <PenLine className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-slate-900 tracking-tight">{t('home.appName')}</h1>
                  <p className="text-xs text-slate-500 font-normal">AI Agent Experience by Singularity Bridge</p>
                </div>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div className="text-sm text-slate-600">
                <span className="font-medium">{book.title}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher currentLocale={locale} />
              <div className="h-6 w-px bg-slate-200" />
              <Link
                href={`/book/${bookId}/knowledge`}
                className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Database className="w-4 h-4" />
                <span className="text-sm font-medium">{t('book.knowledgeBase')}</span>
              </Link>
              <Link
                href="/academy"
                className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <GraduationCap className="w-4 h-4" />
                <span className="text-sm font-medium">{t('nav.academy')}</span>
              </Link>
              <a
                href="https://github.com/singularitybridge/ai-writer-buddy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Github className="w-4 h-4" />
                <span className="text-sm font-medium">GitHub</span>
              </a>
              <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Content Area (2/3) */}
        <div className="flex-1 flex flex-col" style={{ width: '66.666%' }}>
          {/* Book Metadata Row */}
          <div className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-start gap-6">
              {/* Cover Thumbnail */}
              <div className="w-20 h-28 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 relative">
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Metadata */}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-medium text-slate-900 mb-1 tracking-tight book-title">{book.title}</h2>
                <p className="text-slate-600 mb-3 font-normal">{book.subtitle}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <User className="w-4 h-4" />
                    <span>{book.author}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <BookOpen className="w-4 h-4" />
                    <span>{book.genre}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <FileText className="w-4 h-4" />
                    <span className="tabular-nums">{book.chapters.length}</span> {t('book.chapters')}
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600 line-clamp-2 font-normal leading-relaxed">{book.description}</p>
              </div>
            </div>
          </div>

          {/* Content Split: Navigation (1/3) + Page Content (2/3) */}
          <div className="flex-1 flex">
            {/* Chapter/Page Navigation */}
            <div className="w-1/3 bg-white border-l border-slate-200 overflow-y-auto">
              <div className="p-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm tracking-tight">{t('book.tableOfContents')}</h3>
              </div>
              <nav className="p-2">
                {book.chapters.map((chapter) => (
                  <div key={chapter.id} className="mb-1">
                    {/* Chapter Header */}
                    <button
                      onClick={() => toggleChapter(chapter.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-right transition-colors ${
                        selectedChapterId === chapter.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          expandedChapters.has(chapter.id) ? '' : '-rotate-90'
                        }`}
                      />
                      <span className="font-semibold text-sm flex-1 chapter-title">{chapter.title}</span>
                      <span className="text-xs text-slate-400 tabular-nums font-medium">{chapter.pages.length}</span>
                    </button>

                    {/* Pages List */}
                    {expandedChapters.has(chapter.id) && (
                      <div className="mr-6 mt-1 space-y-1">
                        {chapter.pages.map((page) => (
                          <button
                            key={page.id}
                            onClick={() => selectPage(chapter.id, page.id)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-right transition-colors ${
                              selectedPageId === page.id
                                ? 'bg-blue-100 text-blue-800'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {page.type === 'image' ? (
                              <ImageIcon className="w-3.5 h-3.5 flex-shrink-0" />
                            ) : (
                              <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                            )}
                            <span className="text-sm truncate">{page.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Page Content */}
            <div className="flex-1 bg-slate-50 overflow-y-auto">
              {currentPage ? (
                <div className="p-8">
                  <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-3xl mx-auto">
                    {/* Page Title with Voice Over Button */}
                    <div className="flex items-start justify-between mb-6">
                      <h3 className="text-2xl font-medium text-slate-900 tracking-tight book-title">
                        {currentPage.title}
                      </h3>
                      <button
                        onClick={handleVoiceOver}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          isPlaying
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {isPlaying ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm font-medium">{t('book.reading')}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-4 h-4" />
                            <span className="text-sm font-medium">{t('book.voiceOver')}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Page Image (if type is image) */}
                    {currentPage.type === 'image' && currentPage.imageUrl && (
                      <div className="mb-6 rounded-lg overflow-hidden bg-slate-100 relative aspect-video">
                        <Image
                          src={currentPage.imageUrl}
                          alt={currentPage.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Page Content */}
                    <div className="page-content text-slate-700 whitespace-pre-wrap">
                      {currentPage.content.split('\n\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>{t('book.selectPage')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Area (1/3) */}
        <div className="w-1/3 border-r border-slate-200 bg-white flex flex-col">
          <ChatAssistant
            bookId={book.id}
            initialMessages={book.chatMessages}
            bookContext={{
              title: book.title,
              genre: book.genre,
              currentChapter: book.chapters.find(c => c.id === selectedChapterId)?.title,
              currentPage: currentPage?.title
            }}
            hasPageSelected={!!selectedPageId}
          />
        </div>
      </div>
    </div>
  );
}
