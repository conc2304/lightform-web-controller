import { r as registerInstance, i as createEvent, h } from './index-f06469e8.js';
import { K as Key_enum } from './Key.enum-569ae29e.js';
import { K as KeyboardCharMap, L as LfKeyboardBlurDirection } from './lf-keyboard-blur-direction.enum-b83d4bc4.js';

const lfWifiPasswordComponentCss = "body{margin:0px;padding:0px;font-family:'Atlas Grotesk Web', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'}html{width:100vw;height:100vh;overflow-y:hidden;scroll-behavior:smooth;font-size:17px}@media (max-width: 900px){html{font-size:15px}}@media (max-width: 400px){html{font-size:13px}}@font-face{font-family:'Atlas Grotesk Web';src:url('assets/fonts/AtlasGrotesk-Regular-Web.eot');src:url('assets/fonts/AtlasGrotesk-Regular-Web.eot?#iefix') format('embedded-opentype'),  \n       url('assets/fonts/AtlasGrotesk-Regular-Web.woff2') format('woff2'), \n       url('assets/fonts/AtlasGrotesk-Regular-Web.woff') format('woff');font-weight:400;font-style:normal;font-stretch:normal}@font-face{font-family:'Atlas Grotesk Web';src:url('assets/fonts/AtlasGrotesk-Light-Web.eot');src:url('assets/fonts/AtlasGrotesk-Light-Web.eot?#iefix') format('embedded-opentype'),\n       url('assets/fonts/AtlasGrotesk-Light-Web.woff2') format('woff2'),\n       url('assets/fonts/AtlasGrotesk-Light-Web.woff') format('woff');font-weight:300;font-style:normal;font-stretch:normal}@keyframes popIn{0%{opacity:0;transform:scale(0.6) translateY(-1rem)}100%{opacity:1;transform:none}}:host{display:block}:root{--animation-order-prompt:0;--animation-order-input:1;--animation-order-checkbox:2;--animation-order-keyboard:3;--animation-speed:120ms;--animation-duration:0.3s}.wifi-password--container{width:95%;height:100%;margin:0 auto;display:flex;flex-direction:column}.wifi-password--container .wifi-password--input-container{margin-bottom:1rem}.wifi-password--container .wifi-password--prompt{display:block;width:100%;margin:2.6875rem auto 1.9375rem;font-family:Atlas, Helvetica, sans-serif;font-weight:300;font-style:normal;font-stretch:normal;color:#FFFFFF;font-size:2.25rem;line-height:2.6875rem;animation:popIn var(--animation-duration) calc(var(--animation-order-prompt) * var(--animation-speed)) both ease-in}.wifi-password--container .wifi-password--input{display:block;width:100%;margin:0 auto;height:5.625rem;background-color:#3C3E47;border:unset;appearance:none;padding:0 1.8125rem 0.2rem 1.8125rem;margin-bottom:1.5625rem;animation:popIn var(--animation-duration) calc(var(--animation-order-input) * var(--animation-speed)) both ease-in;font-family:Atlas, Helvetica, sans-serif;font-weight:300;font-style:normal;font-stretch:normal;color:#FFFFFF;font-size:2.25rem;line-height:3.6875rem;letter-spacing:3px}.wifi-password--container .wifi-password--input:focus{outline:none}.wifi-password--container .wifi-password--input.dirty[type=password]{letter-spacing:5px;font-family:Arial, Helvetica, sans-serif;font-size:5rem;line-height:10px;padding-bottom:0.1rem}.wifi-password--container .wifi-password--display-toggle-container{display:flex;justify-content:center;align-items:center;animation:popIn var(--animation-duration) calc(var(--animation-order-checkbox) * var(--animation-speed)) both ease-in;border:0.25rem solid transparent;transition-property:border;transition-duration:0.3s;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);border-radius:0.75rem;outline:none;padding:1rem}.wifi-password--container .wifi-password--display-toggle-container:focus,.wifi-password--container .wifi-password--display-toggle-container.lf-item-focused{border-color:#2C65FF;outline:none}.wifi-password--container input[type=checkbox].wifi-password--display-toggle{height:2.25rem;width:2.25rem;outline:none}.wifi-password--container input[type=checkbox].wifi-password--display-toggle:focus{outline:none}.wifi-password--container .wifi-password--display-toggle-label{font-size:2.25rem;margin-left:1.25rem}lf-keyboard{flex-grow:1;overflow:hidden;animation:popIn var(--animation-duration) calc(var(--animation-order-keyboard) * var(--animation-speed)) both ease-in}lf-keyboard:focus{outline:none}@media (max-width: 900px){lf-keyboard{display:flex;justify-items:center;align-items:start;padding-top:2rem}}";

