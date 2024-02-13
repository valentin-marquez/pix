import { png, webp, gif, jpg, bmp } from "./lib/addon.js"

export enum Format {
    JPEG,
    JPG,
    PNG,
    GIF,
    BMP,
    WEBP
}

type PaletteColor = [number, number, number];
type TPalette = PaletteColor[];
type Output = {
    palette: TPalette
}

class Color {
    r: number
    g: number
    b: number

    toHex(): string {
        return `#${this.r.toString(16).padStart(2, '0')}${this.g.toString(16).padStart(2, '0')}${this.b.toString(16).padStart(2, '0')}`
    }
}

class Palette {
    colors: Color[]

    constructor(colors: Color[]) {
        this.colors = colors;
    }

    toHex(): string[] {
        return this.colors.map(color => color.toHex());
    }
}

class Dominant {
    color: Color

    constructor(color: Color) {
        this.color = color;
    }

    toHex(): string {
        return this.color.toHex();
    }
}

class Pix {
    static Format = Format
    public palette: Palette
    dominant: Dominant


    constructor(buffer: Buffer, filetype: any) {

        if (!buffer || buffer.length === 0) {
            throw new Error("Buffer is empty")
        }
        if (!filetype) {
            throw new Error("Filetype is empty")
        }
        // output = { palette: [ [ 204, 226, 185 ], [ 44, 118, 200 ], [ 238, 50, 109 ] ] }
        let output: Output;
        switch (filetype) {
            case Format.PNG:
                output = png(buffer, 1, 5)
                break
            case Format.WEBP:
                output = webp(buffer, 1, 5)
                break
            case Format.GIF:
                output = gif(buffer, 1, 5)
                break
            case Format.JPG:
            case Format.JPEG:
                output = jpg(buffer, 1, 5)
                break
            case Format.BMP:
                output = bmp(buffer, 1, 5)
                break
            default:
                throw new Error("Unsupported file format")
        }

        if (!output.palette) {
            throw new Error("Palette not found")
        }

        const dominantColor = new Color();
        dominantColor.r = output.palette[0][0];
        dominantColor.g = output.palette[0][1];
        dominantColor.b = output.palette[0][2];

        const paletteColors = output.palette.slice(1).map(colorArray => {
            const color = new Color();
            color.r = colorArray[0];
            color.g = colorArray[1];
            color.b = colorArray[2];
            return color;
        });
        this.palette = new Palette(paletteColors);
        this.dominant = new Dominant(dominantColor);
    }

}

export default Pix
