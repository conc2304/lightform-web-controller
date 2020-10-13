import { r as registerInstance, h } from './index-6745bcf5.js';

const lfListComponentCss = ".theme--dark{background-color:#232326;color:#babfd1}.theme--light{background-color:#babfd1;color:#232326}:host{display:block;position:relative;outline:none;font-family:inherit;text-align:initial;text-decoration:none;overflow:hidden;box-sizing:border-box;--min-height:3rem;--border-radius:4px;--border-width:2px;--border-style:solid;--border-color:transparent;--padding-top:1rem;--padding-bottom:1rem;--padding-right:1rem;--padding-left:1rem}:host(lf-list){display:block;text-decoration:none;position:static;outline:none;font-size:16px;padding:0.5rem 0;border-style:solid;border-width:var(--border-width);border-color:var(--border-color)}";

const LfList = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.color = null;
        this.striped = false;
        this.dark = false;
        this.light = false;
        this.dense = false;
        this.outlined = false;
        this.rounded = false;
        this.disabled = false;
        this.elevation = null;
        this.height = null;
        this.width = null;
        this.minHeight = null;
        this.maxHeight = null;
        this.minWidth = null;
        this.maxWidth = null;
    }
    getListClassName() {
        let className = "lf-list";
        if (this.disabled) {
            className = `${className} lf-list--disabled`;
        }
        if (this.dense) {
            className = `${className} lf-list--dense`;
        }
        if (this.outlined) {
            className = `${className} lf-list--outlined`;
        }
        if (this.striped) {
            className = `${className} lf-list--striped`;
        }
        if (this.rounded) {
            className = `${className} lf-list--rounded`;
        }
        if (this.dark) {
            className = `${className} theme--dark`;
        }
        if (this.light) {
            className = `${className} theme--light`;
        }
        if (this.color) {
            className = `${className} theme--color`;
        }
        return className;
    }
    getListStyles() {
        const styles = {
            backgroundColor: `${this.color}`,
            height: `${this.height}`,
            width: `${this.width}`,
            minHeight: `${this.minHeight}`,
            maxHeight: `${this.maxHeight}`,
            minWidth: `${this.minWidth}`,
            maxWidth: `${this.maxWidth}`,
        };
        return styles;
    }
    render() {
        return (h("div", { role: "list", class: this.getListClassName(), style: this.getListStyles() }, h("slot", null)));
    }
};
LfList.style = lfListComponentCss;

export { LfList as lf_list };
