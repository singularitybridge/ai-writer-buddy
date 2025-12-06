# AI Agent Training Academy - מפת דרכים ליישום

## סקירה כללית

מסמך זה מפרט בדיוק אילו קבצים ליצור/לערוך בכל שלב של הטרנספורמציה.

---

## שלב 1: מבנה בסיסי ומודלי נתונים (2-3 ימים)

### קבצים לעדכון

#### 1.1 `src/types/index.ts`
**פעולה:** הוספת interfaces חדשות

```typescript
// להוסיף בסוף הקובץ:

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  instructions: string;
  successCriteria: string[];
  dependencies: string[];
  resources: {
    title: string;
    url: string;
    type: 'docs' | 'video' | 'article';
  }[];
  codeExample?: string;
  hints: {
    level: number;
    text: string;
    pointsPenalty: number;
  }[];
}

export interface UserProgress {
  userId: string;
  totalPoints: number;
  completedChallenges: {
    challengeId: string;
    completedAt: string;
    pointsEarned: number;
    hintsUsed: number;
  }[];
  inProgressChallenges: {
    challengeId: string;
    startedAt: string;
    hintsUsed: number;
  }[];
  level: number;
  badges: {
    id: string;
    name: string;
    earnedAt: string;
  }[];
}

export interface TechGuide {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  order: number;
  updatedAt: string;
  relatedGuides: string[];
}

export interface AIToolSetup {
  toolName: string;
  setupSteps: {
    order: number;
    title: string;
    instructions: string;
    codeSnippet?: string;
  }[];
  recommendedConfig: string;
  usageTips: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
}

// עדכון Database interface
export interface Database {
  books: Book[];
  chapters: Chapter[];
  pages: Page[];
  chatMessages: ChatMessage[];
  knowledgeItems: KnowledgeItem[];
  characters: Character[];
  // NEW:
  challenges: Challenge[];
  userProgress: UserProgress[];
  techGuides: TechGuide[];
  aiToolSetups: AIToolSetup[];
  badges: Badge[];
}
```

#### 1.2 `src/data/db.json`
**פעולה:** הרחבת הנתונים

