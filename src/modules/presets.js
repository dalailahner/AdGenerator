import defaultBgImg from "../assets/defaultBgImg.jpg";
import defaultLogo from "../assets/defaultLogo.png";
import mountaineerBgImg from "../assets/mountaineerBgImg.jpg";
import mountaineerLogo from "../assets/mountaineerLogo.png";
import mountaineerBgPattern from "../assets/mountaineerBgPattern.svg";

const presets = {
  Default: {
    adImgUpload: defaultBgImg,
    BBImgRight: false,
    cutImg: "cutImgNone",
    logoUpload: defaultLogo,
    font: "Lato",
    accentColor: "#0358a9",
    textColor: "#191919",
    bgColor: "#f0f8ff",
    ctaTextColor: true,
    svgBackgroundUpload: null,
  },
  Mountaineer: {
    adImgUpload: mountaineerBgImg,
    BBImgRight: false,
    cutImg: "cutImgNone",
    logoUpload: mountaineerLogo,
    font: "DM Sans",
    accentColor: "#247ec4",
    textColor: "#000000",
    bgColor: "#f2f2f2",
    ctaTextColor: true,
    svgBackgroundUpload: mountaineerBgPattern,
  },
};
export default presets;
