import type { ProviderKind } from '../ai/providerFactory';

export interface AppConfig {
  serverBaseUrl: string;
  provider: ProviderKind;
}

export const defaultAppConfig: AppConfig = {
  serverBaseUrl: 'http://localhost:8787',
  provider: 'mock',
};
