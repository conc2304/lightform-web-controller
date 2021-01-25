// Library Imports
import { newSpecPage, SpecPage } from "@stencil/core/testing";

// App Imports
import { LfTextInput } from "./lf-text-input.component";

describe("LfListItem", () => {
  it("should build", async () => {
    // Arrange
    const html = `
        <lf-text-input class="lf-text-input">
            <div class="lf-text-input--wrapper">
                <input aria-labelledby="lf-text-input-0--label" autocapitalize="off" class="native-input" id="lf-text-input-0" name="lf-text-input-0" placeholder="" type="text" value="">
            </div>
        </lf-text-input>
        `;

    const page = await newSpecPage({
      components: [LfTextInput],
      html: `<lf-text-input></ lf-text-input>`,
    });

    // Act

    // Assert
    expect(page.root).toBeTruthy();
    expect(page.root).toEqualHtml(html);
  });

  it("should build with label", async () => {
    // Arrange
    const html = `
        <lf-text-input class="lf-text-input lf-text-input--label-position-fixed" label="My Label">
            <span class="lf-text-input--label-wrapper">
                <label aria-owns="lf-text-input-1" class="lf-text-input--label" htmlfor="lf-text-input-1" id="lf-text-input-1--label">
                    My Label
                </label>
            </span>
            <div class="lf-text-input--wrapper">
                <input aria-labelledby="lf-text-input-1--label" autocapitalize="off" class="native-input" id="lf-text-input-1" name="lf-text-input-1" placeholder="" type="text" value="">
            </div>
        </lf-text-input>
        `;

    const page = await newSpecPage({
      components: [LfTextInput],
      html: `<lf-text-input label="My Label"></ lf-text-input>`,
    });

    // Act

    // Assert
    expect(page.root).toBeTruthy();
    expect(page.root).toEqualHtml(html);
  });

  describe("should set props", () => {
    let page: SpecPage;
    let component: HTMLLfTextInputElement;

    async function assertComponentProp(propName: string, propVal: any) {
      component[propName] = propVal;
      page.root.appendChild(component);
      await page.waitForChanges();

      // Assert
      expect(page.rootInstance[propName]).toBe(propVal);
    }

    beforeEach(async () => {
      page = await newSpecPage({
        components: [LfTextInput],
        html: `<div></div>`,
      });

      component = page.doc.createElement("lf-text-input");
    });

    it;
    it("should have a label prop", async () => {
      await assertComponentProp("label", "My Input Label");
    });

    it("should have a labelPosition prop", async () => {
      await assertComponentProp("labelPosition", "stacked");
    });

    it("should have a disabled prop", async () => {
      await assertComponentProp("disabled", true);
    });

    it("should have a required prop", async () => {
      await assertComponentProp("required", true);
    });

    it("should have a value prop", async () => {
      await assertComponentProp("value", "My Input Value");
    });

    it("should have a readonly prop", async () => {
      await assertComponentProp("readonly", true);
    });

    it("should have a placeholder prop", async () => {
      await assertComponentProp("placeholder", "My Placeholder");
    });

    it("should have a clear input prop", async () => {
      await assertComponentProp("clearInput", true);
    });

    it("should have a clearIconColor prop", async () => {
      await assertComponentProp("clearIconColor", "red");
    });

    it("should have a clearOnEdit prop", async () => {
      await assertComponentProp("clearOnEdit", true);
    });

    it("should have an autofocus prop", async () => {
      await assertComponentProp("autofocus", true);
    });

    it("should have a debounce prop", async () => {
      await assertComponentProp("debounce", 300);
    });

    it("should have a size prop", async () => {
      await assertComponentProp("size", 200);
    });

    it("should have a step prop", async () => {
      await assertComponentProp("step", "2");
    });

    it("should have a max prop", async () => {
      await assertComponentProp("max", "100");
    });

    it("should have a maxlength prop", async () => {
      await assertComponentProp("maxlength", 100);
    });

    it("should have a min prop", async () => {
      await assertComponentProp("min", "10");
    });

    it("should have a minlength prop", async () => {
      await assertComponentProp("minlength", 16);
    });
  });
});
