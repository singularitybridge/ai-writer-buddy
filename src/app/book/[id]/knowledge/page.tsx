'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import type { Locale } from '@/i18n/config';
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  ChevronDown,
  Database,
  FileText,
  FolderOpen,
  Globe,
  MapPin,
  PenLine,
  Plus,
  Save,
  Settings,
  StickyNote,
  Trash2,
  User,
  Users
} from 'lucide-react';
import ChatAssistant from '@/components/ChatAssistant';
import { Book, KnowledgeItem, Character, ChatMessage } from '@/types';

interface BookWithDetails extends Book {
  knowledgeItems: KnowledgeItem[];
  characters: Character[];
  chatMessages: ChatMessage[];
}

interface Props {
  params: Promise<{ id: string }>;
}

const categoryIcons: Record<string, React.ReactNode> = {
  character: <Users className="w-4 h-4" />,
  location: <MapPin className="w-4 h-4" />,
  plot: <BookOpen className="w-4 h-4" />,
  world: <Globe className="w-4 h-4" />,
  reference: <FileText className="w-4 h-4" />,
  notes: <StickyNote className="w-4 h-4" />
};

const categoryLabels: Record<string, string> = {
  character: 'דמויות',
  location: 'מיקומים',
  plot: 'עלילה',
  world: 'עולם',
  reference: 'מקורות',
  notes: 'הערות'
};

const categoryColors: Record<string, string> = {
  character: 'bg-purple-100 text-purple-700',
  location: 'bg-green-100 text-green-700',
  plot: 'bg-blue-100 text-blue-700',
  world: 'bg-amber-100 text-amber-700',
  reference: 'bg-slate-100 text-slate-700',
  notes: 'bg-pink-100 text-pink-700'
};

const roleLabels: Record<string, string> = {
  protagonist: 'גיבור ראשי',
  antagonist: 'אנטגוניסט',
  supporting: 'דמות תומכת',
  minor: 'דמות משנה'
};

const roleColors: Record<string, string> = {
  protagonist: 'bg-blue-100 text-blue-700',
  antagonist: 'bg-red-100 text-red-700',
  supporting: 'bg-green-100 text-green-700',
  minor: 'bg-slate-100 text-slate-700'
};

type ItemType = 'knowledge' | 'character';
type SelectedItem = { type: ItemType; id: string } | null;

