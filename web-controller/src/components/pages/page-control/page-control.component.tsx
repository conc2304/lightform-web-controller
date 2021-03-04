// ==== Library Imports =======================================================
import { Component, Element, Listen, h, Prop, State } from '@stencil/core';
import { alertController } from '@ionic/core';
import { modalController } from '@ionic/core';
import { toastController } from '@ionic/core';

// ==== App Imports ===========================================================
import state from '../../../store/lf-app-state.store';
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfRemoteApiDeviceService from '../../../shared/services/lf-remote-api/lf-remote-api-device.service';
import lfAppState from '../../../store/lf-app-state.store';
import { LfDevice, LfDevicePlaybackState, LfErrorTemplate, LfRpcResponseError } from '../../../shared/interfaces/lf-web-controller.interface';
import { LF_DEVICE_OFFLINE_STATUS } from '../../../shared/constants/lf-device-status.constant';
import { deviceNameMatch, formatDateStringToLocalString } from '../../../shared/services/lf-utils.service';
import lfRemoteApiAlignmentService from '../../../shared/services/lf-remote-api/lf-remote-api-alignment.service';

@Component({
  tag: 'page-control',
  styleUrl: 'page-control.component.scss',
})
export class PageControl {
  // ==== OWN PROPERTIES SECTION ==================================================================
  // ---- Private  --------------------------------------------------------------------------------
  private log = new LfLoggerService('PageControl').logger;
  private currentAnimationIndex = 0;
  private router: HTMLIonRouterElement;
  private toast: HTMLIonToastElement;

  // ---- Protected -------------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE =====================================================================
  @Element() pageControlEl: HTMLElement;

  // ==== State() VARIABLES SECTION ===============================================================
  @State() projectorIsOn: boolean = false;
  @State() deviceIsPlaying: boolean = false;
  @State() brightnessLevel: number = lfAppState.playbackState?.globalBrightness || 0.5;
  @State() volumeLevel: number = lfAppState.playbackState?.globalVolume;
  @State() deviceSelected: LfDevice = lfAppState.deviceSelected;
  @State() playbackState: LfDevicePlaybackState = lfAppState.playbackState;
  @State() errorMsg: string;
  @State() loading: boolean = false;
  @State() appDataInitialized: boolean = lfAppState.appDataInitialized;
  @State() deviceDataInitialized: boolean = lfAppState.deviceDataInitialized;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ====================================================
  @Prop() deviceName: string; // from the url

  // ==== EVENTS SECTION ==========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================
  // - -  componentWillLoad Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - - -
  public componentWillLoad() {
    this.log.warn('componentWillLoad');

    this.deviceName = this.deviceName ? this.deviceName.replace('-', ' ') : null;

    if (this.deviceName && !deviceNameMatch(this.deviceName, lfAppState.deviceSelected?.name || '')) {
      this.loading = true;
      this.initializeDeviceSelectedState()
        .then((device: LfDevice) => {
          lfAppState.deviceSelected = device;
        })
        .catch((error: LfErrorTemplate) => {
          const errorMsg = error.message.replace(error.search, `<strong>${error.replace}</strong>`);
          this.log.error(errorMsg);
          this.displayErrorAlert('Device Not Found', errorMsg);
        })
        .finally(() => {
          this.loading = false;
        });
    }

    this.projectorIsOn = this.playbackState?.status && !LF_DEVICE_OFFLINE_STATUS.includes(this.playbackState.status);

    document.title = `Lightform | Device Controller `;
  }

  // - -  componentDidLoad Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad() {
    this.log.warn('componentDidLoad');

    this.router = await document.querySelector('ion-router').componentOnReady();

    if (!this.deviceName) {
      this.router.push('/');
      return;
    }

