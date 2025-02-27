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
        const bbImg = await Jimp.fromBuffer(imageArrayBuffer).then((img) => img.cover({ w: sizes.bb.width, h: sizes.bb.height }));
        const mrImg = await Jimp.fromBuffer(imageArrayBuffer).then((img) => img.cover({ w: sizes.mr.width, h: sizes.mr.height }));
        const hpaImg = await Jimp.fromBuffer(imageArrayBuffer).then((img) => img.cover({ w: sizes.hpa.width, h: sizes.hpa.height }));
        ctx.postMessage({
          name: name,
          bbBase64: await bbImg.getBase64("image/jpeg", { quality: 80 }),
          mrBase64: await mrImg.getBase64("image/jpeg", { quality: 80 }),
          hpaBase64: await hpaImg.getBase64("image/jpeg", { quality: 80 }),
        });
      } else {
        console.warn("missing image sizes for transformation. got:", sizes);
      }
      break;

    case "logoUpload":
      if (sizes?.logo.width && sizes?.logo.height) {
        const logoImg = await Jimp.fromBuffer(imageArrayBuffer).then((img) => img.contain({ w: sizes.logo.width, h: sizes.logo.height }));
        ctx.postMessage({
          name: name,
          logoBase64: await logoImg.getBase64("image/png"),
        });
      } else {
        console.warn("missing logo size for transformation. got:", sizes);
      }
      break;

    default:
      console.warn(`WORKER: image name "${name}" not known`);
      break;
  }
});
