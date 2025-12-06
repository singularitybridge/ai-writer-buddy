import { Book, Chapter, Page, ChatMessage, Database, KnowledgeItem, Character, Challenge, TechGuide, AIToolSetup, Badge, UserProgress, AcademyData } from '@/types';
import dbData from '@/data/db.json';
import academyHeData from '@/data/academy.he.json';
import academyEnData from '@/data/academy.en.json';
import type { Locale } from '@/i18n/config';

const db = dbData as Database;
const academyData: Record<Locale, AcademyData> = {
  he: academyHeData as AcademyData,
  en: academyEnData as AcademyData,
};

function getAcademyData(locale: Locale = 'he'): AcademyData {
  return academyData[locale] || academyData.he;
}

export function getBooks(): Book[] {
  return db.books;
}

export function getBook(id: string): Book | undefined {
  return db.books.find(book => book.id === id);
}

export function getChaptersByBookId(bookId: string): Chapter[] {
  return db.chapters
    .filter(chapter => chapter.bookId === bookId)
    .sort((a, b) => a.order - b.order);
}

export function getChapter(id: string): Chapter | undefined {
  return db.chapters.find(chapter => chapter.id === id);
}

export function getPagesByChapterId(chapterId: string): Page[] {
  return db.pages
    .filter(page => page.chapterId === chapterId)
    .sort((a, b) => a.order - b.order);
}

export function getPage(id: string): Page | undefined {
  return db.pages.find(page => page.id === id);
}