    if (!!this.deviceSelected?._embedded.info?.offlineSince) {
      const errorTitle = `${this.deviceName} is offline`;
      const dateString = formatDateStringToLocalString(this.deviceSelected._embedded.info.offlineSince);
      const errorMsg = `Device Offline since ${dateString}`;
      this.displayErrorNotification(errorTitle, errorMsg);
    }
  }

  // - -  componentDidLoad Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - - - -
  public disconnectedCallback() {
    this.log.warn('disconnectedCallback');

    if (this.toast) {
      this.toast.dismiss();
    }
  }

  // ==== LISTENERS SECTION =======================================================================
  @Listen('_deviceSelected', {
    target: 'document',
  })
  async onDeviceSelected(): Promise<void> {
    const deviceNameFormatted = lfAppState.deviceSelected.name.replace(' ', '-');
    this.deviceSelected = lfAppState.deviceSelected;
    this.router.push(`/control/devices/${deviceNameFormatted}`);
  }

  @Listen('_playbackStateUpdated', {
    target: 'document',
  })
  async onPlaybackStateUpdated(): Promise<void> {
    this.log.info('onPlaybackStateUpdated');

    if (!lfAppState.playbackState) {
      return;
    }
    this.deviceIsPlaying = lfAppState.playbackState.status === 'Playing';
    this.playbackState = lfAppState.playbackState;
    this.brightnessLevel = lfAppState.playbackState?.globalBrightness;
    this.volumeLevel = lfAppState.playbackState?.globalVolume;
    this.projectorIsOn = !LF_DEVICE_OFFLINE_STATUS.includes(this.playbackState.status);
  }

  @Listen('_appDataInitialized', { target: 'document' })
  onAppDataInitialized(): void {
    this.appDataInitialized = lfAppState.appDataInitialized;
    this.loading = !(lfAppState.appDataInitialized && lfAppState.deviceDataInitialized);
  }

  @Listen('_deviceDataInitialized', { target: 'document' })
  onDeviceDataInitialized(): void {
    this.deviceDataInitialized = lfAppState.deviceDataInitialized;
    this.loading = !(lfAppState.appDataInitialized && lfAppState.deviceDataInitialized);
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ==================================================

  // ==== LOCAL METHODS SECTION ===================================================================
  private async initializeDeviceSelectedState() {
    this.log.debug('initializeDeviceSelectedState');

    // changing device selected state will trigger a change to playback state that is emitted app-wide

    return lfRemoteApiDeviceService.getDeviceInfo(this.deviceName).then(res => {
      const response = res.response;
      const json = res.body;
      if (!response.ok) {
        lfAppState.deviceSelected = null;
        const error: LfErrorTemplate = {
          message: 'Unable to retrieve device info for :deviceName.',
          search: ':deviceName',
          replace: this.deviceName,
        };
        return Promise.reject(error);
      } else {
        return Promise.resolve(json);
      }
    });
  }

  private async displayErrorNotification(errorHeader: string, errorMsg: string) {
    const minutesToClose = 1;
    this.toast = await toastController.create({
      header: errorHeader,
      message: errorMsg,
      position: 'top',
      color: 'danger',
      duration: minutesToClose * 60 * 1000,
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
        },
      ],
    });
    this.toast.present();
  }

  private async displayErrorAlert(header: string, message: string) {
    const alert = await alertController.create({
      cssClass: 'my-custom-class',
      backdropDismiss: false,
      header: header || null,
      message: message,
      buttons: [
        {
          text: 'Choose A Device',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.openDeviceSelector();
            return false;
          },
        },
        {
          text: 'Home',
          handler: () => {
            this.router.push('/');
            return true;
          },
        },
      ],
    });

    await alert.present();
  }

  private async openDeviceSelector(): Promise<void> {
    this.log.debug('openDeviceSelector');

    const modal = await modalController.create({
      component: 'lf-device-selector-modal',
      cssClass: 'lf-device-selector--modal',
    });
    await modal.present();
  }

  private async onProjectorPowerToggle(): Promise<void> {
    this.log.info('onProjectorPowerToggle');

    const device = lfAppState.deviceSelected;
    let response;

    if (this.projectorIsOn) {
      response = await lfRemoteApiDeviceService.lightEngineOff(device.serialNumber);
    } else {
      response = await lfRemoteApiDeviceService.lightEngineOn(device.serialNumber);
    }

    if (response.error) {
      const errorHeader = `Unable to turn ${this.projectorIsOn ? 'off' : 'on'} ${this.deviceSelected?.name || 'device'}.`;
      this.displayErrorNotification(errorHeader, this.formatErrorMessage(response.error));
    } else {
      this.projectorIsOn = !this.projectorIsOn;
    }
  }

  private projectorIsOffline(): boolean {
    return !!this.deviceSelected?._embedded.info?.offlineSince;
  }

  private onPlayToggle(): void {
    this.log.info('onPlayToggle');

    const device = lfAppState.deviceSelected;

    if (device.serialNumber) {
      if (this.deviceIsPlaying) {
        lfRemoteApiDeviceService.pause(device.serialNumber);
      } else {
        lfRemoteApiDeviceService.play(device.serialNumber);
      }
      this.deviceIsPlaying = !this.deviceIsPlaying;
    } else {
      this.log.warn('No device available');
    }
  }

  private onPrevious(): void {
    this.log.info('onPrevious');
    const device = lfAppState.deviceSelected;

    if (device.serialNumber) {
      lfRemoteApiDeviceService.previous(device.serialNumber);
    } else {
      this.log.warn('No device available');
    }
  }

  private onNext(): void {
    this.log.info('onNext');
    const device = lfAppState.deviceSelected;

    if (device.serialNumber) {
      lfRemoteApiDeviceService.next(device.serialNumber);
    } else {
      this.log.warn('No device available');
    }
  }

  private onBrightnessChange(event: CustomEvent) {
    this.log.info('onBrightnessChange');
    const device = lfAppState.deviceSelected;
    const brightness = event.detail.value;
    const globalBrightness = Math.round((brightness + Number.EPSILON) * 100) / 100;

    lfAppState.playbackState = { ...lfAppState.playbackState, globalBrightness };
    lfRemoteApiDeviceService.updateBrightness(device.serialNumber, globalBrightness);
  }

  private onVolumeChange(event: CustomEvent) {
    this.log.info('onVolumeChange');
    const device = lfAppState.deviceSelected;
    const volume = event.detail.value;
    const volumeLevel = Math.round((volume + Number.EPSILON) * 100) / 100;

    lfAppState.playbackState = { ...lfAppState.playbackState };
    lfRemoteApiDeviceService.updateVolume(device.serialNumber, volumeLevel);
  }

  private formatErrorMessage(error: LfRpcResponseError) {
    let formattedErrorMsg: string;
    if (error?.data?.message) {
      const errorMsg = error?.data?.message;

      if (errorMsg.includes('offline since')) {
        const matches = errorMsg.match(/offline since(.*)/);
        const isoDateString = matches[1].toString().trim();

        if (isoDateString) {
          const formattedDate = formatDateStringToLocalString(isoDateString);
          formattedErrorMsg = errorMsg.replace(isoDateString, formattedDate);
        }
      }
    }

    if (!formattedErrorMsg) {
      formattedErrorMsg = 'Device Unresponsive';
    }

    return formattedErrorMsg;
  }

  // ==== RENDERING SECTION =======================================================================
  private renderSlideShowController() {
    this.log.debug('renderSlideShowController');

    return (
      <div class="lf-controller--slideshow-container controller-container" style={{ '--animation-order': this.currentAnimationIndex++ } as any}>
        <div class="lf-controller--item-title">Slideshow</div>
        <div class="lf-controller--settings-container slideshow-controls">
          <lf-button
            shape="round"
            context="secondary"
            onClick={() => {
              this.onPrevious();
            }}
            disabled={!this.projectorIsOn || this.projectorIsOffline()}
          >
            <ion-icon class="lf-button--icon" name="play-skip-back-outline"></ion-icon>
          </lf-button>
          <lf-button
            shape="round"
            context="secondary"
            onClick={() => {
              this.onPlayToggle();
            }}
            disabled={!this.projectorIsOn || this.projectorIsOffline()}
          >
            <ion-icon class="lf-button--icon" name={this.deviceIsPlaying ? 'pause-outline' : 'play-outline'}></ion-icon>
          </lf-button>
          <lf-button
            shape="round"
            context="secondary"
            onClick={() => {
              this.onNext();
            }}
            disabled={!this.projectorIsOn || this.projectorIsOffline()}
          >
            <ion-icon class="lf-button--icon" name="play-skip-forward-outline"></ion-icon>
          </lf-button>
        </div>
      </div>
    );
  }

  private renderBrightnessController() {
    this.log.debug('renderBrightnessController');

    return (
      <div class="lf-controller--brightness-container controller-container" style={{ '--animation-order': this.currentAnimationIndex++ } as any}>
        <div class="lf-controller--item-title">Brightness</div>
        <div class="lf-controller--settings-container">
          <ion-range
            min={0}
            max={1}
            step={0.1}
            value={this.brightnessLevel}
            onIonChange={event => {
              this.onBrightnessChange(event);
            }}
            disabled={!this.projectorIsOn || this.projectorIsOffline()}
          >
            <ion-icon size="small" slot="start" name="sunny"></ion-icon>
            <ion-icon slot="end" name="sunny"></ion-icon>
          </ion-range>
        </div>
      </div>
    );
  }

  private renderVolumeController() {
    this.log.debug('renderVolumeController');

    return (
      <div class="lf-controller--volume-container controller-container" style={{ '--animation-order': this.currentAnimationIndex++ } as any}>
        <div class="lf-controller--item-title">Volume</div>
        <div class="lf-controller--settings-container">
          <ion-range
            min={0}
            max={1}
            step={0.1}
            value={this.volumeLevel}
            // debounce={300}
            onIonChange={event => {
              this.onVolumeChange(event);
            }}
            disabled={this.volumeLevel === null || !this.projectorIsOn || this.projectorIsOffline()}
          >
            <ion-icon slot="start" name="volume-low-outline"></ion-icon>
            <ion-icon slot="end" name="volume-high-outline"></ion-icon>
          </ion-range>
        </div>
      </div>
    );
  }

  private renderPowerController() {
    this.log.debug('renderPowerController');
    const buttonClass = `lf-button--status-${this.projectorIsOn ? 'on' : 'off'}`;

    return (
      <div class="lf-controller--power-container controller-container" style={{ '--animation-order': this.currentAnimationIndex++ } as any}>
        <div class="lf-controller--item-title">Projector</div>
        <div class="lf-controller--settings-container">
          <lf-button
            class={buttonClass}
            shape="round"
            onClick={() => {
              this.onProjectorPowerToggle();
            }}
            disabled={this.projectorIsOffline()}
          >
            <ion-icon class="lf-button--icon" name="power"></ion-icon>
          </lf-button>
        </div>
      </div>
    );
  }

  private renderControlPageContent() {
    this.log.debug('renderControlPageContent');

    if (state.deviceSelected && !this.loading) {
      return (
        <div class="lf-controller--content-container">
          {this.renderSlideShowController()}
          {this.renderBrightnessController()}
          {this.renderVolumeController()}
          {this.renderPowerController()}
          <div class="error-msg--container">{this.errorMsg}</div>
        </div>
      );
    } else if (this.loading) {
      return <lf-loading-message />;
    } else if (lfAppState.registeredDevices?.length > 1) {
      return (
        <lf-call-to-action imgSrc="/assets/images/LF2_plus_ghost.png" message="Select a device to control" imgAltText={'No Devices Found'}>
          <lf-button
            onClick={() => {
              this.openDeviceSelector();
            }}
          >
            Select Device
          </lf-button>
        </lf-call-to-action>
      );
    }
  }

  // - -  render Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    try {
      this.log.debug('render');
      this.currentAnimationIndex = 0;

      return <div class="lf-controller scroll-y ion-padding">{this.renderControlPageContent()}</div>;
    } catch (error) {
      this.log ? this.log.error(error) : console.error(error);

      if (error?.message && error?.code) {
        return <lf-error-message errorCode={error?.name} errorMessage={error?.message} hasResetButton={true} />;
      } else {
        return <lf-error-message hasResetButton={true} />;
      }
    }
  }
}