export default function KnowledgeBasePage({ params }: Props) {
  const [book, setBook] = useState<BookWithDetails | null>(null);
  const [bookId, setBookId] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['characters', 'character', 'location', 'plot', 'world', 'reference', 'notes']));
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const isRTL = locale === 'he';
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  // Editing states
  const [editingTitle, setEditingTitle] = useState('');
  const [editingContent, setEditingContent] = useState('');
  const [editingTags, setEditingTags] = useState<string[]>([]);
  const [editingCategory, setEditingCategory] = useState<string>('notes');

  // Character editing states
  const [editingName, setEditingName] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [editingRole, setEditingRole] = useState<string>('minor');
  const [editingTraits, setEditingTraits] = useState<string[]>([]);
  const [editingBackstory, setEditingBackstory] = useState('');

  useEffect(() => {
    params.then(p => setBookId(p.id));
  }, [params]);

  useEffect(() => {
    if (!bookId) return;

    fetch(`/api/book/${bookId}`)
      .then(res => res.json())
      .then(data => {
        setBook(data);
      })
      .catch(err => console.error('Error fetching book:', err));
  }, [bookId]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const selectKnowledgeItem = (item: KnowledgeItem) => {
    setSelectedItem({ type: 'knowledge', id: item.id });
    setEditingTitle(item.title);
    setEditingContent(item.content);
    setEditingTags(item.tags);
    setEditingCategory(item.category);
  };

  const selectCharacter = (character: Character) => {
    setSelectedItem({ type: 'character', id: character.id });
    setEditingName(character.name);
    setEditingDescription(character.description);
    setEditingRole(character.role);
    setEditingTraits(character.traits);
    setEditingBackstory(character.backstory);
  };

  const getSelectedKnowledgeItem = (): KnowledgeItem | null => {
    if (!book || selectedItem?.type !== 'knowledge') return null;
    return book.knowledgeItems.find(item => item.id === selectedItem.id) || null;
  };

  const getSelectedCharacter = (): Character | null => {
    if (!book || selectedItem?.type !== 'character') return null;
    return book.characters.find(char => char.id === selectedItem.id) || null;
  };

  const getItemsByCategory = (category: string): KnowledgeItem[] => {
    if (!book) return [];
    return book.knowledgeItems.filter(item => item.category === category);
  };

  const categories = ['location', 'plot', 'world', 'reference', 'notes'];

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-500">{t('common.loading')}</div>
      </div>
    );
  }

  const currentKnowledgeItem = getSelectedKnowledgeItem();
  const currentCharacter = getSelectedCharacter();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/book/${bookId}`}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
              >
                <BackArrow className="w-4 h-4" />
                <span className="text-sm font-medium">{t('knowledge.backToBook')}</span>
              </Link>
              <div className="h-6 w-px bg-slate-200" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Database className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-slate-900 tracking-tight">{t('book.knowledgeBase')}</h1>
                  <p className="text-xs text-slate-500 font-normal">{book.title}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher currentLocale={locale} />
              <div className="h-6 w-px bg-slate-200" />
              <button className="flex items-center gap-2 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm font-medium">
                <Plus className="w-4 h-4" />
                <span>{t('knowledge.newItem')}</span>
              </button>
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
          {/* Book Info Row */}
          <div className="bg-white border-b border-slate-200 px-6 py-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-slate-600">
                <FolderOpen className="w-4 h-4" />
                <span className="text-sm font-medium">{book.knowledgeItems.length} פריטי ידע</span>
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-2 text-slate-600">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">{book.characters.length} דמויות</span>
              </div>
            </div>
          </div>

          {/* Content Split: Navigation (1/3) + Editor (2/3) */}
          <div className="flex-1 flex">
            {/* Knowledge/Character Navigation */}
            <div className="w-1/3 bg-white border-l border-slate-200 overflow-y-auto">
              {/* Characters Section */}
              <div className="border-b border-slate-100">
                <button
                  onClick={() => toggleCategory('characters')}
                  className="w-full flex items-center gap-2 px-4 py-3 text-right hover:bg-slate-50 transition-colors"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform text-slate-400 ${
                      expandedCategories.has('characters') ? '' : '-rotate-90'
                    }`}
                  />
                  <Users className="w-4 h-4 text-purple-500" />
                  <span className="font-bold text-sm text-slate-900 flex-1">דמויות</span>
                  <span className="text-xs text-slate-400 tabular-nums font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                    {book.characters.length}
                  </span>
                </button>

                {expandedCategories.has('characters') && (
                  <div className="pb-2">
                    {book.characters.map(character => (
                      <button
                        key={character.id}
                        onClick={() => selectCharacter(character)}
                        className={`w-full flex items-center gap-3 px-4 py-2 mr-4 text-right transition-colors ${
                          selectedItem?.type === 'character' && selectedItem.id === character.id
                            ? 'bg-purple-100 text-purple-800'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-purple-600">
                            {character.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{character.name}</p>
                          <p className="text-xs text-slate-400">{roleLabels[character.role]}</p>
                        </div>
                      </button>
                    ))}
                    <button className="w-full flex items-center gap-2 px-4 py-2 mr-4 text-purple-500 hover:bg-purple-50 transition-colors text-sm">
                      <Plus className="w-4 h-4" />
                      <span>הוסף דמות</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Knowledge Categories */}
              {categories.map(category => {
                const items = getItemsByCategory(category);
                return (
                  <div key={category} className="border-b border-slate-100">
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center gap-2 px-4 py-3 text-right hover:bg-slate-50 transition-colors"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform text-slate-400 ${
                          expandedCategories.has(category) ? '' : '-rotate-90'
                        }`}
                      />
                      <span className={`w-6 h-6 rounded flex items-center justify-center ${categoryColors[category]}`}>
                        {categoryIcons[category]}
                      </span>
                      <span className="font-semibold text-sm text-slate-900 flex-1">{categoryLabels[category]}</span>
                      <span className="text-xs text-slate-400 tabular-nums font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                        {items.length}
                      </span>
                    </button>

                    {expandedCategories.has(category) && items.length > 0 && (
                      <div className="pb-2">
                        {items.map(item => (
                          <button
                            key={item.id}
                            onClick={() => selectKnowledgeItem(item)}
                            className={`w-full flex items-center gap-2 px-4 py-2 mr-6 text-right transition-colors ${
                              selectedItem?.type === 'knowledge' && selectedItem.id === item.id
                                ? 'bg-blue-100 text-blue-800'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="text-sm truncate">{item.title}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {expandedCategories.has(category) && (
                      <button className="w-full flex items-center gap-2 px-4 py-2 mr-6 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors text-sm">
                        <Plus className="w-3.5 h-3.5" />
                        <span>הוסף פריט</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Editor Area */}
            <div className="flex-1 bg-slate-50 overflow-y-auto">
              {selectedItem ? (
                <div className="p-6">
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden max-w-3xl mx-auto">
                    {/* Editor Header */}
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {selectedItem.type === 'character' ? (
                          <>
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <span className="text-lg font-bold text-purple-600">
                                {editingName.charAt(0) || 'ד'}
                              </span>
                            </div>
                            <div>
                              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${roleColors[editingRole]}`}>
                                {roleLabels[editingRole]}
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${categoryColors[editingCategory]}`}>
                              {categoryIcons[editingCategory]}
                            </div>
                            <span className="text-sm font-medium text-slate-600">
                              {categoryLabels[editingCategory]}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors">
                          <Save className="w-4 h-4" />
                          <span>שמור</span>
                        </button>
                        <button className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Editor Content */}
                    <div className="p-6 space-y-6">
                      {selectedItem.type === 'character' ? (
                        <>
                          {/* Character Name */}
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">שם הדמות</label>
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-lg font-bold focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                              placeholder="שם הדמות..."
                            />
                          </div>

                          {/* Character Role */}
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">תפקיד</label>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(roleLabels).map(([role, label]) => (
                                <button
                                  key={role}
                                  onClick={() => setEditingRole(role)}
                                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    editingRole === role
                                      ? roleColors[role]
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Character Description */}
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">תיאור</label>
                            <textarea
                              value={editingDescription}
                              onChange={(e) => setEditingDescription(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 min-h-[100px] resize-none"
                              placeholder="תיאור קצר של הדמות..."
                            />
                          </div>

                          {/* Character Traits */}
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">תכונות אופי</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {editingTraits.map((trait, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1"
                                >
                                  {trait}
                                  <button
                                    onClick={() => setEditingTraits(editingTraits.filter((_, i) => i !== index))}
                                    className="hover:text-purple-900"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                            <input
                              type="text"
                              placeholder="הוסף תכונה והקש Enter..."
                              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-400"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                  setEditingTraits([...editingTraits, e.currentTarget.value.trim()]);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                          </div>

                          {/* Character Backstory */}
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">רקע וסיפור</label>
                            <textarea
                              value={editingBackstory}
                              onChange={(e) => setEditingBackstory(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 min-h-[200px] resize-none font-serif leading-relaxed"
                              placeholder="הרקע והסיפור של הדמות..."
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Knowledge Item Title */}
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">כותרת</label>
                            <input
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-lg font-bold focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                              placeholder="כותרת הפריט..."
                            />
                          </div>

                          {/* Category */}
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">קטגוריה</label>
                            <div className="flex flex-wrap gap-2">
                              {categories.map(cat => (
                                <button
                                  key={cat}
                                  onClick={() => setEditingCategory(cat)}
                                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                                    editingCategory === cat
                                      ? categoryColors[cat]
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {categoryIcons[cat]}
                                  {categoryLabels[cat]}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Content */}
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">תוכן</label>
                            <textarea
                              value={editingContent}
                              onChange={(e) => setEditingContent(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 min-h-[300px] resize-none font-serif leading-relaxed"
                              placeholder="תוכן הפריט..."
                            />
                          </div>

                          {/* Tags */}
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">תגיות</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {editingTags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-sm flex items-center gap-1"
                                >
                                  {tag}
                                  <button
                                    onClick={() => setEditingTags(editingTags.filter((_, i) => i !== index))}
                                    className="hover:text-slate-900"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                            <input
                              type="text"
                              placeholder="הוסף תגית והקש Enter..."
                              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                  setEditingTags([...editingTags, e.currentTarget.value.trim()]);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">בחר פריט לעריכה</p>
                    <p className="text-sm mt-1">בחר דמות או פריט ידע מהרשימה</p>
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
              currentChapter: 'בסיס ידע',
              currentPage: selectedItem?.type === 'character'
                ? `דמות: ${editingName}`
                : selectedItem?.type === 'knowledge'
                  ? `פריט: ${editingTitle}`
                  : undefined
            }}
            hasPageSelected={false}
          />
        </div>
      </div>
    </div>
  );
}
