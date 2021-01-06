// Library Imports
import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

// App Imports
// None

describe("lf-list", () => {
  let page: E2EPage;
  let component: E2EElement;
  const componentSelector = "lf-list";

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
  });
});
