export const upscaleImage = async (imageDataUrl: string): Promise<string> => {
  const HF_API_TOKEN = import.meta.env.VITE_HF_API_TOKEN;
  console.log("Token length:", HF_API_TOKEN?.length || 0);

  if (!HF_API_TOKEN) {
    throw new Error("Missing Hugging Face API Token. Please set VITE_HF_API_TOKEN in your .env file.");
  }

  // Convert base64 data URL to blob
  let blob: Blob;
  try {
    const arr = imageDataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    blob = new Blob([u8arr], { type: mime });
  } catch (err) {
    throw new Error(`Failed to convert image data: ${err instanceof Error ? err.message : "Unknown error"}`);
  }

  const API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-x4-upscaler";

  try {
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
  } catch (err) {
    throw new Error(`Network or API error: ${err instanceof Error ? err.message : "Unknown error"}`);
  }
};
