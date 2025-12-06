import Link from 'next/link';
import {
  ArrowRight,
  Zap,
  CheckCircle,
  ExternalLink,
  Code2,
  Play,
  BookOpen
} from 'lucide-react';
import { getChallenge, getChallenges } from '@/lib/data';
import { getLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Challenge } from '@/types';
import type { Locale } from '@/i18n/config';

const difficultyColors: Record<Challenge['difficulty'], string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-red-100 text-red-700',
};

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale() as Locale;
  const t = await getTranslations('challenges');

  const challenge = getChallenge(id, locale);
  const allChallenges = getChallenges(locale);

  if (!challenge) {
    notFound();
  }

  const currentIndex = allChallenges.findIndex(c => c.id === challenge.id);
  const prevChallenge = currentIndex > 0 ? allChallenges[currentIndex - 1] : null;
  const nextChallenge = currentIndex < allChallenges.length - 1 ? allChallenges[currentIndex + 1] : null;

  const difficultyLabels: Record<Challenge['difficulty'], string> = {
    beginner: t('difficulty.beginner'),
    intermediate: t('difficulty.intermediate'),
    advanced: t('difficulty.advanced'),
  };

  const isRtl = locale === 'he';

  return (
    <div className="max-w-3xl">
      {/* Back Link */}
      <Link
        href="/academy/challenges"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-6"
      >
        <ArrowRight className={`w-4 h-4 ${!isRtl ? 'rotate-180' : ''}`} />
        <span>{locale === 'en' ? 'Back to Challenges' : 'חזרה למשימות'}</span>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${difficultyColors[challenge.difficulty]}`}>
            {difficultyLabels[challenge.difficulty]}
          </span>
          <span className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full text-xs font-medium">
            <Zap className="w-3.5 h-3.5" />
            {challenge.points} {locale === 'en' ? 'points' : 'נקודות'}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
          {challenge.title}
        </h1>
        <p className="text-slate-600 text-lg">
          {challenge.description}
        </p>
      </div>

      {/* Tech Stack */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        {challenge.techStack.map((tech) => (
          <span
            key={tech}
            className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm"
          >
            <Code2 className="w-3.5 h-3.5" />
            {tech}
          </span>
        ))}
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Play className="w-5 h-5 text-purple-600" />
          {locale === 'en' ? 'Instructions' : 'הוראות'}
        </h2>
        <div
          className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatInstructions(challenge.instructions, isRtl) }}
        />
      </div>

      {/* Success Criteria */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          {locale === 'en' ? 'Success Criteria' : 'קריטריונים להצלחה'}
        </h2>
        <ul className="space-y-3">
          {challenge.successCriteria.map((criteria, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 mt-0.5" />
              <span className="text-slate-700">{criteria}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Code Example */}
      {challenge.codeExample && (
        <div className="bg-slate-900 rounded-xl p-6 mb-6">
          <h2 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            {locale === 'en' ? 'Code Example' : 'דוגמת קוד'}
          </h2>
          <pre className="text-sm text-slate-300 overflow-x-auto" dir="ltr">
            <code>{challenge.codeExample}</code>
          </pre>
        </div>
      )}

      {/* Resources */}
      {challenge.resources.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            {locale === 'en' ? 'Resources' : 'משאבים'}
          </h2>
          <div className="space-y-2">
            {challenge.resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700">{resource.title}</span>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  {resource.type}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        {prevChallenge ? (
          <Link
            href={`/academy/challenges/${prevChallenge.id}`}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowRight className={`w-4 h-4 ${!isRtl ? 'rotate-180' : ''}`} />
            <span>{prevChallenge.title}</span>
          </Link>
        ) : (
          <div />
        )}
        {nextChallenge && (
          <Link
            href={`/academy/challenges/${nextChallenge.id}`}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            <span>{locale === 'en' ? `Next: ${nextChallenge.title}` : `המשימה הבאה: ${nextChallenge.title}`}</span>
          </Link>
        )}
      </div>
    </div>
  );
}

function formatInstructions(content: string, isRtl: boolean): string {
  const marginClass = isRtl ? 'mr-4' : 'ml-4';
  const listMarginClass = isRtl ? 'mr-6' : 'ml-6';

  // Convert markdown-like syntax to HTML
  let html = content
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-slate-900 mt-6 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-slate-900 mt-8 mb-4">$1</h2>')
    // Code blocks - LTR with better contrast
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre class="bg-slate-800 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm my-4 font-mono" dir="ltr" style="text-align: left;"><code>${escapeHtml(code.trim())}</code></pre>`;
    })
    // Inline code - better contrast
    .replace(/`([^`]+)`/g, '<code class="bg-slate-200 text-slate-900 px-1.5 py-0.5 rounded text-sm font-mono" dir="ltr">$1</code>')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Numbered lists (handle "1. text" format)
    .replace(/^(\d+)\. (.+)$/gm, `<li class="${marginClass}" value="$1">$2</li>`)
    // Unordered lists
    .replace(/^- (.+)$/gm, `<li class="${marginClass} list-disc">$1</li>`)
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="mb-4 text-slate-700 leading-relaxed">')
    ;

  // Wrap numbered list items in ol
  html = html.replace(new RegExp(`(<li class="${marginClass}" value="\\d+">[^<]*<\\/li>\\n?)+`, 'g'), `<ol class="list-decimal space-y-2 my-4 ${listMarginClass}">$&</ol>`);

  // Wrap unordered list items in ul
  html = html.replace(new RegExp(`(<li class="${marginClass} list-disc">[^<]*<\\/li>\\n?)+`, 'g'), `<ul class="list-disc space-y-2 my-4 ${listMarginClass}">$&</ul>`);

  return `<p class="mb-4 text-slate-700 leading-relaxed">${html}</p>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
