const MediumRectangle = {
  /**
   * get the html code for the Medium Rectangle as a string
   * @param {object} formData the data thats gonna be inserted into the ad like text and colors
   * @param {boolean} [googleAds=false] set specific GoogleAds things like <meta name="ad.size"> or set infinite animations to a big funny number
   * @param {boolean} [clicktag=false] insert a script into the ad with the code for a clicktag (defaults to false for GoogleAds)
   * @returns html code as a string
   */
  getCode(formData, googleAds = false, clicktag = false) {
    const logoAvailable = formData.get("logo")?.length > 0;
    const svgBgAvailable = formData.get("svgBackground")?.length > 0;
    const logoEl = `
<div class="logoCont">
  <img class="logo" src="${formData.get("logo")}" alt="" />
</div>`;

    const clicktagScript = `<script>
document.body.addEventListener("click", () => {
  const getUriParams = (function () {
    let query_string = {};
    const parmsArray = window.location.search.substring(1).split("&");
    parmsArray.forEach((param) => {
      let pair = param.split("=");
      let val = decodeURIComponent(pair[1]);
      if (val != "" && pair[0] != "") {
        query_string[pair[0]] = val;
      }
    });
    return query_string;
  })();
  window.open(getUriParams.clicktag, "_blank");
});
</script>`;

    const outputTxt = `<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${googleAds ? '<meta name="ad.size" content="width=300,height=250">' : ""}
    <link href="https://fonts.googleapis.com/css2?family=${formData.get("font")?.family.replaceAll(" ", "+")}:wght@400;700&display=swap" rel="stylesheet">
    <title>Medium Rectangle</title>
    <style>
      @property --accentColor {
        syntax: "<color>";
        inherits: true;
        initial-value: magenta;
      }
      *,
      *::before,
      *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        overflow-wrap: break-word;
        border: none;

        &:focus-visible {
          outline: 2px solid var(--accentColor);
          outline-offset: 2px;
        }

        &::selection,
        &::target-text {
          background-color: var(--accentColor);
        }

        &[contenteditable] {
          caret-color: var(--accentColor);
        }
      }
      html {
        scroll-behavior: smooth;
        color-scheme: light dark;
        accent-color: var(--accentColor);
        font-size: 100%;
        line-height: 1.5;
        -webkit-text-size-adjust: 100%;
        -moz-tab-size: 4;
        tab-size: 4;
        -webkit-font-smoothing: antialiased;
      }
      body {
        margin: 0;
      }
      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      p,
      span {
        overflow-wrap: break-word;
      }
      hr {
        height: 0;
        color: inherit;
      }
      abbr[title] {
        text-decoration: underline dotted;
      }
      b,
      strong {
        font-weight: bolder;
      }
      code,
      kbd,
      pre,
      samp {
        font-family: Hack, ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
        font-size: 1em;
      }
      small {
        font-size: 80%;
      }
      sub,
      sup {
        font-size: 75%;
        line-height: 0;
        position: relative;
        vertical-align: baseline;
      }
      sub {
        bottom: -0.25em;
      }
      sup {
        top: -0.5em;
      }
      table {
        text-indent: 0;
        border-color: inherit;
      }
      [type="button"],
      [type="reset"],
      [type="submit"],
      button,
      input,
      textarea,
      select,
      optgroup,
      option {
        margin: 0;
        font: inherit;
        letter-spacing: inherit;
        word-spacing: inherit;
      }
      input,
      textarea {
        min-width: 0;
        caret-color: var(--accentColor);
      }
      [type="text"],
      [type="search"],
      textarea {
        &::spelling-error {
          text-decoration: from-font red wavy underline;
        }
        &::grammar-error {
          text-decoration: from-font blue wavy underline;
        }
      }
      button,
      select {
        text-transform: none;
      }
      [type="button"],
      [type="reset"],
      [type="submit"],
      button {
        -webkit-appearance: button;
      }
      ::-moz-focus-inner {
        border-style: none;
        padding: 0;
      }
      :-moz-focusring {
        outline: 1px dotted ButtonText;
      }
      :-moz-ui-invalid {
        box-shadow: none;
      }
      legend {
        padding: 0;
      }
      progress {
        vertical-align: baseline;
      }
      ::-webkit-inner-spin-button,
      ::-webkit-outer-spin-button {
        height: auto;
      }
      [type="search"] {
        -webkit-appearance: textfield;
        outline-offset: -2px;
      }
      ::-webkit-search-decoration {
        -webkit-appearance: none;
      }
      ::-webkit-file-upload-button {
        -webkit-appearance: button;
        font: inherit;
      }
      summary {
        display: list-item;
      }
      dialog {
        max-width: 100%;
        max-height: 100%;
      }
      img,
      picture,
      video,
      canvas,
      svg {
        width: auto;
        height: auto;
        user-select: none;
      }
    </style>
    <style>
      :root {
        --fontFamily: "${formData.get("font")?.family}", ${formData.get("font")?.category ? formData.get("font").category : "sans-serif"};
        --accentColor: ${formData.get("accentColor")};
        --fontColor: ${formData.get("textColor")};
        --bgColor: ${formData.get("bgColor")};
      }
      body {
        width: 100%;
        background-color: var(--bgColor);
        background-image: ${svgBgAvailable ? formData.get("svgBackground") : "none"};
        background-position: center;
      }
      .mainCont {
        padding: 0.5rem 1rem;
        width: 100%;
        height: 100svh;
        display: grid;
        grid-template-rows: ${logoAvailable ? "3fr 1fr" : "auto"};
        place-items: center;
        row-gap: 0.5rem;
        overflow: hidden;
      }
      .imageCont {
        width: 100%;
        height: 100%;
        position: absolute;
        inset: 0;
        overflow: hidden;
        animation: fadeOut 1s linear 0s 1 normal both;
        z-index: -1;
        & .image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .textCont {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        color: var(--fontColor);
        font-family: var(--fontFamily);
        word-break: break-word;
        & .headlineSublineCont {
          width: 100%;
          height: ${logoAvailable ? "100%" : "50%"};
          position: relative;
          & .headline {
            position: absolute;
            inset: 0;
            align-self: center;
            color: inherit;
            font-family: inherit;
            font-size: 1.333rem;
            font-weight: 700;
            line-height: 1.333;
            transform-origin: 0% 50%;
            animation: fadeIn 1s linear 0.1s 1 normal both, textFadeIn 0.5s cubic-bezier(0, 0.55, 0.45, 1) 1s 1 normal both${formData.get("subline")?.length > 0 ? ", headlineChange 6s linear 2s infinite normal forwards" : ""};
          }
          & .subline {
            position: absolute;
            inset: 0;
            align-self: center;
            color: inherit;
            font-family: inherit;
            font-size: 1.15rem;
            font-weight: 400;
            line-height: 1.2;
            animation: sublineChange 6s linear 2s infinite normal both;
          }
        }
        & .btn {
          padding: 0.5em 1em;
          color: ${formData.get("ctaTextColor") ? "var(--bgColor)" : "var(--textColor)"};
          font-weight: 700;
          font-size: 1.1rem;
          letter-spacing: 0.5px;
          line-height: 1;
          text-align: center;
          text-decoration: none;
          border: 1px solid var(--accentColor);
          border-radius: 3px;
          background-color: var(--accentColor);
          animation: btnPulse 3s ease-in-out 0s ${googleAds ? "420" : "infinite"} normal both, fadeIn 1s linear 0.2s 1 normal both;
          transition: all 0.2s ease;
          &:is(:hover, :focus-visible) {
            color: var(--accentColor);
            background-color: var(--bgColor);
          }
        }
      }
      .logoCont {
        width: 100%;
        height: 100%;
        overflow: hidden;
        animation: fadeIn 1s linear 0.3s 1 normal both;
        & .logo {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
      .fakeBorder {
        position: absolute;
        inset: 0;
        border: 1px solid #b3b3b3;
        pointer-events: none;
      }
      @keyframes fadeIn {
        0% {
          opacity: 0;
        }
        90% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
      @keyframes fadeOut {
        0% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          opacity: ${svgBgAvailable ? "0" : "0.2"};
        }
      }
      @keyframes textFadeIn {
        from {
          opacity: 0;
          scale: 1.25 1;
          translate: 50px 0;
        }
        to {
          opacity: 1;
          scale: 1 1;
          translate: 0 0;
        }
      }
      @keyframes headlineChange {
        0% {
          opacity: 1;
          translate: 0 0;
        }
        45% {
          opacity: 1;
          translate: 0 0;
        }
        50% {
          opacity: 0;
          translate: 0 -50px;
        }
        95% {
          opacity: 0;
          translate: 0 50px;
        }
        100% {
          opacity: 1;
          translate: 0 0;
        }
      }
      @keyframes sublineChange {
        0% {
          opacity: 0;
          translate: 0 50px;
        }
        45% {
          opacity: 0;
          translate: 0 50px;
        }
        50% {
          opacity: 1;
          translate: 0 0;
        }
        95% {
          opacity: 1;
          translate: 0 0;
        }
        100% {
          opacity: 0;
          translate: 0 -50px;
        }
      }      @keyframes btnPulse {
        0% {
          scale: 1;
        }
        33% {
          scale: 1;
        }
        45% {
          scale: 1.2;
        }
        50% {
          scale: 1;
        }
        55% {
          scale: 1.1;
        }
        60% {
          scale: 1;
        }
        65% {
          scale: 1.05;
        }
        70% {
          scale: 1;
        }
        75% {
          scale: 1.025;
        }
        80% {
          scale: 1;
        }
        85% {
          scale: 1.0125;
        }
        90% {
          scale: 1;
        }
        95% {
          scale: 1.00625;
        }
        100% {
          scale: 1;
        }
      }
    </style>
  </head>
  <body>
    <div class="mainCont">
      <div class="imageCont">
        <img class="image" src="${formData.get("mrImg")}" alt="" />
      </div>
      <div class="textCont">
        <div class="headlineSublineCont">
          <h1 class="headline">${formData.get("headline")?.length > 0 ? formData.get("headline") : "Headline"}</h1>
          <h1 class="subline">${formData.get("subline")?.length > 0 ? formData.get("subline") : ""}</h1>
        </div>
        <a class="btn" href="#" target="_blank">${formData.get("ctaText")?.length > 0 ? formData.get("ctaText") : "mehr Infos"}</a>
      </div>
      ${logoAvailable ? logoEl : ""}
    </div>
    <div class="fakeBorder"></div>
    <script>
      for (const link of document.querySelectorAll("a")) {
        link.addEventListener("click", (ev) => {
          ev.preventDefault();
        });
      }
    </script>
    ${clicktag && !googleAds ? clicktagScript : ""}
  </body>
</html>
`;
    return outputTxt;
  },
};

export default MediumRectangle;
