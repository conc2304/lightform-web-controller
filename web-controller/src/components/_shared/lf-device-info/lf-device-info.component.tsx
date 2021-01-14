// ==== Library Imports =======================================================
import { Component, Element, h, Listen, Prop, State } from '@stencil/core';
import { alertController } from '@ionic/core';

// ==== App Imports ===========================================================
import { LfDevice, LfDeviceProps } from '../../../shared/interfaces/lf-web-controller.interface';
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfRemoteApiDeviceService from '../../../shared/services/lf-remote-api/lf-remote-api-device.service';
import lfAppState, { initializeData } from '../../../store/lf-app-state.store';
import state from '../../../store/lf-app-state.store';
import { LF_DEVICE_OFFLINE_STATUS } from '../../../shared/constants/lf-device-status.constant';

@Component({
  tag: 'lf-device-info',
  styleUrl: 'lf-device-info.component.scss',
})
export class LfDeviceInfoView {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('LfDeviceInfo').logger;
  private currentAnimationIndex = 0;
  private router: HTMLIonRouterElement;

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() lfDeviceInfoEl: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() device: LfDevice = lfAppState.accountDeviceSelected;
  @State() deviceProps: LfDeviceProps;
  @State() isMobileLayout: boolean = lfAppState.mobileLayout;
  @State() loading = false;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() deviceName: string;

  // ==== EVENTS SECTION ========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - -
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');
    this.loading = true;
    this.isMobileLayout = lfAppState.mobileLayout;

