// ==== Library Imports =======================================================
import { Component, Element, h, Host, Listen, State } from '@stencil/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfRemoteApiAlignmentService from '../../../shared/services/lf-remote-api/lf-remote-api-alignment.service';
import lfAppState, { initializeData, initializeDeviceSelected } from '../../../store/lf-app-state.store';
import lfAlignmentStateStore, { resetAlignmentState } from '../../../store/lf-alignment-state.store';
import lfRemoteApiDeviceService from '../../../shared/services/lf-remote-api/lf-remote-api-device.service';

@Component({
  tag: 'lf-scene-setup-root',
  styleUrls: ['lf-scene-setup-root.component.scss'],
  shadow: false,
})
export class LfSceneSetupRoot {
  // ==== OWN PROPERTIES SECTION ==================================================================
  // ---- Private  --------------------------------------------------------------------------------
  private log = new LfLoggerService('LfSceneSetupRoot').logger;
  private router: HTMLIonRouterElement;

  // ==== HOST HTML REFERENCE =====================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION ===============================================================
  @State() isMobileLayout: boolean = lfAppState.mobileLayout;
  @State() loading = !lfAppState.deviceDataInitialized && !lfAppState.appDataInitialized;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ====================================================
  // ==== EVENTS SECTION ==========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================
  // - -  componentWillLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');

    //p5js needs to client to be on https in order to use certain features
    if (location.protocol != 'https:') {
      location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
    }

    if (!lfAppState.registeredDevices || !lfAppState.playbackState) {
      await initializeData();
    }

    if (!lfAppState.deviceSelected) {
      initializeDeviceSelected();
    }

    if (lfAppState.deviceSelected?.serialNumber) lfRemoteApiDeviceService.stop(lfAppState.deviceSelected.serialNumber);

    lfAlignmentStateStore.registeredObjects =
      lfAlignmentStateStore.registeredObjects ||
      (await lfRemoteApiAlignmentService.getLfObjects().then((response) => {
        return response.body;
      }));

    resetAlignmentState();
  }

  // - -  componentDidLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad() {
    this.log.debug('componentDidLoad');

    document.title = 'Lightform | Scene Setup';
    this.router = await document.querySelector('ion-router').componentOnReady();
  }

  // - -  disconnectedCallback - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - -
  // ** NOTE ** - because scene setup and alignment is all on the same route - we are calling oaklight off on any route change (lf-router) and device change (lf-app-state.store)

  // ==== LISTENERS SECTION =======================================================================
  @Listen('_layoutUpdated', { target: 'document' })
  onWindowResized(): void {
    this.log.debug('onWindowResized');
    this.isMobileLayout = lfAppState.mobileLayout;
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ==================================================
  // ==== LOCAL METHODS SECTION ===================================================================

  // ==== RENDERING SECTION =======================================================================
  private renderBackButton() {
    this.log.debug('renderBackButton');

    return (
      <div
        class="back-button"
        onClick={() => {
          this.router.push('/');
        }}
      >
        <ion-icon name="chevron-back-outline" color="#FFFFFF" size="large" />
      </div>
    );
  }

  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    try {
      this.log.debug('render');
      const layoutClassName = this.isMobileLayout ? 'lf-layout--mobile' : 'lf-layout--desktop';

      return (
        <Host class={`ion-padding page-scene-setup-root scroll-y ${layoutClassName}`}>
          {this.renderBackButton()}
          <lf-scene-setup-init isMobileLayout={this.isMobileLayout} class="lf-scene-setup-content" />
        </Host>
      );
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