```json
{
  "books": [...existing...],
  "chapters": [...existing...],
  "pages": [...existing...],
  "chatMessages": [...existing...],
  "knowledgeItems": [...existing...],
  "characters": [...existing...],
  "challenges": [
    {
      "id": "ch-001",
      "title": "אפשר עריכת עמודים",
      "description": "הוסף כפתור עריכה לכל עמוד שיפתח modal עם textarea לעריכת התוכן.",
      "points": 50,
      "difficulty": "beginner",
      "category": "crud",
      "tags": ["react", "state-management", "modal"],
      "instructions": "יש ליצור:\n1. כפתור 'ערוך' בעמוד\n2. Modal עם textarea\n3. שמירה ב-state\n4. עדכון התצוגה בזמן אמת",
      "successCriteria": [
        "כפתור עריכה מוצג בכל עמוד",
        "Modal נפתח עם textarea המכיל את התוכן הנוכחי",
        "שמירה מעדכנת את התוכן בזמן אמת ללא refresh",
        "השינויים נשמרים גם לאחר רענון הדף"
      ],
      "dependencies": [],
      "resources": [
        {
          "title": "React State Management",
          "url": "https://react.dev/learn/managing-state",
          "type": "docs"
        }
      ],
      "hints": [
        {
          "level": 1,
          "text": "השתמש ב-useState לניהול מצב ה-modal (פתוח/סגור)",
          "pointsPenalty": 5
        },
        {
          "level": 2,
          "text": "שמור את התוכן המעודכן ב-localStorage תחת מפתח ייחודי לעמוד",
          "pointsPenalty": 10
        }
      ]
    },
    {
      "id": "ch-002",
      "title": "אפשר הוספת עמודים",
      "description": "הוסף כפתור להוספת עמוד חדש לפרק קיים.",
      "points": 100,
      "difficulty": "beginner",
      "category": "crud",
      "tags": ["react", "forms", "uuid"],
      "instructions": "יש ליצור:\n1. כפתור 'הוסף עמוד' בתוך כל פרק\n2. Form ליצירת עמוד חדש\n3. יצירת ID ייחודי\n4. שמירה ב-state ו-localStorage",
      "successCriteria": [
        "כפתור הוספה מוצג בכל פרק",
        "Form מאפשר הזנת כותרת ותוכן",
        "עמוד חדש מתווסף לרשימה",
        "העמוד נשמר גם לאחר refresh"
      ],
      "dependencies": [],
      "resources": [],
      "hints": []
    },
    {
      "id": "ch-003",
      "title": "אפשר מחיקת עמודים",
      "description": "הוסף כפתור מחיקה לכל עמוד עם אישור.",
      "points": 50,
      "difficulty": "beginner",
      "category": "crud",
      "tags": ["react", "confirmation", "delete"],
      "instructions": "יש ליצור:\n1. כפתור מחיקה בכל עמוד\n2. Dialog אישור\n3. הסרה מ-state\n4. עדכון localStorage",
      "successCriteria": [
        "כפתור מחיקה מוצג",
        "מופיע אישור לפני מחיקה",
        "העמוד נמחק מהרשימה",
        "המחיקה נשמרת גם לאחר refresh"
      ],
      "dependencies": [],
      "resources": [],
      "hints": []
    },
    {
      "id": "ch-004",
      "title": "AI Agent מעדכן סיפור",
      "description": "צור AI agent שמקבל הוראה ומעדכן את העמוד הרלוונטי.",
      "points": 150,
      "difficulty": "intermediate",
      "category": "ai",
      "tags": ["ai", "openai", "agent", "function-calling"],
      "instructions": "יש ליצור:\n1. API route ל-AI agent\n2. Function calling לזיהוי עמוד\n3. Function לעדכון תוכן\n4. אינטגרציה עם ChatAssistant",
      "successCriteria": [
        "Agent מזהה נכון באיזה פרק/עמוד לעבוד",
        "תוכן חדש משולב בהרמוניה עם התוכן הקיים",
        "שומר עקביות עם סגנון הכתיבה",
        "משתמש ב-Vercel AI SDK + OpenAI Agent API"
      ],
      "dependencies": [],
      "resources": [
        {
          "title": "OpenAI Function Calling",
          "url": "https://platform.openai.com/docs/guides/function-calling",
          "type": "docs"
        }
      ],
      "hints": [
        {
          "level": 1,
          "text": "השתמש ב-function calling כדי לאפשר ל-agent לקרוא ולעדכן עמודים",
          "pointsPenalty": 10
        }
      ]
    },
    {
      "id": "ch-005",
      "title": "הקראת טקסט עם 11Labs",
      "description": "הוסף כפתור הקרא שמשתמש ב-ElevenLabs API.",
      "points": 150,
      "difficulty": "intermediate",
      "category": "voice",
      "tags": ["elevenlabs", "tts", "api"],
      "instructions": "יש ליצור:\n1. API route ל-ElevenLabs\n2. כפתור הקרא/עצור\n3. טיפול ב-loading state\n4. נגן אודיו",
      "successCriteria": [
        "אינטגרציה עם ElevenLabs API",
        "כפתור הקרא/עצור עם אנימציה",
        "הקול נשמע ברור ובעברית תקנית",
        "טיפול נכון בשגיאות API"
      ],
      "dependencies": [],
      "resources": [],
      "hints": []
    },
    {
      "id": "ch-006",
      "title": "מערכת Review",
      "description": "צור מערכת שמאפשרת למשתמש להגדיר כללי ולידציה עם משוב.",
      "points": 200,
      "difficulty": "advanced",
      "category": "review",
      "tags": ["ai", "validation", "feedback"],
      "instructions": "יש ליצור:\n1. ממשק להגדרת כללים\n2. AI שבודק התאמה לכללים\n3. משוב מפורט\n4. דירוג איכות",
      "successCriteria": [
        "משתמש יכול להגדיר כללי ולידציה",
        "AI בודק כל עמוד מול הכללים",
        "משוב מפורט ומועיל",
        "ניקוד או דירוג ברור"
      ],
      "dependencies": ["ch-004"],
      "resources": [],
      "hints": []
    },
    {
      "id": "ch-007",
      "title": "תרגום לאנגלית",
      "description": "הוסף תמיכה רב-לשונית עם תרגום לאנגלית.",
      "points": 100,
      "difficulty": "intermediate",
      "category": "i18n",
      "tags": ["i18n", "translation", "localization"],
      "instructions": "יש ליצור:\n1. מערכת i18n\n2. קבצי תרגום\n3. Language switcher\n4. RTL/LTR handling",
      "successCriteria": [
        "ממשק ב-2 שפות: עברית ואנגלית",
        "החלפת שפות חלקה",
        "כיווניות נכונה (RTL/LTR)",
        "כל הטקסטים מתורגמים"
      ],
      "dependencies": [],
      "resources": [],
      "hints": []
    }
  ],
  "userProgress": [],
  "techGuides": [
    {
      "id": "guide-001",
      "title": "ארכיטקטורת האפליקציה",
      "description": "מבנה התיקיות וזרימת הנתונים",
      "category": "architecture",
      "content": "# ארכיטקטורת האפליקציה\n\n## מבנה תיקיות\n\nהאפליקציה בנויה על Next.js 16 עם App Router...",
      "order": 1,
      "updatedAt": "2025-12-06",
      "relatedGuides": ["guide-002", "guide-003"]
    },
    {
      "id": "guide-002",
      "title": "Tech Stack - הטכנולוגיות בשימוש",
      "description": "סקירת כל הספריות והשירותים",
      "category": "tech-stack",
      "content": "# Tech Stack\n\n## Frontend\n- **Next.js 16** - React framework\n- **TypeScript** - Type safety\n- **Tailwind CSS** - Styling...",
      "order": 2,
      "updatedAt": "2025-12-06",
      "relatedGuides": ["guide-001"]
    }
  ],
  "aiToolSetups": [
    {
      "toolName": "Claude Code",
      "setupSteps": [
        {
          "order": 1,
          "title": "התקנה",
          "instructions": "הורד את Claude Code מהאתר הרשמי",
          "codeSnippet": "npm install -g @anthropic/claude-code"
        }
      ],
      "recommendedConfig": "{}",
      "usageTips": ["השתמש בפקודות ברורות", "תן קונטקסט מספק"]
    }
  ],
  "badges": [
    {
      "id": "badge-first-steps",
      "name": "צעדים ראשונים",
      "description": "השלמת המשימה הראשונה",
      "icon": "star",
      "criteria": "השלמת משימה beginner אחת"
    }
  ]
}
```

