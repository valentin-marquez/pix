import { FORMATS, quantize, addon } from "./lib/index.mjs";
import { fileTypeFromBuffer } from "file-type";

async function parseImage(img) {
    let decodedImage;
    try {
        let decoded = addon.decode(new Uint8Array(img.buffer));
        decodedImage = {
            data: decoded.data,
            width: decoded.width,
            height: decoded.height,
            channels: 4
        }
    } catch (e) {
        throw new Error(e.message);
    }
    return decodedImage;
}

async function getPalette(imageData, count = 10, q = 10) {
    let pixels = await getPixels(imageData);
    let pixel_count = imageData.width * imageData.height;
    let valid_pixels = [];
    for (let i = 0; i < pixel_count; i += q) {
        let [r, g, b] = pixels[Math.floor(i / imageData.width)][i % imageData.width];
        if (r > 250 && g > 250 && b > 250) {
            continue;
        }
        valid_pixels.push([r, g, b]);
    }
    let cmap = quantize(valid_pixels, count);
    if (!cmap) {
        throw new Error('Error getting palette, check the image and the number of colors to quantize.');
    }
    return cmap.palette();
}

async function getPixels(imageData) {
    const shape = [imageData.height, imageData.width, 4];
    const pixels = imageData.data;
    const arr = new Array(shape[0]);
    for (let i = 0; i < shape[0]; i++) {
        arr[i] = new Array(shape[1]);
        for (let j = 0; j < shape[1]; j++) {
            arr[i][j] = new Array(shape[2]);
            for (let k = 0; k < shape[2]; k++) {
                arr[i][j][k] = pixels[i * shape[1] * shape[2] + j * shape[2] + k];
            }
        }
    }
    return arr;
}

async function getPredominantColor(imageData, q) {
    let palette = await getPalette(imageData, 5, q);
    return palette[0];
}

async function isValid(input, suppressWarning) {
    if (!Buffer.isBuffer(input)) {
        throw new Error('Invalid input: input must be a valid URL, file path, or Buffer');
    }
    const fileType = await fileTypeFromBuffer(input);
    if (fileType) {
        const format = FORMATS.find(f => f.format.toLowerCase() === fileType.ext);
        if (!format) {
            throw new Error('Unsupported format: the image format is not supported');
        }
        if (format.decoding.toLowerCase() !== 'yes' && !suppressWarning) {
            console.warn(format.decoding);
        }
        return true;
    }
    return false;
}

async function Pix(img, suppressWarning) {

    await isValid(img, suppressWarning || false);

    let imageData;
    try {
        imageData = await parseImage(img);
    } catch (e) {
        console.log(e);
        throw new Error('Error decoding image');
    }

    return {
        predominant: async function (q) {
            return await getPredominantColor(imageData, q);
        },
        palette: async function (count, q) {
            return await getPalette(imageData, count, q);
        },
    };
}


export default Pix;