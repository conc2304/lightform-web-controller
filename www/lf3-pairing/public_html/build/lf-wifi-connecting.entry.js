import { r as registerInstance, i as createEvent, h, e as Host, g as getElement } from './index-f06469e8.js';
import { L as LfAppState } from './lf-app-state.service-e3055c6c.js';
import { K as Key_enum } from './Key.enum-569ae29e.js';
import { L as LfNetworkConnector } from './lf-network-connection.service-bb723f11.js';

const lfWifiConnectingComponentCss = "body{margin:0px;padding:0px;font-family:'Atlas Grotesk Web', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'}html{width:100vw;height:100vh;overflow-y:hidden;scroll-behavior:smooth;font-size:17px}@media (max-width: 900px){html{font-size:15px}}@media (max-width: 400px){html{font-size:13px}}@font-face{font-family:'Atlas Grotesk Web';src:url('assets/fonts/AtlasGrotesk-Regular-Web.eot');src:url('assets/fonts/AtlasGrotesk-Regular-Web.eot?#iefix') format('embedded-opentype'),  \n       url('assets/fonts/AtlasGrotesk-Regular-Web.woff2') format('woff2'), \n       url('assets/fonts/AtlasGrotesk-Regular-Web.woff') format('woff');font-weight:400;font-style:normal;font-stretch:normal}@font-face{font-family:'Atlas Grotesk Web';src:url('assets/fonts/AtlasGrotesk-Light-Web.eot');src:url('assets/fonts/AtlasGrotesk-Light-Web.eot?#iefix') format('embedded-opentype'),\n       url('assets/fonts/AtlasGrotesk-Light-Web.woff2') format('woff2'),\n       url('assets/fonts/AtlasGrotesk-Light-Web.woff') format('woff');font-weight:300;font-style:normal;font-stretch:normal}@keyframes popIn{0%{opacity:0;transform:scale(0.6) translateY(-1rem)}100%{opacity:1;transform:none}}:root{--animation-speed:120ms;--animation-duration:0.3s}:host{display:flex;height:100%}.animation--pop-in{animation:popIn var(--animation-duration) calc(var(--animation-order) * var(--animation-speed)) both ease-in}.wifi-connecting--container{margin:0 auto;display:flex;flex-direction:column;justify-content:space-evenly;flex-grow:1}.wifi-connecting--points p{font-family:Atlas, Helvetica, sans-serif;font-weight:400;font-style:normal;font-stretch:normal;color:#FFFFFF;font-size:1.75rem;line-height:2.1rem;text-align:center;margin:unset}.wifi-connecting--img-frame{width:8.75rem;height:8.75rem;display:flex;align-items:center;justify-content:center;background-color:transparent}.wifi-connecting--status-msg-container,.wifi-connecting--status-container{width:80%;margin:0 auto}.wifi-connecting--status-container{display:flex;justify-content:space-between}.wifi-connecting--status-wrapper{width:100%;display:flex;align-items:center;justify-content:center}.wifi-connecting-progress-bar{height:0.5rem;width:66%}.wifi-connecting--status-icon{height:3.75rem}.wifi-connecting--status-icon.failed-icon{height:5rem}.wifi-connecting--status-msg{font-family:Atlas, Helvetica, sans-serif;font-weight:300;font-style:normal;font-stretch:normal;color:#FFFFFF;font-size:2.25rem;line-height:2.6875rem;text-align:center}.wifi-connecting--action-btn-container{outline:none}.wifi-connecting--action-btn-container .wifi-connecting--action-btn{border:0.25rem solid transparent;transition-property:border;transition-duration:0.3s;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);border-radius:0.75rem;outline:none;outline:none}.wifi-connecting--action-btn-container .wifi-connecting--action-btn:focus,.wifi-connecting--action-btn-container .wifi-connecting--action-btn.focused{outline:none;border-color:#2C65FF}.action-btn--text{font-family:Atlas, Helvetica, sans-serif;font-weight:400;font-style:normal;font-stretch:normal;color:#17E8B0;font-size:2.25rem;line-height:2.7rem;text-align:center;outline:none;padding:1.4375rem}.action-btn--text:focus{outline:none}";

