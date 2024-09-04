use neon::{prelude::*, types::buffer::TypedArray};
use palette_extract::{
    get_palette_with_options, Color, MaxColors, PixelEncoding, PixelFilter, Quality,
};
struct Image {
    pixels: Vec<u8>,
    quality: u8,
    max_colors: u8,
}

impl Image {
    fn to_object<'a, C: Context<'a>>(cx: &mut C, img: Image) -> Handle<'a, JsObject> {
        let obj = JsObject::new(cx);

        let r: Vec<Color> = get_palette_with_options(
            &img.pixels,
            PixelEncoding::Rgb,
            Quality::new(img.quality),
            MaxColors::new(img.max_colors),
            PixelFilter::White,
        );
        let palette = JsArray::new(cx, r.len() as u32);
        r.iter().enumerate().for_each(|(_i, color)| {
            let obj = JsObject::new(cx);
            let r = cx.number(color.r as f64);
            let g = cx.number(color.g as f64);
            let b = cx.number(color.b as f64);
            obj.set(cx, "r", r).unwrap();
            obj.set(cx, "g", g).unwrap();
            obj.set(cx, "b", b).unwrap();
            palette.set(cx, _i as u32, obj).unwrap();
        });

        obj.set(cx, "palette", palette).unwrap();

        obj
    }
}

fn png(mut cx: FunctionContext) -> JsResult<JsObject> {
    let buffer = cx.argument::<JsBuffer>(0)?;
    let quality_fs64 = cx.argument::<JsNumber>(1)?.value(&mut cx);
    let quality = format!("{:.0}", quality_fs64).parse::<u8>().unwrap();

    let max_colors_fs64 = cx.argument::<JsNumber>(2)?.value(&mut cx);
    let max_colors = format!("{:.0}", max_colors_fs64).parse::<u8>().unwrap();
    let data = buffer.as_slice(&mut cx);

    let decoder = png::Decoder::new(data);
    let mut reader = decoder.read_info().unwrap();
    let mut pixels = vec![0; reader.output_buffer_size()];
    reader.next_frame(&mut pixels).unwrap();
    let obj = Image::to_object(
        &mut cx,
        Image {
            pixels,
            quality,
            max_colors,
        },
    );

    Ok(obj)
}

fn jpg(mut cx: FunctionContext) -> JsResult<JsObject> {
    let buffer = cx.argument::<JsBuffer>(0)?;
    let quality_fs64 = cx.argument::<JsNumber>(1)?.value(&mut cx);
    let quality = format!("{:.0}", quality_fs64).parse::<u8>().unwrap();

    let max_colors_fs64 = cx.argument::<JsNumber>(2)?.value(&mut cx);
    let max_colors = format!("{:.0}", max_colors_fs64).parse::<u8>().unwrap();

    let data = buffer.as_slice(&mut cx);

    let pixels = zune_jpeg::JpegDecoder::new(data).decode().unwrap();

    let obj = Image::to_object(
        &mut cx,
        Image {
            pixels,
            quality,
            max_colors,
        },
    );
    Ok(obj)
}

fn gif(mut cx: FunctionContext) -> JsResult<JsObject> {
    let buffer = cx.argument::<JsBuffer>(0)?;
    let quality_fs64 = cx.argument::<JsNumber>(1)?.value(&mut cx);
    let quality = format!("{:.0}", quality_fs64).parse::<u8>().unwrap();

    let max_colors_fs64 = cx.argument::<JsNumber>(2)?.value(&mut cx);
    let max_colors = format!("{:.0}", max_colors_fs64).parse::<u8>().unwrap();

    let data = buffer.as_slice(&mut cx);

    let mut options = gif::DecodeOptions::new();
    options.set_color_output(gif::ColorOutput::RGBA);

    let mut decoder = options.read_info(data).unwrap();
    let mut pixels = vec![0; decoder.buffer_size()];

    while let Some(frame) = decoder.read_next_frame().unwrap() {
        let mut frame = frame.buffer.to_vec();
        pixels.append(&mut frame);
    }

    let obj = Image::to_object(
        &mut cx,
        Image {
            pixels,
            quality,
            max_colors,
        },
    );

    Ok(obj)
}

fn bmp(mut cx: FunctionContext) -> JsResult<JsObject> {
    let buffer = cx.argument::<JsBuffer>(0)?;
    let quality_fs64 = cx.argument::<JsNumber>(1)?.value(&mut cx);
    let quality = format!("{:.0}", quality_fs64).parse::<u8>().unwrap();

    let max_colors_fs64 = cx.argument::<JsNumber>(2)?.value(&mut cx);
    let max_colors = format!("{:.0}", max_colors_fs64).parse::<u8>().unwrap();

    let data = buffer.as_slice(&mut cx);

    let pixels = zune_bmp::BmpDecoder::new(data).decode().unwrap();

    let obj = Image::to_object(
        &mut cx,
        Image {
            pixels,
            quality,
            max_colors,
        },
    );

    Ok(obj)
}

fn webp(mut cx: FunctionContext) -> JsResult<JsObject> {
    let buffer = cx.argument::<JsBuffer>(0)?;
    let quality_fs64 = cx.argument::<JsNumber>(1)?.value(&mut cx);
    let quality = format!("{:.0}", quality_fs64).parse::<u8>().unwrap();

    let max_colors_fs64 = cx.argument::<JsNumber>(2)?.value(&mut cx);
    let max_colors = format!("{:.0}", max_colors_fs64).parse::<u8>().unwrap();

    let data = buffer.as_slice(&mut cx);

    let (_width, _height, buf) = libwebp::WebPDecodeRGBA(data).unwrap();
    let pixels = buf.to_vec();

    let obj = Image::to_object(
        &mut cx,
        Image {
            pixels,
            quality,
            max_colors,
        },
    );

    Ok(obj)
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("png", png)?;
    cx.export_function("jpg", jpg)?;
    cx.export_function("gif", gif)?;
    cx.export_function("bmp", bmp)?;
    cx.export_function("webp", webp)?;
    Ok(())
}
