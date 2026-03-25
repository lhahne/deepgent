import { LLMProvider } from './types';
type ProviderFactory = (config?: Record<string, string>) => LLMProvider;
export declare function registerProvider(name: string, factory: ProviderFactory): void;
export declare function getProvider(name?: string): LLMProvider;
export declare function configureRegistry(options: {
    defaultProvider?: string;
    env?: Record<string, string>;
}): void;
export declare function clearProviderCache(): void;
export {};
//# sourceMappingURL=registry.d.ts.map