import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { LanguageModel } from 'ai';

export type ModelAlias = 
  | 'otto:frontier'
  | 'otto:balanced'
  | 'otto:fast'
  | 'otto:reasoning';

interface ModelConfig {
  provider: 'anthropic' | 'openrouter';
  modelId: string;
}

export const MODEL_REGISTRY: Record<ModelAlias, ModelConfig> = {
  'otto:frontier': {
    provider: 'anthropic',
    modelId: 'claude-3-5-sonnet-20240620', // or 20241022
  },
  'otto:balanced': {
    provider: 'anthropic',
    modelId: 'claude-3-haiku-20240307',
  },
  'otto:fast': {
    provider: 'openrouter',
    modelId: 'meta-llama/llama-3-8b-instruct',
  },
  'otto:reasoning': {
    provider: 'anthropic',
    modelId: 'claude-3-opus-20240229',
  }
};

export interface AIProviderConfig {
  anthropicApiKey?: string;
  openrouterApiKey?: string;
}

export function getModel(alias: ModelAlias, config: AIProviderConfig): LanguageModel {
  const modelConfig = MODEL_REGISTRY[alias];
  if (!modelConfig) {
    throw new Error(`Unknown model alias: ${alias}`);
  }

  if (modelConfig.provider === 'anthropic') {
    if (!config.anthropicApiKey) {
      throw new Error('Anthropic API key is required for this model');
    }
    const anthropic = createAnthropic({ apiKey: config.anthropicApiKey });
    return anthropic(modelConfig.modelId);
  }

  if (modelConfig.provider === 'openrouter') {
    if (!config.openrouterApiKey) {
      throw new Error('OpenRouter API key is required for this model');
    }
    const openrouter = createOpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: config.openrouterApiKey,
    });
    return openrouter(modelConfig.modelId);
  }

  throw new Error(`Unsupported provider: ${(modelConfig as any).provider}`);
}
