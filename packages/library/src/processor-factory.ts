import path from "path";
import { ImageProcessorFactory, ImageResult } from "./types";

const imageProcessorFactory: ImageProcessorFactory = {
  png: () => {
    throw new Error("Not implemented");
  },
  jpg: () => {
    throw new Error("Not implemented");
  },
  gif: () => {
    throw new Error("Not implemented");
  },
  bmp: () => {
    throw new Error("Not implemented");
  },
  webp: () => {
    throw new Error("Not implemented");
  },
};

export function initFactory(addonPath: string): void {
  const addon = require(addonPath);
  imageProcessorFactory.png = addon.png;
  imageProcessorFactory.jpg = addon.jpg;
  imageProcessorFactory.gif = addon.gif;
  imageProcessorFactory.bmp = addon.bmp;
  imageProcessorFactory.webp = addon.webp;
}

export function getProcessor(
  filePath: string
): (buffer: Buffer, quality: number, maxColors: number) => ImageResult {
  const ext = path.extname(filePath).toLowerCase().slice(1);
  const processor =
    imageProcessorFactory[ext as keyof typeof imageProcessorFactory] ||
    (ext === "jpeg" ? imageProcessorFactory.jpg : undefined);

  if (!processor) {
    throw new Error(`Unsupported image format: ${ext}`);
  }

  return processor;
}

initFactory(path.join(__dirname, "..", "addon.node"));
