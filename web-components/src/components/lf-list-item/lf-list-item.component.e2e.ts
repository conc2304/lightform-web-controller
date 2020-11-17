// Library Imports
import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

// App Imports
// None

describe("lf-list-item", () => {

    let page: E2EPage;
    let component: E2EElement;
    const componentSelector = "lf-list-item";
    const nativeElSelector = `${componentSelector} >>> .native-element`;

    beforeEach(async () => {
        page = await newE2EPage();
    });

    it("should render", async () => {
        // Arrange
        
        // Act
        await page.setContent("<lf-list-item></lf-list-item>");
        component = await page.find(componentSelector);

        // Assert
        expect(component).not.toBeNull();
        expect(component).toHaveClasses(["hydrated", "lf-list-item"]);
    });



    describe("should render correct tag type", () => {
        it("should render as an anchor tag", async () => {
            // Arrange

            // Act
            await page.setContent("<lf-list-item href='#'></lf-list-item>");
            const nativeElement = await page.find(nativeElSelector);

            // Assert
            expect(nativeElement.tagName).toBe("A");
        });

        it("should render as a div tag", async () => {
            // Arrange

            // Act
            await page.setContent("<lf-list-item ></lf-list-item>");
            const nativeElement = await page.find(nativeElSelector);

            // Arrange
            expect(nativeElement.tagName).toBe("DIV");
        });

        it("should render as a button tag", async () => {
            // Arrange

            // Act
            await page.setContent("<lf-list-item button></lf-list-item>");
            const nativeElement = await page.find(nativeElSelector);

            // Arrange
            expect(nativeElement.tagName).toBe("BUTTON");
        });
    });



    describe("should apply correct classes", () => {
        it("should initialize list item component classes", async () => {
            // Arrange
            await page.setContent("<lf-list-item></lf-list-item>");
            
            // Act
            component = await page.find(componentSelector);

            // Assert
            expect(component).toHaveClass("lf-list-item");
            expect(component).not.toEqualAttribute("aria-disabled", true);
        });

        
        it("should render changes to the disabled prop", async () => {
            // Arrange
            const initialVal = false;
            const newVal = true;
            const disabledClass = "lf-list-item--disabled";

            await page.setContent(`<lf-list-item disabled="${initialVal}"></lf-list-item>`);

            // Act
            const component = await page.find(componentSelector);
            
            // Assert
            expect(component).not.toHaveClass(disabledClass);
            expect(await component.getProperty("disabled")).toBe(initialVal);

            // Act
            component.setProperty("disabled", newVal);
            await page.waitForChanges();

            // Assert
            expect(component).toHaveClass(disabledClass);
            expect(await component.getProperty("disabled")).toBe(newVal);
        });


        it("should render changes to the active prop", async () => {
            // Arrange
            const initialVal = false;
            const newVal = true;
            const activeClass = "lf-list-item--active";

            
            // Act
            await page.setContent(`<lf-list-item active="${initialVal}"></lf-list-item>`);
            const component = await page.find(componentSelector);
            await page.waitForChanges();


            // Assert
            expect(component).not.toHaveClass(activeClass);
            expect(await component.getProperty("active")).toBe(initialVal);

            // Act
            component.setProperty("active", newVal);
            await page.waitForChanges();

            // Assert
            expect(component).toHaveClass(activeClass);
            expect(await component.getProperty("active")).toBe(newVal);
        });
    });
    
    describe("should render prop changes", () => {
        it("should render changes to the href prop", async () => {
            // Arrange
            const initialValue = "/";
            const updateValue = "#";

            // Act
            await page.setContent(`<lf-list-item href="${initialValue}"></lf-list-item>`);
            const component = await page.find(componentSelector);
            expect(await component.getProperty("href")).toBe(initialValue);

            component.setProperty("href", updateValue);
            await page.waitForChanges();

            // Assert
            expect(await component.getProperty("href")).toBe(updateValue);
        });

        it("should render changes to the rel prop", async () => {
            // Arrange
            const initialValue = "nofollow";
            const updateValue = "next";

            // Act
            await page.setContent(`<lf-list-item rel="${initialValue}" href="#"></lf-list-item>`);
            const component = await page.find(componentSelector);
            expect(await component.getProperty("rel")).toBe(initialValue);

            component.setProperty("rel", updateValue);
            await page.waitForChanges();

            // Assert
            expect(await component.getProperty("rel")).toBe(updateValue);
        });

        it("should render changes to the target prop", async () => {
            // Arrange
            const initialValue = "_blank";
            const updateValue = "_self"

            // Act
            await page.setContent(`<lf-list-item target="${initialValue}" href="#"></lf-list-item>`);
            const component = await page.find(componentSelector);
            expect(await component.getProperty("target")).toBe(initialValue);

            component.setProperty("target", updateValue);
            await page.waitForChanges();

            // Assert
            expect(await component.getProperty("target")).toBe(updateValue);
        });

        it("should render changes to the type prop", async () => {
            // Arrange
            const initialValue = "submit";
            const updateValue = "reset"

            // Act
            await page.setContent(`<lf-list-item button type="${initialValue}"></lf-list-item>`);
            const component = await page.find(componentSelector);
            expect(await component.getProperty("type")).toBe(initialValue);

            component.setProperty("type", updateValue);
            await page.waitForChanges();

            // Assert
            expect(await component.getProperty("type")).toBe(updateValue);
        });
    });
});
