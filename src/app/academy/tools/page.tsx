import Link from 'next/link';
import {
  Wrench,
  ArrowLeft,
  Sparkles,
  Terminal,
  Code2,
  Zap
} from 'lucide-react';
import { getAIToolSetups } from '@/lib/data';
import { getLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';

export default async function ToolsPage() {
  const locale = await getLocale() as Locale;
  const tools = getAIToolSetups(locale);

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-amber-600 mb-2">
          <Wrench className="w-5 h-5" />
          <span className="text-sm font-medium">
            {locale === 'en' ? 'AI Tools' : 'כלי AI'}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
          {locale === 'en' ? 'Smart Coding Tools' : 'כלי קידוד חכמים'}
        </h1>
        <p className="text-slate-600">
          {locale === 'en'
            ? 'Learn to use AI tools that will help you write code faster and develop more efficiently. All tools are recommended for Vibe Coding.'
            : 'למד להשתמש בכלי AI שיעזרו לך לכתוב קוד מהר יותר ולפתח בצורה יעילה יותר. כל הכלים מומלצים ל-Vibe Coding.'}
        </p>
      </div>

      {/* Intro Card */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              {locale === 'en' ? 'What is Vibe Coding?' : 'מה זה Vibe Coding?'}
            </h2>
            <p className="text-slate-600 mb-3">
              {locale === 'en'
                ? 'Vibe Coding is a development style where you use AI tools to write code. Instead of writing every line manually, you describe what you want and the AI helps you implement it.'
                : 'Vibe Coding הוא סגנון פיתוח שבו משתמשים בכלי AI כדי לכתוב קוד. במקום לכתוב כל שורה ידנית, אתה מתאר מה אתה רוצה וה-AI עוזר לך ליישם את זה.'}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-amber-700">
                <Zap className="w-4 h-4" />
                {locale === 'en' ? 'Faster' : 'מהיר יותר'}
              </span>
              <span className="flex items-center gap-1.5 text-amber-700">
                <Code2 className="w-4 h-4" />
                {locale === 'en' ? 'Fewer bugs' : 'פחות באגים'}
              </span>
              <span className="flex items-center gap-1.5 text-amber-700">
                <Terminal className="w-4 h-4" />
                {locale === 'en' ? 'More fun' : 'יותר כיף'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="space-y-4">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={`/academy/tools/${tool.slug}`}
            className="block bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md hover:border-slate-300 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Terminal className="w-7 h-7 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{tool.toolName}</h3>
                <p className="text-slate-600 mb-4">
                  {tool.description}
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-500">
                    {tool.setupSteps.length} {locale === 'en' ? 'setup steps' : 'שלבי התקנה'}
                  </span>
                  <span className="text-sm text-slate-500">
                    {tool.usageTips.length} {locale === 'en' ? 'tips' : 'טיפים'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ArrowLeft className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* More Tools Coming */}
      <div className="mt-8 bg-slate-50 rounded-xl p-6 text-center">
        <p className="text-slate-500">
          {locale === 'en'
            ? 'More tools coming soon: Gemini CLI, Windsurf, Bolt, v0...'
            : 'עוד כלים בקרוב: Gemini CLI, Windsurf, Bolt, v0...'}
        </p>
      </div>
    </div>
  );
}
