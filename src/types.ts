export type UserRole = 'user' | 'assistant';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  role: UserRole;
  content: string;
  createdAt: string;
}

export interface ExternalIntegration {
  id: string;
  name: string;
  category: 'social' | 'weather' | 'news' | 'search' | 'custom';
  baseUrl: string;
  authToken?: string;
  enabled: boolean;
  createdAt: string;
}

export interface AuthenticatedRequest {
  user?: User;
}

export interface FetchResult {
  ok: boolean;
  status: number;
  headers: Record<string, string>;
  data: unknown;
}
