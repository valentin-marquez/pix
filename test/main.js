const PixDecode = require('../index.node');
const fs = require('fs');

const JPEG_PATH = "C:/Users/valen/OneDrive/Documentos/GitHub/PixDecodeRust/test/assets/JPG_Test.jpg";
const PNG_PATH = "C:/Users/valen/OneDrive/Documentos/GitHub/PixDecodeRust/test/assets/PNG_Test.png";
const GIF_PATH = "C:/Users/valen/OneDrive/Documentos/GitHub/PixDecodeRust/test/assets/GIF_Test.gif";
const BMP_PATH = "C:/Users/valen/OneDrive/Documentos/GitHub/PixDecodeRust/test/assets/BMP_Test.bmp";
const WEBP_PATH = "C:/Users/valen/OneDrive/Documentos/GitHub/PixDecodeRust/test/assets/WEBP_Test.webp";

async function readImage(imagePath) {
    let image = await fs.promises.readFile(imagePath);
    return image;
}

function decodePNG(image) {
    console.log("Decoding PNG with rust addon");
    let png_palette = PixDecode.png(image, 1, 2);
    console.log(png_palette);
}

function decodeJPEG(image) {
    console.log("Decoding JPEG with rust addon");
    let jpeg_palette = PixDecode.jpg(image, 1, 2);
    console.log(jpeg_palette);
}

function decodeGIF(image) {
    console.log("Decoding GIF with rust addon");
    let starstTime = Date.now();
    let gif_palette = PixDecode.gif(image, 1, 2);
    console.log(gif_palette);
    let endTime = Date.now();
    console.log("Time: ", endTime - starstTime, "ms");
}

function decodeBMP(image) {
    console.log("Decoding BMP with rust addon");
    let bmp_palette = PixDecode.bmp(image, 1, 0x2);
    console.log(bmp_palette);
}

function decodeWEBP(image) {
    console.log("Decoding WEBP with rust addon");
    let webp_palette = PixDecode.webp(image, 1, 0x2);
    console.log(webp_palette);
}

async function main() {
    let image_png = await readImage(PNG_PATH);
    let image_jpg = await readImage(JPEG_PATH);
    let image_gif = await readImage(GIF_PATH);
    let image_bmp = await readImage(BMP_PATH);
    let image_webp = await readImage(WEBP_PATH);

    decodePNG(image_png);
    decodeJPEG(image_jpg);
    decodeGIF(image_gif);
    decodeBMP(image_bmp);
    decodeWEBP(image_webp);

}


main();