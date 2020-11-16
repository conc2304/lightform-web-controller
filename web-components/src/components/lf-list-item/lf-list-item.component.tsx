import { Component, Prop, h, Element, Host } from "@stencil/core";

/**
 * @slot - Content is placed between the named slots if provided without a slot.
 * @slot start - Content is placed to the left of the item text.
 * @slot end - Content is placed to the right of the item text.
 */
@Component({
  tag: "lf-list-item",
  styleUrls: ["lf-list-item.component.scss", "lf-list-common.component.scss"],
  shadow: true,
})
export class LfListItem {
  @Element() listItemEl: HTMLElement;

  // Public Properties API
  // --------------------------------------------------

  /**
   * If `true`, a button tag will be rendered and the item will be clickable.
   */
  @Prop() button = false;

  /**
   * Sets whether the element should be considered active
   */
  @Prop() active = false;

  /**
   * If `true`, the user cannot interact with the item.
   */
  @Prop() disabled = false;

  /**
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href: string | undefined;

  /**
   * Specifies the relationship of the target object to the link object.
   * The value is a space-separated list of [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types).
   */
  @Prop() rel: string | undefined;

  /**
   * Specifies where to display the linked URL.
   * Only applies when an `href` is provided.
   * Special keywords: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`.
   */
  @Prop() target: string | undefined;

  /**
   * The type of the button. Only used when an `onclick` or `button` property is present.
   */
  @Prop() type: "submit" | "reset" | "button" = "button";

  public listItem: any;

  // Private Methods
  // --------------------------------------------------

  // If the item has an href or button property it will render a native
  // anchor or button that is clickable
  private isClickable(): boolean {
    try {
      return this.href !== undefined || this.button;
    } catch (error) {
      console.error(error);
    }
  }

  private getListItemClassName(): string {
    try {
      let className: string = "lf-list-item";

      if (this.disabled) {
        className = `${className} lf-list-item--disabled`;
      }

      if (this.active) {
        className = `${className} lf-list-item--active`;
      }

      return className;
    } catch (error) {
      console.error(error);
    }
  }

  // Rendering Section
  // --------------------------------------------------
  render() {
    try {
      const { disabled, href, rel, target } = this;
      const clickable = this.isClickable();
      const TagType = clickable
        ? this.href === undefined
          ? "button"
          : "a"
        : ("div" as any);

      const attrs =
        TagType === "button"
          ? { type: this.type }
          : {
              href,
              rel,
              target,
            };

      return (
        <Host
          class={this.getListItemClassName()}
          aria-disabled={disabled ? "true" : null}
          ref={(listItem) => {
            this.listItem = listItem;
          }}
          tabindex="0"
        >
          <TagType {...attrs} class="native-element" role="listitem">
            <slot name="start"></slot>
            <div class="lf-list-item--slot-wrapper">
              <slot />
            </div>
            <slot name="end"></slot>
          </TagType>
        </Host>
      );
    } catch (error) {
      console.error(error);
    }
  }
}
