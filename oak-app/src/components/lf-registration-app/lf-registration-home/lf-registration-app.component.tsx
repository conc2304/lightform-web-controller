// ==== Library Imports =======================================================
import { Component, h, Element, State, Listen, Host } from '@stencil/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';

type RegistrationFlowState = 'input' | 'registering';

@Component({
  tag: 'lf-registration-app',
  styleUrl: 'lf-registration-app.component.scss',
})
export class LfRegistrationApp {
  // ==== OWN PROPERTIES SECTION ==================================================================
  // ---- Private ---------------------------------------------------------------------------------
  private log = new LfLoggerService('LfRegistrationApp').logger;

  // ==== HOST HTML REFERENCE =====================================================================
  @Element() el: HTMLElement;

  // ==== State() VARIABLES SECTION ===============================================================
  @State() registrationState: RegistrationFlowState = 'input';
  @State() registrationCode: string = null;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ====================================================
  // ==== EVENTS SECTION ==========================================================================
  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================
  // ==== LISTENERS SECTION =======================================================================

  @Listen('registrationCodeCompleted')
  onRegistrationCodeCompleted(event: CustomEvent) {
    this.log.debug('onRegistrationCodeCompleted');
    this.registrationCode = event.detail;
    this.registrationState = 'registering';
  }

  @Listen('restartDeviceRegistration')
  onRestartDeviceRegistration() {
    this.log.debug('onRestartDeviceRegistration');
    this.registrationState = 'input';
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ==================================================

  // ==== LOCAL METHODS SECTION ===================================================================

  // ==== RENDERING SECTION =======================================================================
  private renderWifiPairingContent() {
    this.log.debug('renderWifiPairingContent');

    if (this.registrationState === 'input') {
      return <lf-registration-input />;
    } else if (this.registrationState === 'registering' && this.registrationCode) {
      return <lf-registration-registering registration-code={this.registrationCode} />;
    } else {
      return <lf-registration-input />;
    }
  }

  // - -  render Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');

    return (
      <Host class="lf-pairing-app app-flow-container">
        <lf-card cardTitle="Add device to your account">{this.renderWifiPairingContent()}</lf-card>
      </Host>
    );
  }
}