#### 1.3 `src/lib/data.ts`
**פעולה:** הוספת פונקציות חדשות

```typescript
// להוסיף בסוף הקובץ:

export function getChallenges(): Challenge[] {
  return db.challenges;
}

export function getChallenge(id: string): Challenge | undefined {
  return db.challenges.find(c => c.id === id);
}

export function getChallengesByDifficulty(difficulty: string): Challenge[] {
  return db.challenges.filter(c => c.difficulty === difficulty);
}

export function getChallengesByCategory(category: string): Challenge[] {
  return db.challenges.filter(c => c.category === category);
}

export function getUserProgress(userId: string): UserProgress | undefined {
  return db.userProgress.find(up => up.userId === userId);
}

export function getTechGuides(): TechGuide[] {
  return db.techGuides.sort((a, b) => a.order - b.order);
}

export function getTechGuide(id: string): TechGuide | undefined {
  return db.techGuides.find(g => g.id === id);
}

export function getAIToolSetups(): AIToolSetup[] {
  return db.aiToolSetups;
}

export function getBadges(): Badge[] {
  return db.badges;
}
```

#### 1.4 `package.json`
**פעולה:** הוספת dependencies

```bash
npm install ai openai @fal-ai/serverless-client react-markdown react-syntax-highlighter @types/react-syntax-highlighter
```

---

## שלב 2: דף בית ומסלול Academy בסיסי (5-7 ימים)

### קבצים ליצירה

#### 2.1 `src/app/page.tsx` (עדכון)
**פעולה:** מיתוג מחדש של דף הבית

**שינויים עיקריים:**
- החלף "סופר חכם" ב-"אקדמיית AI Agents"
- הוסף קישור ל-`/academy`
- עדכן את התיאורים להתמקד בלמידה

#### 2.2 `src/app/academy/layout.tsx` (חדש)
**פעולה:** יצירת Layout עם Sidebar

```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Trophy,
  BookOpen,
  Wrench,
  BarChart3,
  Library
} from 'lucide-react';

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/academy', label: 'Dashboard', icon: Home },
    { href: '/academy/challenges', label: 'משימות', icon: Trophy },
    { href: '/academy/guides', label: 'מדריכים', icon: BookOpen },
    { href: '/academy/tools', label: 'כלי AI', icon: Wrench },
    { href: '/academy/progress', label: 'התקדמות', icon: BarChart3 },
    { href: '/academy/resources', label: 'משאבים', icon: Library },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-l border-slate-200">
        {/* Sidebar content */}
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50">
        {children}
      </main>
    </div>
  );
}
```

#### 2.3 `src/app/academy/page.tsx` (חדש)
**פעולה:** Dashboard עם סטטיסטיקות

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getUserProgress, getChallenges } from '@/lib/data';

