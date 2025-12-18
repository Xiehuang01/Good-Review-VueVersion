export interface Option {
  label: string;
  text: string;
}

export interface QuestionItem {
  id: number;
  type: string; // "单选", "多选", "判断", "填空", etc.
  title: string;
  options: Option[];
  correctAnswer: string[];
  selectedAnswer: string[]; // From the scrape, ignored during practice usually
  images: string[];
}

export interface ScrapedData {
  source: string;
  ts: number;
  items: QuestionItem[];
}

export interface QuestionBank {
  id: string;
  name: string;
  createdAt: number;
  questions: QuestionItem[];
}

export type ViewState = 'HOME' | 'IMPORT' | 'DASHBOARD' | 'QUIZ';

export interface QuizSessionState {
  bankId: string;
  currentIndex: number;
  answers: Record<number, string[]>; // questionId -> selected answers
  showResult: boolean; // if true, show if answer was correct immediately or at end
}
