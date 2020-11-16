// Library Imports
import { newSpecPage } from "@stencil/core/testing";

// App Imports
import { LfList } from "./lf-list.component";


describe("LfList", () => {
    it("should build", async () => {

        // Arrange
        const html = `
        <lf-list class="lf-list">
            <mock:shadow-root>
                <div class="native-element" part="native" role="list">
                    <slot></slot>
                </div>
            </mock:shadow-root>
        </lf-list>
            `;

        const page = await newSpecPage({
            components: [LfList],
            html: `<lf-list></ lf-list>`
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
        const slotText = "TEST";

        const html = `
        <lf-list>
            <p slot class="${slotClassName}">${slotText}</p>
        </lf-list>            
        `;

        const page = await newSpecPage({
            components: [LfList],
            html: html,
        });

        // Act

        // Assert
        expect(page.root.shadowRoot).toBeTruthy();
        expect(page.root.querySelector(listItemSelector)).toBeFalsy();
        expect(page.root.shadowRoot.querySelector(listItemSelector)).toBeTruthy();
        expect(page.root.querySelector(`.${slotClassName}`)).toBeTruthy();
        expect(page.root.querySelector(`.${slotClassName}`).innerHTML).toBe(slotText);
        expect(page.root).toMatchSnapshot();
    });

    describe("should set props", () => {

        it("should have a disabled prop", async () => {
            // Arrange
            const page = await newSpecPage({
                components: [LfList],
                html: `<div></div>`
            });

            const component = page.doc.createElement("lf-list");

            // Act
            const setValue = true;
            component.disabled = setValue;
            page.root.appendChild(component);
            await page.waitForChanges();

            // Assert
            expect(page.rootInstance.disabled).toBe(setValue);
        });
    });
});
