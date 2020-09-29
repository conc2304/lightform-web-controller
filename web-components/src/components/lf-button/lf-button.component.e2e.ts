// Library Imports
import { E2EPage, newE2EPage } from "@stencil/core/testing";

// App Imports
import { ButtonType } from "./button-types.enum";
import { ButtonSize } from "./button-size.enum";

describe("lf-button", () => {

    const buttonElSelector = "lf-button >>> button";
    let page: E2EPage;

    beforeEach(async () => {
        let page = await newE2EPage();
    });

    it("should render", async () => {
        // Arrange

        // Act
        await page.setContent("<lf-button></lf-button>");
        const element = await page.find("lf-button");

        // Assert
        expect(element).not.toBeNull();
        expect(element).toHaveClass("hydrated");
    });


    describe("should apply correct classes", () => {

        it("should initialize button element classes", async () => {
            // Arrange

            // Act
            await page.setContent("<lf-button></lf-button>");
            const element = await page.find(buttonElSelector);

            // Assert
            expect(element).toHaveClasses(["btn-wrapper", `${ButtonType.Primary}`, `btn-size-${ButtonSize.Regular}`]);
            expect(element).not.toEqualAttribute("disabled", true);
        });

        it("should apply the btn-size class", async () => {
            // Arrange

            // Act
            const setValue = ButtonSize.Large;
            await page.setContent(`<lf-button size="${setValue}"></lf-button>`);
            const element = await page.find(buttonElSelector);

            // Assert
            expect(element).toHaveClass(`btn-size-${setValue}`);
        });

        it("should render changes to the size prop", async () => {
            // Arrange            
            const initialValue = ButtonSize.Small;
            const updateValue = ButtonSize.Large;

            // Act
            await page.setContent(`<lf-button size="${initialValue}"></lf-button>`);
            const component = await page.find("lf-button");
            const nativeButtonEl = await page.find(buttonElSelector);

            expect(nativeButtonEl).toHaveClass(`btn-size-${initialValue}`);

            component.setProperty("size", updateValue);
            await page.waitForChanges();

            // Assert
            expect(nativeButtonEl).toHaveClass(`btn-size-${updateValue}`);
        });

        it("should apply the button type class", async () => {
            // Arrange

            // Act
            const setValue = ButtonType.Secondary;
            await page.setContent(`<lf-button type="${setValue}"></lf-button>`);
            await page.waitForChanges();
            const nativeButtonEl = await page.find(buttonElSelector);

            // Assert
            expect(nativeButtonEl).toHaveClass(setValue);
        });

        it("should render changes to the size prop", async () => {
            // Arrange
            const initialValue = ButtonType.Primary;
            const updateValue = ButtonType.Secondary;

            // Act
            await page.setContent(`<lf-button flavor="${initialValue}"></lf-button>`);
            const component = await page.find("lf-button");
            const nativeButtonEl = await page.find(buttonElSelector);

            expect(nativeButtonEl).toHaveClass(`${initialValue}`);

            component.setProperty("type", updateValue);
            await page.waitForChanges();

            // Assert
            expect(nativeButtonEl).toHaveClass(`${updateValue}`);
        });
    });

    it("should apply disabled attribute", async () => {
        // Arrange

        // Act
        const setValue = true;
        await page.setContent(`<lf-button disabled={${setValue}}></lf-button>`);
        const buttonEl = await page.find(buttonElSelector);

        // Assert
        expect(buttonEl).toEqualAttribute("disabled", "");
    });
});
