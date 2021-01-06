import { LfWifiListItem } from '../lf-wifi-list-item.component';

describe('LfWifiListItem', () => {
  it('should build', () => {
    expect(new LfWifiListItem()).toBeTruthy;
  });

  describe('should return correct icon file', () => {
    const component = new LfWifiListItem();

    expect(component['getNetworkIconPath'](80)).toContain(`network-3bars.svg`);
    expect(component['getNetworkIconPath'](50)).toContain(`network-2bars.svg`);
    expect(component['getNetworkIconPath'](30)).toContain(`network-1bars.svg`);
  });
});
