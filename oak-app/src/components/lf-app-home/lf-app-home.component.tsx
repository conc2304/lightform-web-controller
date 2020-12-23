// ==== Library Imports =======================================================
import { Component, h, Element, Host, Prop, Event } from '@stencil/core';
import { EventEmitter } from 'events';

// ==== App Imports ===========================================================
import LfLoggerService from '../../shared/services/lf-logger.service';

@Component({
  tag: 'lf-app-home',
  styleUrl: 'lf-app-home.component.scss',
})
export class LFPairingApp {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private -------------------------------------------------------------------------------
  private log = new LfLoggerService('LFPairingApp').logger;

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() el: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() animatedBackground = false;
  @Prop() device = {
    name: '**STUB** Lonely Unicorn ', // TODO - API not ready yet
    serial: '**STUB** 2PBETA0010',
  };

  // ==== EVENTS SECTION ========================================================================
  @Event() appRouteChanged: EventEmitter;

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public componentWillLoad(): void {
    this.log.debug('componentWillLoad');

    // TODO - Make a call to ask the android backend for device information ( name, serial, firmware? )

    // TODO - implement a call to ask the android back end where we are supposed to go
    // in the mean time redirect the user to pairing
    setTimeout(() => {
      this.appRouteChanged.emit('pairing');
    }, 6000);
  }

  // ==== LISTENERS SECTION =====================================================================

  // ==== PUBLIC METHODS API - @Method() SECTION ================================================

  // ==== LOCAL METHODS SECTION =================================================================

  // ==== RENDERING SECTION =====================================================================
  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');

    return (
      <Host class="app-home">
        <div class="app-home--page-container">
          <div class="hero--container">
            <img class="hero--logo" src="assets/images/logos/Logomark White.svg"></img>
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
            To get started, visit <strong>lightform.com/go</strong>
          </div>
        </div>
      </Host>
    );
  }
}
