import defaultBgImg from "../assets/defaultBgImg.jpg";
import defaultLogo from "../assets/defaultLogo.png";
import mountaineerBgImg from "../assets/mountaineerBgImg.jpg";
import mountaineerLogo from "../assets/mountaineerLogo.png";
import mountaineerBgPattern from "../assets/mountaineerBgPattern.svg";
import carBgImg from "../assets/carBgImg.jpg";
import carLogo from "../assets/carLogo.png";
import carBgPattern from "../assets/carBgPattern.svg";
import bakeryBgImg from "../assets/bakeryBgImg.jpg";
import bakeryLogo from "../assets/bakeryLogo.png";
import bakeryBgPattern from "../assets/bakeryBgPattern.svg";

const presets = {
  Default: {
    adImgUpload: defaultBgImg,
    headline: null,
    subline: null,
    ctaText: null,
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
    headline: "Unerreichtes erreichen",
    subline: "Die neue ChronoX3D mit präziseren Sensoren, längerer Akkulaufzeit und widerstandsfähigerem Gehäuse.",
    ctaText: "jetzt entdecken",
    BBImgRight: false,
    cutImg: "cutImgRoundInverted",
    logoUpload: mountaineerLogo,
    font: "DM Sans",
    accentColor: "#247ec4",
    textColor: "#000000",
    bgColor: "#f2f2f2",
    ctaTextColor: true,
    svgBackgroundUpload: mountaineerBgPattern,
  },
  Car: {
    adImgUpload: carBgImg,
    headline: "Der neue Gurkenschneider<sup>&copy;&reg;</sup><br/>300PS in der Fußgängerzone",
    subline: null,
    ctaText: "jetzt vorbestellen",
    BBImgRight: false,
    cutImg: "cutImgAngleInverted",
    logoUpload: carLogo,
    font: "Raleway",
    accentColor: "#ffffff",
    textColor: "#facf06",
    bgColor: "#111122",
    ctaTextColor: true,
    svgBackgroundUpload: carBgPattern,
  },
  Bakery: {
    adImgUpload: bakeryBgImg,
    headline: "Backe backe Kuchen!",
    subline: "Der Bäcker hat gerufen, denn er hat den besten Ofen weit und vorallem breit.",
    ctaText: "zum Genuss",
    BBImgRight: true,
    cutImg: "cutImgRoundInverted",
    logoUpload: bakeryLogo,
    font: "Roboto Condensed",
    accentColor: "#a53860",
    textColor: "#000000",
    bgColor: "#f8e8d9",
    ctaTextColor: true,
    svgBackgroundUpload: bakeryBgPattern,
  },
};
export default presets;
