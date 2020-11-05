import { E2EPage, newE2EPage } from '@stencil/core/testing';
// import { WifiEntry } from '../../../shared/interfaces/wifi-entry.interface';

// const stubNetwork: WifiEntry = {
//   ssid: "Lf Wifi Name",
//   signal: 40,
//   security: "Wpa2",
//   uuid: "",
// }

describe("lf-wifi-list-item", () => {

  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
  });

  it("should render without props", async () => {

    await page.setContent(`
      <lf-wifi-list-item class="wifi-list-item"></lf-wifi-list-item>
    `);

    const listItemEl = await page.find("lf-wifi-list-item");
    expect(listItemEl).not.toBeNull();
    expect(listItemEl).toHaveClasses(["hydrated", "wifi-list-item"]);
  });

  it("should render with data", async () => {

    await page.setContent(`
      <lf-wifi-list-item passwordProtected="test" networkName="test" signalStrength="teset"></lf-wifi-list-item>
    `);

    await page.waitForChanges();


    const listItemEl = await page.find("lf-wifi-list-item");
    const networkNameEl = await page.find("lf-wifi-list-item >>> .list-item--network-name");

    expect(networkNameEl.innerHTML).toContain("test");

    expect(listItemEl).toHaveClass("hydrated");
    expect(listItemEl).not.toBeNull();
  });

});
