export const upscaleImage = async (imageDataUrl: string): Promise<string> => {
  const HF_API_TOKEN = import.meta.env.VITE_HF_API_TOKEN;
  if (!HF_API_TOKEN) {
    throw new Error("Missing Hugging Face API Token. Please set VITE_HF_API_TOKEN in your .env file.");
  }

  // Convert base64 data URL to blob
  const response = await fetch(imageDataUrl);
  const blob = await response.blob();

  const API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-x4-upscaler";

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_API_TOKEN}`,
      "Content-Type": "application/octet-stream",
    },
    body: blob,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to upscale image: ${res.statusText}`);
  }

  const resultBlob = await res.blob();

  // Convert blob back to data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(resultBlob);
  });
};
