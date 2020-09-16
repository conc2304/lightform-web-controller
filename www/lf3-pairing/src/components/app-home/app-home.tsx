// ==== Library Imports =======================================================
import { Component, h, State, Listen } from "@stencil/core";

// ==== App Imports ===========================================================
import { WifiEntry } from "../../shared/interfaces/wifi-entry.interface";
import { LfAppState } from "../../shared/services/lf-app-state.service";

enum PairingFlowViewState {
  SelectWifiList,
  EnterPassword,
  Connecting,
}

@Component({
  tag: "app-home",
  styleUrl: "app-home.scss",
})
export class AppHome {
  private lfAppState = LfAppState;

  // ==== PUBLIC ============================================================
  // ---- Properties --------------------------------------------------------

  @State() pairingState: PairingFlowViewState =
    PairingFlowViewState.SelectWifiList;
  @State() selectedPairingNetwork: WifiEntry;

  @Listen("networkSelected")
  networkSelectedHandler(event: CustomEvent) {
    console.group("networkSelectedHandler");
    try {
      const selectedNetwork = event.detail as WifiEntry;
      this.lfAppState.selectedNetwork = selectedNetwork;
      this.pairingState = PairingFlowViewState.EnterPassword;
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  // Getters/Setters

  // ---- Methods -----------------------------------------------------------

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - -
  public render() {
    console.group("render");
    try {
      return (
        <ion-content>
          <div class="wifi-list--page-container">
            <div class="wifi-list--card">
              <div class="wifi-list--content">
                <div class="wifi-list--header-container">
                  <div class="wifi-list--header-text">Internet Settings</div>
                  <div class="wifi-list--header-divider"></div>
                </div>

                <div class="wifi-list--items-container scrollable-content">
                  {this.renderWifiPairingContent()}
                </div>
              </div>
            </div>
          </div>
        </ion-content>
      );
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - -
  public componentWillLoad() {}

  // ==== PROTECTED =========================================================
  // ---- Properties --------------------------------------------------------
  // ---- Methods -----------------------------------------------------------

  // ==== PRIVATE ===========================================================
  // ---- Properties --------------------------------------------------------

  // Getter/Setter backing variables and defaults

  // ---- Methods -----------------------------------------------------------
  private renderWifiPairingContent() {
    console.group("renderWifiPairingContent");
    try {
      console.log("render network", this.lfAppState.selectedNetwork);
      if (this.pairingState === PairingFlowViewState.SelectWifiList) {
        return <lf-wifi-list></lf-wifi-list>;
      } else if (
        this.pairingState === PairingFlowViewState.EnterPassword &&
        this.lfAppState.selectedNetwork
      ) {
        return (
          <lf-wifi-password
            networkName={this.lfAppState.selectedNetwork.wifiName}
          ></lf-wifi-password>
        );
      } else if (this.pairingState === PairingFlowViewState.Connecting) {
        return <lf-wifi-connecting></lf-wifi-connecting>;
      }
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }
}
