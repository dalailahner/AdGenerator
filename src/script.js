import HalfPageAd from "./modules/HalfPageAd";

//---------
// GLOBALS
const form = document.querySelector("form");

//-------
// SETUP

//--------
// EVENTS

// advanced tab
document.querySelector(".advancedBtn").addEventListener("click", (ev) => {
  document.querySelector(".advancedCont").classList.toggle("open");
});

// custom form submit
form.addEventListener("submit", (ev) => formSubmit(ev));

// input change
for (const el of form.querySelectorAll("input")) {
  el.addEventListener("change", (ev) => formSubmit(ev));
}

//-----------
// FUNCTIONS

function formSubmit(event) {
  event.preventDefault();
  const formDataRaw = new FormData(form);
  const formData = Object.fromEntries(formDataRaw.entries());

  // colorPickerRefImg upload
  if (formData.refImgUpload) {
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
