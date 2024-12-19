import {
  GoogleGenerativeAI,
  // HarmCategory,
  // HarmBlockThreshold,
  type Part,
} from "@google/generative-ai";

import type { ModelConfig } from "../config/model-configs";
import { BaseAIProvider, type Message } from "./base";
const { setGlobalDispatcher, ProxyAgent } = require("undici");
const dispatcher = new ProxyAgent({ uri: new URL("http://127.0.0.1:7890").toString() });
//全局fetch调用启用代理
setGlobalDispatcher(dispatcher);

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
    messages: string | Array<string | Part> | Message[],
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

    let messageParts: string | Array<string | Part> = [];

    if (Array.isArray(messages) && messages.length > 0 && typeof messages[0] === "object" && "role" in messages[0]) {
      messageParts = messages[0].content as Array<string | Part>;
    } else {
      messageParts = messages as Array<string | Part>;
    }

    const result = await chatSession.sendMessageStream(messageParts);

    let text = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      onText(chunkText);
      text += chunkText;
    }

    return text;
  }

  async generateImage(prompt: string, modelName?: string, options?: Partial<ModelConfig>): Promise<{ output: string }> {
    // const model = this.gemini.getImageGenerationModel({ model: "imagen-3.0-generate-001" });
    // const result = await model.generateImages({
    //   prompt,
    //   aspectRatio: "3:4",
    //   numberOfImages: 1,
    //   safetyFilterLevel: "block_only_high",
    //   personGeneration: "allow_adult",
    //   negativePrompt: "Outside",
    // });

    return {
      output: "",
    };
  }
}
