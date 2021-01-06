// Library Imports
import { newSpecPage } from "@stencil/core/testing";

// App Imports
import { LfSubheader } from "./lf-subheader.component";

describe("LfSubheader", () => {
  it("should build", async () => {
    // Arrange
    const html = `
        <lf-subheader class="lf-subheader">
            <mock:shadow-root>
                <div class="native-element" part="native">
                    <slot name="start"></slot>
                    <div class="lf-subheader--slot-wrapper">
                        <slot></slot>
                    </div>
                    <slot name="end"></slot>
                </div>
            </mock:shadow-root>
        </lf-subheader>
        `;

    const page = await newSpecPage({
      components: [LfSubheader],
      html: `<lf-subheader></ lf-subheader>`,
    });

    // Act

    // Assert
    expect(page.root).toBeTruthy();
    expect(page.root).toEqualHtml(html);
  });

  it("should set slot content", async () => {
    // Arrange
    const listItemSelector = ".native-element";
    const slotClassName = "inner-content";
    const slotStartClassName = "start-content";
    const slotStartContent = "Banana";
    const slotEndClassName = "end-content";
    const slotEndContent = "../test.png";
    const slotText = "TEST";

    const html = `
        <lf-subheader>
            <p slot="start" class="${slotStartClassName}">${slotStartContent}</p>
            <p class="${slotClassName}">${slotText}</p>
            <img slot="end" class="${slotEndClassName}" src="${slotEndContent}"></img>
        </lf-subheader>            
        `;

    const page = await newSpecPage({
      components: [LfSubheader],
      html: html,
    });

    // Act

    // Assert
    expect(page.root.shadowRoot).toBeTruthy();
    expect(page.root.querySelector(listItemSelector)).toBeFalsy();
    expect(page.root.shadowRoot.querySelector(listItemSelector)).toBeTruthy();

    expect(page.root.querySelector(`.${slotClassName}`)).toBeTruthy();
    expect(page.root.querySelector(`.${slotClassName}`).innerHTML).toBe(
      slotText
    );

    expect(page.root.querySelector(`.${slotStartClassName}`)).toBeTruthy();
    expect(page.root.querySelector(`.${slotStartClassName}`).innerHTML).toBe(
      slotStartContent
    );

    expect(page.root.querySelector(`.${slotEndClassName}`)).toBeTruthy();
    expect(
      page.root.querySelector(`.${slotEndClassName}`).getAttribute("src")
    ).toBe(slotEndContent);

    expect(page.root).toMatchSnapshot();
  });

  describe("should set props", () => {
    it("should have a inset prop", async () => {
      // Arrange
      const page = await newSpecPage({
        components: [LfSubheader],
        html: `<div></div>`,
      });

      const component = page.doc.createElement("lf-subheader");

      // Act
      const setValue = true;
      component.inset = setValue;
      page.root.appendChild(component);
      await page.waitForChanges();

      // Assert
      expect(page.rootInstance.inset).toBe(setValue);
    });
  });
});
