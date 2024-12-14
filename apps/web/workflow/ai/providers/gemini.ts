import {
  GoogleGenerativeAI,
  // HarmCategory,
  // HarmBlockThreshold,
  type Part,
} from "@google/generative-ai";

import type { ModelConfig } from "../config/model-configs";
import { BaseAIProvider, type Message } from "./base";

const apiKey = process.env.GEMINI_API_KEY;

export class GeminiProvider extends BaseAIProvider {
  private gemini = new GoogleGenerativeAI(apiKey);

  constructor(apiKey: string, defaultModel: string, modelConfigs: Record<string, ModelConfig>) {
    super(apiKey, defaultModel, modelConfigs);
    console.log("GeminiProvider constructor");
  }

  async generateText(prompt: string, modelName?: string, options?: Partial<ModelConfig>): Promise<string> {
    const model = this.gemini.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  }

  async streamText(
    prompt: string,
    onText: (text: string) => void,
    modelName?: string,
    options?: Partial<ModelConfig>,
  ): Promise<string> {
    const model = this.gemini.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
    });

    const result = await model.generateContentStream(prompt);

    let text = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      onText(chunkText);
      text += chunkText;
    }

    return text;
  }

  async generateChat(messages: Message[], modelName?: string, options?: Partial<ModelConfig>): Promise<string> {
    // const config = this.getModelConfig(modelName, options);
    const model = this.gemini.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage("Hello, how are you?");

    const response = await result.response;
    const text = response.text();

    return text;
  }

  async streamChat(
    messages: string | Array<string | Part>,
    onText: (text: string) => void,
    modelName?: string,
    options?: Partial<ModelConfig>,
  ): Promise<string> {
    const model = this.gemini.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessageStream(messages);

    let text = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      onText(chunkText);
      text += chunkText;
    }

    return text;
  }
}
