import { r as registerInstance, h, e as Host } from './index-f06469e8.js';
import { L as LfAppState } from './lf-app-state.service-e3055c6c.js';

var LfPairingFlowViewState;
(function (LfPairingFlowViewState) {
  LfPairingFlowViewState[LfPairingFlowViewState["SelectWifiList"] = 0] = "SelectWifiList";
  LfPairingFlowViewState[LfPairingFlowViewState["EnterPassword"] = 1] = "EnterPassword";
  LfPairingFlowViewState[LfPairingFlowViewState["Connecting"] = 2] = "Connecting";
})(LfPairingFlowViewState || (LfPairingFlowViewState = {}));

const appHomeCss = "body{margin:0px;padding:0px;font-family:'Atlas Grotesk Web', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'}html{width:100vw;height:100vh;overflow-y:hidden;scroll-behavior:smooth;font-size:17px}@media (max-width: 900px){html{font-size:15px}}@media (max-width: 400px){html{font-size:13px}}@font-face{font-family:'Atlas Grotesk Web';src:url('assets/fonts/AtlasGrotesk-Regular-Web.eot');src:url('assets/fonts/AtlasGrotesk-Regular-Web.eot?#iefix') format('embedded-opentype'),  \n       url('assets/fonts/AtlasGrotesk-Regular-Web.woff2') format('woff2'), \n       url('assets/fonts/AtlasGrotesk-Regular-Web.woff') format('woff');font-weight:400;font-style:normal;font-stretch:normal}@font-face{font-family:'Atlas Grotesk Web';src:url('assets/fonts/AtlasGrotesk-Light-Web.eot');src:url('assets/fonts/AtlasGrotesk-Light-Web.eot?#iefix') format('embedded-opentype'),\n       url('assets/fonts/AtlasGrotesk-Light-Web.woff2') format('woff2'),\n       url('assets/fonts/AtlasGrotesk-Light-Web.woff') format('woff');font-weight:300;font-style:normal;font-stretch:normal}.app-content{position:relative;display:flex;box-sizing:border-box;padding:2rem;height:100vh;width:100vw;overflow:hidden;background-color:#000000}.device-pairing--page-container{position:relative;width:100%;height:100%}.device-pairing--card{box-sizing:border-box;border:0.25rem solid #FFFFFF;border-radius:0.75rem;color:#FFFFFF;padding:3rem 3rem 1rem 3rem;width:90%;height:100%;margin:0 auto;display:flex;flex-direction:column}.device-pairing--content{flex-grow:1;display:flex;flex-direction:column;min-height:0}.device-pairing--header-container .device-pairing--header-text{font-family:Atlas, Helvetica, sans-serif;font-weight:400;font-style:normal;font-stretch:normal;color:#FFFFFF;font-size:3rem;font-weight:bold;line-height:3.625rem;padding:0rem 2.0625rem}.device-pairing--header-container .device-pairing--header-divider{background-color:#FFFFFF;background-color:#FFFFFF;height:1px;padding:0 0.5rem;width:100%;margin-top:2.3125rem}.device-pairing--content-container{height:100%;overflow:hidden}.scrollable-content{flex-grow:1;overflow:auto;min-height:0}.scrollable-content::-webkit-scrollbar{width:10px}.scrollable-content::-webkit-scrollbar-track{background-color:transparent}.scrollable-content::-webkit-scrollbar-corner{background-color:transparent}.scrollable-content::-webkit-scrollbar-thumb{background-color:#575C6D;border-radius:10px}";

const AppHome = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    // ==== OWN PROPERTIES SECTION =======================================================================
    // Dependency Injections
    this.lfAppState = LfAppState;
    // Getters/Setters
    // ---- Protected -----------------------------------------------------------------------------
    // ==== HOST HTML REFERENCE ===================================================================
    // @Element() el: HTMLElement;
    // ==== State() VARIABLES SECTION =============================================================
    this.pairingState = LfPairingFlowViewState.SelectWifiList;
  }
  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  // ==== EVENTS SECTION ========================================================================
  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentDidLoad Implementation - - - - - - - - - - - - - - - - - - - - -
  componentWillRender() {
    console.group("componentWillRender");
    try {
      if (!this.lfAppState.selectedNetwork) {
        this.pairingState = LfPairingFlowViewState.SelectWifiList;
      }
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
  // ==== LISTENERS SECTION =====================================================================
  onNetworkSelected(event) {
    console.group("onNetworkSelected");
    try {
      const selectedNetwork = event.detail;
      this.lfAppState.selectedNetwork = selectedNetwork;
      this.pairingState = this.lfAppState.pairingFlowState = LfPairingFlowViewState.EnterPassword;
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
  onPasswordSubmitted(event) {
    console.group("onPasswordSubmitted");
    try {
      const password = event.detail;
      this.lfAppState.password = password;
      this.pairingState = this.lfAppState.pairingFlowState = LfPairingFlowViewState.Connecting;
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
  onRestartPairingProcess() {
    console.group("restartPairingProcess");
    try {
      this.pairingState = this.lfAppState.pairingFlowState = LfPairingFlowViewState.SelectWifiList;
      this.lfAppState.password = null;
      this.lfAppState.selectedNetwork = null;
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
  // ==== PUBLIC METHODS API - @Method() SECTION ========================================================
  // @Method()
  // async publicMethod(): Promise<void> {return}
  // ==== LOCAL METHODS SECTION =========================================================================
  // ==== RENDERING SECTION =========================================================================
  renderWifiPairingContent() {
    console.group("renderWifiPairingContent");
    try {
      if (this.pairingState === LfPairingFlowViewState.SelectWifiList) {
        return h("lf-wifi-list", null);
      }
      else if (this.pairingState === LfPairingFlowViewState.EnterPassword && this.lfAppState.selectedNetwork) {
        return (h("lf-wifi-password", { networkName: this.lfAppState.selectedNetwork.ssid }));
      }
      else if (this.pairingState === LfPairingFlowViewState.Connecting) {
        return h("lf-wifi-connecting", null);
      }
      else {
        return h("lf-wifi-list", null);
      }
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render() {
    console.group("render");
    try {
      return (h(Host, { class: "app-content" }, h("div", { class: "device-pairing--page-container" }, h("div", { class: "device-pairing--card" }, h("div", { class: "device-pairing--content" }, h("div", { class: "device-pairing--header-container" }, h("div", { class: "device-pairing--header-text" }, "Internet Settings"), h("div", { class: "device-pairing--header-divider" })), h("div", { class: "device-pairing--content-container" }, this.renderWifiPairingContent()))))));
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
};
AppHome.style = appHomeCss;

export { AppHome as app_home };
