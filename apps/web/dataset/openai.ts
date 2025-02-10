import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: "",
  baseURL: "https://api.openai.com/v1",
});
