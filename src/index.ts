import { png, webp, gif, jpg, bmp } from "./lib/addon.js"

/**
 * Represents the supported image formats.
 */
export enum Format {
    JPG,
    PNG,
    GIF,
    BMP,
    WEBP
}

/**
 * Represents a color in the palette.
 */
type PaletteColor = [number, number, number];

/**
 * Represents a palette of colors.
 */
type TPalette = PaletteColor[];

/**
 * Represents the output of a process.
 */
type Output = {
    palette: TPalette
}

/**
 * Represents a color with red, green, and blue components.
 */
class Color {
    r: number
    g: number
    b: number

    /**
     * Converts the color to its hexadecimal representation.
     * @returns The hexadecimal color code.
     */
    toHex(): string {
        return `#${this.r.toString(16).padStart(2, '0')}${this.g.toString(16).padStart(2, '0')}${this.b.toString(16).padStart(2, '0')}`
    }
}

/**
 * Represents a palette of colors.
 */
class Palette {
    colors: Color[];

    /**
     * Creates a new Palette instance.
     * @param colors - The colors in the palette.
     */
    constructor(colors: Color[]) {
        this.colors = colors;
    }

    /**
     * Converts the colors in the palette to their hexadecimal representation.
     * @returns An array of strings representing the hexadecimal values of the colors.
     */
    toHex(): string[] {
        return this.colors.map(color => color.toHex());
    }
}

/**
 * Represents a dominant color.
 */
class Dominant {
    color: Color

    /**
     * Creates a new Dominant instance.
     * @param color - The dominant color.
     */
    constructor(color: Color) {
        this.color = color;
    }

    /**
     * Converts the dominant color to its hexadecimal representation.
     * @returns The hexadecimal color code.
     */
    toHex(): string {
        return this.color.toHex();
    }
}

/**
 * Represents a Pix object that extracts color information from an image buffer.
 */
class Pix {
    static Format = Format
    public palette: Palette
    dominant: Dominant

    /**
     * Creates a new Pix instance.
     * @param buffer - The image buffer.
     * @param filetype - The file format of the image.
     * @throws Error if the buffer is empty or the filetype is unsupported.
     */
    constructor(buffer: Buffer, filetype: Format.JPG | Format.PNG | Format.GIF | Format.BMP | Format.WEBP) {

        if (!buffer || buffer.length === 0) {
            throw new Error("Buffer is empty")
        }
        if (!filetype) {
            throw new Error("Filetype is empty")
        }

        let output: Output;
        switch (filetype) {
            // @ts-ignore
            case Format.JPG:
                output = jpg(buffer);
                break;
            case Format.PNG:
                output = png(buffer);
                break;
            case Format.GIF:
                output = gif(buffer);
                break;
            case Format.BMP:
                output = bmp(buffer);
                break;
            case Format.WEBP:
                output = webp(buffer);
                break;
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
