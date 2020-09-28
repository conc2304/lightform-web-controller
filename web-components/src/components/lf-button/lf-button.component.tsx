import { Component, Prop, h } from "@stencil/core";
import { ButtonSize } from "./button-size.enum";
import { ButtonFlavor } from "./button-flavor.enum";

@Component({
  tag: "lf-button",
  styleUrl: "lf-button.component.scss",
  shadow: true,
})
export class LfButton {
  /**
   * Button Size
   */
  @Prop() size: ButtonSize = ButtonSize.Regular;
  @Prop() flavor: ButtonFlavor = ButtonFlavor.Primary;
  @Prop() disabled: boolean = false;

  render() {

    return (
      <button class={`btn-wrapper ${this.flavor} btn-size-${this.size}`}
        disabled={this.disabled}
        tabindex="0"
        role="button"
      >

        <span class="button-content">
          <slot />
        </span>
      </button>
    );
  }
}
