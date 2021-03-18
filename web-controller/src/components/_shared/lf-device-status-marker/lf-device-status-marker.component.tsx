// ==== Library Imports =======================================================
import { Component, Element, h, Host, Prop } from '@stencil/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';

@Component({
  tag: 'lf-device-status-marker',
  styleUrl: 'lf-device-status-marker.component.scss',
  shadow: true,
})
export class LfDeviceStatusMarker {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('LfDeviceStatusMarker').logger;

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() online: boolean;
  @Prop() size: 'small' | 'medium' | 'large' = 'medium'


  // ==== EVENTS SECTION ========================================================================
  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // ==== LISTENERS SECTION =====================================================================
  // ==== PUBLIC METHODS API - @Method() SECTION ================================================
  // ==== LOCAL METHODS SECTION =================================================================

  // ==== RENDERING SECTION =====================================================================
  // - -  render Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - - - - - - - - -
  render() {
    try {
      this.log.debug('render');
      return <Host class={`lf-device-status-marker size--${this.size} status--${this.online ? 'online' : 'offline'}`} ></Host>;
    } catch (error) {
      this.log ? this.log.error(error) : console.error(error);
      return '';
    }
  }
}
