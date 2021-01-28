// ==== Library Imports =======================================================
import { Component, h, Element, Host, Prop, Event, EventEmitter, State } from '@stencil/core';
import { RouterHistory } from '@stencil/router';

// ==== App Imports ===========================================================
import LfLoggerService from '../../shared/services/lf-logger.service';
import lfNetworkConnectionService from '../../shared/services/lf-network-api-interface.service';
import { LfNetworkConnectionResults } from '../../shared/models/lf-network-connection-results.model';
import { LfActiveInterface, LfDeviceNetworkMode } from '../../shared/models/lf-network-state.model';
import { LfAppState } from '../../shared/services/lf-app-state.service';
import lfFirmwareApiInterfaceService from '../../shared/services/lf-firmware-api-interface.service';
import { firmwareAGreaterThanB } from '../../shared/services/lf-utilities.service';

@Component({
  tag: 'lf-app-home',
  styleUrl: 'lf-app-home.component.scss',
})
export class LfAppHome {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private -------------------------------------------------------------------------------
  private log = new LfLoggerService('LfAppHome').logger;

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
  @State() availableFirmware: string = null;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() history: RouterHistory;

  // ==== EVENTS SECTION ========================================================================
  @Event() appRouteChanged: EventEmitter;

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad(): Promise<void> {
    this.log.debug('componentDidLoad');

    setTimeout(() => {
      this.init();
    }, 3000);
  }

  // ==== LISTENERS SECTION =====================================================================

  // ==== PUBLIC METHODS API - @Method() SECTION ================================================

  // ==== LOCAL METHODS SECTION =================================================================

  private async init() {
    this.log.debug('init');

    // We return in order to stop the flow of execution, changing routes does not stop the flow
    // We are setting timeouts before rerouting in order to briefly display change in displayed info

    await this.getNetworkState();

    if (this.networkMode !== 'connected_with_ip' && this.activeNetworkInterface === 'wifi') {
      // user doesn't need to go into Device Pairing if over ethernet
      setTimeout(() => {
        this.history.push('/pairing');
      }, 1000);
      return;
    } else {
      await this.testInternetConnection();
    }

    await this.getFirmwareState();

    console.log('CURRENT', this.currentFirmware);
    console.log('AVAILABLE', this.availableFirmware);

    if (this.availableFirmware && this.currentFirmware) {
      if (this.networkMode === 'connected_with_ip' && firmwareAGreaterThanB(this.availableFirmware, this.currentFirmware)) {
        setTimeout(() => {
          this.history.push('/firmware');
        }, 1000);
        return;
      } else {
        setTimeout(() => {
          this.history.push('/registration');
        }, 1000);
        return;
      }
    }
  }

  private async getNetworkState(): Promise<void> {
    this.log.debug('getNetworkState');

    this.networkStateLoading = true;
    await lfNetworkConnectionService
      .fetchNetworkState()
      .then(networkState => {
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

  private async testInternetConnection(): Promise<void> {
    this.log.debug('getNetworkState');

    this.connectionTestLoading = true;

    await lfNetworkConnectionService
      .getConnectionTestResults()
      .then(connectionResults => {
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

  private async getFirmwareState() {
    this.log.debug('getFirmwareState');

    this.firmwareStateLoading = true;
    await lfFirmwareApiInterfaceService
      .getFirmwareState()
      .then(firmwareState => {
        this.log.debug('getFirmwareState - THEN');
        this.log.debug(firmwareState);

        if (!firmwareState) {
          throw new Error('No Network Response Received.');
        }

        this.currentFirmware = firmwareState.currentVersion;
        this.availableFirmware = firmwareState.availableVersion;

        LfAppState.currentFirmware = firmwareState.currentVersion;
        LfAppState.availableFirmware = firmwareState.availableVersion;
      })
      .catch(e => {
        throw new Error(e);
      })
      .finally(() => {
        this.firmwareStateLoading = false;
        this.log.debug('getFirmwareState - FINALLY');
      });
  }

  // ==== RENDERING SECTION =====================================================================

  private renderNetworkStatusInfo() {
    const connectionImageModeStr = this.activeNetworkInterface === 'eth' ? 'ethernet' : 'wi-fi';
    const connectionImageStr = this.networkMode === 'connected_with_ip' ? 'connected-green' : 'disconnected-yellow';

    const imageFilename = `${connectionImageModeStr}-${connectionImageStr}.svg`;
    const imageAssetPath = `./assets/images/icons/${imageFilename}`;

    let networkDisplayText: string;
    if (!this.activeNetworkInterface || this.activeNetworkInterface === 'wifi') {
      if (this.networkMode === 'connected_with_ip' && this.activeNetworkName) {
        networkDisplayText = this.activeNetworkName;
      } else if (this.networkMode === 'trying_connection') {
        networkDisplayText = 'Attempting to connection to Wi-Fi';
      } else if (this.networkMode !== null) {
        networkDisplayText = `Network Status: ${this.networkMode}`;
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
    const fwOutOfDateClass = !this.firmwareStateLoading && firmwareAGreaterThanB(this.availableFirmware, this.currentFirmware) < 0 ? 'warning' : '';

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
              <div class={`device-info--value ${fwOutOfDateClass} ${this.firmwareStateLoading ? 'loading' : ''}`}>{this.currentFirmware || 'X.X.XXX'}</div>
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
