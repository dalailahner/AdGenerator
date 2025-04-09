import { Jimp } from "jimp";

const ctx = self;

ctx.addEventListener("message", async (e) => {
  const name = e.data.name;
  console.log(`WORKER: got ${name} to process.`);
  const sizes = e.data.sizes;
  const imageArrayBuffer = await e.data.imageData.arrayBuffer();

  switch (name) {
    case "adImgUpload":
      if (sizes?.bb && sizes?.mr && sizes?.hpa) {
        ctx.postMessage({
          name: name,
          bbBase64: await Jimp.fromBuffer(imageArrayBuffer).then((img) => img.cover({ w: sizes.bb.width, h: sizes.bb.height }).getBase64("image/jpeg", { quality: "80" })),
          mrBase64: await Jimp.fromBuffer(imageArrayBuffer).then((img) => img.cover({ w: sizes.mr.width, h: sizes.mr.height }).getBase64("image/jpeg", { quality: "60" })),
          hpaBase64: await Jimp.fromBuffer(imageArrayBuffer).then((img) => img.cover({ w: sizes.hpa.width, h: sizes.hpa.height }).getBase64("image/jpeg", { quality: "60" })),
        });
      } else {
        console.warn("WORKER: missing bg-img sizes for transformation. got:", sizes);
      }
      break;

    case "logoUpload":
      if (sizes?.logo.width && sizes?.logo.height) {
        ctx.postMessage({
          name: name,
          logoBase64: await Jimp.fromBuffer(imageArrayBuffer).then((img) => img.contain({ w: sizes.logo.width, h: sizes.logo.height }).getBase64("image/png")),
        });
      } else {
        console.warn("WORKER: missing logo size for transformation. got:", sizes);
      }
      break;

    default:
      console.warn(`WORKER: image name "${name}" not known`);
      break;
  }
});
