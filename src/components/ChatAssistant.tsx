'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  BookOpen,
  Globe,
  ToggleLeft,
  ToggleRight,
  FilePlus,
  UserPlus,
  CheckCircle,
  Lightbulb,
  Search,
  Wand2,
  Expand,
  MessageSquare,
  Heart,
  GitBranch,
  Settings,
  X
} from 'lucide-react';
import { ChatMessage } from '@/types';

interface QuickAction {
  id: string;
  label: string;
  prompt: string;
  icon: string;
  category: string;
}

interface Props {
  bookId: string;
  initialMessages: ChatMessage[];
  bookContext: {
    title: string;
    genre: string;
    currentChapter?: string;
    currentPage?: string;
  };
  hasPageSelected: boolean;
}

const bookLevelQuickActions: QuickAction[] = [
  { id: 'add-page', label: 'הוסף עמוד חדש', prompt: 'אני רוצה להוסיף עמוד חדש לספר. עזרי לי לכתוב תוכן מתאים.', icon: 'FilePlus', category: 'create' },
  { id: 'add-character', label: 'הוסף דמות חדשה', prompt: 'אני רוצה להוסיף דמות חדשה לסיפור. עזרי לי לפתח אותה.', icon: 'UserPlus', category: 'create' },
  { id: 'check-consistency', label: 'בדוק עקביות', prompt: 'בדקי את העקביות של קו העלילה והדמויות בספר. האם יש סתירות?', icon: 'CheckCircle', category: 'analyze' },
  { id: 'suggest-plot', label: 'הצע המשך', prompt: 'הציעי רעיונות להמשך העלילה בהתבסס על מה שנכתב עד כה.', icon: 'Lightbulb', category: 'create' },
];

const pageLevelQuickActions: QuickAction[] = [
  { id: 'improve-writing', label: 'שפר כתיבה', prompt: 'שפרי את הכתיבה של העמוד הנוכחי - סגנון, זרימה ותיאורים.', icon: 'Wand2', category: 'edit' },
  { id: 'expand-scene', label: 'הרחב סצנה', prompt: 'הרחיבי את הסצנה הנוכחית עם יותר פרטים ותיאורים.', icon: 'Expand', category: 'edit' },
  { id: 'add-dialogue', label: 'הוסף דיאלוג', prompt: 'הוסיפי דיאלוג מתאים לסצנה הנוכחית בין הדמויות.', icon: 'MessageSquare', category: 'create' },
  { id: 'describe-emotion', label: 'תאר רגשות', prompt: 'הוסיפי תיאורי רגשות ומחשבות פנימיות של הדמויות.', icon: 'Heart', category: 'edit' },
  { id: 'check-flow', label: 'בדוק זרימה', prompt: 'בדקי את הזרימה והקישוריות של העמוד עם העמודים הסמוכים.', icon: 'GitBranch', category: 'analyze' },
];

const iconMap: Record<string, React.ReactNode> = {
  FilePlus: <FilePlus className="w-3 h-3" />,
  UserPlus: <UserPlus className="w-3 h-3" />,
  CheckCircle: <CheckCircle className="w-3 h-3" />,
  Lightbulb: <Lightbulb className="w-3 h-3" />,
  Search: <Search className="w-3 h-3" />,
  Wand2: <Wand2 className="w-3 h-3" />,
  Expand: <Expand className="w-3 h-3" />,
  MessageSquare: <MessageSquare className="w-3 h-3" />,
  Heart: <Heart className="w-3 h-3" />,
  GitBranch: <GitBranch className="w-3 h-3" />,
};

