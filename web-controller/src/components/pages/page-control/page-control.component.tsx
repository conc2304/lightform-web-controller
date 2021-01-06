// ==== Library Imports =======================================================
import { Component, Element, Listen, h, State } from '@stencil/core';

// ==== App Imports ===========================================================
import state from '../../../store/lf-app-state.store';
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfRemoteApiDeviceService from '../../../shared/services/lf-remote-api/lf-remote-api-device.service';
import lfAppState from '../../../store/lf-app-state.store';
import { LfDevice, LfDevicePlaybackState, LfDeviceStatus } from '../../../shared/interfaces/lf-web-controller.interface';

@Component({
  tag: 'page-control',
  styleUrl: 'page-control.component.scss',
})
export class PageControl {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('PageControl').logger;
  private currentAnimationIndex = 0;
  private readonly deviceOffStatuses: Array<LfDeviceStatus> = ['Down', 'Idle', 'Unknown']; // todo may need adjusting

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() pageControlEl: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() projectorIsOn: boolean = false;
  @State() deviceIsPlaying: boolean = false;
  @State() brightnessLevel: number = lfAppState.playbackState?.globalBrightness || 0.5;
  @State() volumeLevel: number = lfAppState.playbackState?.globalVolume;
  @State() deviceSelected: LfDevice = lfAppState.deviceSelected;
  @State() playbackState: LfDevicePlaybackState = lfAppState.playbackState;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  // ==== EVENTS SECTION ========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - -
  public componentWillLoad() {
    this.log.debug('componentWillLoad');

    this.projectorIsOn = this.playbackState?.status && !this.deviceOffStatuses.includes(this.playbackState.status);
  }

  // ==== LISTENERS SECTION =====================================================================
  @Listen('_deviceSelected', {})
  async onDeviceSelected(): Promise<void> {
    this.deviceSelected = lfAppState.deviceSelected;
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
    this.projectorIsOn = !this.deviceOffStatuses.includes(this.playbackState.status);
  }

  // ==== PUBLIC METHODS API - @Method() SECTION =================================================

  // ==== LOCAL METHODS SECTION ==================================================================
  private onProjectorPowerToggle(): void {
    this.log.info('onProjectorPowerToggle');

    const device = lfAppState.deviceSelected;

    this.projectorIsOn ? lfRemoteApiDeviceService.lightEngineOff(device.serialNumber) : lfRemoteApiDeviceService.lightEngineOn(device.serialNumber);
    this.projectorIsOn = !this.projectorIsOn;
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
      console.warn('No device available');
    }
  }

  private onNext(): void {
    this.log.info('onNext');
    const device = lfAppState.deviceSelected;

    if (device.serialNumber) {
      lfRemoteApiDeviceService.next(device.serialNumber);
    } else {
      console.warn('No device available');
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

  // ==== RENDERING SECTION ======================================================================
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
          >
            <ion-icon class="lf-button--icon" name="play-skip-back-outline"></ion-icon>
          </lf-button>
          <lf-button
            shape="round"
            context="secondary"
            onClick={() => {
              this.onPlayToggle();
            }}
          >
            <ion-icon class="lf-button--icon" name={this.deviceIsPlaying ? 'pause-outline' : 'play-outline'}></ion-icon>
          </lf-button>
          <lf-button
            shape="round"
            context="secondary"
            onClick={() => {
              this.onNext();
            }}
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
            debounce={300}
            onIonChange={event => {
              this.onBrightnessChange(event);
            }}
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
            debounce={300}
            onIonChange={event => {
              this.onVolumeChange(event);
            }}
            disabled={this.volumeLevel === null}
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
          >
            <ion-icon class="lf-button--icon" name="power"></ion-icon>
          </lf-button>
        </div>
      </div>
    );
  }

  private renderControlPageContent() {
    this.log.debug('renderControlPageContent');

    if (state.deviceSelected) {
      return (
        <div class="lf-controller--content-container">
          {this.renderSlideShowController()}
          {this.renderBrightnessController()}
          {this.renderVolumeController()}
          {this.renderPowerController()}
        </div>
      );
    } else {
      return <lf-loading-message />;
    }
  }

  // - -  render Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');
    this.currentAnimationIndex = 0;
    return <div class="lf-controller scroll-y ion-padding">{this.renderControlPageContent()}</div>;
  }
}
