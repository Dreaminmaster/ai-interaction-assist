import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 8787),
  openAIApiKey: process.env.OPENAI_API_KEY || '',
  openAIModel: process.env.OPENAI_MODEL || 'gpt-5',
  openAIBaseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  oauthBackendUpstream: process.env.OAUTH_BACKEND_UPSTREAM || '',
};
