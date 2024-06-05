export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface ImageResult {
  dominantColors: RGB[];
  palette: RGB[];
}

export interface Options {
  quality?: number;
  maxColors?: number;
}

export interface ImageProcessorFactory {
  png: (buffer: Buffer, quality: number, maxColors: number) => ImageResult;
  jpg: (buffer: Buffer, quality: number, maxColors: number) => ImageResult;
  gif: (buffer: Buffer, quality: number, maxColors: number) => ImageResult;
  bmp: (buffer: Buffer, quality: number, maxColors: number) => ImageResult;
  webp: (buffer: Buffer, quality: number, maxColors: number) => ImageResult;
}
