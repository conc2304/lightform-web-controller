// Library Imports
import { Component, h, State, Listen } from '@stencil/core';

// App Imports
import { WifiEntry } from '../../shared/interfaces/wifi-entry.interface';

enum PairingFlowViewState {
  SelectWifiList,
  EnterPassword,
  Connecting,
}
@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss',
})
export class AppHome {
  @State() pairingState: PairingFlowViewState = PairingFlowViewState.SelectWifiList;
  @State() selectedPairingNetwork: WifiEntry;

  @Listen('networkSelected')
  networkSelectedHandler(event: CustomEvent) {
    this.selectedPairingNetwork = event.detail as WifiEntry;
    this.pairingState = PairingFlowViewState.EnterPassword;

    console.log(this.selectedPairingNetwork);
  }

  render() {
    return (
      <ion-content>
        <div class="wifi-list--page-container">
          <div class="wifi-list--card">
            <div class="wifi-list--content">
              <div class="wifi-list--header-container">
                <div class="wifi-list--header-text">Internet Settings</div>
                <div class="wifi-list--header-divider"></div>
              </div>

              <div class="wifi-list--items-container scrollable-content">{this.renderWifiPairingContent()}</div>
            </div>
          </div>
        </div>
      </ion-content>
    );
  }

  private renderWifiPairingContent() {
    console.log("render network", this.selectedPairingNetwork);
    if (this.pairingState === PairingFlowViewState.SelectWifiList) {
      return <lf-wifi-list></lf-wifi-list>;
    } else if (this.pairingState === PairingFlowViewState.EnterPassword && this.selectedPairingNetwork) {
      return <lf-wifi-password test={this.selectedPairingNetwork.wifiName} pairing-network={this.selectedPairingNetwork}></lf-wifi-password>;
    } else if (this.pairingState === PairingFlowViewState.Connecting) {
      return <lf-wifi-connecting></lf-wifi-connecting>;
    }

  //   switch (this.pairingState) {
  //     case PairingFlowViewState.SelectWifiList:
  //       return <lf-wifi-list></lf-wifi-list>;
  //     case PairingFlowViewState.EnterPassword:
  //       return <lf-wifi-password test={this.selectedPairingNetwork.wifiName} pairing-network={this.selectedPairingNetwork}></lf-wifi-password>;
  //     case PairingFlowViewState.Connecting:
  //       return <lf-wifi-connecting></lf-wifi-connecting>;
  //     default:
  //       return <lf-wifi-list></lf-wifi-list>;
  //   }
  }
}
