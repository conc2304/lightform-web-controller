// ==== Library Imports =======================================================
import { Component, h, Element, Host, Prop } from '@stencil/core';

// ==== App Imports ===========================================================

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.component.scss',
})
export class PairingApp {
  // ==== OWN PROPERTIES SECTION =======================================================================
  // Dependency Injections

  // Getters/Setters

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() el: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  // @State() pairingState: FlowState = FlowState.SelectWifiList;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() animatedBackground = false;
  @Prop() device = {
    name: 'Glamorous Leafhopper',
    serial: '2PBETA0010',
  };

  // ==== EVENTS SECTION ========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentDidLoad Implementation - - - - - - - - - - - - - - - - - - - - -
  public componentWillRender(): void {
    console.log('componentWillRender');
  }
  // ==== LISTENERS SECTION =====================================================================

  // @Listen('networkSelected')
  // onNetworkSelected(event: CustomEvent) {
  // }

  // ==== PUBLIC METHODS API - @Method() SECTION ========================================================
  // @Method()
  // async publicMethod(): Promise<void> {return}

  // ==== LOCAL METHODS SECTION =========================================================================

  // ==== RENDERING SECTION =========================================================================

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    return (
      <Host class="app-home">
        <div class="app-home--page-container">
          <div class="hero--container">
            <img class="hero--logo" src="../../../assets/images/logos/Logomark White.svg"></img>
            <h1>Welcome to Lightform</h1>
          </div>

          <div class="device-info--container">
            <div class="device-details--container">
              <div class="device-info--label">Device Name</div>
              <div class="device-info--value">{this.device.name}</div>
            </div>
            <div class="device-info--container">
              <div class="device-info--label">Serial Number</div>
              <div class="device-info--value">{this.device.serial}</div>
            </div>
          </div>

          <div class="cta--container">
            To get started, visit <a href="lightform.com/go" target="_blank">lightform.com/go</a>
          </div>
        </div>
      </Host>
    );
  }
}
