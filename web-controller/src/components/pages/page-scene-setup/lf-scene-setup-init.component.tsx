// ==== Library Imports =======================================================
import { modalController } from '@ionic/core';
import { Component, Element, h, Listen, Prop } from '@stencil/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfRemoteApiAlignmentService from '../../../shared/services/lf-remote-api/lf-remote-api-alignment.service';
import lfAppStateStore, { initializeData, initializeDeviceSelected } from '../../../store/lf-app-state.store';
import { LfDevice, LfDeviceScanType } from '../../../shared/interfaces/lf-web-controller.interface';
import lfAlignmentStateStore, { resetAlignmentState } from '../../../store/lf-alignment-state.store';
import lfRemoteApiDeviceService from '../../../shared/services/lf-remote-api/lf-remote-api-device.service';

@Component({
  tag: 'lf-scene-setup-init',
  styleUrls: ['lf-scene-setup-init.component.scss'],
  shadow: false,
})
export class LfSceneSetupInit {
  // ==== OWN PROPERTIES SECTION ==================================================================
  // ---- Private  --------------------------------------------------------------------------------
  private log = new LfLoggerService('LfSceneSetupInit').logger;
  private router: HTMLIonRouterElement;

  // ==== HOST HTML REFERENCE =====================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION ===============================================================

  // ==== PUBLIC PROPERTY API - Prop() SECTION ====================================================
  @Prop() deviceSelected: LfDevice = lfAppStateStore.deviceSelected;
  @Prop() isMobileLayout: boolean = lfAppStateStore.mobileLayout;

  // ==== EVENTS SECTION ==========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================
  // - -  componentWillLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');

    resetAlignmentState();
    if (!lfAppStateStore.registeredDevices || !lfAppStateStore.deviceSelected) {
      await initializeData();
    }
    if (!lfAppStateStore.deviceSelected) {
      initializeDeviceSelected();
    }

    lfAlignmentStateStore.registeredObjects =
      lfAlignmentStateStore.registeredObjects ||
      (await lfRemoteApiAlignmentService.getLfObjects().then(response => {
        return response.body;
      }));

    await lfRemoteApiAlignmentService.cancelScan(this.deviceSelected.serialNumber).catch();
    await lfRemoteApiDeviceService.showTestcard(this.deviceSelected.serialNumber).catch();

    this.isMobileLayout = lfAppStateStore.mobileLayout;
    this.deviceSelected = lfAppStateStore.deviceSelected;
  }

  // - -  componentDidLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad() {
    this.log.debug('componentDidLoad');
    document.title = 'Lightform | Scene Setup';
    this.router = await document.querySelector('ion-router').componentOnReady();
  }

  // ==== LISTENERS SECTION =======================================================================
  @Listen('_layoutUpdated', { target: 'document' })
  onWindowResized(): void {
    this.log.debug('onWindowResized');
    this.isMobileLayout = lfAppStateStore.mobileLayout;
  }

  @Listen('_playbackStateUpdated', { target: 'document' })
  onPlaybackStateUpdated() {
    this.log.log('onPlaybackStateUpdated');
    this.deviceSelected = lfAppStateStore.deviceSelected;
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ==================================================
  // ==== LOCAL METHODS SECTION ===================================================================

  private async openDeviceSelector(): Promise<void> {
    this.log.debug('openDeviceSelector');

    const modal = await modalController.create({
      component: 'lf-device-selector-modal',
      cssClass: 'lf-device-selector--modal',
    });
    await modal.present();
  }

  private onScanTypeClick(scanType: LfDeviceScanType) {
    resetAlignmentState();
    lfAlignmentStateStore.scanType = scanType;
    this.router.push(`/scene-setup-scan/${scanType}`);
  }

  // ==== RENDERING SECTION =======================================================================

  private displayErrorMsg() {
    return (
      <lf-call-to-action imgSrc="/assets/images/LF2_plus_ghost.png" message="Get started by selecting a device to scan with" imgAltText="Register Devices">
        <lf-button
          context="secondary"
          onClick={() => {
            this.openDeviceSelector();
          }}
        >
          Select a device
        </lf-button>
      </lf-call-to-action>
    );
  }

  private renderSceneSelector() {
    const layoutClassName = this.isMobileLayout ? 'lf-layout--mobile' : 'lf-layout--desktop';

    return (
      <div class={`alignment-experience--container ${layoutClassName}`}>
        {/* // Object  */}
        <div
          class="alignment-experience--option object"
          onClick={() => {
            this.onScanTypeClick('object');
          }}
        >
          <div class="video-container">
            <div class="alignment-experience--description">
              <div class="alignment-experience--title">Object</div>
              <div class="alignment-experience--subtitle">Bring your Lightform Object to life</div>
            </div>
            <video preload="auto" autoPlay muted loop poster="/assets/images/objects-poster.jpg">
              <source src="/assets/videos/obj-btn_gradient_loop.webm" type="video/webm"></source>
              <source src="/assets/videos/obj-btn_gradient_loop.mp4" type="video/mp4"></source>
              <p>Your browser cannot play the provided video file.</p>
            </video>
          </div>
        </div>

        {/* Environment */}
        <div
          class="alignment-experience--option environment"
          onClick={() => {
            this.onScanTypeClick('environment');
          }}
        >
          <div class="video-container">
            <div class="alignment-experience--description">
              <div class="alignment-experience--title">Environment</div>
              <div class="alignment-experience--subtitle">Project on a wall for an immersive experience</div>
            </div>
            <video preload="auto" muted autoPlay loop poster="/assets/images/environment-poster.jpg">
              <source src="/assets/videos/env-btn_gradient_loop.webm" type="video/webm" />
              <source src="/assets/videos/env-btn_gradient_loop.mp4" type="video/mp4" />
              <p>Your browser cannot play the provided video file.</p>
            </video>
          </div>
        </div>
      </div>
    );
  }

  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');

    const layoutClassName = this.isMobileLayout ? 'lf-layout--mobile' : 'lf-layout--desktop';

    return [
      <div class={`page-scene-setup-init ${layoutClassName}`}>
        <div class="scene-setup--container">
          <h1 class="scene-setup--title">Select Scene Type</h1>
          <p class="scene-setup--subtitle">Please make sure the projection is in focus and covers the Object fully before continuing.</p>
          {this.deviceSelected?.serialNumber ? this.renderSceneSelector() : this.displayErrorMsg()}
        </div>
      </div>,
    ];
  }
}
