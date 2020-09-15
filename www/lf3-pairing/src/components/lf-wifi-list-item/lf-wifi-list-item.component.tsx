// Library Imports
import { Component, h, Prop, Element } from '@stencil/core';

// App Imports
import { SignalStrength } from '../../shared/enums/wifi-signal-strength.enum';

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
    if (this.index === 0) {
      this.element.focus();
    }
  }

  render() {
    const iconPath = '/assets/images/icons/';
    return (
      <div class="wifi-list-item">
        <div class="list-item--inner-wrapper">
          <div class="list-item--network-name">{this.networkName}</div>
          <div class="list-item--icons-container">
            <div class="list-item--icon-wrapper">{renderNetworkStrengthIcon(this.signalStrength)}</div>
            <div class="list-item--icon--wrapper">{renderLockIcon(this.passwordProtected)}</div>
          </div>
        </div>
      </div>
    );

    function renderLockIcon(protectedNetwork: boolean): HTMLElement {
      const iconImageFile = protectedNetwork ? 'Lock.svg' : 'Unlock.svg';
      const resolvedFilePath = `${iconPath}${iconImageFile}`;
      if (protectedNetwork) {
        return <ion-img class="list-item--icon" alt="protected network" src={resolvedFilePath}></ion-img>;
      } else {
        return <div class="list-item--icon"></div>;
      }
    }

    function renderNetworkStrengthIcon(signalStrength: SignalStrength) {
      return <ion-img class="list-item--icon" src={getNetworkIconPath(signalStrength)} alt={`${signalStrength} Signal Strength}`}></ion-img>;
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
