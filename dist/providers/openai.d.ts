import { LLMProvider, LLMRequest, LLMResponse, LLMStreamChunk } from './types';
export interface OpenAIProviderConfig {
    apiKey?: string;
    baseURL?: string;
    organization?: string;
}
export declare class OpenAIProvider implements LLMProvider {
    private client;
    constructor(config?: OpenAIProviderConfig);
    complete(req: LLMRequest): Promise<LLMResponse>;
    stream(req: LLMRequest): AsyncIterable<LLMStreamChunk>;
}
//# sourceMappingURL=openai.d.ts.map