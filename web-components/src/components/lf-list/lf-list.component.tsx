import { Component, Prop, h, Element, Host } from "@stencil/core";

/**
 * @slot - Content is placed inside the native element wrapper
 *
 * @part native - The native HTML div element that wraps all child elements.
 */
@Component({
  tag: "lf-list",
  styleUrl: "lf-list.component.scss",
  shadow: true,
})
export class LfList {
  @Element() listItemEl: HTMLElement;

  // Public Properties API
  // --------------------------------------------------

  /**
   * If `true`, the user cannot interact with the list.
   */
  @Prop() disabled: boolean = false;

  /**
   * Makes every other line in the list a different background collor
   */
  @Prop() striped: boolean = false;

  public hostEl: any;

  // Private Methods
  // --------------------------------------------------
  private getListClassName(): string {
    let className: string = "lf-list";

    if (this.disabled) {
      className = `${className} lf-list--disabled`;
    }

    if (this.striped) {
      className = `${className} lf-list--striped`;
    }

    return className;
  }

  // Rendering Section
  // --------------------------------------------------
  render() {
    const { disabled } = this;

    return (
      <Host
        class={this.getListClassName()}
        aria-disabled={disabled ? "true" : null}
        ref={(hostEl) => {
          this.hostEl = hostEl;
        }}
      >
        <div class="native-element" part="native" role="list">
          <slot />
        </div>
      </Host>
    );
  }
}
