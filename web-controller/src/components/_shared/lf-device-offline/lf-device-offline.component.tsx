// ==== Library Imports =======================================================
import { Component, Element, h, Host, Prop } from '@stencil/core';

// ==== App Imports ===========================================================
import { formatDateStringToLocalString } from '../../../shared/services/lf-utils.service';
import LfLoggerService from '../../../shared/services/lf-logger.service';

@Component({
  tag: 'lf-device-offline',
  styleUrl: 'lf-device-offline.component.scss',
  shadow: true,
})
export class LfErrorCMessage {
  // ==== OWN PROPERTIES SECTION ==================================================================
  // ---- Private  --------------------------------------------------------------------------------
  private log = new LfLoggerService('LfDeviceOffline').logger;

  // ==== HOST HTML REFERENCE =====================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION ===============================================================
  // ==== PUBLIC PROPERTY API - Prop() SECTION ====================================================
  @Prop() deviceName: string;
  @Prop() offlineSince: string;

  // ==== EVENTS SECTION ==========================================================================
  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================
  // ==== LISTENERS SECTION =======================================================================
  // ==== PUBLIC METHODS API - @Method() SECTION ==================================================

  // ==== LOCAL METHODS SECTION ===================================================================

  private offlineSinceFormatted(): string {
    if (this.offlineSince) {
      return formatDateStringToLocalString(this.offlineSince);
    }
  }

  // ==== RENDERING SECTION =======================================================================
  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');

    return (
      <Host class="lf-device-offline--container">
        <img class="lf-device-offline--img" src="/assets/images/LF2_plus.png" alt="LF2+ Offline" />
        <h3>
          <strong>{this.deviceName || 'Your Device'} is offline </strong> <br />
          since {this.offlineSinceFormatted()}
        </h3>
      </Host>
    );
  }
}
