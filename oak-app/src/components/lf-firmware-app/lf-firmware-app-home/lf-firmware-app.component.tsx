// ==== Library Imports =======================================================
import { Component, h, Element, State, Listen, Host } from '@stencil/core';

// ==== App Imports ===========================================================
import { LfAppState } from '../../../shared/services/lf-app-state.service';

@Component({
  tag: 'lf-firmware-app',
  styleUrl: 'lf-firmware-app.component.scss',
})
export class LfFirmwareApp {
  // ==== OWN PROPERTIES SECTION =======================================================================
  // Dependency Injections
  private lfAppState = LfAppState;

  // Getters/Setters

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() el: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  // @State() pairingState: FlowState = FlowState.SelectWifiList;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================

  // ==== EVENTS SECTION ========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentDidLoad Implementation - - - - - - - - - - - - - - - - - - - - -
  public componentWillRender(): void {
    console.log('componentWillRender');

  }
  // ==== LISTENERS SECTION =====================================================================

  // @Listen('networkSelected')
  // onNetworkSelected(event: CustomEvent) {
  //   console.log('onNetworkSelected');

  // }


  // ==== PUBLIC METHODS API - @Method() SECTION ========================================================
  // @Method()
  // async publicMethod(): Promise<void> {return}

  // ==== LOCAL METHODS SECTION =========================================================================

  // ==== RENDERING SECTION =========================================================================
  private renderFirmwareUpdateContent() {
    console.log('renderWifiPairingContent');
    return (
      <div class="firmware-update--container">
        {/* start status container */}
        <div class="firmware-update--status-container animation--pop-in center-and-shrink" style={{ '--animation-order': 1 } as any}>
          <div class="firmware-update--points">
            <div class="firmware-update--img-frame">
              <img src="assets/images/logos/Logomark Black@60px.svg" class="firmware-update--img"></img>
            </div>
            <p>Firm</p>
          </div>

          <div class="firmware-update--status-wrapper">STATUS ICONS</div>

          <div class="firmware-update--points">
            <div class="firmware-update--img-frame">
              <img src="assets/images/icons/globe.svg" class="firmware-update--img"></img>
            </div>
            <p>Internet</p>
          </div>
        </div>
        {/* end status container */}

        <div class="firmware-update--status-msg-container animation--pop-in center-and-shrink" style={{ '--animation-order': 2 } as any}>
          STATUS MESSAGE
        </div>

        <div class="firmware-update--action-btn-container animation--pop-in" style={{ '--animation-order': 3 } as any}>
        </div>
      </div>
    );
  }

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    return (
      <Host class="lf-pairing-app appflow-container">
        <lf-card cardTitle="Firmware Update">{this.renderFirmwareUpdateContent()}</lf-card>
      </Host>
    );
  }
}
