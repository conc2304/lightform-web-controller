import { r as registerInstance, h, e as Host } from './index-f06469e8.js';

const appRootCss = "body{margin:0px;padding:0px;font-family:'Atlas Grotesk Web', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'}html{width:100vw;height:100vh;overflow-y:hidden;scroll-behavior:smooth;font-size:17px}@media (max-width: 900px){html{font-size:15px}}@media (max-width: 400px){html{font-size:13px}}@font-face{font-family:'Atlas Grotesk Web';src:url('assets/fonts/AtlasGrotesk-Regular-Web.eot');src:url('assets/fonts/AtlasGrotesk-Regular-Web.eot?#iefix') format('embedded-opentype'),  \n       url('assets/fonts/AtlasGrotesk-Regular-Web.woff2') format('woff2'), \n       url('assets/fonts/AtlasGrotesk-Regular-Web.woff') format('woff');font-weight:400;font-style:normal;font-stretch:normal}@font-face{font-family:'Atlas Grotesk Web';src:url('assets/fonts/AtlasGrotesk-Light-Web.eot');src:url('assets/fonts/AtlasGrotesk-Light-Web.eot?#iefix') format('embedded-opentype'),\n       url('assets/fonts/AtlasGrotesk-Light-Web.woff2') format('woff2'),\n       url('assets/fonts/AtlasGrotesk-Light-Web.woff') format('woff');font-weight:300;font-style:normal;font-stretch:normal}:host{background-color:black}";

const AppRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  // ==== PUBLIC ============================================================
  // ---- Properties --------------------------------------------------------
  // ---- Methods -----------------------------------------------------------
  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - -
  render() {
    // console.group("render");
    try {
      return (h(Host, null, h("app-home", null)));
    }
    catch (e) {
      // console.error(e);
    }
    finally {
      // console.groupEnd();
    }
  }
};
AppRoot.style = appRootCss;

export { AppRoot as app_root };
