import { Jimp } from "jimp";

const ctx = self;

ctx.addEventListener("message", async (e) => {
  const name = e.data.name;
  console.log(`worker got ${name} to process.`);
  const imageArrayBuffer = await e.data.imageData.arrayBuffer();
  const options = e.data.options;

  const image = await Jimp.fromBuffer(imageArrayBuffer);

  if (options?.width && options?.height) {
    image.scaleToFit({ w: options.width, h: options.height });
  }

  // Return the result
  if (options?.type === "png") {
    ctx.postMessage({ name: name, base64: await image.getBase64("image/png") });
  } else {
    ctx.postMessage({ name: name, base64: await image.getBase64("image/jpeg", { quality: 80 }) });
  }
});
