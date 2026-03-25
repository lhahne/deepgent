import { LLMProvider } from './types'
import { OpenAIProvider, OpenAIProviderConfig } from './openai'

type ProviderFactory = (config?: Record<string, string>) => LLMProvider

const factories: Record<string, ProviderFactory> = {
  openai: (config?: Record<string, string>) =>
    new OpenAIProvider(config as OpenAIProviderConfig),
}

let defaultProviderName: string | undefined
let defaultConfig: Record<string, string>
let providerCache: Map<string, LLMProvider> = new Map()

export function registerProvider(
  name: string,
  factory: ProviderFactory
): void {
  factories[name] = factory
}

export function getProvider(name?: string): LLMProvider {
  const providerName = name ?? defaultProviderName ?? 'openai'

  if (providerCache.has(providerName)) {
    return providerCache.get(providerName)!
  }

  const factory = factories[providerName]
  if (!factory) {
    throw new Error(`Unknown provider: ${providerName}`)
  }

  const provider = factory(defaultConfig)
  providerCache.set(providerName, provider)
  return provider
}

export function configureRegistry(options: {
  defaultProvider?: string
  env?: Record<string, string>
}): void {
  defaultProviderName = options.defaultProvider ?? process.env.DEFAULT_PROVIDER
  defaultConfig = options.env ?? process.env as Record<string, string>
}

export function clearProviderCache(): void {
  providerCache.clear()
}
