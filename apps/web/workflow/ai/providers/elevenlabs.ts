import { put } from "@vercel/blob";
import { ElevenLabsClient } from "elevenlabs";
import { v4 as uuidv4 } from "uuid";
import type { ModelConfig } from "../config/model-configs";
import type { AIProvider } from "./base";

export class ElevenlabsProvider implements AIProvider {
  private client: ElevenLabsClient;

  constructor(apiKey: string, defaultModel: string, modelConfigs: Record<string, ModelConfig>) {
    this.client = new ElevenLabsClient({
      apiKey: "sk_330767afcd775d98cdfa6b71717ada61997d84333415dbea", // Defaults to process.env.ELEVENLABS_API_KEY
    });
  }

  async textToSpeech(text: string, options?: any): Promise<{ output: string }> {
    try {
      const audio = await this.client.generate({
        stream: true,
        text,
        voice: options?.voice || "Sarah",
        model_id: options?.model_id || "eleven_multilingual_v2",
      });

      // Convert the stream to buffer, then to base64
      const chunks = [];
      for await (const chunk of audio) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      // @ts-ignore
      const { url } = await put(`audio/${uuidv4()}.mp3`, buffer, {
        access: "public",
      });

      return { output: url };
    } catch (error) {
      throw new Error(`ElevenLabs TTS error: ${error.message}`);
    }
  }
}
