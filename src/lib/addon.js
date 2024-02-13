import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { png, webp, gif, jpg, bmp } = require(".");

export { png, webp, gif, jpg, bmp };