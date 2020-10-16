/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { ButtonSize } from "./components/lf-button/button-size.type";
import { ButtonContext } from "./components/lf-button/button-context.type";
export namespace Components {
    interface DesignSheet {
    }
    interface LfButton {
        /**
          * Sets predefined sizes and color schemes based on button type.
         */
        "context": ButtonContext;
        /**
          * If `true`, the user cannot interact with the button.
         */
        "disabled": boolean;
        /**
          * Set to `"block"` for a full-width button or to `"full"` for a full-width button without left and right borders.
         */
        "expand"?: "full" | "block";
        /**
          * Contains a URL or a URL fragment that the hyperlink points to. If this property is set, an anchor tag will be rendered.
         */
        "href": string | undefined;
        /**
          * Specifies the relationship of the target object to the link object. The value is a space-separated list of [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types).
         */
        "rel": string | undefined;
        /**
          * Button Size: "x-large" | "large" | "regular" | "small" | "x-small"
         */
        "size": ButtonSize;
        /**
          * Specifies where to display the linked URL. Only applies when an `href` is provided. Special keywords: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`.
         */
        "target": string | undefined;
        /**
          * The type of the button.
         */
        "type": "submit" | "reset" | "button";
    }
    interface LfList {
        "color": string;
        "dark": boolean;
        "dense": boolean;
        "disabled": boolean;
        "elevation": number | string;
        "height": number | string;
        "light": boolean;
        "maxHeight": number | string;
        "maxWidth": number | string;
        "minHeight": number | string;
        "minWidth": number | string;
        "outlined": boolean;
        "rounded": boolean;
        "width": number | string;
        "zebra": boolean;
    }
    interface LfListItem {
        "dark": boolean;
        "dense": boolean;
        "disabled": boolean;
        "light": boolean;
        "outlined": boolean;
    }
    interface LfSubheader {
        "dark": boolean;
        "inset": boolean;
        "light": boolean;
    }
    interface LfWifiList {
    }
}
declare global {
    interface HTMLDesignSheetElement extends Components.DesignSheet, HTMLStencilElement {
    }
    var HTMLDesignSheetElement: {
        prototype: HTMLDesignSheetElement;
        new (): HTMLDesignSheetElement;
    };
    interface HTMLLfButtonElement extends Components.LfButton, HTMLStencilElement {
    }
    var HTMLLfButtonElement: {
        prototype: HTMLLfButtonElement;
        new (): HTMLLfButtonElement;
    };
    interface HTMLLfListElement extends Components.LfList, HTMLStencilElement {
    }
    var HTMLLfListElement: {
        prototype: HTMLLfListElement;
        new (): HTMLLfListElement;
    };
    interface HTMLLfListItemElement extends Components.LfListItem, HTMLStencilElement {
    }
    var HTMLLfListItemElement: {
        prototype: HTMLLfListItemElement;
        new (): HTMLLfListItemElement;
    };
    interface HTMLLfSubheaderElement extends Components.LfSubheader, HTMLStencilElement {
    }
    var HTMLLfSubheaderElement: {
        prototype: HTMLLfSubheaderElement;
        new (): HTMLLfSubheaderElement;
    };
    interface HTMLLfWifiListElement extends Components.LfWifiList, HTMLStencilElement {
    }
    var HTMLLfWifiListElement: {
        prototype: HTMLLfWifiListElement;
        new (): HTMLLfWifiListElement;
    };
    interface HTMLElementTagNameMap {
        "design-sheet": HTMLDesignSheetElement;
        "lf-button": HTMLLfButtonElement;
        "lf-list": HTMLLfListElement;
        "lf-list-item": HTMLLfListItemElement;
        "lf-subheader": HTMLLfSubheaderElement;
        "lf-wifi-list": HTMLLfWifiListElement;
    }
}
declare namespace LocalJSX {
    interface DesignSheet {
    }
    interface LfButton {
        /**
          * Sets predefined sizes and color schemes based on button type.
         */
        "context"?: ButtonContext;
        /**
          * If `true`, the user cannot interact with the button.
         */
        "disabled"?: boolean;
        /**
          * Set to `"block"` for a full-width button or to `"full"` for a full-width button without left and right borders.
         */
        "expand"?: "full" | "block";
        /**
          * Contains a URL or a URL fragment that the hyperlink points to. If this property is set, an anchor tag will be rendered.
         */
        "href"?: string | undefined;
        /**
          * Emitted when the button is focused.
         */
        "onLfBLur"?: (event: CustomEvent<void>) => void;
        /**
          * Emitted when the button loses focus.
         */
        "onLfFocus"?: (event: CustomEvent<void>) => void;
        /**
          * Specifies the relationship of the target object to the link object. The value is a space-separated list of [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types).
         */
        "rel"?: string | undefined;
        /**
          * Button Size: "x-large" | "large" | "regular" | "small" | "x-small"
         */
        "size"?: ButtonSize;
        /**
          * Specifies where to display the linked URL. Only applies when an `href` is provided. Special keywords: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`.
         */
        "target"?: string | undefined;
        /**
          * The type of the button.
         */
        "type"?: "submit" | "reset" | "button";
    }
    interface LfList {
        "color"?: string;
        "dark"?: boolean;
        "dense"?: boolean;
        "disabled"?: boolean;
        "elevation"?: number | string;
        "height"?: number | string;
        "light"?: boolean;
        "maxHeight"?: number | string;
        "maxWidth"?: number | string;
        "minHeight"?: number | string;
        "minWidth"?: number | string;
        "outlined"?: boolean;
        "rounded"?: boolean;
        "width"?: number | string;
        "zebra"?: boolean;
    }
    interface LfListItem {
        "dark"?: boolean;
        "dense"?: boolean;
        "disabled"?: boolean;
        "light"?: boolean;
        "outlined"?: boolean;
    }
    interface LfSubheader {
        "dark"?: boolean;
        "inset"?: boolean;
        "light"?: boolean;
    }
    interface LfWifiList {
    }
    interface IntrinsicElements {
        "design-sheet": DesignSheet;
        "lf-button": LfButton;
        "lf-list": LfList;
        "lf-list-item": LfListItem;
        "lf-subheader": LfSubheader;
        "lf-wifi-list": LfWifiList;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "design-sheet": LocalJSX.DesignSheet & JSXBase.HTMLAttributes<HTMLDesignSheetElement>;
            "lf-button": LocalJSX.LfButton & JSXBase.HTMLAttributes<HTMLLfButtonElement>;
            "lf-list": LocalJSX.LfList & JSXBase.HTMLAttributes<HTMLLfListElement>;
            "lf-list-item": LocalJSX.LfListItem & JSXBase.HTMLAttributes<HTMLLfListItemElement>;
            "lf-subheader": LocalJSX.LfSubheader & JSXBase.HTMLAttributes<HTMLLfSubheaderElement>;
            "lf-wifi-list": LocalJSX.LfWifiList & JSXBase.HTMLAttributes<HTMLLfWifiListElement>;
        }
    }
}
