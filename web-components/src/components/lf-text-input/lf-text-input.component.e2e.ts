// Library Imports
import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

// App Imports
// None

describe("lf-text-input", () => {
  let page: E2EPage;
  let component: E2EElement;
  const componentSelector = "lf-text-input";

  beforeEach(async () => {
    page = await newE2EPage();
  });

  it("should render", async () => {
    // Arrange

    // Act
    await page.setContent(`<${componentSelector}></${componentSelector}>`);
    component = await page.find(componentSelector);

    // Assert
    expect(component).not.toBeNull();
    expect(component).toHaveClasses(["hydrated", componentSelector]);
  });

  describe("should render prop changes", () => {
    it("should render changes to the disabled prop", async () => {
      // Arrange
      const initialVal = false;
      const newVal = true;
      const propName = "disabled";
      const disabledClass = `${componentSelector}--disabled`;

      await page.setContent(
        `<${componentSelector} ${propName}="${initialVal}"></${componentSelector}>`
      );

      // Act
      const component = await page.find(componentSelector);

      // Assert
      expect(component).not.toHaveClass(disabledClass);
      expect(await component.getProperty(propName)).toBe(initialVal);

      // Act
      component.setProperty(propName, newVal);
      await page.waitForChanges();

      // Assert
      expect(component).toHaveClass(disabledClass);
      expect(await component.getProperty(propName)).toBe(newVal);
    });

    it("should render changes to the value prop", async () => {
      // Arrange
      const propName = "value";
      const initialVal = "";
      const newVal = "My Input Value";
      const hasValueClass = `${componentSelector}--has-value`;
      const emptyClass = `${componentSelector}--empty`;

      await page.setContent(`<${componentSelector}></${componentSelector}>`);
      await page.waitForChanges();

      // Act
      const component = await page.find(componentSelector);

      // Assert
      expect(component).not.toHaveClass(hasValueClass);
      expect(component).toHaveClass(emptyClass);
      expect(await component.getProperty(propName)).toBe(initialVal);

      // Act
      component.setProperty(propName, newVal);
      await page.waitForChanges();

      // Assert
      expect(component).toHaveClass(hasValueClass);
      expect(component).not.toHaveClass(emptyClass);
      expect(await component.getProperty(propName)).toBe(newVal);
    });

    it("should render changes to the label position prop", async () => {
      // Arrange
      const initialVal = undefined;
      const defaultVal = "fixed";
      const newVal = "stacked";
      const propNameCSS = "label-position";
      const propNameJs = "labelPosition";
      const labelPositionClassDefault = `${componentSelector}--${propNameCSS}-${defaultVal}`;
      const labelPositionClassNew = `${componentSelector}--${propNameCSS}-${newVal}`;

      await page.setContent(`<${componentSelector}></${componentSelector}>`);

      // Act
      const component = await page.find(componentSelector);
      await page.waitForChanges();

      // Assert
      expect(component).not.toHaveClass(labelPositionClassNew);
      expect(component).toHaveClass(labelPositionClassDefault);
      expect(await component.getProperty(propNameJs)).toBe(initialVal);

      // Act
      component.setProperty(propNameJs, newVal);
      await page.waitForChanges();

      // Assert
      expect(component).toHaveClass(labelPositionClassNew);
      expect(component).not.toHaveClass(labelPositionClassDefault);
      expect(await component.getProperty(propNameJs)).toBe(newVal);
    });

    it("should render changes on focus", async () => {
      // Arrange
      const focusClassName = `${componentSelector}--has-focus`;
      await page.setContent(`<${componentSelector} </${componentSelector}>`);
      const component = await page.find(componentSelector);
      const nativeInput = await page.find(`${componentSelector} .native-input`);

      // Act

      expect(component).not.toHaveClass(focusClassName);

      nativeInput.focus();
      await page.waitForChanges();

      // Assert
      expect(component).toHaveClass(focusClassName);
    });
  });

  it("should emit a focus event", async () => {
    // Arrange
    await page.setContent(`<${componentSelector} </${componentSelector}>`);
    await page.waitForChanges();
    const nativeInput = await page.find(`${componentSelector} .native-input`);
    const onFocus = await page.spyOnEvent("lfFocus");

    // Act
    nativeInput.focus();
    await page.waitForChanges();

    // Assert
    expect(onFocus).toHaveReceivedEvent();
  });
});
