export interface RGB {
  r: number; // Red component (0-255)
  g: number; // Green component (0-255)
  b: number; // Blue component (0-255)
}

export interface ImageResult {
  dominantColors: RGB[];
  palette: RGB[];
}

export interface Options {
  quality?: number; // Quality of color extraction (1-100)
  maxColors?: number; // Maximum number of colors to extract
}

export interface ImageProcessorFactory {
  png: (buffer: Buffer, quality: number, maxColors: number) => ImageResult;
  jpg: (buffer: Buffer, quality: number, maxColors: number) => ImageResult;
  gif: (buffer: Buffer, quality: number, maxColors: number) => ImageResult;
  bmp: (buffer: Buffer, quality: number, maxColors: number) => ImageResult;
  webp: (buffer: Buffer, quality: number, maxColors: number) => ImageResult;
}
