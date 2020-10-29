import { r as registerInstance, i as createEvent, h, g as getElement } from './index-f06469e8.js';
import { K as Key_enum } from './Key.enum-569ae29e.js';
import { L as LfNetworkConnector } from './lf-network-connection.service-bb723f11.js';

const lfWifiListComponentCss = "body{margin:0px;padding:0px;font-family:'Atlas Grotesk Web', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'}html{width:100vw;height:100vh;overflow-y:hidden;scroll-behavior:smooth;font-size:17px}@media (max-width: 900px){html{font-size:15px}}@media (max-width: 400px){html{font-size:13px}}@font-face{font-family:'Atlas Grotesk Web';src:url('assets/fonts/AtlasGrotesk-Regular-Web.eot');src:url('assets/fonts/AtlasGrotesk-Regular-Web.eot?#iefix') format('embedded-opentype'),  \n       url('assets/fonts/AtlasGrotesk-Regular-Web.woff2') format('woff2'), \n       url('assets/fonts/AtlasGrotesk-Regular-Web.woff') format('woff');font-weight:400;font-style:normal;font-stretch:normal}@font-face{font-family:'Atlas Grotesk Web';src:url('assets/fonts/AtlasGrotesk-Light-Web.eot');src:url('assets/fonts/AtlasGrotesk-Light-Web.eot?#iefix') format('embedded-opentype'),\n       url('assets/fonts/AtlasGrotesk-Light-Web.woff2') format('woff2'),\n       url('assets/fonts/AtlasGrotesk-Light-Web.woff') format('woff');font-weight:300;font-style:normal;font-stretch:normal}.wifi-list--items-container{padding-top:0.825rem;height:100%;overflow-y:scroll}.wifi-list--items-container.no-scroll{overflow:hidden}.wifi-list--items-container .loading-container{height:100%;display:flex;flex-direction:column;align-items:center;justify-items:center;justify-content:center;text-align:center}.wifi-list--items-container .loading-container h3{font-family:Atlas, Helvetica, sans-serif;font-weight:300;font-style:normal;font-stretch:normal;color:#FFFFFF;font-size:2.5rem}.wifi-list--items-container .loading-container img{margin-top:3.4375rem;width:7.25rem;height:7.25rem}.wifi-list--items-container .wifi-list--refresh-list{border:0.25rem solid transparent;transition-property:border;transition-duration:0.3s;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);border-radius:0.75rem;outline:none;line-height:3.625rem;animation:popIn 0.2s calc(var(--animation-order) * 80ms) both ease-in;font-family:Atlas, Helvetica, sans-serif;font-weight:400;font-style:normal;font-stretch:normal;color:#FFFFFF;font-size:3rem;line-height:3.625rem;padding:1rem 2.0625rem;font-family:Atlas, Helvetica, sans-serif;font-weight:400;font-style:normal;font-stretch:normal;font-size:2.25rem;text-align:center}.wifi-list--items-container .wifi-list--refresh-list:focus,.wifi-list--items-container .wifi-list--refresh-list:hover{color:#12A37B;border-color:#2C65FF;cursor:pointer}.wifi-list--items-container .wifi-list--refresh-list:active{border-color:#15C595}";

