import { Jimp } from "jimp";

const ctx = self;

ctx.addEventListener("message", async (e) => {
  const name = e.data.name;
  console.log(`worker got ${name} to process.`);
  const sizes = e.data.sizes;
  const imageArrayBuffer = await e.data.imageData.arrayBuffer();

  switch (name) {
    case "adImgUpload":
      if (sizes?.bb && sizes?.mr && sizes?.hpa) {
        ctx.postMessage({
          name: name,
          bbBase64: await getBgImgBase64(sizes.bb, "image/jpeg"),
          mrBase64: await getBgImgBase64(sizes.mr, "image/jpeg"),
          hpaBase64: await getBgImgBase64(sizes.hpa, "image/jpeg"),
        });
      } else {
        console.warn("missing bg-image sizes for transformation. got:", sizes);
      }
      break;

    case "logoUpload":
      if (sizes?.logo.width && sizes?.logo.height) {
        ctx.postMessage({
          name: name,
          logoBase64: await getBgImgBase64(sizes.logo, "image/png"),
        });
      } else {
        console.warn("missing logo size for transformation. got:", sizes);
      }
      break;

    default:
      console.warn(`WORKER: image name "${name}" not known`);
      break;
  }

  async function getBgImgBase64(dimensions, mime) {
    const image = await Jimp.fromBuffer(imageArrayBuffer, (img) => {
      img.cover({ w: dimensions.width, h: dimensions.height });
      img.quality(80);
    });
    const imageBase64 = image.getBase64(mime);
    return imageBase64;
  }
});
