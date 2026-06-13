export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'admin' | 'super_admin';
  avatar: string | null;
  date_joined: string;
  streak_days: number;
  total_correct_answers: number;
  total_quizzes_taken: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
}

export interface AuthResponse {
  user: User;
  tokens: Tokens;
}

export interface Tokens {
  access: string;
  refresh: string;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'draft' | 'published' | 'archived';
  time_limit: number;
  max_attempts?: number;
  shuffle_questions?: boolean;
  shuffle_answers?: boolean;
  question_count: number;
  created_by_name: string;
  created_at: string;
  updated_at?: string;
  attempt_count: number;
  avg_score: number;
  questions?: Question[];
}

export interface Question {
  id: number;
  text: string;
  order: number;
  image: string | null;
  points: number;
  explanation?: string;
  answers: Answer[];
}

export interface Answer {
  id: number;
  text: string;
  order: number;
  is_correct?: boolean;
}

export interface QuizStartResponse {
  quiz_id: number;
  title: string;
  time_limit: number;
  question_count: number;
  questions: Question[];
  started_at: string;
}

export interface AttemptSubmit {
  quiz_id: number;
  started_at: string;
  time_spent: number;
  answers: AttemptAnswerSubmit[];
}

export interface AttemptAnswerSubmit {
  question_id: number;
  answer_id: number | null;
}

export interface Attempt {
  id: number;
  quiz_id: number;
  quiz_title: string;
  started_at: string;
  completed_at: string;
  time_spent: number;
  score: number;
  max_score: number;
  percentage: number;
  is_completed: boolean;
  is_cheating?: boolean;
  answers?: AttemptAnswer[];
}

export interface AttemptAnswer {
  id: number;
  question_id: number;
  question_text: string;
  selected_answer_id: number | null;
  selected_answer_text: string | null;
  is_correct: boolean;
  correct_answer_text: string | null;
  answered_at: string;
}

export interface Ranking {
  id: number;
  user_id: number;
  username: string;
  ranking_type: string;
  quiz_id: number | null;
  quiz_title: string | null;
  rank: number;
  score: number;
  total_quizzes: number;
  avg_percentage: number;
  period_start: string | null;
  period_end: string | null;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  badge_type: string;
  difficulty: 'bronze' | 'silver' | 'gold' | 'platinum';
  icon: string;
  threshold: number;
  is_active: boolean;
  is_unlocked?: boolean;
  unlocked_at?: string | null;
}

export interface UserBadge {
  id: number;
  badge: Badge;
  unlocked_at: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  is_global: boolean;
  quiz_title: string | null;
  badge_name: string | null;
  related_quiz_id: number | null;
  related_badge_id: number | null;
  created_at: string;
}

export interface UserStats {
  total_quizzes: number;
  avg_score: number;
  best_score: { quiz: string; score: number } | null;
  total_time: number;
  streak_days: number;
  total_correct_answers: number;
  quiz_stats: QuizStat[];
}

export interface QuizStat {
  quiz_id: number;
  quiz_title: string;
  attempts: number;
  best_score: number;
  avg_score: number;
}

export interface AdminStats {
  total_users: number;
  total_quizzes: number;
  total_attempts: number;
  active_users: number;
}
