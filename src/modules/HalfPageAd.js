const HalfPageAd = {
  getCode(formData, mode = "output") {
    let imgSrc;

    switch (mode) {
      case "output":
        imgSrc = "./bgImg.jpg";
        break;

      case "preview":
        imgSrc = formData.get("hpaImg") ? formData.get("hpaImg") : "";
        break;

      default:
        break;
    }

    const outputTxt = `<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=${formData.get("font").family.replaceAll(" ", "+")}:wght@400;700&display=swap" rel="stylesheet">
    <title>interstitial</title>
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
      }
      .mainCont {
        width: 100%;
        height: 100svh;
        display: grid;
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 2rem 1fr 2rem;
        grid-template-areas:
          "img img img"
          ". text .";
        place-items: center;
        overflow: hidden;
      }
      .imageCont {
        width: 100%;
        height: 100%;
        grid-area: img;
        overflow: hidden;
        & .image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .textCont {
        width: 100%;
        height: 100%;
        grid-area: text;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        color: var(--fontColor);
        font-family: var(--fontFamily);

        & .headline {
          color: inherit;
          font-family: inherit;
          font-weight: 700;
          font-size: clamp(1.5rem, 8vmin, 3rem);
          transform-origin: 0% 50%;
          animation: textFadeIn 0.5s cubic-bezier(0, 0.55, 0.45, 1) 0.25s 1 normal both;
        }
        & .subline {
          color: inherit;
          font-family: inherit;
          font-weight: 400;
          font-size: clamp(1rem, 4vmin, 2rem);
          transform-origin: 0% 50%;
          animation: textFadeIn 0.5s cubic-bezier(0, 0.55, 0.45, 1) 0.5s 1 normal both;
        }
        & .btn {
          padding: 0.5em 1em;
          color: ${formData.get("ctaTextColor") ? "var(--bgColor)" : "var(--textColor)"};
          font-weight: 700;
          font-size: clamp(1.1rem, 4vmin, 1.6rem);
          letter-spacing: 0.5px;
          line-height: 1;
          text-align: center;
          text-decoration: none;
          border: 1px solid var(--accentColor);
          border-radius: 3px;
          background-color: var(--accentColor);
          animation: btnPulse 3s ease-in-out 0s infinite normal both;
          transition: all 0.2s ease;

          &:is(:hover, :focus-visible) {
            color: var(--accentColor);
            background-color: var(--bgColor);
          }
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
      @keyframes btnPulse {
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
        <img class="image" src="${imgSrc}" alt="" />
      </div>
      <div class="textCont">
        <h1 class="headline">${formData.get("headline")?.length > 0 ? formData.get("headline") : "Headline"}</h1>
        <p class="subline">${formData.get("subline")?.length > 0 ? formData.get("subline") : "Subline"}</p>
        <a class="btn" href="#" target="_blank">${formData.get("ctaText")?.length > 0 ? formData.get("ctaText") : "mehr Infos"}</a>
      </div>
    </div>
  </body>
</html>
`;
    return outputTxt;
  },
};

export default HalfPageAd;
