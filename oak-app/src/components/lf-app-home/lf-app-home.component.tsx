// ==== Library Imports =======================================================
import { Component, h, Element, Host, Prop, Event, EventEmitter, State } from '@stencil/core';
import { RouterHistory } from '@stencil/router';

// ==== App Imports ===========================================================
import LfLoggerService from '../../shared/services/lf-logger.service';
import lfNetworkConnectionService from '../../shared/services/lf-network-connection.service';

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
  @State() deviceConnected = false;
  @State() device = {
    name: 'Frantic Elderberry',
    serial: 'LF2PL007',
    firmwareVersion: 'X.XX.XXX',
  };
  @State() networkStatus = {
    ssid: 'TEMP',
    state: 'temp',
  };

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() history: RouterHistory;

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

    //
  }

  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public componentDidLoad(): void {
    this.log.debug('componentDidLoad');

    // TODO - implement a call to ask the android back end where we are supposed to go
    // in the mean time redirect the user to pairing
    setTimeout(() => {
      // this.history.push('/registration');
      // this.appRouteChanged.emit('registration'); // TODO this needs to be changed before production
    }, 1000);
  }

  // ==== LISTENERS SECTION =====================================================================

  // ==== PUBLIC METHODS API - @Method() SECTION ================================================

  // ==== LOCAL METHODS SECTION =================================================================
  private async getNetworkState() {
    this.log.debug('getNetworkState');

    lfNetworkConnectionService
      .fetchNetworkState()
      .then(networkState => {
        this.log.debug('getNetworkState - then');
        this.log.debug(networkState);

        if (!networkState) {
          throw new Error('No Network Response Received.');
        }
        if (!Array.isArray(networks)) {
          throw new Error('Network list is not iterable');
        }
        if (!networks.length) {
          throw new Error('No Networks available');
        }
      })
      .catch(e => {
        throw new Error(e);
      });
  }

  // ==== RENDERING SECTION =====================================================================

  private renderNetworkStatusInfo() {
    const networkDisplayText = this.networkStatus.state === 'connected' && this.networkStatus.ssid ? this.networkStatus.ssid : 'Attempting to connect to Wi-Fi';

    const image = this.deviceConnected ? 'wi-f-connected-green.svg' : 'wi-fi-disconnected-yellow.svg';
    const imageAssetPath = `./assets/images/icons/${image}`;

    return [
      <div class="device-info--label">Network</div>,
      <div class="device-info--value network">
        <img class="network-state--img" src={imageAssetPath} />
        <span class="network-state--text">{networkDisplayText}</span>
      </div>,
    ];
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
            <div class="device-details--container">
              <div class="device-info--label">Device Name</div>
              <div class="device-info--value">{this.device.name}</div>
            </div>
            <div class="device-details--container">{this.renderNetworkStatusInfo()}</div>
            <div class="device-details--container">
              <div class="device-info--label">Firmware Version</div>
              <div class="device-info--value">{this.device.firmwareVersion}</div>
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
