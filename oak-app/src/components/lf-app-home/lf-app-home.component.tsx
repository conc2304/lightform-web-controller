// ==== Library Imports =======================================================
import { Component, h, Element, Host, Prop, Event, EventEmitter } from '@stencil/core';
import { RouterHistory } from "@stencil/router";


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
  @Prop() history: RouterHistory;
  @Prop() animatedBackground = false;
  @Prop() device;

  // ==== EVENTS SECTION ========================================================================
  @Event() appRouteChanged: EventEmitter;

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public componentWillLoad(): void {
    this.log.debug('componentWillLoad');

    // TODO - Make a call to ask the android backend for device information ( name, serial, firmware? )

    // TODO - implement a call to ask the android back end where we are supposed to go
    // in the mean time redirect the user to pairing
    // setTimeout(() => {
    //   this.history.push('/registration');
    //   // this.appRouteChanged.emit('registration'); // TODO this needs to be changed before production
    // }, 1000);
  }

  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public componentDidLoad(): void {
    this.log.debug('componentDidLoad');

    // TODO - Make a call to ask the android backend for device information ( name, serial, firmware? )

    // TODO - implement a call to ask the android back end where we are supposed to go
    // in the mean time redirect the user to pairing
    setTimeout(() => {
      this.history.push('/registration');
      // this.appRouteChanged.emit('registration'); // TODO this needs to be changed before production
    }, 1000);
  }

  // ==== LISTENERS SECTION =====================================================================

  // ==== PUBLIC METHODS API - @Method() SECTION ================================================

  // ==== LOCAL METHODS SECTION =================================================================

  // ==== RENDERING SECTION =====================================================================
  private renderDeviceName() {
    this.log.debug('renderDeviceName');

    if (this.device?.name) {
      return (
        <div class="device-details--container">
          <div class="device-info--label">Device Name</div>
          <div class="device-info--value">{this.device.name}</div>
        </div>
      );
    }
  }

  private renderDeviceSerial() {
    this.log.debug('renderDeviceSerial');

    if (this.device?.serial) {
      return (
        <div class="device-info--container">
          <div class="device-info--label">Serial Number</div>
          <div class="device-info--value">{this.device.serial}</div>
        </div>
      );
    }
  }

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
            {this.renderDeviceName()}
            {this.renderDeviceSerial()}
          </div>

          <div class="cta--container">
            To get started, visit <strong>lightform.com/go</strong>
          </div>
        </div>
      </Host>
    );
  }
}
