import bcrypt from 'bcryptjs';
import { config } from './config.js';
import { ChatMessage, ExternalIntegration, User } from './types.js';

const users: User[] = [];
const messages: ChatMessage[] = [];
const integrations: ExternalIntegration[] = [];

export function seedDefaultData() {
  if (users.length > 0) {
    return;
  }

  const passwordHash = bcrypt.hashSync(config.defaultUserPassword, 10);

  users.push({
    id: 'user-admin',
    name: 'Administrator',
    email: config.defaultUserEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
  });

  messages.push({
    id: 'msg-welcome',
    userId: 'user-admin',
    role: 'assistant',
    content: 'Welcome to your LibreChat API. The platform is ready to accept requests.',
    createdAt: new Date().toISOString(),
  });

  integrations.push({
    id: 'integration-duckduckgo',
    name: 'DuckDuckGo Search',
    category: 'search',
    baseUrl: 'https://api.duckduckgo.com/',
    enabled: true,
    createdAt: new Date().toISOString(),
  });
}

export function listUsers() {
  return [...users];
}

export function findUserByEmail(email: string) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string) {
  return users.find((user) => user.id === id);
}

export function createUser({ name, email, passwordHash }: { name: string; email: string; passwordHash: string }) {
  const existingUser = findUserByEmail(email);
  if (existingUser) {
    throw new Error('User already exists.');
  }

  const user: User = {
    id: `user-${crypto.randomUUID()}`,
    name,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  return user;
}

export function listMessagesForUser(userId: string) {
  return messages.filter((message) => message.userId === userId).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function createMessage({ userId, role, content }: { userId: string; role: UserRole; content: string }) {
  const message: ChatMessage = {
    id: `msg-${crypto.randomUUID()}`,
    userId,
    role,
    content,
    createdAt: new Date().toISOString(),
  };

  messages.push(message);
  return message;
}

export function listIntegrations() {
  return [...integrations];
}

export function createIntegration(integration: Omit<ExternalIntegration, 'id' | 'createdAt'>) {
  const item: ExternalIntegration = {
    ...integration,
    id: `int-${crypto.randomUUID()}`,
    createdAt: new Date().toISOString(),
  };
  integrations.push(item);
  return item;
}

export function findIntegrationById(id: string) {
  return integrations.find((integration) => integration.id === id);
}

export function removeIntegrationById(id: string) {
  const index = integrations.findIndex((integration) => integration.id === id);
  if (index === -1) {
    return false;
  }

  integrations.splice(index, 1);
  return true;
}
