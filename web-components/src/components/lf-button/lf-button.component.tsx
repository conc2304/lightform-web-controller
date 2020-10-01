import { Component, Prop, h } from "@stencil/core";
import { ButtonSize } from "./button-size.enum";
import { ButtonType } from "./button-types.enum";

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
  /**
   * Button Type
   */
  @Prop() type: ButtonType = ButtonType.Primary;
  /**
   * Button Disabled
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  render() {

    return (
      <button class={`btn-wrapper ${this.type} btn-size-${this.size}`}
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
