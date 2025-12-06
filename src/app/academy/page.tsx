import Link from 'next/link';
import {
  Trophy,
  BookOpen,
  Wrench,
  ArrowLeft,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';
import { getChallenges, getTechGuides, getAIToolSetups, getTotalAvailablePoints } from '@/lib/data';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/config';

export default async function AcademyDashboard() {
  const locale = await getLocale() as Locale;
  const t = await getTranslations('academy');

  const challenges = getChallenges(locale);
  const guides = getTechGuides(locale);
  const tools = getAIToolSetups(locale);
  const totalPoints = getTotalAvailablePoints(locale);

  const beginnerChallenges = challenges.filter(c => c.difficulty === 'beginner');
  const intermediateChallenges = challenges.filter(c => c.difficulty === 'intermediate');
  const advancedChallenges = challenges.filter(c => c.difficulty === 'advanced');

  return (
    <div className="max-w-5xl">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-purple-500 mb-2">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-medium">
            {locale === 'en' ? 'Welcome to the Academy' : 'ברוכים הבאים לאקדמיה'}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
          {locale === 'en' ? 'Learn to Build AI Apps' : 'למד לבנות אפליקציות AI'}
        </h1>
        <p className="text-slate-600 max-w-2xl">
          {locale === 'en'
            ? 'The Academy will teach you to build applications with AI agents, work with Vercel AI SDK, and use smart coding tools like Claude Code and Cursor.'
            : 'האקדמיה תלמד אותך לבנות אפליקציות עם סוכני AI, לעבוד עם Vercel AI SDK, ולהשתמש בכלי קידוד חכמים כמו Claude Code ו-Cursor.'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{challenges.length}</p>
              <p className="text-sm text-slate-500">
                {locale === 'en' ? 'Challenges' : 'משימות'}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{totalPoints}</p>
              <p className="text-sm text-slate-500">
                {locale === 'en' ? 'Points Available' : 'נקודות זמינות'}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{guides.length}</p>
              <p className="text-sm text-slate-500">
                {locale === 'en' ? 'Guides' : 'מדריכים'}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{tools.length}</p>
              <p className="text-sm text-slate-500">
                {locale === 'en' ? 'AI Tools' : 'כלי AI'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">
              {locale === 'en' ? 'Ready to Start?' : 'מוכן להתחיל?'}
            </h2>
            <p className="text-purple-100 mb-4 max-w-lg">
              {locale === 'en'
                ? 'Start with the first challenge - editing book pages. This is a basic CRUD task that will help you get familiar with the project.'
                : 'התחל מהמשימה הראשונה - עריכת עמודים בספר. זו משימת CRUD בסיסית שתעזור לך להכיר את הפרויקט.'}
            </p>
            <Link
              href="/academy/challenges/ch-001"
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors"
            >
              <span>{locale === 'en' ? 'Start First Challenge' : 'התחל במשימה הראשונה'}</span>
              <ArrowLeft className={`w-4 h-4 ${locale === 'en' ? 'rotate-180' : ''}`} />
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">
              {locale === 'en' ? '50 points' : '50 נקודות'}
            </span>
          </div>
        </div>
      </div>

      {/* Challenges Overview */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            {locale === 'en' ? 'Challenges by Level' : 'משימות לפי רמה'}
          </h2>
          <Link
            href="/academy/challenges"
            className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
          >
            <span>{locale === 'en' ? 'All Challenges' : 'כל המשימות'}</span>
            <ArrowLeft className={`w-4 h-4 ${locale === 'en' ? 'rotate-180' : ''}`} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Beginner */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="font-medium text-slate-900">
                {locale === 'en' ? 'Beginner' : 'מתחיל'}
              </span>
              <span className="text-sm text-slate-500">
                ({beginnerChallenges.length} {locale === 'en' ? 'challenges' : 'משימות'})
              </span>
            </div>
            <div className="space-y-2">
              {beginnerChallenges.slice(0, 3).map((challenge) => (
                <Link
                  key={challenge.id}
                  href={`/academy/challenges/${challenge.id}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm text-slate-700">{challenge.title}</span>
                  <span className="text-xs text-purple-600 font-medium">
                    {challenge.points} {locale === 'en' ? 'pts' : 'נק׳'}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Intermediate */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full" />
              <span className="font-medium text-slate-900">
                {locale === 'en' ? 'Intermediate' : 'בינוני'}
              </span>
              <span className="text-sm text-slate-500">
                ({intermediateChallenges.length} {locale === 'en' ? 'challenges' : 'משימות'})
              </span>
            </div>
            <div className="space-y-2">
              {intermediateChallenges.slice(0, 3).map((challenge) => (
                <Link
                  key={challenge.id}
                  href={`/academy/challenges/${challenge.id}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm text-slate-700">{challenge.title}</span>
                  <span className="text-xs text-purple-600 font-medium">
                    {challenge.points} {locale === 'en' ? 'pts' : 'נק׳'}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Advanced */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="font-medium text-slate-900">
                {locale === 'en' ? 'Advanced' : 'מתקדם'}
              </span>
              <span className="text-sm text-slate-500">
                ({advancedChallenges.length} {locale === 'en' ? 'challenges' : 'משימות'})
              </span>
            </div>
            <div className="space-y-2">
              {advancedChallenges.slice(0, 3).map((challenge) => (
                <Link
                  key={challenge.id}
                  href={`/academy/challenges/${challenge.id}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm text-slate-700">{challenge.title}</span>
                  <span className="text-xs text-purple-600 font-medium">
                    {challenge.points} {locale === 'en' ? 'pts' : 'נק׳'}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Guides & Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Guides */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-slate-900">
                {locale === 'en' ? 'Technical Guides' : 'מדריכים טכניים'}
              </h3>
            </div>
            <Link
              href="/academy/guides"
              className="text-purple-600 hover:text-purple-700 text-sm"
            >
              {locale === 'en' ? 'All' : 'הכל'}
            </Link>
          </div>
          <div className="space-y-2">
            {guides.slice(0, 4).map((guide) => (
              <Link
                key={guide.id}
                href={`/academy/guides/${guide.slug}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <span className="text-sm text-slate-700">{guide.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-slate-900">
                {locale === 'en' ? 'Recommended AI Tools' : 'כלי AI מומלצים'}
              </h3>
            </div>
            <Link
              href="/academy/tools"
              className="text-purple-600 hover:text-purple-700 text-sm"
            >
              {locale === 'en' ? 'All' : 'הכל'}
            </Link>
          </div>
          <div className="space-y-2">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={`/academy/tools/${tool.slug}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-700">{tool.toolName}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
