import FontPicker from "font-picker";
import HalfPageAd from "./modules/HalfPageAd";

//---------
// GLOBALS
const form = document.querySelector("form");
const formData = new Map();
const loadingStates = new Map().set("adImgUpload", false).set("logoUpload", false);

//-------
// SETUP
const fontPicker = new FontPicker("AIzaSyBc8NDnGvm0qzqTV85De1AWiQlFkOUbhRw", "Open Sans", { categories: ["sans-serif", "serif", "display"], limit: 30, sort: "popularity" }, () => formSubmit());
const imgWorker = new Worker(new URL("./modules/imgWorker.js", import.meta.url), {
  type: "module",
});

//--------
// EVENTS

// imgWorker
imgWorker.addEventListener("message", (ev) => {
  const name = ev.data.name;

  loadingStates.set(name, false);
  console.log(`got ${name} back from worker.`);

  switch (name) {
    case "adImgUpload":
      formData.set("hpaImg", ev.data.base64);
      break;

    case "logoUpload":
      formData.set("logo", ev.data.base64);
      break;

    default:
      console.warn(`MAIN THREAD: image name "${name}" not known`);
      break;
  }

  updatePreview();
});

// custom form submit
form.addEventListener("submit", (ev) => formSubmit(ev));

// input change
for (const el of form.querySelectorAll(":is(input, textarea)")) {
  el.addEventListener("change", (ev) => formSubmit(ev));
}

// advanced tab
document.querySelector(".advancedBtn").addEventListener("click", (ev) => {
  document.querySelector(".advancedCont").classList.toggle("open");
});

//-----------
// FUNCTIONS

function formSubmit(event) {
  if (event) {
    event?.preventDefault();
  }
  const formDataRaw = new FormData(form);
  for (const entry of formDataRaw.entries()) {
    formData.set(entry[0], entry[1]);
  }
  formData.set("font", fontPicker.getActiveFont());

  // ad img upload
  if (formData.get("adImgUpload")?.size > 0) {
    loadingStates.set("adImgUpload", true);
    imgWorker.postMessage({
      name: "adImgUpload",
      imageData: formData.get("adImgUpload"),
      options: {
        width: 600,
        height: 600,
      },
    });
  }

  // logo upload
  if (formData.get("logoUpload")?.size > 0) {
    loadingStates.set("logoUpload", true);
    imgWorker.postMessage({
      name: "logoUpload",
      imageData: formData.get("logoUpload"),
      options: {
        width: 300,
        height: 100,
      },
    });
  }

  // reference img upload (for color picker)
  if (formData.get("refImgUpload")?.size > 0) {
    const colorPickerRefImg = document?.querySelector(".colorPickerRefImg");
    if (colorPickerRefImg) {
      colorPickerRefImg.src = URL.createObjectURL(formData.get("refImgUpload"));
      colorPickerRefImg.style.display = "block";
      const refImgUploadCont = document?.querySelector(".refImgUploadCont");
      if (refImgUploadCont) {
        refImgUploadCont.style.display = "none";
      }
    }
  }

  updatePreview();
}

// update preview iframes
function updatePreview() {
  // return if things are still loading
  if (Array.from(loadingStates.values()).includes(true)) {
    console.log("things are still loading...");
    return;
  }

  // log data:
  console.log("updating preview with form data: ", formData);

  // ad preview
  const previewIframe = document.querySelector(".preview");
  if (previewIframe) {
    previewIframe.srcdoc = HalfPageAd.getCode(formData, "preview");
  }
}
