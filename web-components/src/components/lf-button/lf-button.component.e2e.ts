import { newE2EPage } from "@stencil/core/testing";

fdescribe("lf-button", () => {
    it("renders", async () => {
        const page = await newE2EPage();

        await page.setContent("<lf-button></lf-button>");
        const element = await page.find("lf-button");
        expect(element).toHaveClass("hydrated");
    })
})
