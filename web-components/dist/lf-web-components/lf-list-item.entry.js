import { r as registerInstance, h, e as Host, g as getElement } from './index-6745bcf5.js';

const lfListItemComponentCss = ".theme--dark{background-color:#232326;color:#babfd1}.theme--light{background-color:#babfd1;color:#232326}:host{font:inherit;color:inherit;z-index:1;--background:inherit;--background-active:#5885ff;--background-active-opacity:1;--background-focus:#2c65ff;--background-focus-opacity:1;--background-hover:#2352d0;--background-hover-opacity:1;--border-radius:4px;--border-width:2px;--border-style:solid;--border-color:transparent;--border-color-active:#2352d0;--border-color-focus:#2c65ff;--border-color-hover:#2352d0;--padding-top:0px;--padding-bottom:0px;--padding-right:1rem;--padding-left:1rem;--outer-padding-top:0rem;--outer-padding-bottom:0rem;--outer-padding-right:0rem;--outer-padding-left:0rem;--color:inherit;--color-active:var(--color);--color-focus:var(--color);--color-hover:var(--color);display:flex;position:relative;outline:none;text-align:initial;text-decoration:none;overflow:hidden;box-sizing:border-box}button{width:100%;appearance:unset;background:unset;color:unset;border:unset;padding:unset;font:unset;cursor:unset;outline:unset}:host(lf-list-item){padding:var(--outer-padding-top) var(--outer-padding-right) var(--outer-padding-bottom) var(--outer-padding-left);text-decoration:none;background:var(--background);border-style:var(--border-style);border-color:var(--border-color);border-width:var(--border-width);color:var(--color);transition-duration:0.3s;transition-property:border-color, background-color;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);margin:var(--outer-padding-top) var(--outer-padding-right) var(--outer-padding-bottom) var(--outer-padding-left);cursor:pointer}:host(lf-list-item) button,:host(lf-list-item) a{cursor:pointer;user-select:none;-webkit-user-drag:none}:host(lf-list-item) a{color:unset;text-decoration:unset}.native-element{display:flex;flex:1 1 100%;width:100%;align-items:center;flex-direction:row;padding:var(--padding-top) var(--padding-right) var(--padding-bottom) var(--padding-left)}.native-element:hover,.native-element:focus,.native-element:active{outline:none}:host .lf-list-item--outlined{background-color:inherit;border-color:var(--border-color)}:host .lf-list-item--outlined:focus{background-color:inherit;border-color:var(--border-color-focus)}:host .lf-list-item--outlined:hover{background-color:inherit;border-color:var(--border-color-hover)}:host .lf-list-item--outlined:active,:host .lf-list-item--outlined.lf-list-item--active{background-color:inherit;border-color:var(--border-color-active)}:host(lf-list-item.lf-list-item--active,lf-list-item:active){background-color:var(--background-active);opacity:var(--background-active-opacity);color:var(--color-active);outline:none}:host(:hover){background-color:var(--background-hover);opacity:var(--background-hover-opacity);color:var(--color-hover);outline:none}:host(:focus-within){background-color:var(--background-focused);opacity:var(--background-focus-opacity);color:var(--color-focus);outline:none}:host(.lf-list-item--disabled){cursor:not-allowed;opacity:0.3;pointer-events:none}.lf-list-item--slot-wrapper{display:flex;flex-wrap:wrap;overflow:hidden;padding:0.8rem 0}::slotted(*),.lf-list-item--slot-wrapper{display:inline-flex;align-items:center}slot[name=start]::slotted(*){margin-right:0.63rem;min-width:1.5rem;justify-self:flex-left}:host slot[name=end]::slotted(*){margin-left:auto;min-width:1.5rem;justify-self:flex-right}";

const ListItem = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * If `true`, a button tag will be rendered and the item will be tappable.
         */
        this.button = false;
        /**
         * Sets whether the element should be considered active
         */
        this.active = false;
        /**
         * If `true`, implements a dark theme
         */
        this.dark = false;
        /**
         * If `true`, implements a light theme
         */
        this.light = false;
        /**
         * If `true`, the list item is rendered thinner
         */
        this.dense = false;
        /**
         * If `true`, the user cannot interact with the item.
         */
        this.disabled = false;
        /**
         * The type of the button. Only used when an `onclick` or `button` property is present.
         */
        this.type = "button";
    }
    // If the item has an href or button property it will render a native
    // anchor or button that is clickable
    isClickable() {
        return this.href !== undefined || this.button;
    }
    getListItemClassName() {
        let className = "lf-list-item";
        if (this.disabled) {
            className = `${className} lf-list-item--disabled`;
        }
        if (this.active) {
            className = `${className} lf-list-item--active`;
        }
        if (this.dense) {
            className = `${className} lf-list-item--dense`;
        }
        if (this.dark) {
            className = `${className} theme--dark`;
        }
        else if (this.light) {
            className = `${className} theme--light`;
        }
        return className;
    }
    render() {
        const { disabled, href, rel, target } = this;
        const clickable = this.isClickable();
        const TagType = clickable
            ? this.href === undefined
                ? "button"
                : "a"
            : "div";
        const attrs = TagType === "button"
            ? { type: this.type }
            : {
                href,
                rel,
                target,
            };
        return (h(Host, { class: this.getListItemClassName(), "aria-disabled": disabled ? "true" : null, ref: (listItem) => {
                this.listItem = listItem;
            } }, h(TagType, Object.assign({}, attrs, { class: "native-element", role: "listitem", tabindex: "0" }), h("slot", { name: "start" }), h("div", { class: "lf-list-item--slot-wrapper" }, h("slot", null)), h("slot", { name: "end" }))));
    }
    get listItemEl() { return getElement(this); }
};
ListItem.style = lfListItemComponentCss;

export { ListItem as lf_list_item };
