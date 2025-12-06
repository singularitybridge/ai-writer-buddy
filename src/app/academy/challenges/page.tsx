import Link from 'next/link';
import {
  Trophy,
  ArrowLeft,
  Zap,
  Code2,
  Mic,
  Star,
  Globe,
  Database,
  Bot
} from 'lucide-react';
import { getChallenges, getTotalAvailablePoints } from '@/lib/data';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Challenge } from '@/types';
import type { Locale } from '@/i18n/config';

const categoryIcons: Record<Challenge['category'], React.ElementType> = {
  crud: Database,
  ai: Bot,
  voice: Mic,
  review: Star,
  i18n: Globe,
};

const categoryLabelsHe: Record<Challenge['category'], string> = {
  crud: 'CRUD',
  ai: 'AI Agent',
  voice: 'Voice',
  review: 'Review',
  i18n: 'Translation',
};

const categoryLabelsEn: Record<Challenge['category'], string> = {
  crud: 'CRUD',
  ai: 'AI Agent',
  voice: 'Voice',
  review: 'Review',
  i18n: 'Translation',
};

const difficultyColors: Record<Challenge['difficulty'], string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-red-100 text-red-700',
};

export default async function ChallengesPage() {
  const locale = await getLocale() as Locale;
  const t = await getTranslations('challenges');
  const challenges = getChallenges(locale);
  const totalPoints = getTotalAvailablePoints(locale);
  const categoryLabels = locale === 'en' ? categoryLabelsEn : categoryLabelsHe;

  const difficultyLabels: Record<Challenge['difficulty'], string> = {
    beginner: t('difficulty.beginner'),
    intermediate: t('difficulty.intermediate'),
    advanced: t('difficulty.advanced'),
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-purple-500 mb-2">
          <Trophy className="w-5 h-5" />
          <span className="text-sm font-medium">{t('title')}</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
          {locale === 'en' ? '7 Challenges for Full Mastery' : '7 משימות לשליטה מלאה'}
        </h1>
        <p className="text-slate-600">
          {locale === 'en'
            ? `Complete the challenges in order to build the project step by step. Total ${totalPoints} points available.`
            : `השלם את המשימות לפי הסדר כדי לבנות את הפרויקט צעד אחרי צעד. סה״כ ${totalPoints} נקודות זמינות.`}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-3xl font-bold text-slate-900">{challenges.length}</p>
          <p className="text-sm text-slate-500">{t('title')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{totalPoints}</p>
          <p className="text-sm text-slate-500">{locale === 'en' ? 'Points' : 'נקודות'}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-3xl font-bold text-green-600">0</p>
          <p className="text-sm text-slate-500">{locale === 'en' ? 'Completed' : 'הושלמו'}</p>
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-4">
        {challenges.map((challenge, index) => {
          const CategoryIcon = categoryIcons[challenge.category];

          return (
            <Link
              key={challenge.id}
              href={`/academy/challenges/${challenge.id}`}
              className="block bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Number */}
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-slate-600">{index + 1}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 text-lg">{challenge.title}</h3>
                  </div>
                  <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                    {challenge.description}
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[challenge.difficulty]}`}>
                      {difficultyLabels[challenge.difficulty]}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <CategoryIcon className="w-3.5 h-3.5" />
                      {categoryLabels[challenge.category]}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Code2 className="w-3.5 h-3.5" />
                      {challenge.techStack.slice(0, 2).join(', ')}
                    </span>
                  </div>
                </div>

                {/* Points & Arrow */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg">
                    <Zap className="w-4 h-4" />
                    <span className="font-bold">{challenge.points}</span>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
