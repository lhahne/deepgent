export interface LLMMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface LLMRequest {
    messages: LLMMessage[];
    model: string;
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
}
export interface LLMResponse {
    content: string;
    model: string;
    usage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    finishReason: string;
}
export interface LLMStreamChunk {
    delta: string;
    done: boolean;
}
export interface LLMProvider {
    complete(req: LLMRequest): Promise<LLMResponse>;
    stream(req: LLMRequest): AsyncIterable<LLMStreamChunk>;
}
//# sourceMappingURL=types.d.ts.map