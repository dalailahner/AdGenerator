import FontPicker from "font-picker";
import Billboard from "./modules/Billboard.js";
import MediumRectangle from "./modules/MediumRectangle.js";
import HalfPageAd from "./modules/HalfPageAd.js";

//---------
// GLOBALS
const GOOGLE_FONT_API_KEY = import.meta.env.VITE_GOOGLE_FONT_API_KEY;
const form = document.querySelector("form");
const formData = new Map();
const prevImgUploads = new Map().set("adImgUpload", { name: "", type: "application/octet-stream", size: 0 }).set("logoUpload", { name: "", type: "application/octet-stream", size: 0 });
const loadingStates = new Map().set("adImgUpload", false).set("logoUpload", false);

//-------
// SETUP
const fontPicker = new FontPicker(GOOGLE_FONT_API_KEY, "Open Sans", { categories: ["sans-serif", "serif", "display"], limit: 30, sort: "popularity" }, () => formSubmit());
const imgWorker = new Worker(new URL("./modules/imgWorker.js", import.meta.url), { type: "module" });

//--------
// EVENTS

// imgWorker
imgWorker.addEventListener("message", (ev) => {
  const name = ev.data.name;

  loadingStates.set(name, false);
  console.log(`got "${name}" back from worker.`);

  switch (name) {
    case "adImgUpload":
      formData.set("bbImg", ev.data.bbBase64);
      formData.set("mrImg", ev.data.mrBase64);
      formData.set("hpaImg", ev.data.hpaBase64);
      break;

    case "logoUpload":
      formData.set("logo", ev.data.logoBase64);
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
  console.log("---------- UPDATE START ----------");
  if (event) {
    event?.preventDefault();
  }
  const formDataRaw = new FormData(form);
  for (const entry of formDataRaw.entries()) {
    formData.set(entry[0], entry[1]);
  }
  formData.set("font", fontPicker.getActiveFont());

  // ad img upload
  if (filesDiffer(prevImgUploads.get("adImgUpload"), formData.get("adImgUpload"))) {
    console.log("adImgUpload has changed");
    if (formData.get("adImgUpload")?.size > 0) {
      loadingStates.set("adImgUpload", true);
      imgWorker.postMessage({
        name: "adImgUpload",
        imageData: formData.get("adImgUpload"),
        sizes: {
          bb: { width: 325, height: 250 },
          mr: { width: 600, height: 500 },
          hpa: { width: 600, height: 600 },
        },
      });
    }
    prevImgUploads.set("adImgUpload", structuredClone(formData.get("adImgUpload")));
  } else {
    console.log("adImgUpload has not changed");
  }

  // logo upload
  if (filesDiffer(prevImgUploads.get("logoUpload"), formData.get("logoUpload"))) {
    console.log("logoUpload has changed");
    if (formData.get("logoUpload")?.size > 0) {
      loadingStates.set("logoUpload", true);
      imgWorker.postMessage({
        name: "logoUpload",
        imageData: formData.get("logoUpload"),
        sizes: {
          logo: { width: 300, height: 100 },
        },
      });
    }
    prevImgUploads.set("logoUpload", structuredClone(formData.get("logoUpload")));
  } else {
    console.log("logoUpload has not changed");
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

function filesDiffer(fileA, fileB) {
  if (typeof fileA === "object" && typeof fileB === "object") {
    const keysToCheck = ["name", "type", "size"];
    const checkResults = [];
    for (const key of keysToCheck) {
      if (typeof fileA[key] !== "undefined" && fileB[key] !== "undefined") {
        checkResults.push(fileA[key] === fileB[key]);
      } else {
        return true;
      }
    }
    return checkResults.includes(false);
  }
  console.warn('filesDiffer(); was fed something that is not typeof "object". returning: true');
  return true;
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

  // update iframes
  function updateIframe(iframeSelector, moduleName) {
    const iframe = document.querySelector(iframeSelector);
    if (iframe) {
      iframe.srcdoc = moduleName.getCode(formData, "preview");
    }
  }
  updateIframe(".preview#billboard", Billboard);
  updateIframe(".preview#mediumRectangle", MediumRectangle);
  updateIframe(".preview#halfPageAd", HalfPageAd);

  console.log("---------- UPDATE DONE ----------");
}
