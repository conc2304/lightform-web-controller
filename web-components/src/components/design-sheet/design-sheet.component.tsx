import { Component, h } from "@stencil/core";

import { ButtonSize } from "../lf-button/button-size.enum";
import { ButtonContext } from "../lf-button/button-context.enum";

@Component({
  tag: "design-sheet",
  styleUrl: "design-sheet.component.scss",
  shadow: true,
})
export class DesignSheet {
  private buttonSizes = Object.keys(ButtonSize).map((key) => key);
  private buttonContexts = Object.keys(ButtonContext).map((key) => key);

  render() {
    enum ButtonContextText {
      Primary = "Scan",
      Secondary = "Cancel",
      UI = "Send",
    }

    return (
      <div>
        <h1>Design Sheet</h1>

        <div>
          <h3 class="section-header">UI Buttons</h3>
          {this.buttonContexts.map((flavorKey) => {
            return (
              <div class="btn-context-row">
                <h4 class="btn-type-label">{flavorKey}</h4>
                {this.buttonSizes.map((sizeKey) => {
                  const isDisabled = ButtonSize[sizeKey] === ButtonSize.Small;

                  return (
                    <div class="btn-container">
                      <lf-button
                        class="btn-spacer"
                        size={ButtonSize[sizeKey]}
                        context={ButtonContext[flavorKey]}
                        disabled={isDisabled}
                      >
                        {ButtonContextText[flavorKey]}
                      </lf-button>
                      <div class="btn-size-label">{sizeKey}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div class="btn-context-row">
          <h4 class="btn-type-label">Buttons with Icons</h4>

          <div class="btn-container">
            <lf-button disabled context={ButtonContext.UI} size={ButtonSize.XLarge}>
              <img slot="start" src="/assets/images/icons/Lock.svg"></img>
              <span>Lock</span>
            </lf-button>
          </div>

          <div class="btn-container">
            <lf-button context={ButtonContext.UI} size={ButtonSize.XLarge}>
              <p>Unlock</p>
              <img slot="end" src="/assets/images/icons/Unlock.svg"></img>
            </lf-button>
          </div>
        </div>

        <p>Native Web Wifi List Version</p>
        <lf-wifi-list></lf-wifi-list>
      </div>
    );
  }
}