var ConnectionStatus;
(function (ConnectionStatus) {
  ConnectionStatus[ConnectionStatus["Connecting"] = 0] = "Connecting";
  ConnectionStatus[ConnectionStatus["Successful"] = 1] = "Successful";
  ConnectionStatus[ConnectionStatus["Failed"] = 2] = "Failed";
})(ConnectionStatus || (ConnectionStatus = {}));
const LfWifiConnecting = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.restartPairingProcess = createEvent(this, "restartPairingProcess", 7);
    // ==== OWN PROPERTIES SECTION =======================================================================
    // Dependency Injections
    this.lfAppState = LfAppState;
    this.NetworkConnector = LfNetworkConnector;
    // ==== State() VARIABLES SECTION =============================================================
    this.connectionStatus = ConnectionStatus.Connecting;
  }
  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - -
  componentWillLoad() {
    console.group('componentWillLoad');
    try {
      const network = this.lfAppState.selectedNetwork;
      this.connectToNetwork(network);
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
  // - -  componentDidRender Implementation - - - - - - - - - - - - - - - - - - - - - - - - - -
  componentDidRender() {
    console.group('componentDidRender');
    try {
      // do stuff on render complete
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
  // ==== LISTENERS SECTION =====================================================================
  onKeydown(e) {
    console.group('onKeydown');
    try {
      this.handleKeys(e);
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
  // async publicMethod(): Promise<void> {
  //   return;
  // }
  // ==== LOCAL METHODS SECTION =========================================================================
  handleKeys(e) {
    console.group('handleKeys');
    try {
      const specialKeys = [Key_enum.Key.ArrowDown, Key_enum.Key.ArrowUp, Key_enum.Key.ArrowLeft, Key_enum.Key.ArrowRight, Key_enum.Key.Enter];
      const activeEl = this.hostElement.shadowRoot.activeElement;
      if (specialKeys.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
      switch (e.key) {
        case Key_enum.Key.ArrowDown:
        case Key_enum.Key.ArrowUp:
        case Key_enum.Key.ArrowLeft:
        case Key_enum.Key.ArrowRight:
          console.log('KEY', e.key);
          this.connectionActionBtn.focus();
          break;
        case Key_enum.Key.Enter:
          if (activeEl !== this.connectionActionBtn) {
            this.connectionActionBtn.focus();
          }
          else {
            this.onConnectionBtnClick();
          }
          break;
      }
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
  async connectToNetwork(network) {
    console.group('connectToNetwork');
    try {
      this.connectionStatus = ConnectionStatus.Connecting;
      network.password = LfAppState.password;
      this.NetworkConnector.connectToNetwork(network)
        .then((response) => {
        if (response.error) {
          const error = response.error.message ? response.error.message : response.error.code;
          throw new Error(error.toString());
        }
        this.connectionStatus = ConnectionStatus.Successful;
        this.connectionActionBtn.focus();
      })
        .catch(error => {
        this.connectionStatus = ConnectionStatus.Failed;
        this.connectionActionBtn.focus();
        throw new Error(error);
      });
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
  onConnectionBtnClick() {
    console.group('onConnectionBtnClick');
    try {
      this.restartPairingProcess.emit();
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
  // ==== RENDERING SECTION =========================================================================
  renderConnectingStatus() {
    switch (this.connectionStatus) {
      case ConnectionStatus.Connecting:
        return h("ion-progress-bar", { class: "wifi-connecting-progress-bar", color: "success", type: "indeterminate" });
      case ConnectionStatus.Successful:
        return (h("img", { src: "assets/images/icons/checkmark--rounded-green.svg", class: "wifi-connecting--status-icon success-icon animation--pop-in", style: { '--animation-order': 1 } }));
      case ConnectionStatus.Failed:
        return (h("img", { src: "assets/images/icons/x--flat-red.svg", class: "wifi-connecting--status-icon failed-icon animation--pop-in", style: { '--animation-order': 1 } }));
    }
  }
  renderStatusMsg() {
    const className = 'wifi-connecting--status-msg';
    switch (this.connectionStatus) {
      case ConnectionStatus.Connecting:
        return h("p", { class: className }, "Connecting to the internet ...");
      case ConnectionStatus.Successful:
        return h("p", { class: className }, "Successfully Connected.");
      case ConnectionStatus.Failed:
        return (h("p", { class: className }, "Unable to connect to the network.", h("br", null), "Please check your network settings or make sure the password is correct."));
    }
  }
  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render() {
    return (h(Host, null, h("div", { class: "wifi-connecting--container" }, h("div", { class: "wifi-connecting--status-container animation--pop-in", style: { '--animation-order': 1 } }, h("div", { class: "wifi-connecting--points" }, h("div", { class: "wifi-connecting--img-frame" }, h("img", { src: "assets/images/logos/Logomark Black@60px.svg", class: "wifi-connecting--img" })), h("p", null, "Lightform")), h("div", { class: "wifi-connecting--status-wrapper" }, this.renderConnectingStatus()), h("div", { class: "wifi-connecting--points" }, h("div", { class: "wifi-connecting--img-frame" }, h("img", { src: "assets/images/icons/globe.svg", class: "wifi-connecting--img" })), h("p", null, "Internet"))), h("div", { class: "wifi-connecting--status-msg-container animation--pop-in", style: { '--animation-order': 2 } }, this.renderStatusMsg()), h("div", { class: "wifi-connecting--action-btn-container animation--pop-in", style: { '--animation-order': 3 } }, h("div", { onClick: () => this.onConnectionBtnClick(), ref: el => (this.connectionActionBtn = el), class: "wifi-connecting--action-btn wifi-list-item", tabindex: "0" }, h("div", { class: "action-btn--text" }, this.connectionStatus === ConnectionStatus.Connecting ? 'Cancel' : 'OK'))))));
  }
  get hostElement() { return getElement(this); }
};
LfWifiConnecting.style = lfWifiConnectingComponentCss;

export { LfWifiConnecting as lf_wifi_connecting };
