import FontPicker from "font-picker";
import HalfPageAd from "./modules/HalfPageAd";

//---------
// GLOBALS
const form = document.querySelector("form");

//-------
// SETUP
const fontPicker = new FontPicker("AIzaSyBc8NDnGvm0qzqTV85De1AWiQlFkOUbhRw", "Open Sans", { categories: ["sans-serif", "serif", "display"], limit: 30, sort: "popularity" }, () => formSubmit());

//--------
// EVENTS

// custom form submit
form.addEventListener("submit", (ev) => formSubmit(ev));

// input change
for (const el of form.querySelectorAll("input")) {
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
  const formData = Object.fromEntries(formDataRaw.entries());
  formData.font = fontPicker.getActiveFont();

  if (formData.refImgUpload) {
    // colorPickerRefImg upload
    const colorPickerRefImg = document.querySelector(".colorPickerRefImg");
    if (colorPickerRefImg && formData.refImgUpload.size > 0) {
      colorPickerRefImg.src = URL.createObjectURL(formData.refImgUpload);
      colorPickerRefImg.style.display = "block";
      const refImgUploadCont = document.querySelector(".refImgUploadCont");
      if (refImgUploadCont) {
        refImgUploadCont.style.display = "none";
      }
    }
  }

  // ad preview
  const previewIframe = document.querySelector(".preview");
  if (previewIframe) {
    previewIframe.srcdoc = HalfPageAd.getCode(formData, "preview");
  }

  // log form data:
  console.log("Form Data: \n", formData);
}
