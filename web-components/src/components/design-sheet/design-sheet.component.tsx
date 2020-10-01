import { Component, h } from "@stencil/core";

import { ButtonSize } from "../lf-button/button-size.enum";
import { ButtonType } from "../lf-button/button-types.enum";

@Component({
  tag: "design-sheet",
  styleUrl: "design-sheet.component.scss",
  shadow: true,
})
export class DesignSheet {
  private buttonSizes = Object.keys(ButtonSize).map((key) => key);
  private buttonTypes = Object.keys(ButtonType).map((key) => key);

  render() {
    enum ButtonTypeText {
      Primary = "Scan",
      Secondary = "Cancel",
      UI = "Send",
    }

    return (
      <div>
        <h1>Design Sheet</h1>

        <div>
          <h3 class="section-header">UI Buttons</h3>
          {this.buttonTypes.map((flavorKey) => {
            return (
              <div class="btn-type-row">
                <h4 class="btn-type-label">{flavorKey}</h4>
                {this.buttonSizes.map((sizeKey) => {
                  const isDisabled = ButtonSize[sizeKey] === ButtonSize.Small;

                  return (
                    <div class="btn-container">
                      <lf-button
                        class="btn-spacer"
                        size={ButtonSize[sizeKey]}
                        type={ButtonType[flavorKey]}
                        disabled={isDisabled}
                      >
                        {ButtonTypeText[flavorKey]}
                      </lf-button>
                      <div class="btn-size-label">{sizeKey}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <p>Native Web Wifi List Version</p>
        <lf-wifi-list></lf-wifi-list>
      </div>
    );
  }
}