export function getChatMessagesByBookId(bookId: string): ChatMessage[] {
  return db.chatMessages
    .filter(msg => msg.bookId === bookId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

export function getKnowledgeItemsByBookId(bookId: string): KnowledgeItem[] {
  return db.knowledgeItems
    .filter(item => item.bookId === bookId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getKnowledgeItem(id: string): KnowledgeItem | undefined {
  return db.knowledgeItems.find(item => item.id === id);
}

export function getCharactersByBookId(bookId: string): Character[] {
  return db.characters.filter(char => char.bookId === bookId);
}

export function getCharacter(id: string): Character | undefined {
  return db.characters.find(char => char.id === id);
}

export function getBookWithDetails(bookId: string) {
  const book = getBook(bookId);
  if (!book) return null;

  const chapters = getChaptersByBookId(bookId).map(chapter => ({
    ...chapter,
    pages: getPagesByChapterId(chapter.id)
  }));

  const chatMessages = getChatMessagesByBookId(bookId);
  const knowledgeItems = getKnowledgeItemsByBookId(bookId);
  const characters = getCharactersByBookId(bookId);

  return {
    ...book,
    chapters,
    chatMessages,
    knowledgeItems,
    characters
  };
}

// Quick actions based on context
export const bookLevelQuickActions = [
  {
    id: 'add-page',
    label: 'הוסף עמוד חדש',
    prompt: 'אני רוצה להוסיף עמוד חדש לספר. עזרי לי לכתוב תוכן מתאים.',
    icon: 'FilePlus',
    category: 'create'
  },
  {
    id: 'add-character',
    label: 'הוסף דמות חדשה',
    prompt: 'אני רוצה להוסיף דמות חדשה לסיפור. עזרי לי לפתח אותה.',
    icon: 'UserPlus',
    category: 'create'
  },
  {
    id: 'check-consistency',
    label: 'בדוק עקביות עלילה',
    prompt: 'בדקי את העקביות של קו העלילה והדמויות בספר. האם יש סתירות או בעיות?',
    icon: 'CheckCircle',
    category: 'analyze'
  },
  {
    id: 'suggest-plot',
    label: 'הצע המשך עלילה',
    prompt: 'הציעי רעיונות להמשך העלילה בהתבסס על מה שנכתב עד כה.',
    icon: 'Lightbulb',
    category: 'create'
  },
  {
    id: 'research-topic',
    label: 'חקור נושא',
    prompt: 'אני צריך לחקור נושא רלוונטי לספר שלי. עזרי לי למצוא מידע.',
    icon: 'Search',
    category: 'research'
  }
];

export const pageLevelQuickActions = [
  {
    id: 'improve-writing',
    label: 'שפר את הכתיבה',
    prompt: 'שפרי את הכתיבה של העמוד הנוכחי - סגנון, זרימה ותיאורים.',
    icon: 'Wand2',
    category: 'edit'
  },
  {
    id: 'expand-scene',
    label: 'הרחב את הסצנה',
    prompt: 'הרחיבי את הסצנה הנוכחית עם יותר פרטים ותיאורים.',
    icon: 'Expand',
    category: 'edit'
  },
  {
    id: 'add-dialogue',
    label: 'הוסף דיאלוג',
    prompt: 'הוסיפי דיאלוג מתאים לסצנה הנוכחית בין הדמויות.',
    icon: 'MessageSquare',
    category: 'create'
  },
  {
    id: 'describe-emotion',
    label: 'תאר רגשות',
    prompt: 'הוסיפי תיאורי רגשות ומחשבות פנימיות של הדמויות בסצנה.',
    icon: 'Heart',
    category: 'edit'
  },
  {
    id: 'check-flow',
    label: 'בדוק זרימה',
    prompt: 'בדקי את הזרימה והקישוריות של העמוד הזה עם העמודים הסמוכים.',
    icon: 'GitBranch',
    category: 'analyze'
  }
];

// Academy Data Functions

export function getChallenges(locale: Locale = 'he'): Challenge[] {
  return getAcademyData(locale).challenges || [];
}

export function getChallenge(id: string, locale: Locale = 'he'): Challenge | undefined {
  return getAcademyData(locale).challenges?.find(challenge => challenge.id === id);
}

export function getChallengesByCategory(category: Challenge['category'], locale: Locale = 'he'): Challenge[] {
  return getAcademyData(locale).challenges?.filter(challenge => challenge.category === category) || [];
}

export function getChallengesByDifficulty(difficulty: Challenge['difficulty'], locale: Locale = 'he'): Challenge[] {
  return getAcademyData(locale).challenges?.filter(challenge => challenge.difficulty === difficulty) || [];
}

export function getTechGuides(locale: Locale = 'he'): TechGuide[] {
  return (getAcademyData(locale).techGuides || []).sort((a, b) => a.order - b.order);
}

export function getTechGuide(slug: string, locale: Locale = 'he'): TechGuide | undefined {
  return getAcademyData(locale).techGuides?.find(guide => guide.slug === slug);
}

export function getTechGuidesByCategory(category: TechGuide['category'], locale: Locale = 'he'): TechGuide[] {
  return getAcademyData(locale).techGuides?.filter(guide => guide.category === category).sort((a, b) => a.order - b.order) || [];
}

export function getAIToolSetups(locale: Locale = 'he'): AIToolSetup[] {
  return getAcademyData(locale).aiToolSetups || [];
}

export function getAIToolSetup(slug: string, locale: Locale = 'he'): AIToolSetup | undefined {
  return getAcademyData(locale).aiToolSetups?.find(tool => tool.slug === slug);
}

export function getBadges(locale: Locale = 'he'): Badge[] {
  return getAcademyData(locale).badges || [];
}

export function getBadge(id: string, locale: Locale = 'he'): Badge | undefined {
  return getAcademyData(locale).badges?.find(badge => badge.id === id);
}

export function getUserProgress(userId: string): UserProgress | undefined {
  return db.userProgress?.find(progress => progress.userId === userId);
}

export function getDefaultUserProgress(): UserProgress {
  return {
    userId: 'default',
    totalPoints: 0,
    completedChallenges: [],
    inProgressChallenges: [],
    level: 1,
    badges: []
  };
}

export function calculateLevel(points: number): number {
  if (points >= 800) return 5;
  if (points >= 500) return 4;
  if (points >= 300) return 3;
  if (points >= 100) return 2;
  return 1;
}

export function getLevelTitle(level: number, locale: Locale = 'he'): string {
  const titlesHe: Record<number, string> = {
    1: 'מתחיל',
    2: 'מפתח זוטר',
    3: 'מפתח',
    4: 'מפתח בכיר',
    5: 'מאסטר AI'
  };
  const titlesEn: Record<number, string> = {
    1: 'Beginner',
    2: 'Junior Developer',
    3: 'Developer',
    4: 'Senior Developer',
    5: 'AI Master'
  };
  const titles = locale === 'en' ? titlesEn : titlesHe;
  return titles[level] || titles[1];
}

export function getTotalAvailablePoints(locale: Locale = 'he'): number {
  return getAcademyData(locale).challenges?.reduce((sum, challenge) => sum + challenge.points, 0) || 0;
}
