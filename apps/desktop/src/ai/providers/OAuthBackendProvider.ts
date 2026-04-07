import type { TopicAnalyzerProvider, TopicAnalysisInput, TopicAnalysisResult } from '../types';

interface OAuthBackendProviderOptions {
  endpoint: string;
  getAccessToken?: () => Promise<string | null> | string | null;
}

export class OAuthBackendProvider implements TopicAnalyzerProvider {
  private readonly endpoint: string;
  private readonly getAccessToken?: OAuthBackendProviderOptions['getAccessToken'];

  constructor(options: OAuthBackendProviderOptions) {
    this.endpoint = options.endpoint;
    this.getAccessToken = options.getAccessToken;
  }

  async analyze(input: TopicAnalysisInput): Promise<TopicAnalysisResult> {
    const token = this.getAccessToken ? await this.getAccessToken() : null;

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        topic: input.topic,
        session: input.session,
        answer: input.answer,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OAuthBackendProvider: ${response.status} ${errorText}`);
    }

    return (await response.json()) as TopicAnalysisResult;
  }
}
