import { r as registerInstance, h } from './index-6745bcf5.js';

const lfSubheaderComponentCss = ".theme--dark{background-color:#232326;color:#babfd1}.theme--light{background-color:#babfd1;color:#232326}:host{align-items:center;display:flex;height:3rem;font-size:0.875rem;font-weight:400;padding:0 1rem}:host .lf-subheader.theme--light{color:#575c6d}:host .lf-subheader.theme--dark{color:#d9dbe5}:host .lf-subheader.lf-subheader--inset{margin-left:3.5rem}";

const LfSubheader = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.inset = false;
        this.dark = false;
        this.light = false;
    }
    getClassName() {
        let className = "lf-subheader";
        if (this.inset) {
            className = `${className} lf-subheader--inset`;
        }
        if (this.dark) {
            className = `${className} theme--dark`;
        }
        if (this.light) {
            className = `${className} theme--light`;
        }
        return className;
    }
    render() {
        return (h("div", { class: this.getClassName() }, h("slot", null)));
    }
};
LfSubheader.style = lfSubheaderComponentCss;

export { LfSubheader as lf_subheader };
