import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 8787),
  autoOpenBrowser: String(process.env.AUTO_OPEN_BROWSER || 'true').toLowerCase() === 'true',
  openAIApiKey: process.env.OPENAI_API_KEY || '',
  openAIModel: process.env.OPENAI_MODEL || 'gpt-5',
  openAIBaseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  oauthBackendUpstream: process.env.OAUTH_BACKEND_UPSTREAM || '',
  localModelBaseUrl: process.env.LOCAL_MODEL_BASE_URL || 'http://127.0.0.1:1234/v1',
  localModelApiKey: process.env.LOCAL_MODEL_API_KEY || '',
  localModelName: process.env.LOCAL_MODEL_NAME || 'local-model',
};
