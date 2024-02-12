import { FileTypeResult } from "file-type";

export declare interface ImageFormat {
    format: string;
    decoding: string;
}

export declare const FORMATS: ImageFormat[];

export declare function quantize(pixels: number[][], count: number): {
    palette(): number[][];
};

export declare const addon: {
    decode(data: Uint8Array): {
        data: Uint8Array;
        width: number;
        height: number;
    };
};

export declare function parseImage(img: ArrayBuffer): Promise<{
    data: Uint8Array;
    width: number;
    height: number;
    channels: number;
}>;

export declare function getPalette(imageData: { width: number; height: number; data: Uint8Array; }, count?: number, q?: number): Promise<number[][]>;

export declare function getPixels(imageData: { width: number; height: number; data: Uint8Array; }): Promise<number[][][]>;


export declare function getPredominantColor(imageData: { width: number; height: number; data: Uint8Array; }, q: number): Promise<number[]>;


export declare function isValid(input: ArrayBuffer | Uint8Array | Buffer, suppressWarning?: boolean): Promise<boolean>;


export declare function Pix(img: ArrayBuffer, suppressWarning?: boolean): Promise<{
    predominant(q: number): Promise<number[]>;
    palette(count: number, q: number): Promise<number[][]>;
}>;
