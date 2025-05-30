// Library Imports
import { newE2EPage } from "@stencil/core/testing";

// App Imports
import { ButtonContext } from "./button-context.type";
import { ButtonSize } from "./button-size.type";

describe("lf-button", () => {
  const componentSelector = "lf-button";
  const buttonElSelector = `${componentSelector} >>> button`;
  beforeEach(async () => {});

  it("should render", async () => {
    // Arrange
    const page = await newE2EPage();

    // Act
    await page.setContent("<lf-button></lf-button>");
    const element = await page.find(componentSelector);

    // Assert
    expect(element).not.toBeNull();
    expect(element).toHaveClass("hydrated");
  });

  describe("should apply correct classes", () => {
    it("should initialize button element classes", async () => {
      // Arrange
      const page = await newE2EPage();

      // Act
      await page.setContent("<lf-button></lf-button>");
      const component = await page.find(componentSelector);

      // Assert
      expect(component).toHaveClasses([
        "lf-button",
        `lf-button--context-primary`,
        `lf-button--size-regular`,
      ]);
      expect(component).not.toEqualAttribute("disabled", true);
    });

    it("should apply the btn-size class", async () => {
      // Arrange
      const page = await newE2EPage();

      // Act
      const setValue: ButtonSize = "small";
      await page.setContent(`<lf-button size="${setValue}"></lf-button>`);
      const component = await page.find(componentSelector);

      // Assert
      expect(component).toHaveClass(`lf-button--size-${setValue}`);
    });

    it("should render changes to the size prop", async () => {
      // Arrange
      const page = await newE2EPage();
      const initialValue: ButtonSize = "small";
      const updateValue: ButtonSize = "large";

      // Act
      await page.setContent(`<lf-button size="${initialValue}"></lf-button>`);
      const component = await page.find("lf-button");

      expect(component).toHaveClass(`lf-button--size-${initialValue}`);
      expect(await component.getProperty("size")).toBe(initialValue);

      component.setProperty("size", updateValue);
      await page.waitForChanges();

      // Assert
      expect(component).toHaveClass(`lf-button--size-${updateValue}`);
      expect(await component.getProperty("size")).toBe(updateValue);
    });

    it("should apply the button context class", async () => {
      // Arrange
      const page = await newE2EPage();

      // Act
      const setValue: ButtonContext = "secondary";
      await page.setContent(`<lf-button context="${setValue}"></lf-button>`);
      await page.waitForChanges();
      const component = await page.find(componentSelector);

      // Assert
      expect(component).toHaveClass(`lf-button--context-${setValue}`);
    });

    it("should render changes to the context prop", async () => {
      // Arrange
      const page = await newE2EPage();
      const initialValue: ButtonContext = "primary";
      const updateValue: ButtonContext = "secondary";

      // Act
      await page.setContent(`<lf-button flavor="${initialValue}"></lf-button>`);
      const component = await page.find("lf-button");

      expect(component).toHaveClass(`lf-button--context-${initialValue}`);
      expect(await component.getProperty("context")).toBe(initialValue);

      component.setProperty("context", updateValue);
      await page.waitForChanges();

      // Assert
      expect(component).toHaveClass(`lf-button--context-${updateValue}`);
      expect(await component.getProperty("context")).toBe(updateValue);
    });

    it("should render changes to the type prop", async () => {
      // Arrange
      const page = await newE2EPage();
      const initialValue = "button";
      const updateValue = "submit";

      // Act
      await page.setContent(`<lf-button type="${initialValue}"></lf-button>`);
      const component = await page.find("lf-button");

      expect(await component.getProperty("type")).toBe(initialValue);

      component.setProperty("type", updateValue);
      await page.waitForChanges();

      // Assert
      expect(await component.getProperty("type")).toBe(updateValue);
    });

    it("should render changes to the href prop", async () => {
      // Arrange
      const page = await newE2EPage();
      const initialValue = "/";
      const updateValue = "#";

      // Act
      await page.setContent(`<lf-button href="${initialValue}"></lf-button>`);
      const component = await page.find("lf-button");

      expect(await component.getProperty("href")).toBe(initialValue);

      component.setProperty("href", updateValue);
      await page.waitForChanges();

      // Assert
      expect(await component.getProperty("href")).toBe(updateValue);
    });

    it("should render changes to the target prop", async () => {
      // Arrange
      const page = await newE2EPage();
      const initialValue = "_self";
      const updateValue = "_blank";

      // Act
      await page.setContent(`<lf-button href="${initialValue}"></lf-button>`);
      const component = await page.find("lf-button");

      expect(await component.getProperty("href")).toBe(initialValue);

      component.setProperty("href", updateValue);
      await page.waitForChanges();

      // Assert
      expect(await component.getProperty("href")).toBe(updateValue);
    });
  });

  it("should apply disabled attribute", async () => {
    // Arrange
    const page = await newE2EPage();

    // Act
    const setValue = true;
    await page.setContent(`<lf-button disabled={${setValue}}></lf-button>`);
    const buttonEl = await page.find(buttonElSelector);

    // Assert
    expect(buttonEl).toEqualAttribute("disabled", "");
  });
});