export default function AcademyDashboard() {
  const [progress, setProgress] = useState(null);
  const [challenges, setChallenges] = useState([]);

  // Stats cards, recent challenges, etc.

  return (
    <div className="p-8">
      <h1>ברוך הבא לאקדמיית AI Agents</h1>
      {/* Dashboard content */}
    </div>
  );
}
```

#### 2.4 `src/app/academy/challenges/page.tsx` (חדש)
**פעולה:** גריד משימות עם סינון

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getChallenges } from '@/lib/data';
import Link from 'next/link';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [filter, setFilter] = useState('all');

  return (
    <div className="p-8">
      {/* Filters */}
      {/* Grid of challenge cards */}
    </div>
  );
}
```

#### 2.5 `src/app/academy/challenges/[id]/page.tsx` (חדש)
**פעולה:** פרטי משימה

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getChallenge } from '@/lib/data';

interface Props {
  params: Promise<{ id: string }>;
}

export default function ChallengePage({ params }: Props) {
  const [challenge, setChallenge] = useState(null);
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="p-8">
      {/* Challenge details, success criteria, hints, etc. */}
    </div>
  );
}
```

#### 2.6 `src/app/api/challenges/route.ts` (חדש)
**פעולה:** API endpoint למשימות

```typescript
import { NextResponse } from 'next/server';
import { getChallenges, getChallengesByDifficulty } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const difficulty = searchParams.get('difficulty');

  const challenges = difficulty
    ? getChallengesByDifficulty(difficulty)
    : getChallenges();

  return NextResponse.json({ challenges });
}
```

#### 2.7 `src/app/api/challenges/[id]/route.ts` (חדש)
**פעולה:** API endpoint למשימה ספציפית

```typescript
import { NextResponse } from 'next/server';
import { getChallenge } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const challenge = getChallenge(id);

  if (!challenge) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ challenge });
}
```

#### 2.8 `src/app/api/progress/route.ts` (חדש)
**פעולה:** API endpoint להתקדמות

```typescript
import { NextResponse } from 'next/server';
import { getUserProgress } from '@/lib/data';

export async function GET(request: Request) {
  // For now, use a default user ID
  const userId = 'default-user';
  const progress = getUserProgress(userId);

  return NextResponse.json({ progress });
}
```

#### 2.9 `src/app/api/progress/complete/route.ts` (חדש)
**פעולה:** סימון משימה כהושלמה

```typescript
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { challengeId, hintsUsed } = await request.json();

  // Update user progress in localStorage (client-side)
  // Or in db.json for server-side

  return NextResponse.json({
    pointsEarned: 100,
    totalPoints: 250
  });
}
```

---

## שלב 3: מדריכים טכניים וכלי AI (4-5 ימים)

### קבצים ליצירה

#### 3.1 `src/app/academy/guides/page.tsx` (חדש)
**פעולה:** רשימת מדריכים

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getTechGuides } from '@/lib/data';
import Link from 'next/link';

export default function GuidesPage() {
  const [guides, setGuides] = useState([]);

  return (
    <div className="p-8">
      {/* List of guides */}
    </div>
  );
}
```

#### 3.2 `src/app/academy/guides/[slug]/page.tsx` (חדש)
**פעולה:** תצוגת מדריך עם Markdown

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getTechGuide } from '@/lib/data';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

export default function GuidePage({ params }: Props) {
  const [guide, setGuide] = useState(null);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter language={match[1]} {...props}>
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {guide?.content}
      </ReactMarkdown>
    </div>
  );
}
```

#### 3.3 `src/components/CodeBlock.tsx` (חדש)
**פעולה:** רכיב לתצוגת קוד

```typescript
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  language: string;
  code: string;
}

