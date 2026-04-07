import { MockTopicAnalyzer } from './mockTopicAnalyzer';
import { OAuthBackendProvider } from './providers/OAuthBackendProvider';
import { OpenAIResponsesProvider } from './providers/OpenAIResponsesProvider';
import type { TopicAnalyzerProvider } from './types';

export type ProviderKind = 'mock' | 'openai-responses' | 'oauth-backend';

interface ProviderFactoryOptions {
  provider: ProviderKind;
  openAIApiKey?: string;
  openAIModel?: string;
  openAIBaseUrl?: string;
  oauthBackendEndpoint?: string;
  getAccessToken?: () => Promise<string | null> | string | null;
}

export function createTopicAnalyzerProvider(options: ProviderFactoryOptions): TopicAnalyzerProvider {
  switch (options.provider) {
    case 'openai-responses':
      if (!options.openAIApiKey) {
        throw new Error('Missing openAIApiKey for openai-responses provider.');
      }
      return new OpenAIResponsesProvider({
        apiKey: options.openAIApiKey,
        model: options.openAIModel,
        baseUrl: options.openAIBaseUrl,
      });

    case 'oauth-backend':
      if (!options.oauthBackendEndpoint) {
        throw new Error('Missing oauthBackendEndpoint for oauth-backend provider.');
      }
      return new OAuthBackendProvider({
        endpoint: options.oauthBackendEndpoint,
        getAccessToken: options.getAccessToken,
      });

    case 'mock':
    default:
      return new MockTopicAnalyzer();
  }
}
