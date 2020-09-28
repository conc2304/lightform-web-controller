import { newSpecPage } from '@stencil/core/testing';
import { LfWifiPassword } from '../lf-wifi-password.component';

describe('lf-wifi-password', () => {
  it("should build", () => {
    expect(new LfWifiPassword()).toBeTruthy;
  });
});
