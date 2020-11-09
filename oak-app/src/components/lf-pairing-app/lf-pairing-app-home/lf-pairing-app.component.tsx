// ==== Library Imports =======================================================
import { Component, h, Element, State, Listen, Host } from '@stencil/core';

// ==== App Imports ===========================================================
import { WifiEntry } from '../../../shared/interfaces/wifi-entry.interface';
import { LfAppState } from '../../../shared/services/lf-app-state.service';
import { LfPairingFlowViewState as FlowState } from '../../../shared/enums/lf-pairing-flow-state.enum';

@Component({
  tag: 'lf-pairing-app',
  styleUrl: 'lf-pairing-app.component.scss',
})
export class LfPairingApp {
  // ==== OWN PROPERTIES SECTION =======================================================================
  // Dependency Injections
  private lfAppState = LfAppState;

  // Getters/Setters

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() el: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() pairingState: FlowState = FlowState.SelectWifiList;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================

  // ==== EVENTS SECTION ========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentDidLoad Implementation - - - - - - - - - - - - - - - - - - - - -
  public componentWillRender(): void {
    console.log('componentWillRender');

    if (!this.lfAppState.selectedNetwork) {
      this.pairingState = FlowState.SelectWifiList;
    }
  }
  // ==== LISTENERS SECTION =====================================================================

  @Listen('networkSelected')
  onNetworkSelected(event: CustomEvent) {
    console.log('onNetworkSelected');
    const selectedNetwork = event.detail as WifiEntry;
    const security = selectedNetwork.security;
    const networkSecure = !(security == undefined || security.toUpperCase() == 'UNSECURED');

    this.lfAppState.pairingFlowState = networkSecure ? FlowState.EnterPassword : FlowState.Connecting;
    this.lfAppState.selectedNetwork = selectedNetwork;
    this.pairingState = this.lfAppState.pairingFlowState;
  }

  @Listen('passwordSubmitted')
  onPasswordSubmitted(event: CustomEvent) {
    console.log('onPasswordSubmitted');
    const password = event.detail;
    this.lfAppState.password = password;
    this.pairingState = this.lfAppState.pairingFlowState = FlowState.Connecting;
  }

  @Listen('restartPairingProcess')
  onRestartPairingProcess() {
    console.log('onRestartPairingProcess');

    this.pairingState = this.lfAppState.pairingFlowState = FlowState.SelectWifiList;
    this.lfAppState.password = null;
    this.lfAppState.selectedNetwork = null;
  }

  @Listen('restartPasswordProcess')
  onRestartPasswordProcess() {
    console.log('onRestartPasswordProcess');

    this.pairingState = this.lfAppState.pairingFlowState = FlowState.EnterPassword;
    this.lfAppState.password = null;
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ========================================================
  // @Method()
  // async publicMethod(): Promise<void> {return}

  // ==== LOCAL METHODS SECTION =========================================================================

  // ==== RENDERING SECTION =========================================================================
  private renderWifiPairingContent() {
    console.log('renderWifiPairingContent');
    if (this.pairingState === FlowState.SelectWifiList) {
      return <lf-wifi-list></lf-wifi-list>;
    } else if (this.pairingState === FlowState.EnterPassword && this.lfAppState.selectedNetwork) {
      return <lf-wifi-password networkName={this.lfAppState.selectedNetwork.ssid}></lf-wifi-password>;
    } else if (this.pairingState === FlowState.Connecting) {
      return <lf-wifi-connecting></lf-wifi-connecting>;
    } else {
      return <lf-wifi-list></lf-wifi-list>;
    }
  }

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    return (
      <Host class="lf-pairing-app appflow-container">
        <lf-card cardTitle="Network Settings">{this.renderWifiPairingContent()}</lf-card>
      </Host>
    );
  }
}