var LoadingProgress;
(function (LoadingProgress) {
  LoadingProgress[LoadingProgress["Pending"] = 0] = "Pending";
  LoadingProgress[LoadingProgress["Successful"] = 1] = "Successful";
  LoadingProgress[LoadingProgress["Failed"] = 2] = "Failed";
})(LoadingProgress || (LoadingProgress = {}));
const LfWifiList = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.networkSelected = createEvent(this, "networkSelected", 7);
    // ==== OWN PROPERTIES SECTION =================================================================
    // Dependency Injections
    this.NetworkConnector = LfNetworkConnector;
    this.wifiEntries = [];
  }
  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - - -
  componentWillLoad() {
    console.group("componentWillLoad");
    try {
      this.getAvailableNetworks();
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - - -
  componentDidUpdate() {
    console.group("componentDidUpdate");
    try {
      if (this.loadingProgress === LoadingProgress.Failed) {
        setTimeout(() => {
          this.refreshButtonEl.focus();
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
  // ==== LISTENERS SECTION =====================================================================
  onKeydown(e) {
    console.group("onKeydown");
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
  // async publicMethod(): Promise<void> {return}
  // ==== LOCAL METHODS SECTION =========================================================================
  async getAvailableNetworks() {
    console.group("getAvailableNetworks");
    try {
      this.loadingProgress = LoadingProgress.Pending;
      this.NetworkConnector.getAvailableNetworks()
        .then(response => {
        if (!response) {
          throw new Error("No Network Response Received.");
        }
        this.wifiEntries = response;
        this.loadingProgress = LoadingProgress.Successful;
      })
        .catch(e => {
        this.loadingProgress = LoadingProgress.Failed;
        throw new Error(e);
      });
    }
    catch (e) {
      console.error(e);
      this.loadingProgress = LoadingProgress.Failed;
    }
    finally {
      console.groupEnd();
    }
  }
  onWifiEntryClicked(network) {
    console.group("onWifiEntryClicked");
    try {
      this.networkSelected.emit(network);
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
  handleKeys(e) {
    console.group("handleKeys");
    try {
      const specialKeys = [Key_enum.Key.ArrowDown, Key_enum.Key.ArrowUp, Key_enum.Key.Enter];
      const parent = document.querySelector(".wifi-list--items-container");
      const activeEl = document.activeElement;
      let nextFocusEl;
      if (specialKeys.includes(e.key)) {
        e.preventDefault();
      }
      switch (e.key) {
        case Key_enum.Key.ArrowDown:
          nextFocusEl = activeEl.nextSibling
            ? activeEl.nextSibling
            : parent.firstChild;
          nextFocusEl.focus();
          break;
        case Key_enum.Key.ArrowUp:
          nextFocusEl = activeEl.previousSibling
            ? activeEl.previousSibling
            : parent.lastChild;
          nextFocusEl.focus();
          break;
        case Key_enum.Key.Enter:
          const activeIndex = Array.prototype.indexOf.call(parent.childNodes, document.activeElement);
          if (this.loadingProgress === LoadingProgress.Failed || activeIndex === this.wifiEntries.length) {
            this.getAvailableNetworks();
          }
          else {
            this.onWifiEntryClicked(this.wifiEntries[activeIndex]);
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
  // ==== RENDERING SECTION =========================================================================
  renderListItems() {
    return [
      this.wifiEntries.map((item, index) => {
        return (h("lf-wifi-list-item", { tabindex: "0", passwordProtected: item.security, networkName: item.ssid, signalStrength: item.signal, index: index, focusElem: index === 0, style: { "--animation-order": index }, class: "wifi-list-item", onClick: () => this.onWifiEntryClicked(item) }));
      }),
      this.renderRefreshButton(),
    ];
  }
  renderRefreshButton() {
    var _a;
    try {
      return (h("div", { onClick: () => this.getAvailableNetworks(), class: "wifi-list--refresh-list wifi-list-item", tabindex: "0", style: { "--animation-order": ((_a = this.wifiEntries) === null || _a === void 0 ? void 0 : _a.length) || 1 }, ref: el => (this.refreshButtonEl = el) }, h("div", null, "Refresh Wifi List")));
    }
    catch (e) {
      console.error(e);
    }
  }
  renderLoadingContainer() {
    console.group("renderLoadingContainer");
    try {
      return (h("div", { class: "wifi-list--items-container no-scroll" }, h("div", { class: "loading-container" }, h("h3", null, "Searching for networks"), h("img", { alt: "Loading", src: "assets/images/progress-spinner-circles.gif" }))));
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
  renderFailureContainer() {
    console.group("renderFailureContainer");
    try {
      return (h("div", { class: "wifi-list--items-container no-scroll" }, h("div", { class: "loading-container" }, h("h3", null, "Unable to find any available networks"), this.renderRefreshButton())));
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
      console.log(this.wifiEntries);
      if (this.loadingProgress === LoadingProgress.Pending) {
        return this.renderLoadingContainer();
      }
      else if (this.loadingProgress === LoadingProgress.Failed) {
        return this.renderFailureContainer();
      }
      else if (this.loadingProgress === LoadingProgress.Successful && this.wifiEntries.length) {
        return h("div", { class: "wifi-list--items-container scrollable-content" }, this.renderListItems());
      }
      else {
        return this.renderFailureContainer();
      }
    }
    catch (e) {
      console.error(e);
      return this.renderFailureContainer();
    }
    finally {
      console.groupEnd();
    }
  }
  get el() { return getElement(this); }
};
LfWifiList.style = lfWifiListComponentCss;

export { LfWifiList as lf_wifi_list };
