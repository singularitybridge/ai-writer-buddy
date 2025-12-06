export interface Book {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  genre: string;
  author: string;
  coverImage: string;
  coverPrompt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  bookId: string;
  title: string;
  order: number;
}

export interface Page {
  id: string;
  chapterId: string;
  type: 'text' | 'image';
  title: string;
  content: string;
  imageUrl?: string;
  order: number;
}

export interface ChatMessage {
  id: string;
  bookId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    action?: 'add_page' | 'edit_page' | 'add_character' | 'research' | 'consistency_check';
    pageId?: string;
    chapterId?: string;
  };
}

export interface KnowledgeItem {
  id: string;
  bookId: string;
  title: string;
  content: string;
  category: 'character' | 'location' | 'plot' | 'world' | 'reference' | 'notes';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Character {
  id: string;
  bookId: string;
  name: string;
  description: string;
  role: 'protagonist' | 'antagonist' | 'supporting' | 'minor';
  traits: string[];
  backstory: string;
  relationships: { characterId: string; relationship: string }[];
  imageUrl?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  prompt: string;
  icon: string;
  context: 'book' | 'page' | 'both';
  category: 'create' | 'edit' | 'analyze' | 'research';
}

// Academy Types

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'crud' | 'ai' | 'voice' | 'review' | 'i18n';
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
  techStack: string[];
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
  slug: string;
  title: string;
  description: string;
  category: 'architecture' | 'tech-stack' | 'setup' | 'concepts' | 'tools' | 'roadmap';
  content: string;
  order: number;
  updatedAt: string;
  relatedGuides: string[];
  icon: string;
}

export interface AIToolSetup {
  id: string;
  slug: string;
  toolName: string;
  description: string;
  icon: string;
  setupSteps: {
    order: number;
    title: string;
    instructions: string;
    codeSnippet?: string;
    language?: string;
  }[];
  recommendedConfig: string;
  usageTips: string[];
  officialDocs: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
  requiredPoints?: number;
  requiredChallenges?: string[];
}

export interface Database {
  books: Book[];
  chapters: Chapter[];
  pages: Page[];
  chatMessages: ChatMessage[];
  knowledgeItems: KnowledgeItem[];
  characters: Character[];
  challenges: Challenge[];
  userProgress: UserProgress[];
  techGuides: TechGuide[];
  aiToolSetups: AIToolSetup[];
  badges: Badge[];
}

export interface AcademyData {
  challenges: Challenge[];
  techGuides: TechGuide[];
  aiToolSetups: AIToolSetup[];
  badges: Badge[];
}
