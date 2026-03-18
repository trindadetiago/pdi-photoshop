import { ImageType } from "../types/process";

export function detectImageType(dataUrl: string): Promise<ImageType> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const sampleStep = Math.max(1, Math.floor(data.length / 4 / 1000));
      let isGray = true;

      for (let i = 0; i < data.length; i += 4 * sampleStep) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        if (r !== g || g !== b) {
          isGray = false;
          break;
        }
      }

      resolve(isGray ? "grayscale" : "color");
    };
    img.src = dataUrl;
  });
}
