import { Jimp } from "jimp";

const ctx = self;

ctx.addEventListener("message", async (e) => {
  const name = e.data.name;
  console.log(`worker got ${name} to process.`);
  const imageArrayBuffer = await e.data.imageData.arrayBuffer();
  const options = e.data.options;

  const image = await Jimp.fromBuffer(imageArrayBuffer);

  switch (name) {
    case "adImgUpload":
      if (options?.width && options?.height) {
        image.cover({ w: options.width, h: options.height });
      }
      ctx.postMessage({ name: name, base64: await image.getBase64("image/jpeg", { quality: 80 }) });
      break;

    case "logoUpload":
      if (options?.width && options?.height) {
        image.contain({ w: options.width, h: options.height });
      }
      ctx.postMessage({ name: name, base64: await image.getBase64("image/png") });
      break;

    default:
      console.warn(`WORKER: image name "${name}" not known`);
      break;
  }
});