export default function ChatAssistant({ bookId, initialMessages, bookContext, hasPageSelected }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useKnowledge, setUseKnowledge] = useState(true);
  const [useOnlineResearch, setUseOnlineResearch] = useState(false);
  const [knowledgePrompt, setKnowledgePrompt] = useState('חפש מידע רלוונטי על דמויות, מיקומים ועלילה מבסיס הידע של הספר');
  const [researchPrompt, setResearchPrompt] = useState('חפש מידע היסטורי, תרבותי או עובדתי רלוונטי לנושא');
  const [showKnowledgeSettings, setShowKnowledgeSettings] = useState(false);
  const [showResearchSettings, setShowResearchSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      bookId,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const aiResponse: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        bookId,
        role: 'assistant',
        content: generateDemoResponse(input.trim(), bookContext, useKnowledge, useOnlineResearch),
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const quickActions = hasPageSelected ? pageLevelQuickActions : bookLevelQuickActions;

  return (
    <div className="flex flex-col h-full relative">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Bot className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">נעמי</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>עוזרת כתיבה חכמה</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Context Badge & Toggles */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 space-y-2">
        {bookContext.currentChapter && (
          <p className="text-xs text-slate-500">
            הקשר: <span className="text-slate-700">{bookContext.currentChapter}</span>
            {bookContext.currentPage && (
              <> → <span className="text-slate-700">{bookContext.currentPage}</span></>
            )}
          </p>
        )}

        {/* Toggles Row */}
        <div className="flex items-center gap-3">
          {/* Use Knowledge Toggle */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setUseKnowledge(!useKnowledge)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                useKnowledge
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {useKnowledge ? (
                <ToggleRight className="w-4 h-4" />
              ) : (
                <ToggleLeft className="w-4 h-4" />
              )}
              <BookOpen className="w-3 h-3" />
              <span>בסיס ידע</span>
            </button>
            {useKnowledge && (
              <button
                onClick={() => setShowKnowledgeSettings(true)}
                className="p-1.5 text-purple-500 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors"
                title="הגדרות בסיס ידע"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Online Research Toggle */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setUseOnlineResearch(!useOnlineResearch)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                useOnlineResearch
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {useOnlineResearch ? (
                <ToggleRight className="w-4 h-4" />
              ) : (
                <ToggleLeft className="w-4 h-4" />
              )}
              <Globe className="w-3 h-3" />
              <span>חיפוש מקוון</span>
            </button>
            {useOnlineResearch && (
              <button
                onClick={() => setShowResearchSettings(true)}
                className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                title="הגדרות חיפוש מקוון"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Knowledge Settings Modal */}
      {showKnowledgeSettings && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-80 mx-4">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-600" />
                <h4 className="font-semibold text-slate-900 text-sm">הגדרות בסיס ידע</h4>
              </div>
              <button
                onClick={() => setShowKnowledgeSettings(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <label className="block text-xs text-slate-600 mb-2">
                הנחיה לסוכן החיפוש בבסיס הידע:
              </label>
              <textarea
                value={knowledgePrompt}
                onChange={(e) => setKnowledgePrompt(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg resize-none focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                rows={4}
                placeholder="הכנס הנחיה מותאמת אישית..."
              />
              <p className="text-xs text-slate-400 mt-2">
                ההנחיה תכוון את הסוכן כיצד לחפש ולהשתמש במידע מבסיס הידע
              </p>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-slate-100">
              <button
                onClick={() => setShowKnowledgeSettings(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                ביטול
              </button>
              <button
                onClick={() => setShowKnowledgeSettings(false)}
                className="px-3 py-1.5 text-xs bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
              >
                שמור
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Research Settings Modal */}
      {showResearchSettings && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-80 mx-4">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <h4 className="font-semibold text-slate-900 text-sm">הגדרות חיפוש מקוון</h4>
              </div>
              <button
                onClick={() => setShowResearchSettings(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <label className="block text-xs text-slate-600 mb-2">
                הנחיה לסוכן החיפוש באינטרנט:
              </label>
              <textarea
                value={researchPrompt}
                onChange={(e) => setResearchPrompt(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg resize-none focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                rows={4}
                placeholder="הכנס הנחיה מותאמת אישית..."
              />
              <p className="text-xs text-slate-400 mt-2">
                ההנחיה תכוון את הסוכן כיצד לחפש מידע באינטרנט ומה להתמקד בו
              </p>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-slate-100">
              <button
                onClick={() => setShowResearchSettings(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                ביטול
              </button>
              <button
                onClick={() => setShowResearchSettings(false)}
                className="px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                שמור
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-slate-400">
              <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">שלום! אני נעמי</p>
              <p className="text-sm mt-1">איך אוכל לעזור לך בכתיבה?</p>
              <p className="text-xs mt-3 text-slate-300">
                {hasPageSelected
                  ? 'בחרת עמוד - אני יכולה לעזור לערוך ולשפר אותו'
                  : 'בחר עמוד או השתמש בפעולות המהירות למטה'
                }
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message flex gap-3 ${
                message.role === 'user' ? 'flex-row-reverse' :
                message.role === 'system' ? 'justify-center' : ''
              }`}
            >
              {/* System Message */}
              {message.role === 'system' ? (
                <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-medium">
                  {message.content}
                </div>
              ) : (
                <>
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                      message.role === 'user'
                        ? 'bg-blue-100'
                        : 'bg-purple-100'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Bot className="w-4 h-4 text-purple-600" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white rounded-tr-sm'
                        : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </>
              )}
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="chat-message flex gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-purple-600" />
            </div>
            <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-2 text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">
                  {useOnlineResearch ? 'נעמי מחפשת באינטרנט...' : useKnowledge ? 'נעמי מחפשת בבסיס הידע...' : 'נעמי מקלידה...'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="כתוב הודעה לנעמי..."
              rows={1}
              className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl resize-none focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-slate-400"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {/* Contextual Quick Actions */}
        <div className="mt-3">
          <p className="text-xs text-slate-400 mb-2">
            {hasPageSelected ? '📄 פעולות לעמוד הנוכחי:' : '📚 פעולות כלליות לספר:'}
          </p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map(action => (
              <button
                key={action.id}
                type="button"
                onClick={() => setInput(action.prompt)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
              >
                {iconMap[action.icon]}
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('he-IL', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function generateDemoResponse(
  input: string,
  context: { title: string; genre: string; currentChapter?: string; currentPage?: string },
  useKnowledge: boolean,
  useOnlineResearch: boolean
): string {
  const lowerInput = input.toLowerCase();

  // Add context indicators
  const notes: string[] = [];
  if (useKnowledge) notes.push('📚 *השתמשתי במידע מבסיס הידע של הספר*');
  if (useOnlineResearch) notes.push('🌐 *השתמשתי במידע מחיפוש באינטרנט*');
  const knowledgeNote = notes.length > 0 ? '\n\n' + notes.join('\n') : '';

  if (lowerInput.includes('עמוד חדש') || lowerInput.includes('הוסף עמוד')) {
    return `מצוין! בואי נוסיף עמוד חדש ל"${context.title}".

לפני שנתחיל, כמה שאלות:
1. **איפה להוסיף?** באיזה פרק ובאיזה מיקום?
2. **סוג העמוד**: עמוד טקסט רגיל או עמוד עם תמונה?
3. **נושא**: מה צריך לקרות בעמוד הזה?

ברגע שתעני, אכתוב טיוטה ראשונה שנוכל לשפר יחד.${knowledgeNote}`;
  }

  if (lowerInput.includes('דמות חדשה') || lowerInput.includes('הוסף דמות')) {
    return `אשמח לעזור ליצור דמות חדשה!

ספרי לי על הדמות:
• **שם ותפקיד**: מה השם ומה תפקידה בסיפור?
• **מראה**: איך היא נראית?
• **אופי**: מה התכונות הבולטות?
• **מניע**: מה מניע אותה?
• **קשרים**: למי היא קשורה בסיפור?

אחרי שנגדיר את הדמות, אציע איפה ואיך להכניס אותה לסיפור.${knowledgeNote}`;
  }

  if (lowerInput.includes('עקביות') || lowerInput.includes('בדוק')) {
    return `ביצעתי בדיקת עקביות ל"${context.title}":

✅ **תקין:**
• קו הזמן של האירועים עקבי
• שמות הדמויות אחידים
• מיקומים מתוארים באופן עקבי

⚠️ **נקודות לבדיקה:**
• בפרק 2, רונית מוזכרת כ"צעירה" אבל גילה לא צוין
• יש חוסר בהירות לגבי הקשר בין הדמויות המשניות

💡 **המלצות:**
• הוסיפי פרטים על גיל הדמות הראשית
• הבהירי את הקשר בין דניאל לשרה${knowledgeNote}`;
  }

  if (lowerInput.includes('שפר') || lowerInput.includes('כתיבה')) {
    const pageName = context.currentPage || 'הקטע הנוכחי';
    return `בדקתי את "${pageName}" והנה הצעות לשיפור:

📝 **סגנון:**
• נסי להחליף "היה/הייתה" בפעלים חזקים יותר
• הוסיפי תיאורים חושיים - ריחות, קולות, מגע

🎯 **מבנה:**
• הפסקה השנייה ארוכה - כדאי לפצל
• הסיום קצת פתאומי - אפשר להוסיף משפט מעבר

💬 **דיאלוג:**
• הדיאלוג טוב אבל אפשר להוסיף שפת גוף
• תני לכל דמות קול ייחודי

רוצה שאציע נוסח מתוקן לקטע ספציפי?${knowledgeNote}`;
  }

  if (lowerInput.includes('הרחב') || lowerInput.includes('סצנה')) {
    return `אשמח להרחיב את הסצנה הנוכחית!

הנה כמה כיוונים להרחבה:
• **תיאור הסביבה**: מה רואים, שומעים, מריחים?
• **מחשבות פנימיות**: מה עובר בראש הדמות?
• **פרטים קטנים**: תנועות, מבטים, אביזרים
• **אטמוספרה**: מה מרגישים במקום?

באיזה כיוון תרצי שאתמקד?${knowledgeNote}`;
  }

  if (lowerInput.includes('דיאלוג')) {
    return `בואי ניצור דיאלוג לסצנה!

כדי לכתוב דיאלוג טוב, צריך:
• **מי מדבר**: אילו דמויות בסצנה?
• **מה המטרה**: מה הדיאלוג צריך להשיג?
• **המתח**: האם יש קונפליקט? הסתרה?

הנה טיוטה ראשונה בהתבסס על הסצנה:

"מה את עושה כאן?" שאל בהפתעה.
"חיכיתי לך," היא ענתה, מבלי להרים את מבטה.
"כמה זמן?"
"מספיק."

רוצה שאשנה משהו או אמשיך?${knowledgeNote}`;
  }

  if (lowerInput.includes('רגשות') || lowerInput.includes('תאר')) {
    return `הנה הצעות להוספת רגשות לסצנה:

**במקום:** "היא הייתה עצובה"
**נסי:** "משהו כבד התיישב על חזה שלה. היא בלעה רוק, אבל הגוש בגרון לא זז."

**במקום:** "הוא כעס"
**נסי:** "אצבעותיו נקפצו לאגרוף. הוא הרגיש את הלסתות נטחנות זו בזו."

**במקום:** "היא שמחה"
**נסי:** "חיוך פרץ ממנה בלי בקשת רשות. הגוף הרגיש קל פתאום, כאילו משהו התרומם מהכתפיים."

רוצה שאכתוב גרסה מורחבת לקטע מהטקסט שלך?${knowledgeNote}`;
  }

  // Default response
  return `תודה על השאלה! אני כאן לעזור לך עם הכתיבה של "${context.title}".

${context.currentChapter ? `אני רואה שאת עובדת על "${context.currentChapter}"${context.currentPage ? ` - "${context.currentPage}"` : ''}. ` : ''}

איך אוכל לעזור לך? אני יכולה:
• 📄 להוסיף עמודים ותוכן חדש
• 👤 לפתח דמויות ולהוסיף חדשות
• ✨ לשפר ולערוך את הכתיבה
• 🔍 לבדוק עקביות ולתת משוב

מה היית רוצה?${knowledgeNote}`;
}
