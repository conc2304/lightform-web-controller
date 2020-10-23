import { Component, h } from "@stencil/core";

import { ButtonSize } from "../lf-button/button-size.type";
import { ButtonContext } from "../lf-button/button-context.type";

@Component({
  tag: "design-sheet",
  styleUrl: "design-sheet.component.scss",
  shadow: true,
})
export class DesignSheet {
  private buttonSizes = ["x-large", "large", "regular", "small", "x-small"];
  private buttonContexts = ["primary", "secondary", "ui"];

  render() {
    enum ButtonContextText {
      primary = "Scan",
      secondary = "Cancel",
      ui = "Send",
    }

    return (
      <div>
        <h1>Design Sheet</h1>

        <div>
          <h3 class="section-header">UI Buttons</h3>
          {this.buttonContexts.map((flavorKey: ButtonContext) => {
            return (
              <div class="btn-context-row">
                <h4 class="btn-type-label">{flavorKey}</h4>
                {this.buttonSizes.map((sizeKey: ButtonSize) => {
                  const isDisabled = sizeKey === "small";

                  return (
                    <div class="btn-container">
                      <lf-button
                        class="btn-spacer"
                        size={sizeKey}
                        context={flavorKey}
                        disabled={isDisabled}
                        onClick={() => {
                          console.log("click");
                        }}
                      >
                        {ButtonContextText[flavorKey]}
                      </lf-button>
                      <div class="btn-size-label">{sizeKey.toString()}</div>
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

            <lf-button
              class="test"
              disabled
              context="ui"
              size="large"
            >
              <img slot="start" src="/assets/images/icons/Lock.svg"></img>
              <span>Lock</span>
            </lf-button>
          </div>

          <div class="btn-container">
            <lf-button context="primary" size="large">
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
