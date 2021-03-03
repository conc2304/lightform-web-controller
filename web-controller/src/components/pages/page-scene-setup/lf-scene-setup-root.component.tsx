// ==== Library Imports =======================================================
import { Component, Element, h, Host, Listen, State } from '@stencil/core';
import { alertController } from '@ionic/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfRemoteApiAlignmentService from '../../../shared/services/lf-remote-api/lf-remote-api-alignment.service';
import lfAppState from '../../../store/lf-app-state.store';
import { LfSceneSetupState } from '../../../shared/interfaces/lf-web-controller.interface';
import lfAlignmentStateStore, { resetAlignmentState } from '../../../store/lf-alignment-state.store';
import { isLocal } from '../../../global/LfConfig';
import lfAlignmentService from '../../../shared/services/lf-alignment.service';

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
  @State() scanningStatus: LfSceneSetupState = LfSceneSetupState.Pending;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ====================================================
  // ==== EVENTS SECTION ==========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================
  // - -  componentWillLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');

    //p5js needs to client to be on https in order to use certain features
    if (!isLocal && location.protocol != 'https:') {
      location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
    }

    lfAlignmentStateStore.registeredObjects =
      lfAlignmentStateStore.registeredObjects ||
      (await lfRemoteApiAlignmentService.getLfObjects().then(response => {
        return response.body;
      }));

    resetAlignmentState();
  }

  // - -  componentDidLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad() {
    this.log.debug('componentDidLoad');

    document.title = 'Lightform | Scene Setup';
    this.router = await document.querySelector('ion-router').componentOnReady();

    this.renderPermissionPopUp();
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

  private setScanProgress(toStatus: LfSceneSetupState) {
    this.scanningStatus = toStatus;
  }

  // ==== RENDERING SECTION =======================================================================

  private async renderPermissionPopUp() {
    this.log.debug('renderPermissionPopUp');
    if (typeof DeviceMotionEvent.requestPermission === 'function' || typeof DeviceOrientationEvent.requestPermission === 'function') {
      let permissionNeeded: boolean;

      const motionPerm = navigator?.permissions?.query ? await lfAlignmentService.handlePermission(DeviceMotionEvent.name) : 'pending';
      const orientationPerm = navigator?.permissions?.query ? await lfAlignmentService.handlePermission(DeviceOrientationEvent.name) : 'pending';

      permissionNeeded = motionPerm !== 'granted' || orientationPerm !== 'granted';
      if (permissionNeeded) {
        const alert = await alertController.create({
          cssClass: 'lf-alert-modal',
          message: "Scene setup requires permission to use device's motion and orientation events",
          backdropDismiss: false,
          buttons: [
            {
              text: 'Allow',
              role: 'confirm',
              cssClass: 'secondary-button',
              handler: () => {
                if (motionPerm !== 'granted') {
                  DeviceMotionEvent.requestPermission().then(() => {
                    alert.dismiss();
                  });
                }
                if (orientationPerm !== 'granted') {
                  DeviceOrientationEvent.requestPermission().then(() => {
                    alert.dismiss();
                  });
                }
              },
            },
          ],
        });

        await alert.present();
      }
    }
  }

  private renderBackButton() {
    this.log.debug('renderBackButton');

    return (
      <div
        class="back-button"
        onClick={() => {
          if (this.scanningStatus === LfSceneSetupState.Pending) {
            this.router.push('/');
          }
          this.scanningStatus = LfSceneSetupState.Pending;
          resetAlignmentState();
        }}
      >
        <ion-icon name="chevron-back-outline" color="#FFFFFF" size="large" />
      </div>
    );
  }

  private renderSceneSetUpView() {
    const className = 'lf-scene-setup-content';

    if (this.scanningStatus === LfSceneSetupState.Pending) {
      return (
        <lf-scene-setup-init
          isMobileLayout={this.isMobileLayout}
          class={className}
          onScanProgressUpdated={(event: CustomEvent) => {
            this.setScanProgress(event.detail);
          }}
        />
      );
    } else if (this.scanningStatus === LfSceneSetupState.Scanning) {
      return (
        <lf-scene-setup-scan
          isMobileLayout={this.isMobileLayout}
          class={className}
          onScanProgressUpdated={(event: CustomEvent) => {
            this.setScanProgress(event.detail);
          }}
        />
      );
    }
  }

  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    try {
      this.log.debug('render');
      const layoutClassName = this.isMobileLayout ? 'lf-layout--mobile' : 'lf-layout--desktop';

      return [
        <Host class={`ion-padding page-scene-setup-root scroll-y ${layoutClassName}`}>
          {this.renderBackButton()}
          {this.renderSceneSetUpView()}
        </Host>,
      ];
    } catch (error) {
      if (error?.message && error?.code) {
        return <lf-error-message errorCode={error?.name} errorMessage={error?.message} hasResetButton={true} />;
      } else {
        return <lf-error-message hasResetButton={true} />;
      }
    }
  }
}
