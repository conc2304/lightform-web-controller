// ==== Library Imports =======================================================
import { Component, h, State, Listen } from "@stencil/core";

// ==== App Imports ===========================================================
import { WifiEntry } from "../../shared/interfaces/wifi-entry.interface";
import { LfAppState } from "../../shared/services/lf-app-state.service";
import { LfPairingFlowViewState as FlowState } from "../../shared/enums/lf-pairing-flow-state.enum";

@Component({
  tag: "app-home",
  styleUrl: "app-home.scss",
})
export class AppHome {
  private lfAppState = LfAppState;
  // ==== OWN PROPERTIES SECTION =======================================================================
  // Dependency Injections

  // Getters/Setters

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  // @Element() el: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() pairingState: FlowState = FlowState.SelectWifiList;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================

  // ==== EVENTS SECTION ========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentDidLoad Implementation - - - - - - - - - - - - - - - - - - - - -
  public componentWillRender(): void {
    console.group("componentWillRender");

    try {
      if (!this.lfAppState.selectedNetwork) {
        this.pairingState = FlowState.SelectWifiList;
      }
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }
  // ==== LISTENERS SECTION =====================================================================

  @Listen("networkSelected")
  onNetworkSelected(event: CustomEvent) {
    console.group("onNetworkSelected");
    try {
      const selectedNetwork = event.detail as WifiEntry;
      this.lfAppState.selectedNetwork = selectedNetwork;
      this.pairingState = this.lfAppState.pairingFlowState = FlowState.EnterPassword;
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  @Listen("passwordSubmitted")
  onPasswordSubmitted(event: CustomEvent) {
    console.group("onPasswordSubmitted");
    try {
      const submittedPassword = event.detail;
      this.lfAppState.submittedPassword = submittedPassword;
      this.pairingState = this.lfAppState.pairingFlowState = FlowState.Connecting;
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  @Listen("restartPairingProcess")
  onRestartPairingProcess() {
    console.group("restartPairingProcess");

    try {
      this.pairingState = this.lfAppState.pairingFlowState = FlowState.SelectWifiList;
      this.lfAppState.submittedPassword = null;
      this.lfAppState.selectedNetwork = null;

      console.log(this.pairingState, FlowState.Connecting);
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ========================================================
  // @Method()
  // async publicMethod(): Promise<void> {return}

  // ==== LOCAL METHODS SECTION =========================================================================

  // ==== RENDERING SECTION =========================================================================
  private renderWifiPairingContent() {
    console.group("renderWifiPairingContent");
    try {
      if (this.pairingState === FlowState.SelectWifiList) {
        return <lf-wifi-list></lf-wifi-list>;
      } else if (this.pairingState === FlowState.EnterPassword && this.lfAppState.selectedNetwork) {
        return (
          <lf-wifi-password networkName={this.lfAppState.selectedNetwork.wifiName}></lf-wifi-password>
        );
      } else if (this.pairingState === FlowState.Connecting) {
        return <lf-wifi-connecting></lf-wifi-connecting>;
      } else {
        return <lf-wifi-list></lf-wifi-list>;
      }
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    console.group("render");
    try {
      return (
        <ion-content>
          <div class="device-pairing--page-container">
            <div class="device-pairing--card">
              <div class="device-pairing--content">
                <div class="device-pairing--header-container">
                  <div class="device-pairing--header-text">Internet Settings</div>
                  <div class="device-pairing--header-divider"></div>
                </div>

                <div class="device-pairing--content-container">{this.renderWifiPairingContent()}</div>
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
}
