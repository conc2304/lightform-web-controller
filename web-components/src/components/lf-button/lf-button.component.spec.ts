import { newSpecPage } from "@stencil/core/testing";
import { ButtonFlavor } from "./button-flavor.enum";
import { ButtonSize } from "./button-size.enum";
import { LfButton } from "./lf-button.component";

describe("LfButton", () => {
    it("builds", async () => {
        // Arrange
        const page = await newSpecPage({
            components: [LfButton],
            html: `<lf-button></lf-button>`
        });

        // Act

        // Assert
        expect(page.root).toBeTruthy();
    });

    describe("setting props", () => {

        it("has a size prop", async () => {
            // Arrange
            const page = await newSpecPage({
                components: [LfButton],
                html: `<div></div>`
            });
            
            let component = page.doc.createElement("lf-button");
            
            // Act
            const setValue = ButtonSize.Large
            component.size = setValue;
            page.root.appendChild(component);
            await page.waitForChanges();
            
            // Assert
            expect(page.rootInstance.size).toBe(setValue);
        });

        it("has a disabled prop", async () => {
            // Arrange 
            const page = await newSpecPage({
                components: [LfButton],
                html: `<div></div>`
            });

            let component = page.doc.createElement("lf-button");

            // Act
            const setValue = true;
            component.disabled = setValue;
            page.root.appendChild(component);
            await page.waitForChanges();

            // Assert
            expect(page.rootInstance.disabled).toBe(setValue);
        });

        it("has a flavor property", async ()=> {
            // Arrange
            const page = await newSpecPage({
                components: [LfButton],
                html: `<div></div>`
            });

            let component = page.doc.createElement("lf-button");

            // Act
            const setValue = ButtonFlavor.Primary;
            (component as any).flavor = setValue;
            page.root.appendChild(component);
            await page.waitForChanges();

            // Assert
            expect(page.rootInstance.flavor).toBe(setValue);
        });

    });
});
