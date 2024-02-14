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
console.log('Dominant Color:', image.dominant.toHex()); // Dominant color in hexadecimal format
console.log('Palette:', image.palette.toHex()); // Array of colors in hexadecimal format
```

Replace `'path_to_your_image.jpg'` with the path to the image file you want to process.

## Benchmark

A benchmark was conducted comparing the performance of `@babidi/pix` with another popular library called ColorThief in extracting the dominant color and color palette from different types of image files. Times are shown in milliseconds (ms).

| File Type | Pix (ms) | ColorThief (ms) |
|-----------|----------|-----------------|
| PNG       | 274      | 2325            |
| JPEG      | 309      | 3781            |
| GIF       | 262      | 237             |
| BMP       | 122      | No Supported    |
| WEBP      | 726      | No Supported    |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

For bug reporting and feature requests, please use the [issues](https://github.com/valentin-marquez/pix/issues) section of the repository.