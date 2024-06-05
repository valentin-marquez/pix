import { promises as fs } from "fs";
import { getProcessor } from "./processor-factory";
import { Options, ImageResult } from "./types";

export async function processImage(
  filePath: string,
  options: Options = {}
): Promise<ImageResult> {
  const { quality = 80, maxColors = 10 } = options;
  const buffer = await fs.readFile(filePath);
  const processor = getProcessor(filePath);
  const result = processor(buffer, quality, maxColors);

  // Asegúrate de que el resultado siempre tenga dominantColors
  if (!result.dominantColors) {
    result.dominantColors = [];
  }

  return result;
}

export { Options, ImageResult } from "./types";
export { RGB } from "./types";
export { getProcessor } from "./processor-factory";
