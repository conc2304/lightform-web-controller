import { LfConf } from "../../../global/resources";
import { SignalStrength } from "../../../shared/enums/wifi-signal-strength.enum";
import { LfWifiListItem } from "../lf-wifi-list-item.component";

describe("LfWifiListItem", () => {
  it("should build", () => {
    expect(new LfWifiListItem()).toBeTruthy;
  });

  describe("should return correct icon file", () => {

    const component = new LfWifiListItem();

    expect(component["getNetworkIconPath"](SignalStrength.Strong)).toContain(`network-3bars.svg`);
    expect(component["getNetworkIconPath"](SignalStrength.OK)).toContain(`network-2bars.svg`);
    expect(component["getNetworkIconPath"](SignalStrength.Weak)).toContain(`network-1bars.svg`);
  });
})
