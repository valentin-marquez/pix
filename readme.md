# @babidi/pix

A library to process images and extract dominant color and palette.

## Installation

You can install the library via npm or yarn:

```bash
npm install @babidi/pix
```

or

```bash
yarn add @babidi/pix
```

## Usage

Here's an example of how you can use `@babidi/pix` to extract the predominant color and palette from an image:

```javascript
import Pix from '@babidi/pix';

(async () => {
  const image = new Pix();
  await image.create('path_to_your_image.jpg'); // Replace 'path_to_your_image.jpg' with the path to your image file
  const predominantColor = await image.getPredominantColor(5);
  const palette = await image.getPalette(10, 10);
  
  console.log('Predominant Color:', image.toHex(predominantColor));
  console.log('Palette:', palette.map(color => image.toHex(color)));
})();
```

Replace `'path_to_your_image.jpg'` with the path to the image file you want to process.

## API Documentation

### `Pix`

#### `create(img: string | Buffer): Promise<Pix>`

Creates a new `Pix` object with the provided image data.

#### `isValidUrl(url: string): boolean`

Checks if a given URL is valid.

#### `isValidPath(path: string): boolean`

Checks if the given path is valid.

#### `fromPath(path: string): Promise<Buffer>`

Reads the contents of a file from the specified path and returns it as a Buffer.

#### `parseImage(img: Buffer | string): Promise<ImageData>`

Parses an image and returns its image data.

#### `decodeJPEG(data: Buffer): Promise<ImageData>`

Decodes a JPEG image from the given buffer and returns the decoded image data.

#### `decodePNG(data: Buffer): Promise<ImageData>`

Decodes a PNG image from the given buffer and returns the image data.

#### `fromUrl(url: string): Promise<Buffer>`

Fetches an image from the specified URL and returns it as a Buffer.

#### `getPixels(): Promise<number[][][]>`

Retrieves the pixels of the image as a 3-dimensional array.

#### `getPredominantColor(q: number): Promise<number[]>`

Retrieves the predominant color of an image.

#### `getPalette(count?: number, q?: number): Promise<number[][]>`

Retrieves the color palette of the image.

#### `toHex(color: number[]): string`

Converts an array of RGB color values to a hexadecimal color representation.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

For bug reporting and feature requests, please use the [issues](https://github.com/valentin-marquez/pix/issues) section of the repository.