    await this.initDeviceInfo().then(() => {
      this.loading = false;
    });
  }

  // ==== LISTENERS SECTION =====================================================================
  @Listen('_layoutUpdated', { target: 'document' })
  onWindowResized(): void {
    this.log.debug('onWindowResized');
    this.isMobileLayout = state.mobileLayout;
  }

  // - -  componentDidLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad() {
    this.log.debug('componentDidLoad');
    this.router = await document.querySelector('ion-router').componentOnReady();
  }

  // ==== PUBLIC METHODS API - @Method() SECTION =================================================
  // ==== LOCAL METHODS SECTION ==================================================================

  private async initDeviceInfo() {
    this.log.info('initDeviceInfo');

    const deviceName = this.deviceName;
    const deviceInfo = await lfRemoteApiDeviceService.getDeviceInfo(deviceName).then(res => {
      const response = res.response;
      const json = res.body;

      if (!response.ok) {
        let errorMsg = 'Unable to retrieve device info for : ' + deviceName;
        return Promise.reject(errorMsg);
      } else {
        return Promise.resolve(json);
      }
    });

    lfAppState.accountDeviceSelected = {
      model: deviceInfo.model || 'N/A',
      name: deviceInfo.name || deviceName,
      serialNumber: deviceInfo.serialNumber || 'N/A',
      createdAt: deviceInfo.createdAt || 'N/A',
      owner: deviceInfo.owner || 'N/A',
    };

    this.log.warn('Device Info - ', deviceInfo);

    this.device = lfAppState.accountDeviceSelected;
    this.deviceProps = deviceInfo._embedded.info;
    this.deviceProps.model = deviceInfo.model;
  }

  private async openRemoveDeviceModal(): Promise<void> {
    this.log.debug('openRemoveDeviceModal');

    const alert = await alertController.create({
      cssClass: 'lf-alert-modal',
      message: `Are you sure you want to remove ${this.deviceName}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary-button',
        },
        {
          text: 'Remove',
          role: 'confirm',
          cssClass: 'secondary-button',
          handler: () => {
            this.handleRemoveDevice();
          },
        },
      ],
    });

    await alert.present();
  }

  private async handleRemoveDevice() {
    this.log.debug('handleRemoveDevice');

    lfRemoteApiDeviceService
      .deregisterDevice(this.device.serialNumber)
      .then((response: any) => {
        if (response && response.status >= 200 && response.status < 300) {
          return Promise.resolve(response);
        } else {
          const error = response.statusText || 'Unknown Status Error';
          return Promise.reject(error);
        }
      })
      .then(() => {
        initializeData();
        this.router.push('/account');
      })
      .catch(error => {
        this.log.error(error);
      });
  }

  // ==== RENDERING SECTION ======================================================================
  private renderDeviceStatus() {
    this.log.debug('renderDeviceStatus');

    const status = !LF_DEVICE_OFFLINE_STATUS.includes(this.deviceProps.status) ? 'Online' : 'Offline';
    const date = new Date(this.deviceProps.offlineSince);

    const formattedLastOnlineDate = `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;

    return (
      <div class={`lf-device-info--field-value status-container ${status.toLowerCase()}`}>
        <span class="status-marker"></span>
        <span class="lf-device-info--field-value">{status} </span>
        <span class={`lf-device-info--last-online ${status.toLowerCase()}`}>(since {formattedLastOnlineDate})</span>
      </div>
    );
  }

  private renderDesktopDeviceInfoHeader() {
    if (!this.isMobileLayout) {
      return (
        <div class="lf-device-info--header">
          <h3 class="lf-device-info--device-name">{this.device.name}</h3>
          <ion-icon
            class="close-button"
            onClick={() => {
              state.accountDeviceSelected = null;
              this.router.push('/account');
            }}
            name="close"
          ></ion-icon>
        </div>
      );
    } else {
      return [];
    }
  }

  private renderDeviceInfo() {
    this.log.debug('renderDeviceInfo');

    const { vResolution, hResolution, refreshRate } = this.deviceProps;

    const resolution = vResolution > 0 && hResolution > 0 && refreshRate > 0 ? `${vResolution}x${hResolution} @${refreshRate}` : 'N/A';
    const mobileClassName = this.isMobileLayout ? 'lf-layout--mobile' : 'lf-layout--desktop';

    if (!this.device || !this.deviceProps) {
      this.log.warn('No Device Info');

      return [];
    }

    return [
      <div class={`lf-device-info--content-container ${mobileClassName}`}>
        <div class="lf-device-info--content">
          {this.renderDesktopDeviceInfoHeader()}

          <div class="lf-device-info--details-container animate-in" style={{ '--animation-order': this.currentAnimationIndex++ } as any}>
            <div class="lf-device-info--field-label">Status</div>
            {this.renderDeviceStatus()}
          </div>

          <lf-info-item label="Device Type" value={this.deviceProps.model || 'N/A'} animationOrder={this.currentAnimationIndex++} />
          <lf-info-item label="Serial Number" value={this.device.serialNumber || 'N/A'} animationOrder={this.currentAnimationIndex++} />
          <lf-info-item label="Firmware Version" value={this.deviceProps.firmwareVersion || 'N/A'} animationOrder={this.currentAnimationIndex++} />
          <lf-info-item label="IP Address" value={this.deviceProps.hostname || 'N/A'} animationOrder={this.currentAnimationIndex++} />
          <lf-info-item label="Resolution" value={resolution} animationOrder={this.currentAnimationIndex++} />
          {/* <lf-info-item label="Lense Type" value="** TEMP LENSE **" animationOrder={this.currentAnimationIndex++} /> */}
        </div>

        <div class="divider animate-in" style={{ '--animation-order': this.currentAnimationIndex++ } as any}></div>
        <div class="lf-device-info--action-links-container">
          <p
            class="action-link animate-in"
            style={{ '--animation-order': this.currentAnimationIndex++ } as any}
            onClick={() => {
              this.openRemoveDeviceModal();
            }}
          >
            Remove device from account
          </p>
        </div>
      </div>,
    ];
  }

  // - -  render Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - - - - - - - - -
  render() {
    this.log.debug('render');

    if (state.user && !this.loading) {
      return this.renderDeviceInfo();
    } else {
      return <lf-loading-message />;
    }
  }
}
