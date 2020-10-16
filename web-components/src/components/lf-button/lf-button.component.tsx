import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
} from "@stencil/core";
import { ButtonSize } from "./button-size.type";
import { ButtonContext } from "./button-context.type";

/**
 *
 * @slot - Content is placed between the named slots if provided without a slot.
 * @slot start - Content is placed to the left of the button text.
 * @slot end - Content is placed to the right of the button text.
 *
 * @part native - The native HTML button or anchor element that wraps all child elements.
 */
@Component({
  tag: "lf-button",
  styleUrl: "lf-button.component.scss",
  shadow: true,
})
export class LfButton {
  @Element() el!: HTMLElement;

  // Public Properties API
  // --------------------------------------------------

  /**
   * Button Size: "x-large" | "large" | "regular" | "small" | "x-small"
   */
  @Prop() size: ButtonSize = "regular";

  /**
   * Sets predefined sizes and color schemes based on button type.
   */
  @Prop() context: ButtonContext = "primary";

  /**
   * If `true`, the user cannot interact with the button.
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  /**
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href: string | undefined;

  /**
   * Set to `"block"` for a full-width button or to `"full"` for a full-width button
   * without left and right borders.
   */
  @Prop({ reflect: true }) expand?: "full" | "block";

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
   * The type of the button.
   */
  @Prop() type: "submit" | "reset" | "button" = "button";

  // Events API
  // --------------------------------------------------

  /**
   * Emitted when the button is focused.
   */
  @Event() lfBLur: EventEmitter<void>;

  /**
   * Emitted when the button loses focus.
   */
  @Event() lfFocus: EventEmitter<void>;

  // Private Methods
  // --------------------------------------------------
  private onBlur(): void {
    try {
      this.lfBLur.emit();
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  private onFocus(): void {
    try {
      this.lfBLur.emit();
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  // Rendering Section
  // --------------------------------------------------
  render(): HTMLCollection {
    try {
      const { context, disabled, expand, rel, target, href, type } = this;
      const TagType = href === undefined ? "button" : ("a" as any);
      const attrs =
        TagType === "button"
          ? { type }
          : {
              href,
              rel,
              target,
            };

      return (
        <Host
          class={`
          lf-button 
          lf-button--context-${context} 
          lf-button--size-${this.size} 
          ${disabled ? "lf-button--disabled" : ""}
          ${expand ? "lf-button--expand" : ""}
          `}
          aria-disabled={disabled ? "true" : null}
        >
          <TagType
            {...attrs}
            disabled={disabled}
            tabindex="0"
            role="button"
            part="native"
            class="native-element"
            onBlur={() => {
              this.onBlur();
            }}
            onFocus={() => {
              this.onFocus();
            }}
          >
            <span class="lf-button--content">
              <slot name="start"></slot>
              <slot></slot>
              <slot name="end"></slot>
            </span>
          </TagType>
        </Host>
      );
    } catch (error) {
      console.error(error);
    } finally {
    }
  }
}
