import Link from 'next/link';
import {
  BookOpen,
  ArrowLeft,
  Code2,
  Layers,
  Settings,
  Lightbulb,
  Wrench,
  Rocket
} from 'lucide-react';
import { getTechGuides } from '@/lib/data';
import { getLocale } from 'next-intl/server';
import type { TechGuide } from '@/types';
import type { Locale } from '@/i18n/config';

const categoryIcons: Record<TechGuide['category'], React.ElementType> = {
  architecture: Layers,
  'tech-stack': Code2,
  setup: Settings,
  concepts: Lightbulb,
  tools: Wrench,
  roadmap: Rocket,
};

const categoryLabelsHe: Record<TechGuide['category'], string> = {
  architecture: 'ארכיטקטורה',
  'tech-stack': 'Tech Stack',
  setup: 'התקנה',
  concepts: 'קונספטים',
  tools: 'כלים',
  roadmap: 'Roadmap',
};

const categoryLabelsEn: Record<TechGuide['category'], string> = {
  architecture: 'Architecture',
  'tech-stack': 'Tech Stack',
  setup: 'Setup',
  concepts: 'Concepts',
  tools: 'Tools',
  roadmap: 'Roadmap',
};

const categoryColors: Record<TechGuide['category'], string> = {
  architecture: 'bg-blue-100 text-blue-700',
  'tech-stack': 'bg-purple-100 text-purple-700',
  setup: 'bg-green-100 text-green-700',
  concepts: 'bg-amber-100 text-amber-700',
  tools: 'bg-slate-100 text-slate-700',
  roadmap: 'bg-rose-100 text-rose-700',
};

export default async function GuidesPage() {
  const locale = await getLocale() as Locale;
  const guides = getTechGuides(locale);
  const categoryLabels = locale === 'en' ? categoryLabelsEn : categoryLabelsHe;

  // Group by category
  const groupedGuides = guides.reduce((acc, guide) => {
    if (!acc[guide.category]) {
      acc[guide.category] = [];
    }
    acc[guide.category].push(guide);
    return acc;
  }, {} as Record<string, TechGuide[]>);

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-green-600 mb-2">
          <BookOpen className="w-5 h-5" />
          <span className="text-sm font-medium">
            {locale === 'en' ? 'Guides' : 'מדריכים'}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
          {locale === 'en' ? 'Technical Guides' : 'מדריכים טכניים'}
        </h1>
        <p className="text-slate-600">
          {locale === 'en'
            ? 'Learn the basics of the project, the Tech Stack, and key concepts in AI development.'
            : 'למד את הבסיס של הפרויקט, ה-Tech Stack, וקונספטים מרכזיים בפיתוח עם AI.'}
        </p>
      </div>

      {/* All Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {guides.map((guide) => {
          const CategoryIcon = categoryIcons[guide.category];

          return (
            <Link
              key={guide.id}
              href={`/academy/guides/${guide.slug}`}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CategoryIcon className="w-5 h-5 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 mb-1">{guide.title}</h3>
                  <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                    {guide.description}
                  </p>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${categoryColors[guide.category]}`}>
                    {categoryLabels[guide.category]}
                  </span>
                </div>
                <ArrowLeft className="w-5 h-5 text-slate-400 flex-shrink-0" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Categories Overview */}
      <div className="bg-slate-50 rounded-xl p-6">
        <h2 className="font-bold text-slate-900 mb-4">
          {locale === 'en' ? 'Categories' : 'קטגוריות'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {Object.entries(categoryLabels).map(([key, label]) => {
            const Icon = categoryIcons[key as TechGuide['category']];
            const count = groupedGuides[key]?.length || 0;

            return (
              <div
                key={key}
                className="bg-white rounded-lg p-3 border border-slate-200 text-center"
              >
                <Icon className="w-5 h-5 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700">{label}</p>
                <p className="text-xs text-slate-500">
                  {count} {locale === 'en' ? 'guides' : 'מדריכים'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
