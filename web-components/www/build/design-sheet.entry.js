import { r as registerInstance, h } from './index-6745bcf5.js';
import { B as ButtonSize, a as ButtonContext } from './button-context.enum-450211ee.js';

const designSheetComponentCss = ".theme--dark{background-color:#232326;color:#babfd1}.theme--light{background-color:#babfd1;color:#232326}:host{margin:1rem}:host *{font-family:AtlasLight, Helvetica, sans-serif;font-weight:300;font-style:normal;font-stretch:normal}:host .btn-container{display:inline-block;padding:1rem}:host .btn-context-label{margin-left:1rem;margin:0 1rem}:host .btn-size-label{text-align:center;margin-top:5px}";

const DesignSheet = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.buttonSizes = Object.keys(ButtonSize).map((key) => key);
        this.buttonContexts = Object.keys(ButtonContext).map((key) => key);
    }
    render() {
        let ButtonContextText;
        (function (ButtonContextText) {
            ButtonContextText["Primary"] = "Scan";
            ButtonContextText["Secondary"] = "Cancel";
            ButtonContextText["UI"] = "Send";
        })(ButtonContextText || (ButtonContextText = {}));
        return (h("div", null, h("h1", null, "Design Sheet"), h("p", null, "Native Web Wifi List Version"), h("lf-wifi-list", null), h("div", null, h("h3", { class: "section-header" }, "UI Buttons"), this.buttonContexts.map((contexKey) => {
            return (h("div", { class: "btn-context-row" }, h("h4", { class: "btn-context-label" }, contexKey), this.buttonSizes.map((sizeKey) => {
                const isDisabled = ButtonSize[sizeKey] === ButtonSize.Small;
                return (h("div", { class: "btn-container" }, h("lf-button", { class: "btn-spacer", size: ButtonSize[sizeKey], context: ButtonContext[contexKey], disabled: isDisabled }, ButtonContextText[contexKey]), h("div", { class: "btn-size-label" }, sizeKey)));
            })));
        })), h("br", null)));
    }
};
DesignSheet.style = designSheetComponentCss;

export { DesignSheet as design_sheet };
