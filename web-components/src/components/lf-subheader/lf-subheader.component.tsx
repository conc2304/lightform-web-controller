import { Component, Prop, h, Host, Element } from "@stencil/core";

/**
 * @slot - Content is placed inside the native element wrapper
 *
 * @part native - The native HTML div element that wraps all child elements.
 */
@Component({
  tag: "lf-subheader",
  styleUrls: ["lf-subheader.component.scss"],
  shadow: true,
})
export class LfSubheader {
  @Element() element: HTMLElement;

  // Public Properties API
  // --------------------------------------------------
  /**
   *   If `true`,the subheader content is inset from the left border
   */
  @Prop() inset: boolean = false;

  // Private Methods
  // --------------------------------------------------
  private getClassName(): string {
    let className: string = "lf-subheader";

    if (this.inset) {
      className = `${className} lf-subheader--inset`;
    }

    return className;
  }

  // Rendering Section
  // --------------------------------------------------
  render() {
    return (
      <Host class={this.getClassName()}>
        <div class="native-element" part="native">
          <slot name="start"></slot>
          <div class="lf-subheader--slot-wrapper">
            <slot />
          </div>
          <slot name="end"></slot>
        </div>
      </Host>
    );
  }
}
