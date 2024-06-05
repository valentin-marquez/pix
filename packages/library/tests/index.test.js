// @ts-check
const path = require('path');
// import { getProcessor, processImage } from "../dist/index";
const { getProcessor, processImage } = require('../dist/index.cjs');
// Ruta al directorio de medios de prueba
const MEDIA_DIR = path.join(__dirname, 'media');

// Función auxiliar para obtener la ruta completa de un archivo
const getMediaPath = (file) => path.join(MEDIA_DIR, file);

describe('Factory Pattern', () => {
  test('getProcessor returns correct function for each image type', () => {
    const pngProcessor = getProcessor('image.png');
    const jpgProcessor = getProcessor('image.jpg');
    const gifProcessor = getProcessor('image.gif');
    const bmpProcessor = getProcessor('image.bmp');
    const webpProcessor = getProcessor('image.webp');
    const jpegProcessor = getProcessor('image.jpeg');

    expect(typeof pngProcessor).toBe('function');
    expect(typeof jpgProcessor).toBe('function');
    expect(typeof gifProcessor).toBe('function');
    expect(typeof bmpProcessor).toBe('function');
    expect(typeof webpProcessor).toBe('function');
    expect(jpegProcessor).toBe(jpgProcessor);
  });

  test('getProcessor throws for unsupported image type', () => {
    expect(() => getProcessor('image.tiff')).toThrow('Unsupported image format: tiff');
    expect(() => getProcessor('image.svg')).toThrow('Unsupported image format: svg');
  });
});

describe('Image Processing', () => {
  test('processImage handles PNG correctly', async () => {
    const result = await processImage(getMediaPath('test.png'));
    expect(result).toHaveProperty('dominantColors');
    expect(result).toHaveProperty('palette');
    expect(Array.isArray(result.dominantColors)).toBe(true);
    expect(Array.isArray(result.palette)).toBe(true);
  });

  test('processImage handles JPG correctly', async () => {
    const result = await processImage(getMediaPath('test.jpg'));
    expect(result).toHaveProperty('dominantColors');
    expect(result).toHaveProperty('palette');
  });

  test.each([
    ['gif', 'test.gif'],
    ['bmp', 'test.bmp'],
    ['webp', 'test.webp']
  ])('processImage handles %s correctly', async (format, file) => {
    const result = await processImage(getMediaPath(file));
    expect(result).toHaveProperty('dominantColors');
    expect(result).toHaveProperty('palette');
  });

  test('processImage respects options', async () => {
    const highQuality = await processImage(getMediaPath('test.png'), { quality: 95 });
    const lowQuality = await processImage(getMediaPath('test.png'), { quality: 50 });
    const manyColors = await processImage(getMediaPath('test.png'), { maxColors: 20 });
    const fewColors = await processImage(getMediaPath('test.png'), { maxColors: 3 });

    expect(highQuality.palette.length).toBeGreaterThan(lowQuality.palette.length);
    expect(manyColors.palette.length).toBe(20);
    expect(fewColors.palette.length).toBe(3);
  });

  test('processImage handles errors gracefully', async () => {
    await expect(processImage('nonexistent.png')).rejects.toThrow();
    await expect(processImage(getMediaPath('test.txt'))).rejects.toThrow('Unsupported image format: txt');
  });
});

describe('Color Output', () => {
  test('RGB values are within valid range', async () => {
    const { dominantColors, palette } = await processImage(getMediaPath('test.png'));
    const allColors = [...(dominantColors || []), ...(palette || [])];

    allColors.forEach(color => {
      expect(color.r).toBeGreaterThanOrEqual(0);
      expect(color.r).toBeLessThanOrEqual(255);
      expect(color.g).toBeGreaterThanOrEqual(0);
      expect(color.g).toBeLessThanOrEqual(255);
      expect(color.b).toBeGreaterThanOrEqual(0);
      expect(color.b).toBeLessThanOrEqual(255);
    });
  });

  // Puedes agregar más pruebas relacionadas con los colores aquí
});
