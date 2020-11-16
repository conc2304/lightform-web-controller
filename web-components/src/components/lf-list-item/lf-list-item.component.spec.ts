// Library Imports
import { newSpecPage } from "@stencil/core/testing";

// App Imports
import { LfListItem } from "./lf-list-item.component";


describe("LfListItem", () => {
    it("should build", async () => {
        // Arrange
        const html = `
            <lf-list-item class="lf-list-item" tabindex="0">
                <mock:shadow-root>
                    <div class="native-element" role="listitem">
                        <slot name="start"></slot>
                        <div class="lf-list-item--slot-wrapper">
                            <slot></slot>
                        </div>
                        <slot name="end"></slot>
                    </div>
                </mock:shadow-root>
            </lf-list-item>
        `;

        const page = await newSpecPage({
            components: [LfListItem],
            html: `<lf-list-item></ lf-list-item>`
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
        <lf-list-item>
            <p slot class="${slotClassName}">${slotText}</p>
        </lf-list-item>            
        `;

        const page = await newSpecPage({
            components: [LfListItem],
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
        it("should have a button prop", async () => {
            // Arrange
            const page = await newSpecPage({
                components: [LfListItem],
                html: `<div></div>`
            });

            const component = page.doc.createElement("lf-list-item");

            // Act
            const setValue = true;
            component.button = setValue;
            page.root.appendChild(component);
            await page.waitForChanges();

            // Assert
            expect(page.rootInstance.button).toBe(setValue);
        });

        it("should have a disabled prop", async () => {
            // Arrange 
            const page = await newSpecPage({
                components: [LfListItem],
                html: `<div></div>`
            });

            const component = page.doc.createElement("lf-list-item");

            // Act
            const setValue = true;
            component.disabled = setValue;
            page.root.appendChild(component);
            await page.waitForChanges();

            // Assert
            expect(page.rootInstance.disabled).toBe(setValue);
        });

        it("should have an active prop", async () => {
            // Arrange 
            const page = await newSpecPage({
                components: [LfListItem],
                html: `<div></div>`
            });

            const component = page.doc.createElement("lf-list-item");

            // Act
            const setValue = true;
            component.active = setValue;
            page.root.appendChild(component);
            await page.waitForChanges();

            // Assert
            expect(page.rootInstance.active).toBe(setValue);
        });

        it("should have a context property", async () => {
            // Arrange
            const page = await newSpecPage({
                components: [LfListItem],
                html: `<div></div>`
            });

            const component = page.doc.createElement("lf-list-item");

            // Act
            const setValue = "/test/url?params=true";
            component.href = setValue;
            page.root.appendChild(component);
            await page.waitForChanges();

            // Assert
            expect(page.rootInstance.href).toBe(setValue);
        });

        it("should have a rel property", async () => {
            // Arrange
            const page = await newSpecPage({
                components: [LfListItem],
                html: `<div></div>`
            });

            const component = page.doc.createElement("lf-list-item");

            // Act
            const setValue = "nofollow";
            component.rel = setValue;
            page.root.appendChild(component);
            await page.waitForChanges();

            // Assert
            expect(page.rootInstance.rel).toBe(setValue);
        });

        it("should have a target property", async () => {
            // Arrange
            const page = await newSpecPage({
                components: [LfListItem],
                html: `<div></div>`
            });

            const component = page.doc.createElement("lf-list-item");

            // Act
            const setValue = "_self";
            component.target = setValue;
            page.root.appendChild(component);
            await page.waitForChanges();

            // Assert
            expect(page.rootInstance.target).toBe(setValue);
        });

        // it("should have a type property", async () => {
        //     // Arrange
        //     const page = await newSpecPage({
        //         components: [LfListItem],
        //         html: `<div></div>`
        //     });

        //     const component = page.doc.createElement("lf-list-item");

        //     // Act
        //     const setValue = "reset";
        //     component.target = setValue;
        //     page.root.appendChild(component);
        //     await page.waitForChanges();

        //     // Assert
        //     expect(page.rootInstance.type).toBe(setValue);
        // });

        it("should have a type property", async () => {
            // Arrange
            const page = await newSpecPage({
                components: [LfListItem],
                html: `<div></div>`
            });


            const component = page.doc.createElement("lf-list-item");

            // Act
            const setValue = "submit";
            component.type = setValue;
            page.root.appendChild(component);
            await page.waitForChanges();

            // Assert
            expect(page.rootInstance.type).toBe(setValue);
        });
    });

});
