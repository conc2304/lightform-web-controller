import { r as registerInstance, h, g as getElement } from './index-f06469e8.js';

const lfWifiListItemComponentCss = "body{margin:0px;padding:0px;font-family:'Atlas Grotesk Web', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'}html{width:100vw;height:100vh;overflow-y:hidden;scroll-behavior:smooth;font-size:17px}@media (max-width: 900px){html{font-size:15px}}@media (max-width: 400px){html{font-size:13px}}@font-face{font-family:'Atlas Grotesk Web';src:url('assets/fonts/AtlasGrotesk-Regular-Web.eot');src:url('assets/fonts/AtlasGrotesk-Regular-Web.eot?#iefix') format('embedded-opentype'),  \n       url('assets/fonts/AtlasGrotesk-Regular-Web.woff2') format('woff2'), \n       url('assets/fonts/AtlasGrotesk-Regular-Web.woff') format('woff');font-weight:400;font-style:normal;font-stretch:normal}@font-face{font-family:'Atlas Grotesk Web';src:url('assets/fonts/AtlasGrotesk-Light-Web.eot');src:url('assets/fonts/AtlasGrotesk-Light-Web.eot?#iefix') format('embedded-opentype'),\n       url('assets/fonts/AtlasGrotesk-Light-Web.woff2') format('woff2'),\n       url('assets/fonts/AtlasGrotesk-Light-Web.woff') format('woff');font-weight:300;font-style:normal;font-stretch:normal}:host{display:block;border:0.25rem solid transparent;transition-property:border;transition-duration:0.3s;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);border-radius:0.75rem;outline:none;line-height:3.625rem;animation:popIn 0.2s calc(var(--animation-order) * 80ms) both ease-in;font-family:Atlas, Helvetica, sans-serif;font-weight:400;font-style:normal;font-stretch:normal;color:#FFFFFF;font-size:3rem;line-height:3.625rem;padding:1rem 2.0625rem;font-family:Atlas, Helvetica, sans-serif;font-weight:300;font-style:normal;font-stretch:normal;color:#FFFFFF;font-size:3rem}:host(:focus),:host(:hover){border-color:#2C65FF;cursor:pointer}:host(:active){border-color:#12A37B}.list-item--inner-wrapper{width:100%;display:flex;justify-content:space-between}.list-item--icons-container{display:flex;justify-content:space-between;min-width:50px;align-items:center}.list-item--icons-container .list-item--icon{padding-right:0.8rem;height:3.625rem;width:3.625rem}";

const LfWifiListItem = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.focusElem = false;
  }
  // ==== EVENTS SECTION ===============================================================
  // @Event() eventName: EventEmitter;
  // ==== COMPONENT LIFECYCLE EVENTS ===================================================
  // - -  componentDidRender Implementation - - - - - - - - - - - - - - - - - - - - - -
  componentDidRender() {
    console.group("componentDidRender");
    try {
      if (this.focusElem) {
        setTimeout(() => {
          this.element.focus();
        }, 500);
      }
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
  // ==== LISTENERS SECTION ==============================================================
  // @Listen("eventName")
  // onEventNameReceived(event: CustomEvent): void { /** do stuff */}
  // ==== PUBLIC METHODS API - @Method() SECTION =========================================
  // @Method()
  // async publicMethod(): Promise<void> { /** do stuff */}
  // ==== LOCAL METHODS SECTION ==========================================================
  getNetworkIconPath(signalStrength) {
    console.group("getNetworkIconPath");
    try {
      let wifiSignalFile = "network-1bar.svg";
      if (signalStrength >= 66) {
        wifiSignalFile = "network-3bars.svg";
      }
      else if (signalStrength >= 33) {
        wifiSignalFile = "network-2bars.svg";
      }
      const fileName = typeof wifiSignalFile !== "undefined" ? `${wifiSignalFile}` : "";
      return fileName;
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
  networkIsSecure(security) {
    console.group("networkIsUnsecured");
    try {
      return !(security == undefined || security.toUpperCase() == "UNSECURED");
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
  // ==== RENDERING SECTION ===============================================
  renderLockIcon(security) {
    console.group("renderLockIcon");
    try {
      if (this.networkIsSecure(security)) {
        const iconImageFile = "Lock.svg";
        const resolvedFilePath = `assets/images/icons/${iconImageFile}`;
        return h("img", { class: "list-item--icon", alt: "protected network", src: resolvedFilePath });
      }
      else {
        // don't show an unlock icon, just a blank div for UI
        return h("div", { class: "list-item--icon img--empty" });
      }
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
  renderNetworkStrengthIcon(signalStrength) {
    console.group("renderNetworkStrengthIcon");
    try {
      return h("img", { class: "list-item--icon", src: `assets/images/icons/${this.getNetworkIconPath(signalStrength)}`, alt: `${signalStrength} Signal Strength}` });
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - -
  render() {
    console.group("render");
    try {
      return (h("div", { class: "wifi-list-item" }, h("div", { class: "list-item--inner-wrapper" }, h("div", { class: "list-item--network-name" }, this.networkName), h("div", { class: "list-item--icons-container" }, h("div", { class: "list-item--icon-wrapper" }, this.renderNetworkStrengthIcon(this.signalStrength)), h("div", { class: "list-item--icon--wrapper" }, this.renderLockIcon(this.passwordProtected))))));
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
  get element() { return getElement(this); }
};
LfWifiListItem.style = lfWifiListItemComponentCss;

export { LfWifiListItem as lf_wifi_list_item };
