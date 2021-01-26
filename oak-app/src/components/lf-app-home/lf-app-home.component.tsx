// ==== Library Imports =======================================================
import { Component, h, Element, Host, Prop, Event, EventEmitter, State } from '@stencil/core';
import { RouterHistory } from '@stencil/router';
import { LfNetworkConnectionResults } from '../../shared/models/lf-network-connection-results.model';
import { LfActiveInterface, LfDeviceNetworkMode } from '../../shared/models/lf-network-state.model';
import { LfAppState } from '../../shared/services/lf-app-state.service';
import lfFirmwareApiInterfaceService from '../../shared/services/lf-firmware-api-interface.service';

// ==== App Imports ===========================================================
import LfLoggerService from '../../shared/services/lf-logger.service';
import lfNetworkConnectionService from '../../shared/services/lf-network-api-interface.service';
import { firmwareAGreaterThanB } from '../../shared/services/lf-utilities.service';

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
  @State() deviceNameLoading = true;
  @State() networkStateLoading = true;
  @State() firmwareStateLoading = true;
  @State() connectionTestLoading = true;

  @State() connectionResults: LfNetworkConnectionResults = null;
  @State() deviceName: string = null;
  @State() activeNetworkName: string = null;
  @State() activeNetworkInterface: LfActiveInterface = null;
  @State() networkMode: LfDeviceNetworkMode = null;
  @State() currentFirmware: string = null;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() history: RouterHistory;

  // ==== EVENTS SECTION ========================================================================
  @Event() appRouteChanged: EventEmitter;

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async componentWillLoad(): Promise<void> {
    this.log.debug('componentWillLoad');

    await this.getNetworkState();

    if (!this.deviceHasNetworkConnection()) {
      this.history.push('/pairing');
    } else {
      await this.testInternetConnection();
    }

    await this.getFirmwareState();

    if (LfAppState.availableFirmware && LfAppState.currentFirmware) {
      if (this.deviceHasNetworkConnection() && firmwareAGreaterThanB(LfAppState.availableFirmware, LfAppState.currentFirmware)) {
        // available firmware is greater than current
        this.history.push('/firmware');
      }

      if (this.deviceHasNetworkConnection() && firmwareAGreaterThanB(LfAppState.currentFirmware, LfAppState.availableFirmware) >= 0) {
        // current firmware is equal to or greater than available
        this.history.push('/registration');
      }
    }
  }

  // ==== LISTENERS SECTION =====================================================================

  // ==== PUBLIC METHODS API - @Method() SECTION ================================================

  // ==== LOCAL METHODS SECTION =================================================================
  private deviceHasNetworkConnection(): boolean {
    const isConnected = !(this.networkMode !== 'connected_with_ip' && this.activeNetworkInterface === 'wifi');
    this.log.debug('deviceHasNetworkConnection', isConnected);
    return isConnected;
  }

  private async testInternetConnection(): Promise<void> {
    this.log.debug('getNetworkState');

    this.connectionTestLoading = true;

    lfNetworkConnectionService
      .getConnectionTestResults()
      .then((connectionResults) => {
        this.log.debug('testInternetConnection - THEN');
        this.log.debug(connectionResults);

        if (!connectionResults) {
          throw new Error('No Connection Results Received.');
        }

        this.connectionResults = connectionResults;
      })
      .catch(e => {
        throw new Error(e);
      })
      .finally(() => {
        this.connectionTestLoading = false;
      });
  }

  private async getNetworkState(): Promise<void> {
    this.log.debug('getNetworkState');

    this.networkStateLoading = true;
    lfNetworkConnectionService
      .fetchNetworkState()
      .then(networkState => {
        this.log.debug('getNetworkState - THEN');
        this.log.debug(networkState);

        if (!networkState) {
          throw new Error('No Network Response Received.');
        }

        this.activeNetworkName = networkState.activeSSID;
        this.networkMode = networkState.mode;
        this.activeNetworkInterface = networkState.activeInterface;
        LfAppState.availableNetworks = networkState.availableNetworks;
      })
      .catch(e => {
        throw new Error(e);
      })
      .finally(() => {
        this.networkStateLoading = false;
      });
  }

  private async getFirmwareState() {
    this.log.debug('getFirmwareState');

    this.firmwareStateLoading = true;
    lfFirmwareApiInterfaceService
      .getFirmwareState()
      .then(firmwareState => {
        this.log.debug('getFirmwareState - then');
        this.log.debug(firmwareState);

        if (!firmwareState) {
          throw new Error('No Network Response Received.');
        }

        this.currentFirmware = firmwareState.currentVersion;
        LfAppState.currentFirmware = firmwareState.currentVersion;
        LfAppState.availableFirmware = firmwareState.availableVersion;
      })
      .catch(e => {
        throw new Error(e);
      })
      .finally(() => {
        this.firmwareStateLoading = false;
      });
  }

  // ==== RENDERING SECTION =====================================================================

  private renderNetworkStatusInfo() {
    const connectionImageModeStr = this.activeNetworkInterface === 'eth' ? 'ethernet' : 'wi-fi';
    const connectionImageStr = this.networkMode === 'connected_with_ip' ? 'connected-green' : 'disconnected-yellow';

    const imageFilename = `${connectionImageModeStr}-${connectionImageStr}.svg`;
    // const image =  "" ? 'wi-fi-connected-green.svg' : 'wi-fi-disconnected-yellow.svg';
    const imageAssetPath = `./assets/images/icons/${imageFilename}`;

    let networkDisplayText: string;
    if (!this.activeNetworkInterface || this.activeNetworkInterface === 'wifi') {
      if (this.networkMode === 'connected_with_ip' && this.activeNetworkName) {
        networkDisplayText = this.activeNetworkName;
      } else if (this.networkMode === 'trying_connection') {
        networkDisplayText = 'Attempting to connection to Wi-Fi';
      } else {
        networkDisplayText = 'Verifying network connection';
      }
    } else if (this.activeNetworkInterface == 'eth') {
      networkDisplayText = 'Ethernet';
      if (this.networkMode !== 'connected_with_ip') {
        networkDisplayText += ' (no internet)';
      }
    }

    return [
      <div class="device-info--label">Network</div>,
      <div class={`device-info--value ${this.networkStateLoading ? 'loading' : ''}`}>
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
            <img class="hero--logo" src="./assets/images/logos/Logomark White.svg"></img>
            <h1>Welcome to Lightform</h1>
          </div>

          <div class="device-info--container">
            <div class="device-details--container">
              <div class="device-info--label">Device Name</div>
              <div class={`device-info--value ${this.deviceNameLoading ? 'loading' : ''}`}>{this.deviceName || 'Loading'}</div>
            </div>
            <div class="device-details--container">{this.renderNetworkStatusInfo()}</div>
            <div class="device-details--container">
              <div class="device-info--label">Firmware Version</div>
              <div class={`device-info--value ${this.firmwareStateLoading ? 'loading' : ''}`}>{this.currentFirmware || 'X.X.XXX'}</div>
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
