'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  Code2,
  Lightbulb,
  HelpCircle,
  Rocket,
  CheckCircle,
  BookOpen
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

interface QuickAction {
  id: string;
  labelEn: string;
  labelHe: string;
  promptEn: string;
  promptHe: string;
  icon: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'explain',
    labelEn: 'Explain this',
    labelHe: 'הסבר לי',
    promptEn: 'Can you explain the current topic in simpler terms?',
    promptHe: 'אתה יכול להסביר לי את הנושא הנוכחי במילים פשוטות?',
    icon: 'HelpCircle'
  },
  {
    id: 'example',
    labelEn: 'Show example',
    labelHe: 'הראה דוגמה',
    promptEn: 'Show me a practical code example for this concept.',
    promptHe: 'הראה לי דוגמת קוד מעשית לקונספט הזה.',
    icon: 'Code2'
  },
  {
    id: 'hint',
    labelEn: 'Give me a hint',
    labelHe: 'תן רמז',
    promptEn: 'I\'m stuck. Can you give me a hint without giving away the answer?',
    promptHe: 'אני תקוע. אתה יכול לתת לי רמז בלי לחשוף את התשובה?',
    icon: 'Lightbulb'
  },
  {
    id: 'next',
    labelEn: 'What\'s next?',
    labelHe: 'מה הלאה?',
    promptEn: 'What should I learn or do next after completing this?',
    promptHe: 'מה כדאי לי ללמוד או לעשות אחרי שאסיים את זה?',
    icon: 'Rocket'
  },
];

const iconMap: Record<string, React.ReactNode> = {
  HelpCircle: <HelpCircle className="w-3 h-3" />,
  Code2: <Code2 className="w-3 h-3" />,
  Lightbulb: <Lightbulb className="w-3 h-3" />,
  Rocket: <Rocket className="w-3 h-3" />,
  CheckCircle: <CheckCircle className="w-3 h-3" />,
  BookOpen: <BookOpen className="w-3 h-3" />,
};

