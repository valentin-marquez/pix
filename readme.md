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
import * as fs from 'fs';

const imageBuffer = fs.promises.readFile('path_to_your_image.jpg');
const image = new Pix(imageBuffer, Pix.Format.JPG);
console.log('Dominant Color:', image.dominantHex); // Dominant color in hexadecimal format
console.log('Palette:', image.paletteHex); // Array of colors in hexadecimal format
```

Replace `'path_to_your_image.jpg'` with the path to the image file you want to process.

## API Documentation

### `Pix`

#### Constructor

```typescript
new Pix(buffer: Buffer, filetype: Pix.Format): Pix
```

Creates a new `Pix` object with the provided image data and file format.

#### Properties

- `dominant`: Color
  - The dominant color of the image.
- `dominantHex`: string
  - The dominant color of the image in hexadecimal format.
- `palette`: Color[]
  - The color palette of the image.
- `paletteHex`: string[]
  - The color palette of the image in hexadecimal format.

### Enums

#### `Pix.Format`

An enum representing supported image formats:

- `JPEG`
- `JPG`
- `PNG`
- `GIF`
- `BMP`
- `WEBP`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

For bug reporting and feature requests, please use the [issues](https://github.com/valentin-marquez/pix/issues) section of the repository.