import { r as registerInstance, h } from './index-6745bcf5.js';
import { B as ButtonSize, a as ButtonContext } from './button-context.enum-450211ee.js';

const lfButtonComponentCss = ".theme--dark{background-color:#232326;color:#babfd1}.theme--light{background-color:#babfd1;color:#232326}:host{font-size:16px}:host *{box-sizing:border-box}:host .btn-wrapper{font-family:AtlasLight, Helvetica, sans-serif;font-weight:300;font-style:normal;font-stretch:normal;color:#ffffff;border-style:none;appearance:none;align-items:center;border-radius:2px;display:inline-flex;flex:0 0 auto;letter-spacing:0.09em;justify-content:center;outline:0;position:relative;text-decoration:none;text-indent:0.09em;text-transform:uppercase;transition-duration:0.28s;transition-property:box-shadow, transform, opacity, background-color;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);user-select:none;vertical-align:middle;white-space:nowrap}:host .btn-wrapper:hover:enabled,:host .btn-wrapper:active:enabled{cursor:pointer}:host .btn-wrapper:disabled{cursor:not-allowed}:host .btn-wrapper.primary{background-color:#12A37B;opacity:1}:host .btn-wrapper.primary:hover:enabled,:host .btn-wrapper.primary:active:enabled{background-color:#15c595}:host .btn-wrapper.primary:disabled,:host .btn-wrapper.primary .disabled{background-color:#12A37B;opacity:0.5}:host .btn-wrapper.secondary{background-color:#3c3e47;opacity:1}:host .btn-wrapper.secondary:hover:enabled,:host .btn-wrapper.secondary:active:enabled{background-color:#12A37B}:host .btn-wrapper.secondary:disabled,:host .btn-wrapper.secondary.disabled{background-color:#12A37B;opacity:0.5}:host .btn-wrapper.ui{background-color:#3c3e47;opacity:1;min-width:1.625rem}:host .btn-wrapper.ui:disabled,:host .btn-wrapper.ui.disabled{background-color:#3c3e47;opacity:0.5}:host .btn-wrapper.ui:hover:enabled{background-color:#232326}:host .btn-wrapper.ui:active:enabled{background-color:#2352d0}:host .btn-wrapper .btn-content{align-items:center;color:inherit;display:flex;flex:1 0 auto;justify-content:inherit;line-height:normal;position:relative}:host .btn-wrapper.btn-size-large{font-size:1rem;height:3.25rem;min-width:5.75rem;padding:0 1.845rem}:host .btn-wrapper.btn-size-x-large{font-size:0.875rem;height:2.8rem;min-width:7rem}:host .btn-wrapper.btn-size-large{font-size:0.75rem;height:2.4rem;min-width:6rem}:host .btn-wrapper.btn-size-regular{font-size:0.625rem;height:2rem;min-width:5rem}:host .btn-wrapper.btn-size-small{font-size:0.5rem;height:1.6rem;min-width:4rem}:host .btn-wrapper.btn-size-x-small{font-size:0.4rem;height:1.2rem;min-width:3rem;font-weight:bold}";

const LfButton = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.size = ButtonSize.Regular;
        this.context = ButtonContext.Primary;
        this.disabled = false;
    }
    render() {
        return (h("button", { class: `btn-wrapper ${this.context} btn-size-${this.size}`, disabled: this.disabled, tabindex: "0", role: "button" }, h("span", { class: "button-content" }, h("slot", null))));
    }
};
LfButton.style = lfButtonComponentCss;

export { LfButton as lf_button };
