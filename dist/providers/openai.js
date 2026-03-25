"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIProvider = void 0;
const openai_1 = __importDefault(require("openai"));
class OpenAIProvider {
    client;
    constructor(config = {}) {
        this.client = new openai_1.default({
            apiKey: config.apiKey ?? process.env.OPENAI_API_KEY,
            baseURL: config.baseURL ?? process.env.OPENAI_BASE_URL,
            organization: config.organization ?? process.env.OPENAI_ORGANIZATION,
        });
    }
    async complete(req) {
        const completion = await this.client.chat.completions.create({
            model: req.model,
            messages: req.messages,
            temperature: req.temperature,
            max_tokens: req.maxTokens,
            stream: false,
        });
        const choice = completion.choices[0];
        return {
            content: choice.message.content ?? '',
            model: completion.model,
            usage: {
                promptTokens: completion.usage?.prompt_tokens ?? 0,
                completionTokens: completion.usage?.completion_tokens ?? 0,
                totalTokens: completion.usage?.total_tokens ?? 0,
            },
            finishReason: choice.finish_reason ?? 'stop',
        };
    }
    async *stream(req) {
        const stream = await this.client.chat.completions.create({
            model: req.model,
            messages: req.messages,
            temperature: req.temperature,
            max_tokens: req.maxTokens,
            stream: true,
        });
        for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content ?? '';
            const finishReason = chunk.choices[0]?.finish_reason;
            yield {
                delta,
                done: finishReason !== undefined && finishReason !== null,
            };
        }
    }
}
exports.OpenAIProvider = OpenAIProvider;
//# sourceMappingURL=openai.js.map