// ==== Library Imports =======================================================
import { Component, h, Element, Host, Prop, Event } from '@stencil/core';
import { RouterHistory } from '@stencil/router';
import { EventEmitter } from 'events';

// ==== App Imports ===========================================================
import { LfAppRoute } from '../../shared/enums/lf-app-routes.enum';

@Component({
  tag: 'lf-app-home',
  styleUrl: 'lf-app-home.component.scss',
})
export class LFPairingApp {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private -------------------------------------------------------------------------------
  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() el: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() animatedBackground = false;
  @Prop() device = {
    name: 'Glamorous Leafhopper',
    serial: '2PBETA0010',
  };

  @Prop() history: RouterHistory;

  // ==== EVENTS SECTION ========================================================================
  @Event() appRouteChanged: EventEmitter;

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentDidLoad Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public componentWillLoad(): void {
    console.log('componentWillLoad');

    // TODO - Make a call to ask the android backend for device information ( name, serial, firmware? )

    // TODO - implement a call to ask the android back end where we are supposed to go
    // in the mean time redirect the user to pairing
    setTimeout(() => {
      this.appRouteChanged.emit("pairing");
    }, 4000);
  }

  // - -  componentDidRender Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public componentDidRender(): void {
    console.log('componentDidRender');
  }

  // ==== LISTENERS SECTION =====================================================================

  // ==== PUBLIC METHODS API - @Method() SECTION ========================================================

  // ==== LOCAL METHODS SECTION =========================================================================

  // ==== RENDERING SECTION =========================================================================
  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
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