export default function CodeBlock({ language, code }: CodeBlockProps) {
  return (
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      customStyle={{
        borderRadius: '0.5rem',
        padding: '1rem',
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
}
```

#### 3.4 `src/app/academy/tools/page.tsx` (חדש)
**פעולה:** רשימת כלי AI

```typescript
import Link from 'next/link';

export default function ToolsPage() {
  const tools = [
    { name: 'Claude Code', slug: 'claude-code' },
    { name: 'OpenAI Codex', slug: 'openai-codex' },
    { name: 'Gemini CLI', slug: 'gemini-cli' },
  ];

  return (
    <div className="p-8">
      {/* List of tools */}
    </div>
  );
}
```

#### 3.5 `src/app/academy/tools/claude-code/page.tsx` (חדש)
**פעולה:** מדריך Claude Code

```typescript
export default function ClaudeCodeSetup() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1>הגדרת Claude Code</h1>
      {/* Setup instructions */}
    </div>
  );
}
```

#### 3.6 `src/app/api/guides/route.ts` (חדש)
**פעולה:** API endpoint למדריכים

```typescript
import { NextResponse } from 'next/server';
import { getTechGuides } from '@/lib/data';

export async function GET() {
  const guides = getTechGuides();
  return NextResponse.json({ guides });
}
```

---

## שלב 4: Gamification ו-AI Mentor (5-6 ימים)

### קבצים ליצירה/עדכון

#### 4.1 `src/app/academy/progress/page.tsx` (חדש)
**פעולה:** דף התקדמות עם גרפים

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getUserProgress, getBadges } from '@/lib/data';

export default function ProgressPage() {
  const [progress, setProgress] = useState(null);
  const [badges, setBadges] = useState([]);

  return (
    <div className="p-8">
      {/* Progress stats, badges, charts */}
    </div>
  );
}
```

#### 4.2 `src/components/ChatAssistant.tsx` (עדכון)
**פעולה:** התאמה ל-AI Coding Mentor

**שינויים:**
- הוספת context של משימה נוכחית
- שינוי הפרומפט להיות מנטור קודינג
- הוספת quick actions רלוונטיים למשימה

#### 4.3 `src/app/api/chat/route.ts` (חדש)
**פעולה:** AI chat endpoint עם Vercel AI SDK

```typescript
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages, challengeId } = await req.json();

  const result = streamText({
    model: openai('gpt-4-turbo'),
    messages,
    system: `אתה מנטור AI לקודינג. עזור לתלמיד בפתרון משימה ${challengeId}...`,
  });

  return result.toDataStreamResponse();
}
```

#### 4.4 `src/hooks/useLocalStorage.ts` (חדש)
**פעולה:** Hook לניהול localStorage

```typescript
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}
```

#### 4.5 `src/components/HintButton.tsx` (חדש)
**פעולה:** רכיב לקבלת רמזים

```typescript
'use client';

import { useState } from 'react';
import { Lightbulb } from 'lucide-react';

interface HintButtonProps {
  hints: { level: number; text: string; pointsPenalty: number }[];
  onHintUsed: (level: number, penalty: number) => void;
}

export default function HintButton({ hints, onHintUsed }: HintButtonProps) {
  const [currentHint, setCurrentHint] = useState(0);

  return (
    <div>
      {/* Hint button and display */}
    </div>
  );
}
```

#### 4.6 `src/components/BadgeDisplay.tsx` (חדש)
**פעולה:** תצוגת תגי הישגים

```typescript
import { Badge } from '@/types';

interface BadgeDisplayProps {
  badges: Badge[];
  earnedBadges: string[];
}

export default function BadgeDisplay({ badges, earnedBadges }: BadgeDisplayProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Badge cards */}
    </div>
  );
}
```

---

## קבצים נוספים לשקול

### רכיבים משותפים
- `src/components/StatsCard.tsx` - כרטיס סטטיסטיקה
- `src/components/ChallengeCard.tsx` - כרטיס משימה
- `src/components/ProgressBar.tsx` - פס התקדמות
- `src/components/DifficultyBadge.tsx` - תג רמת קושי

### Utilities
- `src/lib/points.ts` - חישובי נקודות ורמות
- `src/lib/badges.ts` - לוגיקת תגי הישגים
- `src/lib/ai-config.ts` - תצורת AI

### Types נוספים
- `src/types/api.ts` - טיפוסים ל-API responses

---

## סדר ביצוע מומלץ

1. **יום 1-2:** שלב 1 (Types + Data)
2. **יום 3-4:** Academy Layout + Dashboard
3. **יום 5-6:** Challenges pages + API
4. **יום 7-8:** Guides + Tools pages
5. **יום 9-10:** Progress page + Gamification
6. **יום 11-12:** AI Mentor integration
7. **יום 13-14:** Polishing + Testing

---

## Checklist לכל קובץ חדש

- [ ] TypeScript types נכונים
- [ ] Error handling
- [ ] Loading states
- [ ] Empty states
- [ ] Mobile responsive
- [ ] Hebrew RTL תומך
- [ ] Accessibility (a11y)
- [ ] Comments בעברית

---

## הערות חשובות

1. **Backward Compatibility:** אל תמחק את `/book` routes - הם צריכים להישאר עובדים
2. **localStorage:** בשלב הראשון, שמור את ההתקדמות ב-localStorage. בעתיד אפשר לעבור ל-DB
3. **AI Costs:** התחל עם GPT-4.1 mini (זול), עבור ל-Agent API רק אם צריך
4. **Testing:** בדוק כל page לפני מעבר להבא
5. **Git Commits:** עשה commit אחרי כל קובץ משמעותי

---

## משאבים טכניים

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [OpenAI API](https://platform.openai.com/docs)
- [React Markdown](https://github.com/remarkjs/react-markdown)
- [Tailwind CSS](https://tailwindcss.com/docs)
