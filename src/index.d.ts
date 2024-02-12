import { FORMATS, quantize, addon } from "./lib/index.mjs";
import { fileTypeFromBuffer, FileTypeResult } from "file-type";

export interface ImageFormat {
    format: string;
    decoding: string;
}

export const FORMATS: ImageFormat[];

export async function quantize(pixels: number[][], count: number): Promise<{
    palette(): number[][];
}> {
    return new Promise((resolve, reject) => {
        try {
            const palette = quantize(pixels, count);
            resolve({
                palette: () => palette.palette()
            });
        } catch (error) {
            reject(error);
        }
    });
}

export const addon: {
    decode(data: Uint8Array): {
        data: Uint8Array;
        width: number;
        height: number;
    };
};

export async function parseImage(img: ArrayBuffer): Promise<{
    data: Uint8Array;
    width: number;
    height: number;
    channels: number;
}> {
    return new Promise((resolve, reject) => {
        try {
            const decoded = addon.decode(new Uint8Array(img));
            resolve({
                data: decoded.data,
                width: decoded.width,
                height: decoded.height,
                channels: 4
            });
        } catch (error) {
            reject(error);
        }
    });
}

export async function getPalette(imageData: { width: number; height: number; data: Uint8Array; }, count?: number, q?: number): Promise<number[][]> {
    const pixels = await getPixels(imageData);
    const pixel_count = imageData.width * imageData.height;
    const valid_pixels = [];
    for (let i = 0; i < pixel_count; i += q) {
        const [r, g, b] = pixels[Math.floor(i / imageData.width)][i % imageData.width];
        if (r > 250 && g > 250 && b > 250) {
            continue;
        }
        valid_pixels.push([r, g, b]);
    }
    const cmap = await quantize(valid_pixels, count);
    if (!cmap) {
        throw new Error('Error getting palette, check the image and the number of colors to quantize.');
    }
    return cmap.palette();
}

export async function getPixels(imageData: { width: number; height: number; data: Uint8Array; }): Promise<number[][][]> {
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

export async function getPredominantColor(imageData: { width: number; height: number; data: Uint8Array; }, q: number): Promise<number[]> {
    const palette = await getPalette(imageData, 5, q);
    return palette[0];
}

export async function isValid(input: ArrayBuffer | Uint8Array | Buffer, suppressWarning?: boolean): Promise<boolean> {
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

export async function Pix(img: ArrayBuffer, suppressWarning?: boolean): Promise<{
    predominant(q: number): Promise<number[]>;
    palette(count: number, q: number): Promise<number[][]>;
}> {
    await isValid(img, suppressWarning || false);
    let imageData;
    try {
        imageData = await parseImage(img);
    } catch (e) {
        console.log(e);
        throw new Error('Error decoding image');
    }
    return {
        predominant: async function (q: number): Promise<number[]> {
            return await getPredominantColor(imageData, q);
        },
        palette: async function (count: number, q: number): Promise<number[][]> {
            return await getPalette(imageData, count, q);
        },
    };
}
