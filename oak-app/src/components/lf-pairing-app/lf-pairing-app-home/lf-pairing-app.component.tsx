// ==== Library Imports =======================================================
import { Component, h, Element, State, Listen, Host } from '@stencil/core';

// ==== App Imports ===========================================================
import { WifiEntry } from '../../../shared/interfaces/wifi-entry.interface';
import { LfAppState } from '../../../shared/services/lf-app-state.service';
import { LfPairingFlowViewState as FlowState } from '../../../shared/enums/lf-pairing-flow-state.enum';
import LfLoggerService from '../../../shared/services/lf-logger.service';

@Component({
  tag: 'lf-pairing-app',
  styleUrl: 'lf-pairing-app.component.scss',
})
export class LfPairingApp {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private -------------------------------------------------------------------------------
  private log = new LfLoggerService('LfPairingApp').logger;

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
    this.log.debug('componentWillRender');

    if (!LfAppState.selectedNetwork) {
      this.pairingState = FlowState.SelectWifiList;
    }
  }
  // ==== LISTENERS SECTION =====================================================================

  @Listen('networkSelected')
  onNetworkSelected(event: CustomEvent) {
    this.log.debug('onNetworkSelected');
    const selectedNetwork = event.detail as WifiEntry;
    const security = selectedNetwork.security;
    const networkSecure = !(security == undefined || security.toUpperCase() == 'UNSECURED');

    LfAppState.pairingFlowState = networkSecure ? FlowState.EnterPassword : FlowState.Connecting;
    LfAppState.selectedNetwork = selectedNetwork;
    this.pairingState = LfAppState.pairingFlowState;
  }

  @Listen('passwordSubmitted')
  onPasswordSubmitted(event: CustomEvent) {
    this.log.debug('onPasswordSubmitted');
    const password = event.detail;
    LfAppState.password = password;
    this.pairingState = LfAppState.pairingFlowState = FlowState.Connecting;
  }

  @Listen('restartPairingProcess')
  onRestartPairingProcess() {
    this.log.debug('onRestartPairingProcess');

    this.pairingState = LfAppState.pairingFlowState = FlowState.SelectWifiList;
    LfAppState.password = null;
    LfAppState.selectedNetwork = null;
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ========================================================

  // ==== LOCAL METHODS SECTION =========================================================================

  // ==== RENDERING SECTION =========================================================================
  private renderWifiPairingContent() {
    this.log.debug('renderWifiPairingContent');
    if (this.pairingState === FlowState.SelectWifiList) {
      return <lf-wifi-list></lf-wifi-list>;
    } else if (this.pairingState === FlowState.EnterPassword && LfAppState.selectedNetwork) {
      return <lf-wifi-password networkName={LfAppState.selectedNetwork.ssid}></lf-wifi-password>;
    } else if (this.pairingState === FlowState.Connecting) {
      return <lf-wifi-connecting></lf-wifi-connecting>;
    } else {
      return <lf-wifi-list></lf-wifi-list>;
    }
  }

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');

    return (
      <Host class="lf-pairing-app appflow-container">
        <lf-card cardTitle="Network Settings">{this.renderWifiPairingContent()}</lf-card>
      </Host>
    );
  }
}
