import { newE2EPage } from "@stencil/core/testing";

describe("lf-registration-registering", () => {
  it("renders", async () => {
    const page = await newE2EPage();
    await page.setContent("<lf-registration-registering></lf-registration-registering>")

    const element = await page.find("lf-registration-registering");
    expect(element).toHaveClass("hydrated");
  });

});
