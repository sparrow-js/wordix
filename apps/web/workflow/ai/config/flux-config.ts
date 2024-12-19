export const ImageConfig = [
  // {
  //   name: "imagen-3.0",
  //   provider: "gemini",
  //   model: "imagen-3.0-generate-001",
  //   parameters: {
  //     prompt: "a majestic snow-capped mountain peak bathed in a warm glow of the setting sun",
  //     aspectRatio: "3:4",
  //     numberOfImages: 1,
  //     safetyFilterLevel: "block_only_high",
  //     personGeneration: "allow_adult",
  //     negativePrompt: "Outside",
  //   },
  // },
  {
    name: "flux 1.1 pro",
    provider: "flux",
    model: "black-forest-labs/flux-1.1-pro",
    parameters: {
      prompt: 'black forest gateau cake spelling out the words "FLUX 1 . 1 Pro", tasty, food photography',
      aspect_ratio: "1:1",
      output_format: "webp",
      output_quality: 80,
      safety_tolerance: 2,
      prompt_upsampling: true,
    },
  },
  {
    name: "flux dev",
    provider: "flux",
    model: "black-forest-labs/flux-dev",
    parameters: {
      prompt: 'black forest gateau cake spelling out the words "FLUX DEV", tasty, food photography, dynamic shot',
      go_fast: true,
      guidance: 3.5,
      megapixels: "1",
      num_outputs: 1,
      aspect_ratio: "1:1",
      output_format: "webp",
      output_quality: 80,
      prompt_strength: 0.8,
      num_inference_steps: 28,
    },
  },
  {
    name: "flux schnell",
    provider: "flux",
    model: "black-forest-labs/flux-schnell",
    parameters: {
      prompt: 'black forest gateau cake spelling out the words "FLUX SCHNELL", tasty, food photography, dynamic shot',
      go_fast: true,
      megapixels: "1",
      num_outputs: 1,
      aspect_ratio: "1:1",
      output_format: "webp",
      output_quality: 80,
      num_inference_steps: 4,
    },
  },
  {
    name: "flux 1.1 pro ultra",
    provider: "flux",
    model: "black-forest-labs/flux-1.1-pro-ultra",
    parameters: {
      raw: false,
      prompt: "a majestic snow-capped mountain peak bathed in a warm glow of the setting sun",
      aspect_ratio: "3:2",
      output_format: "jpg",
      safety_tolerance: 2,
      image_prompt_strength: 0.1,
    },
  },
];

export const ASPECT_RATIO = [
  { label: "1:1", value: "1:1" },
  { label: "16:9", value: "16:9" },
  { label: "3:2", value: "3:2" },
  { label: "2:3", value: "2:3" },
  { label: "4:5", value: "4:5" },
  { label: "5:4", value: "5:4" },
  { label: "3:4", value: "3:4" },
  { label: "9:21", value: "9:21" },
];

export const MODEL = [
  { label: "Flux Schnell", value: "Flux Schnell" },
  { label: "Flux Dev", value: "Flux Dev" },
  { label: "Flux Pro 1.1", value: "Flux Pro 1.1" },
  { label: "Flux Pro Ultra", value: "Flux Pro Ultra" },
  { label: "Flux Pro Ultra Raw", value: "Flux Pro Ultra Raw" },
  { label: "Stable Diffusion 3", value: "Stable Diffusion 3" },
  { label: "Imagen 3.0", value: "Imagen 3.0" },
];

export const PARAMETER_LIST = [
  { label: "Aspect ratio", value: "aspect_ratio" },
  { label: "Model", value: "model" },
  { label: "Prompt", value: "prompt" },
];

export function getProviderFromModel(modelName: string): string {
  const model = ImageConfig.find((m) => m.model === modelName);
  if (!model) {
    throw new Error(`Model ${modelName} not found`);
  }
  return model.provider;
}

export async function getFormatMessage(message: any[], modelName: string) {
  const model = ImageConfig.find((m) => m.model === modelName);

  return Promise.all(
    message.map(async (m) => {
      return m;
    }),
  );
}
