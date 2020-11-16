import { Component, h, Host } from "@stencil/core";

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

  private renderButtonsExample() {
    try {
      enum ButtonContextText {
        primary = "Scan",
        secondary = "Cancel",
        ui = "Send",
      }

      return (
        <div>
          <h3 class="section-header">UI Buttons</h3>

          {this.buttonContexts.map((flavorKey: ButtonContext) => {
            return (
              <div class="btn-context-row">
                <h4 class="btn-type-label">{flavorKey}</h4>

                <div class="btn-container">
                  <lf-button
                    class="btn-spacer"
                    size="regular"
                    disabled
                    context={flavorKey}
                    onClick={() => {
                      console.log("click");
                    }}
                  >
                    {ButtonContextText[flavorKey]}
                  </lf-button>
                  <div class="btn-size-label">Disabled</div>
                </div>

                {this.buttonSizes.map((sizeKey: ButtonSize) => {
                  return (
                    <div class="btn-container">
                      <lf-button
                        class="btn-spacer"
                        size={sizeKey}
                        context={flavorKey}
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

          <div class="btn-context-row">
            <h4 class="btn-type-label">Buttons with Icons</h4>

            <div class="btn-container">
              <lf-button class="btn-spacer test" context="ui" size="large">
                <img slot="start" src="/assets/images/icons/Lock.svg"></img>
                <span>Lock</span>
              </lf-button>
              <div class="btn-size-label">UI w/ Icon Start</div>
            </div>

            <div class="btn-container">
              <lf-button class="btn-spacer" context="primary" size="large">
                <p>Unlock</p>
                <img slot="end" src="/assets/images/icons/Unlock.svg"></img>
              </lf-button>
              <div class="btn-size-label">Primary w/ Icon End</div>
            </div>
          </div>
        </div>
      );
    } catch (e) {
      console.error(e);
    } finally {
    }
  }

  private renderWifiListScssCode() {
    return (
      <pre>
        <code>
          {
            "lf-subheader { \r\n --background: #{$color-brand-lf-green-base}; \r\n}"
          }
        </code>
      </pre>
    );
  }

  render() {
    return (
      <Host>
        <div class="design-sheet--wrapper">
          <div class="design-sheet--hero">
            <h1 class="hero--text">Lightform Design Sheet</h1>
          </div>

          <div class="wifi-list design-sheet--example">
            <h3 class="section-header">Native Wifi List</h3>
            <lf-wifi-list></lf-wifi-list>
            <br></br>
            <p class="section-subheader">Styling Example</p>
            <p class="section-subheader">
              Implementation of lf-list, lf-subheader, and lf-list-item
              <br></br>
              Example of custom flavorings through the component's api:{" "}
              <br></br>subheader in green, 2nd list item disabled
            </p>
            {this.renderWifiListScssCode()}
          </div>

          <div class="lf-buttons design-sheet--example">
            {this.renderButtonsExample()}
          </div>
        </div>
      </Host>
    );
  }
}
