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
    // Note: For image-to-image/upscaling, we use the specific model
    const result = await hf.imageToImage({
      data: blob,
      model: 'stabilityai/stable-diffusion-x4-upscaler',
    });

    // Convert blob back to data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(result);
    });
  } catch (err) {
    console.error("Hugging Face API Error:", err);
    throw new Error(`Failed to upscale image: ${err instanceof Error ? err.message : "Unknown error"}`);
  }
};