export default function AcademyChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();
  const locale = useLocale();
  const isHebrew = locale === 'he';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset chat when page changes
  useEffect(() => {
    setMessages([]);
  }, [pathname]);

  const getPageContext = () => {
    if (pathname.includes('/challenges/')) {
      return isHebrew ? 'משימת אקדמיה' : 'Academy Challenge';
    }
    if (pathname.includes('/guides/')) {
      return isHebrew ? 'מדריך טכני' : 'Technical Guide';
    }
    if (pathname.includes('/tools/')) {
      return isHebrew ? 'כלי AI' : 'AI Tool';
    }
    if (pathname === '/academy/challenges') {
      return isHebrew ? 'רשימת משימות' : 'Challenges List';
    }
    if (pathname === '/academy/guides') {
      return isHebrew ? 'רשימת מדריכים' : 'Guides List';
    }
    if (pathname === '/academy/tools') {
      return isHebrew ? 'רשימת כלים' : 'Tools List';
    }
    return isHebrew ? 'לוח בקרה' : 'Dashboard';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
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
        role: 'assistant',
        content: generateDemoResponse(input.trim(), getPageContext(), isHebrew),
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

  const handleQuickAction = (action: QuickAction) => {
    setInput(isHebrew ? action.promptHe : action.promptEn);
  };

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
              <h3 className="font-semibold text-slate-900">
                {isHebrew ? 'אלכס' : 'Alex'}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>{isHebrew ? 'מדריך אקדמיה חכם' : 'Smart Academy Guide'}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Context Badge */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
        <p className="text-xs text-slate-500">
          {isHebrew ? 'הקשר:' : 'Context:'} <span className="text-slate-700 font-medium">{getPageContext()}</span>
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-slate-400">
              <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">{isHebrew ? 'היי! אני אלכס' : 'Hi! I\'m Alex'}</p>
              <p className="text-sm mt-1">
                {isHebrew
                  ? 'איך אוכל לעזור לך ללמוד?'
                  : 'How can I help you learn?'}
              </p>
              <p className="text-xs mt-3 text-slate-300">
                {isHebrew
                  ? 'שאל אותי על קוד, קונספטים, או השתמש בפעולות המהירות למטה'
                  : 'Ask me about code, concepts, or use the quick actions below'}
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
              {message.role === 'system' ? (
                <div className="bg-purple-50 text-purple-600 px-4 py-2 rounded-full text-xs font-medium">
                  {message.content}
                </div>
              ) : (
                <>
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

        {isLoading && (
          <div className="chat-message flex gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-purple-600" />
            </div>
            <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-2 text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">
                  {isHebrew ? 'אלכס מקליד...' : 'Alex is typing...'}
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
              placeholder={isHebrew ? 'שאל את אלכס...' : 'Ask Alex...'}
              rows={1}
              className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl resize-none focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-sm placeholder:text-slate-400"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {/* Quick Actions */}
        <div className="mt-3">
          <div className="flex flex-wrap gap-2">
            {quickActions.map(action => (
              <button
                key={action.id}
                type="button"
                onClick={() => handleQuickAction(action)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
              >
                {iconMap[action.icon]}
                {isHebrew ? action.labelHe : action.labelEn}
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
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function generateDemoResponse(input: string, context: string, isHebrew: boolean): string {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes('explain') || lowerInput.includes('הסבר')) {
    return isHebrew
      ? `בטח! בוא נפרק את הנושא לחלקים פשוטים יותר.

**${context}**

הרעיון המרכזי הוא:
1. להבין את הבעיה שאנחנו מנסים לפתור
2. לפרק אותה לצעדים קטנים
3. ליישם כל צעד בנפרד

רוצה שאעמיק בחלק מסוים?`
      : `Sure! Let me break this down into simpler parts.

**${context}**

The core idea is:
1. Understand the problem we're trying to solve
2. Break it down into small steps
3. Implement each step separately

Want me to dive deeper into a specific part?`;
  }

  if (lowerInput.includes('example') || lowerInput.includes('דוגמ')) {
    return isHebrew
      ? `הנה דוגמת קוד פשוטה:

\`\`\`typescript
// דוגמה בסיסית
const example = async () => {
  const result = await fetchData();
  console.log(result);
};
\`\`\`

הקוד הזה מדגים:
• שימוש ב-async/await
• קריאה לפונקציה אסינכרונית
• הדפסת התוצאה

רוצה לראות דוגמה יותר מתקדמת?`
      : `Here's a simple code example:

\`\`\`typescript
// Basic example
const example = async () => {
  const result = await fetchData();
  console.log(result);
};
\`\`\`

This code demonstrates:
• Using async/await
• Calling an async function
• Logging the result

Want to see a more advanced example?`;
  }

  if (lowerInput.includes('hint') || lowerInput.includes('רמז')) {
    return isHebrew
      ? `הנה רמז בלי לחשוף יותר מדי:

💡 **רמז:** חשוב על איך הנתונים זורמים במערכת.

שאלות מנחות:
• מאיפה המידע מגיע?
• איפה הוא מעובד?
• לאן הוא צריך להגיע?

נסה לעקוב אחרי הזרימה הזו בקוד. אם עדיין תקוע, אני כאן לעזור!`
      : `Here's a hint without giving too much away:

💡 **Hint:** Think about how data flows through the system.

Guiding questions:
• Where does the data come from?
• Where is it processed?
• Where does it need to go?

Try following this flow in the code. If you're still stuck, I'm here to help!`;
  }

  if (lowerInput.includes('next') || lowerInput.includes('הלאה')) {
    return isHebrew
      ? `מצוין שאתה שואל! הנה מה שכדאי לך לעשות אחרי ${context}:

**צעדים הבאים:**
1. ✅ סיים את המשימה הנוכחית
2. 📚 עבור למדריך הבא ברצף
3. 🔧 תרגל עם פרויקט אמיתי

**המלצה אישית:**
הכי חשוב לתרגל! נסה ליישם מה שלמדת בפרויקט קטן משלך.

רוצה שאציע פרויקט תרגול?`
      : `Great that you're asking! Here's what you should do after ${context}:

**Next steps:**
1. ✅ Complete the current task
2. 📚 Move to the next guide in sequence
3. 🔧 Practice with a real project

**Personal recommendation:**
Practice is key! Try applying what you learned in a small project of your own.

Want me to suggest a practice project?`;
  }

  // Default response
  return isHebrew
    ? `שאלה טובה! אני כאן לעזור לך עם ${context}.

אני יכול לעזור לך עם:
• 📖 הסברים על קונספטים
• 💻 דוגמאות קוד
• 💡 רמזים למשימות
• 🚀 המלצות להמשך

מה היית רוצה לדעת?`
    : `Good question! I'm here to help you with ${context}.

I can help you with:
• 📖 Concept explanations
• 💻 Code examples
• 💡 Task hints
• 🚀 Next step recommendations

What would you like to know?`;
}
