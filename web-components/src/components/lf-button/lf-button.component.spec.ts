// Library Imports
import { newSpecPage } from "@stencil/core/testing";

// App Imports
import { ButtonType } from "./button-types.enum";
import { ButtonSize } from "./button-size.enum";
import { LfButton } from "./lf-button.component";

describe("LfButton", () => {
    it("should build", async () => {
        // Arrange
        const html = `
                <lf-button>
                    <mock:shadow-root>
                        <button class="btn-wrapper ${ButtonType.Primary} btn-size-${ButtonSize.Regular}"
                            tabindex="0"
                            role="button"
                        >
                            <span class="button-content">
                                <slot />
                            </span>
                        </button
                    </mock:shadow-root>
                </lf-button>  
            `
        ;

        const page = await newSpecPage({
            components: [LfButton],
            html: `<lf-button></lf-button>`
        });

        // Act

        // Assert
        expect(page.root).toBeTruthy();
        expect(page.root).toEqualHtml(html);
    });

    it("should set slot content", async () => {
        // Arrange
        const btnContentSelector = ".button-content";
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
        expect(page.root.querySelector(`.${slotSelector}`).innerHTML).toBe(slotText);
        expect(page.root).toMatchSnapshot();
    });

    describe("should set props", () => {

        it("should have a size prop", async () => {
            // Arrange
            const page = await newSpecPage({
                components: [LfButton],
                html: `<div></div>`
            });

            const component = page.doc.createElement("lf-button");

            // Act
            const setValue = ButtonSize.Large
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
                html: `<div></div>`
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

        it("should have a type property", async () => {
            // Arrange
            const page = await newSpecPage({
                components: [LfButton],
                html: `<div></div>`
            });

            const component = page.doc.createElement("lf-button");

            // Act
            const setValue = ButtonType.Primary;
            component.type = setValue;
            page.root.appendChild(component);
            await page.waitForChanges();

            // Assert
            expect(page.rootInstance.type).toBe(setValue);
        });

    });
});
