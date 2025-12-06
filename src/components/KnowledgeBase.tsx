'use client';

import { useState } from 'react';
import {
  X,
  Plus,
  Search,
  BookOpen,
  MapPin,
  Users,
  Globe,
  FileText,
  StickyNote,
  Tag,
  ChevronDown,
  Pencil,
  Trash2
} from 'lucide-react';
import { KnowledgeItem, Character } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  knowledgeItems: KnowledgeItem[];
  characters: Character[];
  bookTitle: string;
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

export default function KnowledgeBase({ isOpen, onClose, knowledgeItems, characters, bookTitle }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'knowledge' | 'characters'>('knowledge');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = item.title.includes(searchQuery) ||
                         item.content.includes(searchQuery) ||
                         item.tags.some(tag => tag.includes(searchQuery));
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredCharacters = characters.filter(char => {
    return char.name.includes(searchQuery) || char.description.includes(searchQuery);
  });

  const categories = ['character', 'location', 'plot', 'world', 'reference', 'notes'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">בסיס ידע</h2>
            <p className="text-sm text-slate-500">{bookTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 py-3 border-b border-slate-100 flex gap-4">
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'knowledge'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              מידע וידע ({knowledgeItems.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('characters')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'characters'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              דמויות ({characters.length})
            </span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="px-6 py-4 border-b border-slate-100 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="חפש בבסיס הידע..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Category Filters (only for knowledge tab) */}
          {activeTab === 'knowledge' && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  !selectedCategory
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                הכל
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    selectedCategory === cat
                      ? 'bg-blue-500 text-white'
                      : `${categoryColors[cat]} hover:opacity-80`
                  }`}
                >
                  {categoryIcons[cat]}
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'knowledge' ? (
            <div className="space-y-3">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>לא נמצאו פריטים</p>
                </div>
              ) : (
                filteredItems.map(item => (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-colors"
                  >
                    <button
                      onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                      className="w-full px-4 py-3 flex items-center gap-3 text-right"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${categoryColors[item.category]}`}>
                        {categoryIcons[item.category]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 truncate">{item.title}</h4>
                        <p className="text-xs text-slate-500">
                          {categoryLabels[item.category]} • {item.tags.slice(0, 3).join(', ')}
                        </p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedItem === item.id ? 'rotate-180' : ''}`} />
                    </button>

                    {expandedItem === item.id && (
                      <div className="px-4 pb-4 pt-2 border-t border-slate-100">
                        <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                          {item.content}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {item.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg flex items-center gap-1.5 transition-colors">
                            <Pencil className="w-3 h-3" />
                            ערוך
                          </button>
                          <button className="px-3 py-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center gap-1.5 transition-colors">
                            <Trash2 className="w-3 h-3" />
                            מחק
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCharacters.length === 0 ? (
                <div className="col-span-2 text-center py-12 text-slate-400">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>לא נמצאו דמויות</p>
                </div>
              ) : (
                filteredCharacters.map(char => (
                  <div
                    key={char.id}
                    className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex gap-4">
                      {/* Avatar placeholder */}
                      <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold text-purple-600">
                          {char.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900">{char.name}</h4>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs mt-1 ${
                          char.role === 'protagonist' ? 'bg-blue-100 text-blue-700' :
                          char.role === 'antagonist' ? 'bg-red-100 text-red-700' :
                          char.role === 'supporting' ? 'bg-green-100 text-green-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {char.role === 'protagonist' ? 'גיבור ראשי' :
                           char.role === 'antagonist' ? 'אנטגוניסט' :
                           char.role === 'supporting' ? 'דמות תומכת' : 'דמות משנה'}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mt-3 line-clamp-2">
                      {char.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {char.traits.map(trait => (
                        <span key={trait} className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded text-xs">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            הוסף {activeTab === 'knowledge' ? 'פריט' : 'דמות'}
          </button>
          <p className="text-xs text-slate-400">
            {activeTab === 'knowledge'
              ? `${filteredItems.length} פריטים`
              : `${filteredCharacters.length} דמויות`
            }
          </p>
        </div>
      </div>
    </div>
  );
}
