import FontPicker from "font-picker";
import Billboard from "./modules/Billboard.js";
import MediumRectangle from "./modules/MediumRectangle.js";
import HalfPageAd from "./modules/HalfPageAd.js";
import { downloadZip } from "client-zip";

//---------
// GLOBALS
const GOOGLE_FONT_API_KEY = import.meta.env.VITE_GOOGLE_FONT_API_KEY;
const form = document.querySelector("form");
const outputSection = document.querySelector(".outputSection");
const downloadBtn = document.querySelector(".downloadBtn");
const formData = new Map();
let errorArr = [];
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

// download button
downloadBtn.addEventListener("click", () => {
  if (errorArr.length > 0) {
    reportErrors();
  } else {
    downloadAds();
  }
});

//-----------
// FUNCTIONS

function formSubmit(event) {
  console.log("---------- UPDATE START ----------");
  if (event) {
    event?.preventDefault();
  }

  // clear error array
  errorArr = [];

  // display loading states
  outputSection.classList.add("loading");
  downloadBtn.setAttribute("disabled", "");

  // get form data
  const formDataRaw = new FormData(form);
  for (const entry of formDataRaw.entries()) {
    formData.set(entry[0], entry[1]);
  }

  // sanitize campaign name
  formData.set("campaign", formData.get("campaign").replaceAll(/[^\w\d_-]/g, ""));
  if (formData.get("campaign").length <= 0) {
    addError("#campaign");
  }

  // ad img upload
  if (formData.get("adImgUpload")?.size <= 0) {
    addError("label:has( ~ #adImgUpload)", ".errorMsg:has( + #adImgUpload)");
  }
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

  // headline
  if (formData.get("headline").replaceAll(/[^\w\d_-]/g, "").length <= 0) {
    addError("#headline");
  }

  // cta text
  if (formData.get("ctaText").replaceAll(/[^\w\d_-]/g, "").length <= 0) {
    formData.set("ctaText", "");
  }

  // set custom font
  formData.set("font", fontPicker.getActiveFont());

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

  // CTA btn text color
  formData.set("ctaTextColor", form.ctaTextColor.checked);

  updatePreview();
}

function addError(faultyElSelector, errorMsgElSelector = `${faultyElSelector} + .errorMsg`) {
  const faultyEl = document.querySelector(faultyElSelector);
  const errorMsgEl = document.querySelector(errorMsgElSelector);

  if (faultyEl && errorMsgEl) {
    errorArr.push({ faultyEl: faultyEl, errorMsgEl: errorMsgEl });
  } else {
    console.error(`input error, but didn't find elements: "${faultyElSelector}", "${errorMsgElSelector}"`);
  }
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
      iframe.srcdoc = moduleName.getCode(formData, false, false);
    } else {
      console.warn(`can't update iframe: iframe "${iframeSelector}" not found`);
    }
  }
  updateIframe("#billboard", Billboard);
  updateIframe("#mediumRectangle", MediumRectangle);
  updateIframe("#halfPageAd", HalfPageAd);

  console.log("---------- UPDATE DONE ----------");
  outputSection.classList.remove("loading");
  downloadBtn.removeAttribute("disabled");
}

// report errors
function reportErrors() {
  // focus the first faulty element
  errorArr[0].faultyEl.focus();
  // show error messages for all errors (debounced)
  for (const errorObj of errorArr) {
    errorObj.errorMsgEl.classList.add("show");
    if (errorObj?.timeoutId) {
      clearTimeout(errorObj.timeoutId);
    }
    errorObj.timeoutId = setTimeout(() => {
      errorObj.errorMsgEl.classList.remove("show");
    }, 3000);
  }
}

// download btn function (download ads as zip)
async function downloadAds() {
  const BBdisplayBlob = new Blob([Billboard.getCode(formData, false, true)], { type: "text/html" });
  const MRdisplayBlob = new Blob([MediumRectangle.getCode(formData, false, true)], { type: "text/html" });
  const HPAdisplayBlob = new Blob([HalfPageAd.getCode(formData, false, true)], { type: "text/html" });
  const BBgoogleAdsBlob = new Blob([Billboard.getCode(formData, true, false)], { type: "text/html" });
  const MRgoogleAdsBlob = new Blob([MediumRectangle.getCode(formData, true, false)], { type: "text/html" });
  const HPAgoogleAdsBlob = new Blob([HalfPageAd.getCode(formData, true, false)], { type: "text/html" });

  // pack the html file in a zip archive
  async function wrapFileInZip(data) {
    return await downloadZip([{ name: "index.html", input: data }]).blob();
  }
  const BBDisplayZipBlob = await wrapFileInZip(BBdisplayBlob);
  const MRDisplayZipBlob = await wrapFileInZip(MRdisplayBlob);
  const HPADisplayZipBlob = await wrapFileInZip(HPAdisplayBlob);
  const BBgoogleAdsZipBlob = await wrapFileInZip(BBgoogleAdsBlob);
  const MRgoogleAdsZipBlob = await wrapFileInZip(MRgoogleAdsBlob);
  const HPAgoogleAdsZipBlob = await wrapFileInZip(HPAgoogleAdsBlob);

  // get the parent zip as a Blob
  const parentZipBlob = await downloadZip([
    { name: `${formData.get("campaign")}-BB-970x250.zip`, input: BBDisplayZipBlob },
    { name: `${formData.get("campaign")}-MR-300x250.zip`, input: MRDisplayZipBlob },
    { name: `${formData.get("campaign")}-HPA-300x600.zip`, input: HPADisplayZipBlob },
    { name: `${formData.get("campaign")}-BB-970x250-googleAds.zip`, input: BBgoogleAdsZipBlob },
    { name: `${formData.get("campaign")}-MR-300x250-googleAds.zip`, input: MRgoogleAdsZipBlob },
    { name: `${formData.get("campaign")}-HPA-300x600-googleAds.zip`, input: HPAgoogleAdsZipBlob },
  ]).blob();

  // init download
  const downloadLinkEl = document.createElement("a");
  const parentZipBlobURL = URL.createObjectURL(parentZipBlob);
  downloadLinkEl.href = parentZipBlobURL;
  downloadLinkEl.download = `${formData.get("campaign")}-Display_Werbemittel.zip`;
  downloadLinkEl.click();

  // remove link and revoke your Blob URLs
  downloadLinkEl.remove();
  URL.revokeObjectURL(parentZipBlobURL);
}
