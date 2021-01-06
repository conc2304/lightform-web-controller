// Library Imports
import { newSpecPage } from "@stencil/core/testing";

// App Imports
import { ButtonContext } from "./button-context.type";
import { ButtonSize } from "./button-size.type";
import { LfButton } from "./lf-button.component";

describe("LfButton", () => {
  it("should build", async () => {
    // Arrange
    const html = `
        <lf-button class="lf-button lf-button--size-regular lf-button--context-primary">
            <mock:shadow-root>
                <button class="native-element" part="native" role="button" tabindex="0" type="button">
                    <span class="lf-button--content">
                        <slot name="start"></slot>
                        <slot></slot>
                        <slot name="end"></slot>
                    </span>
                </button>
            </mock:shadow-root>

        </lf-button>
        `;

    const page = await newSpecPage({
      components: [LfButton],
      html: `<lf-button></lf-button>`,
    });

    // Act

    // Assert
    expect(page.root).toBeTruthy();
    expect(page.root).toEqualHtml(html);
  });

  it("should set slot content", async () => {
    // Arrange
    const btnContentSelector = ".lf-button--content";
    const slotSelector = "inner-content";
    const slotText = "TEST";

    const html = `
        <lf-button>
            <p slot class="${slotSelector}">${slotText}</p>
        </lf-button>            
        `;

    const page = await newSpecPage({
      components: [LfButton],
      html: html,
    });

    // Act

    // Assert
    expect(page.root.shadowRoot).toBeTruthy();
    expect(page.root.querySelector(btnContentSelector)).toBeFalsy();
    expect(page.root.shadowRoot.querySelector(btnContentSelector)).toBeTruthy();
    expect(page.root.querySelector(`.${slotSelector}`)).toBeTruthy();
    expect(page.root.querySelector(`.${slotSelector}`).innerHTML).toBe(
      slotText
    );
    expect(page.root).toMatchSnapshot();
  });

  describe("should set props", () => {
    it("should have a size prop", async () => {
      // Arrange
      const page = await newSpecPage({
        components: [LfButton],
        html: `<div></div>`,
      });

      const component = page.doc.createElement("lf-button");

      // Act
      const setValue: ButtonSize = "large";
      component.size = setValue;
      page.root.appendChild(component);
      await page.waitForChanges();

      // Assert
      expect(page.rootInstance.size).toBe(setValue);
    });

    it("should have a disabled prop", async () => {
      // Arrange
      const page = await newSpecPage({
        components: [LfButton],
        html: `<div></div>`,
      });

      const component = page.doc.createElement("lf-button");

      // Act
      const setValue = true;
      component.disabled = setValue;
      page.root.appendChild(component);
      await page.waitForChanges();

      // Assert
      expect(page.rootInstance.disabled).toBe(setValue);
    });

    it("should have a context property", async () => {
      // Arrange
      const page = await newSpecPage({
        components: [LfButton],
        html: `<div></div>`,
      });

      const component = page.doc.createElement("lf-button");

      // Act
      const setValue = "primary";
      component.context = setValue;
      page.root.appendChild(component);
      await page.waitForChanges();

      // Assert
      expect(page.rootInstance.context).toBe(setValue);
    });

    it("should have a type property", async () => {
      // Arrange
      const page = await newSpecPage({
        components: [LfButton],
        html: `<div></div>`,
      });

      const component = page.doc.createElement("lf-button");

      // Act
      const setValue = "submit";
      component.type = setValue;
      page.root.appendChild(component);
      await page.waitForChanges();

      // Assert
      expect(page.rootInstance.type).toBe(setValue);
    });
  });
});
