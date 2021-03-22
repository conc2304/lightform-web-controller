// ==== Library Imports =======================================================
import { Component, Element, Listen, h, Prop, State } from '@stencil/core';
import { alertController } from '@ionic/core';
import { modalController } from '@ionic/core';
import { toastController } from '@ionic/core';

// ==== App Imports ===========================================================
import state, { updatePlaybackState, updateSceneSelected } from '../../../store/lf-app-state.store';
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfRemoteApiDeviceService from '../../../shared/services/lf-remote-api/lf-remote-api-device.service';
import lfAppState from '../../../store/lf-app-state.store';
import { LfDevice, LfDevicePlaybackState, LfErrorTemplate, LfRpcResponseError } from '../../../shared/interfaces/lf-web-controller.interface';
import { deviceNameMatch, formatDateStringToLocalString, getProjectIndex } from '../../../shared/services/lf-utils.service';

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
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION ===============================================================
  @State() deviceIsPlaying: boolean = lfAppState.playbackState?.status === 'Playing';
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
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');

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

    if (lfAppState.deviceSelected) {
      updatePlaybackState(this.deviceSelected);
    }

    document.title = `Lightform | Device Controller `;
  }

  // - -  componentDidLoad Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad() {
    this.log.debug('componentDidLoad');

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
    this.log.debug('disconnectedCallback');

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
    if (this.router) {
      this.router.push(`/control/devices/${deviceNameFormatted}`);
    }
  }

  @Listen('_playbackStateUpdated', {
    target: 'document',
  })
  async onPlaybackStateUpdated(): Promise<void> {
    this.log.debug('onPlaybackStateUpdated');

    if (!lfAppState.playbackState) {
      return;
    }
    const pbState = lfAppState.playbackState;
    this.playbackState = pbState;
    this.deviceIsPlaying = pbState.status === 'Playing';
    this.brightnessLevel = pbState?.globalBrightness;
    this.volumeLevel = pbState?.globalVolume;
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

  private async onProjectorPowerToggle(toStatus: 'on' | 'off'): Promise<void> {
    this.log.info('onProjectorPowerToggle');

    const device = lfAppState.deviceSelected;
    let response;

    if (toStatus === 'off') {
      response = await lfRemoteApiDeviceService.lightEngineOff(device.serialNumber);
    } else {
      response = await lfRemoteApiDeviceService.lightEngineOn(device.serialNumber);
    }

    if (response.error) {
      const errorHeader = `Unable to turn ${toStatus} ${this.deviceSelected?.name || 'device'}.`;
      this.displayErrorNotification(errorHeader, this.formatErrorMessage(response.error));
    }
  }

  private projectorIsOffline(): boolean {
    return !!this.deviceSelected?._embedded.info?.offlineSince;
  }

  private onPlayToggle(): void {
    this.log.debug('onPlayToggle');

    const device = lfAppState.deviceSelected;

    if (device.serialNumber) {
      if (this.deviceIsPlaying) {
        lfRemoteApiDeviceService.pause(device.serialNumber).then(() => {
          lfAppState.playbackState = { ...lfAppState.playbackState, status: 'Paused' };
        });
      } else {
        lfRemoteApiDeviceService.play(device.serialNumber).then(() => {
          lfAppState.playbackState = { ...lfAppState.playbackState, status: 'Playing' };
        });
      }
    } else {
      this.log.warn('No device available');
    }
  }

  private onPrevious(): void {
    this.log.info('onPrevious');
    const device = lfAppState.deviceSelected;

    if (device.serialNumber) {
      lfRemoteApiDeviceService.previous(device.serialNumber).then(() => {
        const projectId = lfAppState.sceneSelected.projectId;
        const projectIndex = getProjectIndex(state.playbackState.projectMetadata, projectId);

        if (projectIndex === null || projectIndex < 0) return;

        const projectSlides = state.playbackState.projectMetadata[projectIndex].slides;
        const projectSlideCount = projectSlides.length;
        const currentSlideIndex = state.playbackState.slide;

        let nextSlideIndex: number;

        if (currentSlideIndex - 1 < 0) {
          nextSlideIndex = projectSlideCount - 1;
        } else {
          nextSlideIndex = currentSlideIndex - 1;
        }

        state.playbackState.slide = nextSlideIndex;
        updateSceneSelected(null, nextSlideIndex);
      });
    } else {
      this.log.warn('No device available');
    }
  }

  private onNext(): void {
    this.log.debug('onNext');
    const device = lfAppState.deviceSelected;

    if (device.serialNumber) {
      lfRemoteApiDeviceService.next(device.serialNumber).then(() => {
        const projectId = lfAppState.sceneSelected.projectId;
        const projectIndex = getProjectIndex(state.playbackState.projectMetadata, projectId);

        if (projectIndex === null || projectIndex < 0) return;

        const projectSlides = state.playbackState.projectMetadata[projectIndex].slides;
        const projectSlideCount = projectSlides.length;
        const currentSlideIndex = state.playbackState.slide;

        let nextSlideIndex: number;

        if (currentSlideIndex + 1 > projectSlideCount - 1) {
          nextSlideIndex = 0;
        } else {
          nextSlideIndex = currentSlideIndex + 1;
        }

        state.playbackState.slide = nextSlideIndex;
        updateSceneSelected(null, nextSlideIndex);
      });
    } else {
      this.log.warn('No device available');
    }
  }

  private onBrightnessChange(event: CustomEvent) {
    this.log.debug('onBrightnessChange');
    const globalBrightness = this.formatEventValue(event.detail.value);

    if (globalBrightness !== lfAppState.playbackState?.globalBrightness && lfAppState.deviceSelected?.serialNumber) {
      const device = lfAppState.deviceSelected;
      lfAppState.playbackState = { ...lfAppState.playbackState, globalBrightness };
      lfRemoteApiDeviceService.updateBrightness(device.serialNumber, globalBrightness);
    }
  }

  private onVolumeChange(event: CustomEvent) {
    this.log.debug('onVolumeChange');

    const volumeLevel = this.formatEventValue(event.detail.value);
    if (volumeLevel !== lfAppState.playbackState?.globalVolume && lfAppState.deviceSelected?.serialNumber) {
      const device = lfAppState.deviceSelected;
      lfAppState.playbackState = { ...lfAppState.playbackState, globalVolume: volumeLevel };
      lfRemoteApiDeviceService.updateVolume(device.serialNumber, volumeLevel);
    }
  }

  private formatEventValue(value: number | string): number {
    const mappedValue = Number(value);
    const formattedValue = Math.round((mappedValue + Number.EPSILON) * 100) / 100;
    return formattedValue;
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
  private renderPlaylistController() {
    this.log.debug('renderPlaylistController');

    return (
      <div class="lf-controller--slideshow-container controller-container" style={{ '--animation-order': this.currentAnimationIndex++ } as any}>
        <div class="lf-controller--item-title">Playlist</div>
        <div class="lf-controller--settings-container slideshow-controls">
          <lf-button
            shape="round"
            context="secondary"
            onClick={() => {
              this.onPrevious();
            }}
            disabled={this.projectorIsOffline()}
          >
            <ion-icon class="lf-button--icon" name="play-skip-back-outline"></ion-icon>
          </lf-button>
          <lf-button
            shape="round"
            context="secondary"
            onClick={() => {
              this.onPlayToggle();
            }}
            disabled={this.projectorIsOffline()}
          >
            <ion-icon class="lf-button--icon" name={this.deviceIsPlaying ? 'pause-outline' : 'play-outline'}></ion-icon>
          </lf-button>
          <lf-button
            shape="round"
            context="secondary"
            onClick={() => {
              this.onNext();
            }}
            disabled={this.projectorIsOffline()}
          >
            <ion-icon class="lf-button--icon" name="play-skip-forward-outline"></ion-icon>
          </lf-button>
        </div>
      </div>
    );
  }

  private renderBrightnessController() {
    this.log.debug('renderBrightnessController');

    const brightnessStep = 0.05;
    const brightnessMin = 0;
    const brightnessMax = 1;

    return (
      <div class="lf-controller--brightness-container controller-container" style={{ '--animation-order': this.currentAnimationIndex++ } as any}>
        <div class="lf-controller--item-title">Brightness</div>
        <div class="lf-controller--settings-container">
          <ion-range
            min={brightnessMin}
            max={brightnessMax}
            step={brightnessStep}
            value={this.brightnessLevel}
            onIonChange={event => {
              this.onBrightnessChange(event);
            }}
            disabled={this.projectorIsOffline()}
          >
            <ion-icon
              size="small"
              slot="start"
              name="sunny"
              onClick={() => {
                if (this.brightnessLevel - brightnessStep >= brightnessMin) {
                  this.brightnessLevel -= brightnessStep;
                }
              }}
            ></ion-icon>
            <ion-icon
              slot="end"
              name="sunny"
              onClick={() => {
                if (this.brightnessLevel + brightnessStep <= brightnessMax) {
                  this.brightnessLevel += brightnessStep;
                }
              }}
            ></ion-icon>
          </ion-range>
        </div>
      </div>
    );
  }

  private renderVolumeController() {
    this.log.debug('renderVolumeController');
    const volumeStep = 0.05;
    const volumeMin = 0;
    const volumeMax = 1;

    return (
      <div class="lf-controller--volume-container controller-container" style={{ '--animation-order': this.currentAnimationIndex++ } as any}>
        <div class="lf-controller--item-title">Volume</div>
        <div class="lf-controller--settings-container">
          <ion-range
            min={0}
            max={1}
            step={0.1}
            value={this.volumeLevel}
            onIonChange={event => {
              this.onVolumeChange(event);
            }}
            disabled={this.volumeLevel === null || this.projectorIsOffline()}
          >
            <ion-icon
              slot="start"
              name="volume-low-outline"
              onClick={() => {
                if (this.volumeLevel - volumeStep >= volumeMin) {
                  this.volumeLevel -= volumeStep;
                }
              }}
            ></ion-icon>
            <ion-icon
              slot="end"
              name="volume-high-outline"
              onClick={() => {
                if (this.volumeLevel + volumeStep <= volumeMax) {
                  this.volumeLevel += volumeStep;
                }
              }}
            ></ion-icon>
          </ion-range>
        </div>
      </div>
    );
  }

  private renderPowerController() {
    this.log.debug('renderPowerController');

    return (
      <div class="lf-controller--power-container controller-container" style={{ '--animation-order': this.currentAnimationIndex++ } as any}>
        <div class="lf-controller--item-title">Projector{this.renderStatus()}</div>
        <div class="lf-controller--settings-container">
          <lf-button
            class="lf-button--status-off"
            shape="round"
            onClick={() => {
              this.onProjectorPowerToggle('off');
            }}
            disabled={this.projectorIsOffline()}
          >
            <ion-icon class="lf-button--icon" name="power"></ion-icon>
          </lf-button>

          <lf-button
            class="lf-button--status-on"
            shape="round"
            onClick={() => {
              this.onProjectorPowerToggle('on');
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
          {this.renderPlaylistController()}
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

  public renderStatus() {
    const status = this.projectorIsOffline() ? 'Offline' : this.playbackState?.status || 'N/A';
    return <span class="status">Status: {status}</span>;
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
        return <lf-error-message errorCode={error?.code} errorMessage={error?.message} hasResetButton={true} />;
      } else {
        return <lf-error-message hasResetButton={true} />;
      }
    }
  }
}
