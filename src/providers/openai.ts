import OpenAI from 'openai'
import { LLMProvider, LLMRequest, LLMResponse, LLMStreamChunk } from './types'

export interface OpenAIProviderConfig {
  apiKey?: string
  baseURL?: string
  organization?: string
}

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI

  constructor(config: OpenAIProviderConfig = {}) {
    this.client = new OpenAI({
      apiKey: config.apiKey ?? process.env.OPENAI_API_KEY,
      baseURL: config.baseURL ?? process.env.OPENAI_BASE_URL,
      organization: config.organization ?? process.env.OPENAI_ORGANIZATION,
    })
  }

  async complete(req: LLMRequest): Promise<LLMResponse> {
    const completion = await this.client.chat.completions.create({
      model: req.model,
      messages: req.messages,
      temperature: req.temperature,
      max_tokens: req.maxTokens,
      stream: false,
    })

    const choice = completion.choices[0]
    return {
      content: choice.message.content ?? '',
      model: completion.model,
      usage: {
        promptTokens: completion.usage?.prompt_tokens ?? 0,
        completionTokens: completion.usage?.completion_tokens ?? 0,
        totalTokens: completion.usage?.total_tokens ?? 0,
      },
      finishReason: choice.finish_reason ?? 'stop',
    }
  }

  async *stream(req: LLMRequest): AsyncIterable<LLMStreamChunk> {
    const stream = await this.client.chat.completions.create({
      model: req.model,
      messages: req.messages,
      temperature: req.temperature,
      max_tokens: req.maxTokens,
      stream: true,
    })

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content ?? ''
      const finishReason = chunk.choices[0]?.finish_reason
      yield {
        delta,
        done: finishReason !== undefined && finishReason !== null,
      }
    }
  }
}