var InputType;
(function (InputType) {
  InputType["Password"] = "password";
  InputType["Text"] = "text";
})(InputType || (InputType = {}));
const LfWifiPassword = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.passwordSubmitted = createEvent(this, "passwordSubmitted", 7);
    this.LfFocusClass = "lf-item-focused";
    this.checkBoxElId = "show-password-toggle";
    this.inputIsDirty = false;
    this.inputType = InputType.Text;
    this.showPassword = true;
  }
  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - -
  componentWillLoad() {
    // console.group("componentWillLoad");
    try {
      this.setInputElClassNames();
    }
    catch (e) {
      // console.error(e);
    }
    finally {
      // console.groupEnd();
    }
  }
  // - -  componentDidLoad Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - -
  componentDidLoad() {
    // console.group("componentDidLoad");
    try {
      setTimeout(() => {
        this.checkboxEl.focus();
      }, 1000);
    }
    catch (e) {
      // console.error(e);
    }
    finally {
      // console.groupEnd();
    }
  }
  // ==== LISTENERS SECTION =====================================================================
  onVKeyboardPress(event) {
    // console.group("onVKeyboardPress");
    try {
      if (event.detail !== null) {
        const receivedInput = event.detail;
        const currentInputValue = this.inputTextEl.value;
        let updatedValue;
        if (receivedInput !== KeyboardCharMap.Delete) {
          updatedValue = `${currentInputValue}${receivedInput}`;
        }
        else {
          updatedValue = currentInputValue.slice(0, -1);
        }
        this.inputTextEl.value = updatedValue;
      }
      this.checkInputDirty();
    }
    catch (e) {
      // console.error(e);
    }
    finally {
      // console.groupEnd();
    }
  }
  onBlurKeyboardEvent() {
    // console.group("onBlurKeyboardEvent");
    try {
      this.lfKeyboardEl.blur();
      this.checkboxEl.focus();
      this.checkboxInFocus();
    }
    catch (e) {
      // console.error(e);
    }
    // console.groupEnd();
  }
  onKeyboardSubmit() {
    // console.group("onKeyboardSubmit");
    try {
      this.passwordSubmitted.emit(this.inputTextEl.value);
    }
    catch (e) {
      // console.error(e);
    }
    finally {
      // console.groupEnd();
    }
  }
  onKeydown(e) {
    // console.group("onKeydown--Password");
    try {
      this.keyHandler(e);
    }
    catch (e) {
      // console.error(e);
    }
    finally {
      // console.groupEnd();
    }
  }
  // ==== PUBLIC METHODS API - @Method() SECTION =================================================
  // @Method()
  // async publicMethod(): Promise<void> {return}
  // ==== LOCAL METHODS SECTION ==================================================================
  checkboxInFocus() {
    // console.group("checkboxInFocus");
    try {
      let className = this.toggleContainer.className;
      if (!className.includes(this.LfFocusClass)) {
        this.toggleContainer.className = `${className} ${this.LfFocusClass}`;
      }
    }
    catch (e) {
      // console.error(e);
    }
    finally {
      // console.groupEnd();
    }
  }
  checkboxInBlur() {
    // console.group("checkboxInBlur");
    try {
      let className = this.toggleContainer.className;
      if (className.includes(this.LfFocusClass)) {
        className = className.replace(this.LfFocusClass, "");
        this.toggleContainer.className = className;
      }
    }
    catch (e) {
      // console.error(e);
    }
    finally {
      // console.groupEnd();
    }
  }
  checkInputDirty() {
    // console.group("checkInputDirty");
    var _a, _b;
    try {
      this.inputIsDirty = ((_b = (_a = this.inputTextEl) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.length) > 0;
      this.setInputElClassNames();
    }
    catch (e) {
      // console.error(e);
    }
    finally {
      // console.groupEnd();
    }
  }
  setInputElClassNames() {
    // console.group("setInputElClassNames");
    try {
      const className = this.inputIsDirty ? `dirty` : `clean`;
      this.inputElemClassName = className;
    }
    catch (e) {
      // console.error(e);
    }
    finally {
      // console.groupEnd();
    }
  }
  togglePasswordDisplay() {
    // console.group("togglePasswordDisplay");
    try {
      this.showPassword = !this.showPassword;
      this.inputType = this.showPassword ? InputType.Text : InputType.Password;
    }
    catch (e) {
      // console.error(e);
    }
    finally {
      // console.groupEnd();
    }
  }
  keyHandler(e) {
    // console.group("KeyHandler");
    // console.log(e);
    try {
      const specialKeys = [Key_enum.Key.ArrowDown, Key_enum.Key.ArrowUp].map(key => {
        return key.toString();
      });
      if (specialKeys.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
      switch (e.key) {
        case Key_enum.Key.ArrowDown:
          if (document.activeElement.id === this.checkBoxElId) {
            this.toggleContainer.blur();
            this.lfKeyboardEl.focus();
          }
          break;
        case Key_enum.Key.ArrowUp:
          break;
        case Key_enum.Key.Enter:
          if (document.activeElement.id === this.checkBoxElId) {
            this.togglePasswordDisplay();
          }
          break;
      }
    }
    catch (e) {
      // console.error(e);
    }
    finally {
      // console.groupEnd();
    }
  }
  // ==== RENDERING SECTION =========================================================================
  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render() {
    return (h("div", { class: "wifi-password--container" }, h("div", { class: "wifi-password--input-container" }, h("p", { class: "wifi-password--prompt" }, "Please enter the password for ", h("strong", null, this.networkName)), h("div", { class: "wifi-password--input-wrapper" }, h("input", { onInput: () => this.checkInputDirty(), ref: el => (this.inputTextEl = el), class: `wifi-password--input ${this.inputElemClassName}`, type: this.inputType, placeholder: "Enter Wifi Password" })), h("div", { class: "wifi-password--display-toggle-container", ref: el => (this.toggleContainer = el) }, h("input", { tabindex: "0", checked: this.showPassword, onChange: () => {
        this.togglePasswordDisplay();
      }, onFocus: () => {
        this.checkboxInFocus();
      }, onBlur: () => {
        this.checkboxInBlur();
      }, ref: el => (this.checkboxEl = el), class: "wifi-password--display-toggle", type: "checkbox", id: this.checkBoxElId }), h("label", { htmlFor: this.checkBoxElId, class: "wifi-password--display-toggle-label" }, "show password"))), h("lf-keyboard", { ref: el => (this.lfKeyboardEl = el), tabindex: "0", id: "lf-keyboard-component", blurDirection: LfKeyboardBlurDirection.Top, wrapNavigation: true })));
  }
};
LfWifiPassword.style = lfWifiPasswordComponentCss;

export { LfWifiPassword as lf_wifi_password };
