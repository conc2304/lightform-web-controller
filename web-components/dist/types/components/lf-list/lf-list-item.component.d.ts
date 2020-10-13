/**
 * @slot - Content is placed between the named slots if provided without a slot.
 * @slot start - Content is placed to the left of the item text.
 * @slot end - Content is placed to the right of the item text.
 */
export declare class ListItem {
    listItemEl: HTMLElement;
    color?: string;
    /**
     * If `true`, a button tag will be rendered and the item will be tappable.
     */
    button: boolean;
    /**
     * Sets whether the element should be considered active
     */
    active: boolean;
    /**
     * If `true`, implements a dark theme
     */
    dark: boolean;
    /**
     * If `true`, implements a light theme
     */
    light: boolean;
    /**
     * If `true`, the list item is rendered thinner
     */
    dense: boolean;
    /**
     * If `true`, the user cannot interact with the item.
     */
    disabled: boolean;
    /**
     * Contains a URL or a URL fragment that the hyperlink points to.
     * If this property is set, an anchor tag will be rendered.
     */
    href: string | undefined;
    /**
     * Specifies the relationship of the target object to the link object.
     * The value is a space-separated list of [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types).
     */
    rel: string | undefined;
    /**
     * Specifies where to display the linked URL.
     * Only applies when an `href` is provided.
     * Special keywords: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`.
     */
    target: string | undefined;
    /**
     * The type of the button. Only used when an `onclick` or `button` property is present.
     */
    type: "submit" | "reset" | "button";
    listItem: any;
    private isClickable;
    private getListItemClassName;
    render(): any;
}
