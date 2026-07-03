export const upscaleImage = async (imageDataUrl: string): Promise<string> => {
  // Simulate AI API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // For now, return original image as a mock upscaled version
      resolve(imageDataUrl);
    }, 1500);
  });
};
