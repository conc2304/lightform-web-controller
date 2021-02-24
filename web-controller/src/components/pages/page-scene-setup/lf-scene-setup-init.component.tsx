// ==== Library Imports =======================================================
import { modalController } from '@ionic/core';

import { Component, Element, Event, EventEmitter, h, Listen, Prop, State } from '@stencil/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfRemoteApiAlignmentService from '../../../shared/services/lf-remote-api/lf-remote-api-alignment.service';
import lfAppStateStore, { initializeData, initializeDeviceSelected } from '../../../store/lf-app-state.store';
import { LfDevice, LfSceneSetupState } from '../../../shared/interfaces/lf-web-controller.interface';
import lfAlignmentStateStore, { resetAlignmentState } from '../../../store/lf-alignment-state.store';

@Component({
  tag: 'lf-scene-setup-init',
  styleUrls: ['lf-scene-setup-init.component.scss'],
  shadow: false,
})
export class LfSceneSetupInit {
  // ==== OWN PROPERTIES SECTION ==================================================================
  // ---- Private  --------------------------------------------------------------------------------
  private log = new LfLoggerService('LfSceneSetupInit').logger;

  // ==== HOST HTML REFERENCE =====================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION ===============================================================
  @State() deviceSelected: LfDevice;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ====================================================
  @Prop() isMobileLayout: boolean = lfAppStateStore.mobileLayout;

  // ==== EVENTS SECTION ==========================================================================
  @Event() scanProgressUpdated: EventEmitter<LfSceneSetupState>;

  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================
  // - -  componentWillLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');

    resetAlignmentState();
    if (!lfAppStateStore.registeredDevices) {
      initializeData().then(() => {
        if (!lfAppStateStore.deviceSelected) {
          initializeDeviceSelected();
        }
      });
    }

    lfAlignmentStateStore.registeredObjects =
      lfAlignmentStateStore.registeredObjects ||
      (await lfRemoteApiAlignmentService.getLfObjects().then(response => {
        return response.body;
      }));

    this.isMobileLayout = lfAppStateStore.mobileLayout;
    this.deviceSelected = lfAppStateStore.deviceSelected;
  }

  // - -  componentDidLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad() {
    this.log.debug('componentDidLoad');

    document.title = 'Lightform | Scene Setup';
  }

  // ==== LISTENERS SECTION =======================================================================
  @Listen('_layoutUpdated', { target: 'document' })
  onWindowResized(): void {
    this.log.debug('onWindowResized');
    this.isMobileLayout = lfAppStateStore.mobileLayout;
  }

  @Listen('_playbackStateUpdated', { target: 'document' })
  onPlaybackStateUpdated() {
    this.log.debug('onPlaybackStateUpdated');
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

  // ==== RENDERING SECTION =======================================================================

  private displayErrorMsg() {
    return (
      <lf-error-container errorTitle="No device is selected" errorMessage="Select a device to continue">
        <lf-button
          context="secondary"
          onClick={() => {
            this.openDeviceSelector();
          }}
        >
          Select a device
        </lf-button>
      </lf-error-container>
    );
  }

  private renderSceneSelector() {
    const layoutClassName = this.isMobileLayout ? 'lf-layout--mobile' : 'lf-layout--desktop';

    return (
      <div class={`alignment-experience--container ${layoutClassName}`}>
        {/* // Object  */}
        <div
          class="alignment-experience--option first"
          onClick={() => {
            lfAlignmentStateStore.scanType = 'object';
            this.scanProgressUpdated.emit(LfSceneSetupState.Scanning);
          }}
        >
          <div class="alignment-experience--title">
            Bring your Lightform <br />
            Object to life
          </div>
          <div class="alignment-experience--subtitle">Set up for Object</div>
        </div>
        {/* Environment */}
        <div
          class="alignment-experience--option last"
          onClick={() => {
            lfAlignmentStateStore.scanType = 'environment';
            this.scanProgressUpdated.emit(LfSceneSetupState.Scanning);
          }}
        >
          <div class="alignment-experience--title">
            Activate a wall for an <br />
            immersive experience
          </div>
          <div class="alignment-experience--subtitle">Set up for Environment</div>
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
          <h1 class="scene-setup--title">Set up a scene</h1>
          {this.deviceSelected?.serialNumber ? this.renderSceneSelector() : this.displayErrorMsg()}
        </div>
      </div>,
    ];
  }
}
