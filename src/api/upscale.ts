import { HfInference } from '@huggingface/inference';

export const upscaleImage = async (imageDataUrl: string): Promise<string> => {
  const HF_API_TOKEN = import.meta.env.VITE_HF_API_TOKEN;

  if (!HF_API_TOKEN) {
    throw new Error("Missing Hugging Face API Token. Please set VITE_HF_API_TOKEN in your .env file.");
  }

  const hf = new HfInference(HF_API_TOKEN);

  try {
    // Fetch the data URL as a blob
    const response = await fetch(imageDataUrl);
    const blob = await response.blob();

    // Use the official inference library
    const result = await hf.imageToImage({
      inputs: blob,
      model: 'stabilityai/stable-diffusion-x4-upscaler',
    });

    // Explicitly cast result to Blob for the FileReader
    const resultBlob = result instanceof Blob ? result : new Blob([result as any]);

    // Convert blob back to data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(resultBlob);
    });
  } catch (err) {
    console.error("Hugging Face API Error:", err);
    throw new Error(`Failed to upscale image: ${err instanceof Error ? err.message : "Unknown error"}`);
  }
};
