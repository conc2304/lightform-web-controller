// ==== Library Imports =======================================================
import { Component, h, Element, Host, Prop, State } from '@stencil/core';
import { RouterHistory } from '@stencil/router';

// ==== App Imports ===========================================================
import LfLoggerService from '../../shared/services/lf-logger.service';
import lfNetworkConnectionService from '../../shared/services/lf-network-api-interface.service';
import { LfNetworkConnectionResults } from '../../shared/models/lf-network-connection-results.model';
import { LfActiveInterface, LfDeviceNetworkMode, LfNetworkState } from '../../shared/models/lf-network-state.model';
import { LfAppState } from '../../shared/services/lf-app-state.service';
import lfFirmwareApiInterfaceService from '../../shared/services/lf-firmware-api-interface.service';
import { firmwareUpdateRequired } from '../../shared/services/lf-utilities.service';
import lfPollingService from '../../shared/services/lf-polling.service';
import { androidGetDeviceName, androidGetDeviceSerial } from '../../shared/services/lf-android-interface.service';
import lfRegistrationApiInterfaceService from '../../shared/services/lf-registration-api-interface.service';

@Component({
  tag: 'lf-app-home',
  styleUrl: 'lf-app-home.component.scss',
})
export class LfAppHome {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private -------------------------------------------------------------------------------
  private log = new LfLoggerService('LfAppHome').logger;
  private readonly POLL_INTERVAL_SECONDS = 2;
  private readonly POLL_DURATION_MINUTES = 5; // setting it to a long time, the device should fail at some point

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() el: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() deviceNameLoading = true;
  @State() networkStateLoading = true;
  @State() firmwareStateLoading = true;
  @State() connectionTestLoading = true;

  @State() connectionResults: LfNetworkConnectionResults = null;
  @State() deviceName: string = null;
  @State() deviceSerial: string = null;
  @State() activeNetworkName: string = null;
  @State() activeNetworkInterface: LfActiveInterface = null;
  @State() networkMode: LfDeviceNetworkMode = null;
  @State() currentFirmware: string = null;
  @State() availableFirmware: string = null;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() history: RouterHistory;

  // ==== EVENTS SECTION ========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentDidLoad Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad(): Promise<void> {
    setTimeout(() => {
      this.init();
    }, 3000);
  }

  // ==== LISTENERS SECTION =====================================================================
  // ==== PUBLIC METHODS API - @Method() SECTION ================================================

  // ==== LOCAL METHODS SECTION =================================================================
  private async init() {
    // We return after route changes in order to stop the flow of execution, changing routes does not stop the flow
    // We are setting timeouts before rerouting in order to briefly display change in displayed info

    let destination: string;
    this.deviceName = androidGetDeviceName();
    this.deviceSerial = androidGetDeviceSerial();
    this.deviceNameLoading = false;

    const validate = (netState: LfNetworkState) => netState.mode !== LfDeviceNetworkMode.Connecting;
    const networkState = await lfPollingService
      .poll(this.getNetworkState, validate, this.POLL_INTERVAL_SECONDS, this.POLL_DURATION_MINUTES)
      .then(result => {
        this.log.debug('getNetworkState', JSON.stringify(result));
        return result;
      })
      .catch(e => {
        this.log.error(e);
      })
      .finally(() => {
        this.networkStateLoading = false;
      });

    console.log('NETWORK STATE RESPONSE');
    this.activeNetworkName = networkState.activeSSID;
    this.networkMode = networkState.mode;
    this.activeNetworkInterface = networkState.activeInterface;
    LfAppState.availableNetworks = networkState.availableNetworks;

    if (this.networkMode !== LfDeviceNetworkMode.Connected && this.activeNetworkInterface === 'wifi') {
      // user doesn't need to go into Device Pairing if over ethernet
      destination = '/pairing';
    } else {
      this.connectionResults = await this.testInternetConnection();
      if (!this.connectionResults.connected || this.connectionResults.captivePortal === true) {
        destination = '/pairing';
      }
    }

    if (destination) {
      setTimeout(() => {
        this.history.push(destination);
      }, 2000);
      return;
    }

    const firmwareState = await this.getFirmwareState();
    console.log('firmwareState result');
    console.log(JSON.stringify(firmwareState));

    this.currentFirmware = firmwareState.currentVersion || lfRegistrationApiInterfaceService.getCurrentFirmwareVersion();
    this.firmwareStateLoading = false;
    this.availableFirmware = firmwareState.availableVersion;
    LfAppState.currentFirmware = this.currentFirmware;
    LfAppState.availableFirmware = this.availableFirmware;

    console.log('CURRENT', this.currentFirmware);
    console.log('AVAILABLE', this.availableFirmware);

    if (this.networkMode !== 'connected_with_ip') {
      destination = '/pairing';
    } else if (!this.availableFirmware || !this.currentFirmware || typeof this.availableFirmware === 'undefined') {
      // something is wrong with the internet
      destination = '/reboot';
    } else if (this.availableFirmware && this.currentFirmware) {
      const updateRequired = firmwareUpdateRequired(this.availableFirmware, this.currentFirmware);
      console.log('firmwareUpdateRequired', updateRequired);
      if (this.networkMode === 'connected_with_ip' && updateRequired) {
        destination = '/firmware';
      } else if (this.networkMode === 'connected_with_ip' && !updateRequired) {
        destination = '/registration';
      }
    } else {
      // don't know what is wrong
      console.warn('available: ', this.availableFirmware);
      console.warn('current: ', this.currentFirmware);
      console.warn('networkMode: ', this.networkMode);
      destination = '/reboot';
    }

    if (destination) {
      setTimeout(() => {
        this.history.push(destination);
      }, 2000);
      return;
    }
  }

  private async getNetworkState(): Promise<LfNetworkState> {
    // no log

    return lfNetworkConnectionService
      .fetchNetworkState()
      .then(networkState => {
        if (!networkState) {
          throw new Error('No Network Response Received.');
        }

        return networkState;
      })
      .catch(e => {
        throw new Error(e);
      });
  }

  private async testInternetConnection(): Promise<LfNetworkConnectionResults> {
    this.connectionTestLoading = true;

    return await lfNetworkConnectionService
      .getConnectionTestResults()
      .then(connectionResults => {
        if (!connectionResults) {
          throw new Error('No Connection Results Received.');
        }

        return connectionResults;
      })
      .catch(e => {
        throw new Error(e);
      })
      .finally(() => {
        this.connectionTestLoading = false;
      });
  }

  private async getFirmwareState() {
    this.firmwareStateLoading = true;
    return await lfFirmwareApiInterfaceService
      .getFirmwareState()
      .then(firmwareState => {
        this.log.debug('getFirmwareState - THEN');
        this.log.debug(JSON.stringify(firmwareState));

        if (!firmwareState) {
          throw new Error('No Network Response Received.');
        }

        return firmwareState;
      })
      .catch(e => {
        console.error(e);
        return {
          currentVersion: null,
          availableVersion: null,
        };
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
        networkDisplayText = 'Attempting to connect to Wi-Fi';
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
    const fwOutOfDateClass = !this.firmwareStateLoading && firmwareUpdateRequired(this.availableFirmware, this.currentFirmware) ? 'warning' : '';

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

          <lf-cta-container />
        </div>
      </Host>
    );
  }
}
