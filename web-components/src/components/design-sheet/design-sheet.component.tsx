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
  private buttonContexts = ["primary", "secondary"];

  private renderTypographyExample() {
    return (
      <div class="typography-container">
        <div class="atlas-light table-row">
          <div class="font-label td">Light 300</div>
          <div class="td">The quick brown fox jumps over the lazy dog.</div>
          <div class="td">Scan</div>
          <div class="td">Cancel</div>
          <lf-button size="regular">Scan</lf-button>
        </div>
        <div class="atlas-regular table-row">
          <div class="font-label td">Regular 400</div>
          <div class="td">The quick brown fox jumps over the lazy dog.</div>
          <div class="td">Scan</div>
          <div class="td">Cancel</div>
          <lf-button size="regular">Scan</lf-button>
        </div>
        <div class="atlas-medium table-row">
          <div class="font-label td">Medium 500</div>
          <div class="td">The quick brown fox jumps over the lazy dog.</div>
          <div class="td">Scan</div>
          <div class="td">Cancel</div>
          <lf-button size="regular">Scan</lf-button>
        </div>
        <div class="atlas-bold table-row">
          <div class="font-label td">Bold 700</div>
          <div class="td">The quick brown fox jumps over the lazy dog.</div>
          <div class="td">Scan</div>
          <div class="td">Cancel</div>
          <lf-button size="regular">Scan</lf-button>
        </div>
      </div>
    );
  }
  private renderButtonsExample() {
    try {
      enum ButtonContextText {
        primary = "Scan",
        secondary = "Cancel",
      }

      return (
        <div class="button-section--container">
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
              <lf-button
                class="btn-spacer test"
                context="secondary"
                size="regular"
              >
                <img slot="start" src="/assets/images/icons/Lock.svg"></img>
                <span>Lock</span>
              </lf-button>
              <div class="btn-size-label">
                Secondary <br /> w/ Icon Start (reg)
              </div>
            </div>

            <div class="btn-container">
              <lf-button class="btn-spacer" context="primary" size="regular">
                <span>Unlock</span>
                <img slot="end" src="/assets/images/icons/Unlock.svg"></img>
              </lf-button>
              <div class="btn-size-label">
                Primary
                <br /> w/ Icon End (reg)
              </div>
            </div>
          </div>

          {this.renderRoundButtons()}
          {/* /.btn-context-row */}
        </div>
        // /.button-section--container
      );
    } catch (e) {
      console.error(e);
    } finally {
    }
  }

  private renderRoundButtons() {
    return (
      <div class="btn-context-row">
        <h4 class="btn-type-label">Rounded Buttons</h4>

        <div class="btn-container">
          <lf-button
            class="btn-spacer"
            context="primary"
            size="regular"
            shape="round"
            disabled
          >
            <img src="/assets/images/icons/Lock.svg"></img>
          </lf-button>
          <div class="btn-size-label">Disabled</div>
        </div>

        {this.buttonSizes.map((sizeKey: ButtonSize) => {
          return (
            <div class="btn-container">
              <lf-button
                class="btn-spacer"
                size={sizeKey}
                context="primary"
                shape="round"
              >
                <img src="/assets/images/icons/Lock.svg"></img>
              </lf-button>
              <div class="btn-size-label">{sizeKey.toString()}</div>
            </div>
          );
        })}
      </div>
    );
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

  private renderTextInputsExample() {
    return [
      <div class="lf-text-inputs-container">
        <lf-text-input
          label="Default Label"
          placeholder="Placeholder Text"
          size={20}
        ></lf-text-input>

        <lf-text-input
          label="Stacked Label w/ clear"
          labelPosition="stacked"
          placeholder="Stacked"
          clearInput={true}
        ></lf-text-input>

        <lf-text-input
          label="Password"
          labelPosition="stacked"
          placeholder="Enter Password"
          type="password"
        ></lf-text-input>
      </div>,
      <div class="lf-text-inputs-container">
        <lf-text-input
          label="Input Expands"
          expand="fill"
          class="item"
          placeholder="Watch me grow"
        />
        <lf-text-input label="Date" placeholder="Enter Date" type="date" />
      </div>,

      <div class="lf-text-inputs-container">
        <lf-text-input
          label="Invalid"
          labelPosition="stacked"
          placeholder="This is no good"
          invalid={true}
        ></lf-text-input>

        <lf-text-input
          label="Disabled"
          labelPosition="stacked"
          disabled={true}
          class="item"
          placeholder="No touchy!!"
        ></lf-text-input>
      </div>,
    ];
  }

  render() {
    return (
      <Host>
        <div class="design-sheet--wrapper">
          <div class="design-sheet--hero">
            <h1 class="hero--text">Lightform Design Sheet</h1>
          </div>

          <div class="lf-text-inputs design-sheet--example">
            <h3 class="section-header">Typography</h3>
            {this.renderTypographyExample()}
          </div>

          <div class="lf-buttons design-sheet--example">
            {this.renderButtonsExample()}
          </div>

          <div class="lf-text-inputs design-sheet--example">
            <h3 class="section-header">Text Inputs</h3>
            {this.renderTextInputsExample()}
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
        </div>
      </Host>
    );
  }
}
