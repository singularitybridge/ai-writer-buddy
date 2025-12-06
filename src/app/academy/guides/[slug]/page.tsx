import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, ArrowLeft } from 'lucide-react';
import { getTechGuide, getTechGuides } from '@/lib/data';
import { getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Locale } from '@/i18n/config';

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale() as Locale;
  const guide = getTechGuide(slug, locale);
  const allGuides = getTechGuides(locale);

  if (!guide) {
    notFound();
  }

  const currentIndex = allGuides.findIndex(g => g.slug === guide.slug);
  const prevGuide = currentIndex > 0 ? allGuides[currentIndex - 1] : null;
  const nextGuide = currentIndex < allGuides.length - 1 ? allGuides[currentIndex + 1] : null;

  // Related guides
  const relatedGuides = guide.relatedGuides
    .map(slug => getTechGuide(slug, locale))
    .filter(Boolean);

  const isRtl = locale === 'he';
  const dateLocale = locale === 'en' ? 'en-US' : 'he-IL';

  return (
    <div className="max-w-3xl">
      {/* Back Link */}
      <Link
        href="/academy/guides"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-6"
      >
        <ArrowRight className={`w-4 h-4 ${!isRtl ? 'rotate-180' : ''}`} />
        <span>{locale === 'en' ? 'Back to Guides' : 'חזרה למדריכים'}</span>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium">
            <BookOpen className="w-3.5 h-3.5" />
            {locale === 'en' ? 'Guide' : 'מדריך'}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
          {guide.title}
        </h1>
        <p className="text-slate-600 text-lg">
          {guide.description}
        </p>
        <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {locale === 'en' ? 'Last updated:' : 'עודכן לאחרונה:'} {new Date(guide.updatedAt).toLocaleDateString(dateLocale)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 mb-8">
        <div
          className="prose prose-slate max-w-none"
          style={{ direction: isRtl ? 'rtl' : 'ltr' }}
          dangerouslySetInnerHTML={{ __html: formatContent(guide.content, isRtl) }}
        />
      </div>

      {/* Related Guides */}
      {relatedGuides.length > 0 && (
        <div className="bg-slate-50 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-slate-900 mb-4">
            {locale === 'en' ? 'Related Guides' : 'מדריכים קשורים'}
          </h3>
          <div className="space-y-2">
            {relatedGuides.map((related) => (
              <Link
                key={related!.id}
                href={`/academy/guides/${related!.slug}`}
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700">{related!.title}</span>
                <ArrowLeft className={`w-4 h-4 text-slate-400 ${isRtl ? 'mr-auto' : 'ml-auto'}`} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        {prevGuide ? (
          <Link
            href={`/academy/guides/${prevGuide.slug}`}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowRight className={`w-4 h-4 ${!isRtl ? 'rotate-180' : ''}`} />
            <span>{prevGuide.title}</span>
          </Link>
        ) : (
          <div />
        )}
        {nextGuide && (
          <Link
            href={`/academy/guides/${nextGuide.slug}`}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            <span>{locale === 'en' ? `Next: ${nextGuide.title}` : `הבא: ${nextGuide.title}`}</span>
          </Link>
        )}
      </div>
    </div>
  );
}

function formatContent(content: string, isRtl: boolean): string {
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
