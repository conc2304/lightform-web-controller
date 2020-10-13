// Library Imports
import { newSpecPage } from "@stencil/core/testing";

// App Imports
import { ButtonContext } from "./button-context.enum";
import { ButtonSize } from "./button-size.enum";
import { LfButton } from "./lf-button.component";

describe("LfButton", () => {
    it("should build", async () => {
        // Arrange
        const html = `
        <lf-button class="btn-size-regular btn-wrapper primary">
            <mock:shadow-root>
                <button class="native-button" part="native" role="button" tabindex="0" type="button">
                    <span class="button-content">
                        <slot name="icon-only"></slot>
                        <slot name="start"></slot>
                        <slot></slot>
                        <slot name="end"></slot>
                    </span>
                </button>
            </mock:shadow-root>
        </lf-button>`
            ;

        const page = await newSpecPage({
            components: [LfButton],
            html: `<lf-button></lf-button>`
        });

        // Act

        // Assert
        expect(page.root).toBeTruthy();
        expect(page.root).toEqualHtml(html);
        expect(new LfButton()).toBeTruthy();
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

        it("should have a context property", async () => {
            // Arrange
            const page = await newSpecPage({
                components: [LfButton],
                html: `<div></div>`
            });

            const component = page.doc.createElement("lf-button");

            // Act
            const setValue = ButtonContext.Primary;
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
                html: `<div></div>`
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

        it("should emit focus event", async () => {
            // Arrange
            const page = await newSpecPage({
                components: [LfButton],
                html: `<lf-button></lf-button>`,
            });

            const buttonEl: HTMLButtonElement = page.root.shadowRoot.querySelector("button");
            // const buttonEl: HTMLElement = page.root.querySelector("button");

            expect(buttonEl).toBeInstanceOf(HTMLButtonElement);

            const _callback = jest.fn();
            page.doc.addEventListener("lfFocus", _callback);
            await page.waitForChanges();

            // Act
            buttonEl.click();
            
            buttonEl.focus();
            
            page.root.querySelector("button").focus();


            // Assert
            expect(_callback).toHaveBeenCalled();

        });

    });
});
