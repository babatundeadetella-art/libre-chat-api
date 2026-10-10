import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? 'development-secret',
  appName: process.env.APP_NAME ?? 'libre-chat-api',
  defaultUserEmail: process.env.DEFAULT_USER_EMAIL ?? 'admin@librechat.local',
  defaultUserPassword: process.env.DEFAULT_USER_PASSWORD ?? 'admin123',
};
