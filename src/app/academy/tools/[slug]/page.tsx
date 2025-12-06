import Link from 'next/link';
import {
  ArrowRight,
  Wrench,
  ExternalLink,
  CheckCircle,
  Lightbulb,
  Terminal
} from 'lucide-react';
import { getAIToolSetup, getAIToolSetups } from '@/lib/data';
import { getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Locale } from '@/i18n/config';

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale() as Locale;
  const tool = getAIToolSetup(slug, locale);
  const allTools = getAIToolSetups(locale);

  if (!tool) {
    notFound();
  }

  const currentIndex = allTools.findIndex(t => t.slug === tool.slug);
  const prevTool = currentIndex > 0 ? allTools[currentIndex - 1] : null;
  const nextTool = currentIndex < allTools.length - 1 ? allTools[currentIndex + 1] : null;

  const isRtl = locale === 'he';

  return (
    <div className="max-w-3xl">
      {/* Back Link */}
      <Link
        href="/academy/tools"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-6"
      >
        <ArrowRight className={`w-4 h-4 ${!isRtl ? 'rotate-180' : ''}`} />
        <span>{locale === 'en' ? 'Back to AI Tools' : 'חזרה לכלי AI'}</span>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-xs font-medium">
            <Wrench className="w-3.5 h-3.5" />
            {locale === 'en' ? 'AI Tool' : 'כלי AI'}
          </span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
              {tool.toolName}
            </h1>
            <p className="text-slate-600 text-lg">
              {tool.description}
            </p>
          </div>
          <a
            href={tool.officialDocs}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{locale === 'en' ? 'Documentation' : 'דוקומנטציה'}</span>
          </a>
        </div>
      </div>

      {/* Setup Steps */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-purple-600" />
          {locale === 'en' ? 'Setup Steps' : 'שלבי התקנה'}
        </h2>
        <div className="space-y-6">
          {tool.setupSteps.map((step) => (
            <div key={step.order} className="relative">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-purple-600">{step.order}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600 mb-3">{step.instructions}</p>
                  {step.codeSnippet && (
                    <div className="relative">
                      <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg overflow-x-auto text-sm text-left" dir="ltr">
                        <code>{step.codeSnippet}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Config */}
      {tool.recommendedConfig && (
        <div className="bg-slate-900 rounded-xl p-6 mb-6">
          <h2 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            {locale === 'en' ? 'Recommended Settings' : 'הגדרות מומלצות'}
          </h2>
          <pre className="text-sm text-slate-300 overflow-x-auto whitespace-pre-wrap text-left" dir="ltr">
            <code>{tool.recommendedConfig}</code>
          </pre>
        </div>
      )}

      {/* Usage Tips */}
      <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 mb-8">
        <h2 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          {locale === 'en' ? 'Usage Tips' : 'טיפים לשימוש'}
        </h2>
        <ul className="space-y-3">
          {tool.usageTips.map((tip, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <span className="text-slate-700">{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        {prevTool ? (
          <Link
            href={`/academy/tools/${prevTool.slug}`}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowRight className={`w-4 h-4 ${!isRtl ? 'rotate-180' : ''}`} />
            <span>{prevTool.toolName}</span>
          </Link>
        ) : (
          <div />
        )}
        {nextTool && (
          <Link
            href={`/academy/tools/${nextTool.slug}`}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            <span>{locale === 'en' ? `Next: ${nextTool.toolName}` : `הבא: ${nextTool.toolName}`}</span>
          </Link>
        )}
      </div>
    </div>
  );
}
