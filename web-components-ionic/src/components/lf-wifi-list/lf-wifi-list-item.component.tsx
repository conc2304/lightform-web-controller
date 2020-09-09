// Library Imports
import { Component, h, Prop, Element } from '@stencil/core';

// App Imports
import { SignalStrength } from './wifi-signal-strength.enum';

@Component({
  tag: 'lf-wifi-list-item',
  styleUrl: 'lf-wifi-list-item.component.scss',
  shadow: true,
})
export class LfWifiListItem {
  @Prop() passwordProtected!: boolean;
  @Prop() networkName!: string;
  @Prop() signalStrength!: SignalStrength;
  @Prop() index?: number;

  @Element() element: HTMLElement;

  componentWillLoad() {
    console.log(this.index, this.networkName);
    if (this.index === 0) {
      console.log("focus", this.networkName);
      this.element.focus();
    }
  }

  render() {
    const iconPath = '/assets/images/icons/';
    return (
      <div class="wifi-list-item" tabindex="0">
        <div class="list-item--inner-wrapper">
          <div slot="start" class="list-item--network-name">{this.networkName}</div>
          <div slot="end" class="list-item--icons-wrapper">
            <div class="list-item--network-strength-icon">
              <ion-img src={getNetworkIconPath(this.signalStrength)}></ion-img>
            </div>
            <div class="list-item--secure-ion">
              <ion-img src={getLockIconPath(this.passwordProtected)}></ion-img>
            </div>
          </div>
        </div>
      </div>
    );

    function getLockIconPath(locked: boolean): string {
      const iconImageFile = locked ? 'Lock.svg' : 'Unlock.svg';
      const resolvedFilePath = `${iconPath}${iconImageFile}`;
      return resolvedFilePath;
    }

    function getNetworkIconPath(signalStrength: SignalStrength): string {
      let wifiSignalFile: string;

      switch (signalStrength) {
        case SignalStrength.Strong:
          wifiSignalFile = 'network-3bars.svg';
          break;
        case SignalStrength.OK:
          wifiSignalFile = 'network-2bars.svg';
          break;
        case SignalStrength.Weak:
          wifiSignalFile = 'network-1bar.svg';
          break;
      }
      const resolvedFilePath = `${iconPath}${wifiSignalFile}`;

      return resolvedFilePath;
    }
  }
}
