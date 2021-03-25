// ==== Library Imports =======================================================
import { Component, Element, Listen, h, Prop, State, Host } from '@stencil/core';
import { alertController } from '@ionic/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../../shared/services/lf-logger.service';
import lfAppStateStore, { initializeData, initializeDeviceSelected, updatePlaybackState } from '../../../../store/lf-app-state.store';
import lfRemoteApiAlignmentService, { LfMaskPath, LfOaklightMode } from '../../../../shared/services/lf-remote-api/lf-remote-api-alignment.service';
import lfAlignmentStateStore, { getObjectIdByName, resetAlignmentState } from '../../../../store/lf-alignment-state.store';
import { LfDeviceScanType } from '../../../../shared/interfaces/lf-web-controller.interface';
import lfAlignmentService from '../../../../shared/services/lf-alignment.service';
import lfRemoteApiDeviceService from '../../../../shared/services/lf-remote-api/lf-remote-api-device.service';
import { LfEnvironmentAlignmentMode } from '../lf-environment-alignment-mode.enum';

@Component({
  tag: 'page-scene-setup-alignment',
  styleUrls: ['page-scene-setup-alignment.component.scss'],
  shadow: false, // if true it will block the click behavior of the p5 sketch
})
export class LfSceneScanCompleted {
  // ==== OWN PROPERTIES SECTION ==================================================================
  // ---- Private  --------------------------------------------------------------------------------
  private log = new LfLoggerService('LfSceneScanCompleted').logger;
  private router: HTMLIonRouterElement;
  private alertDialog: HTMLIonAlertElement;
  private oaklightMode: LfOaklightMode = lfAlignmentService.getOaklightMode();
  private deviceSelected = lfAppStateStore.deviceSelected;
  private deviceSerial = this.deviceSelected?.serialNumber;
  private objectId = lfAlignmentStateStore.lfObjectId;
  private initialAlignmentPoints: LfMaskPath;
  private initialMode: 'update' | 'edit' = 'update';

  // ==== HOST HTML REFERENCE =====================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION ===============================================================
  @State() alignmentFound = !!(lfAlignmentStateStore.objectAnalysis?.alignmentCorners || lfAlignmentStateStore.objectAnalysis?.detectionBounds);
  @State() sceneFound = lfAlignmentService.sceneWasFound();

  @State() maskPath = lfAlignmentStateStore.objectAnalysis?.alignmentCorners || lfAlignmentStateStore.objectAnalysis?.detectionBounds;
  @State() octoMask = lfAlignmentStateStore.environmentAnalysis;
  @State() scannedImgUrl = lfAlignmentStateStore.scanImageUrl;
  @State() objectOutlineUrl = lfAlignmentStateStore.lfObjectOutlineImgUrl;
  @State() environmentMode: LfEnvironmentAlignmentMode = null;
  @State() loading = true;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ====================================================
  @Prop() isMobileLayout: boolean = lfAppStateStore.mobileLayout;
  @Prop() scanType: LfDeviceScanType;
  @Prop() projectName: string;
  @Prop() mode: 'update' | 'edit' = 'update';

  // ==== EVENTS SECTION ==========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================
  // - -  connectedCallback Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async connectedCallback() {
    this.log.debug('connectedCallback');

    try {
      if (!lfAppStateStore.registeredDevices || !lfAppStateStore.playbackState) {
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

      this.projectName = decodeURI(this.projectName);
      this.objectId = getObjectIdByName(this.projectName);
      this.initialMode = this.mode;

      lfAlignmentStateStore.scanType = this.scanType;
      lfAlignmentStateStore.lfObjectName = this.projectName;
      this.oaklightMode = lfAlignmentService.getOaklightMode();

      if (this.mode === 'update' && this.scanType === 'object') {
        // get detection points and image
        await lfRemoteApiDeviceService.stop(this.deviceSerial);

        await lfRemoteApiAlignmentService.setObject(this.deviceSerial, this.objectId);

        this.scannedImgUrl = (await lfAlignmentService.getCameraImage(this.deviceSerial)).imgUrl;
        this.maskPath = (await lfAlignmentService.getObjectCurrentAlignment(this.deviceSerial)) || null;
        this.initialAlignmentPoints = this.maskPath;
      }
      this.loading = false;
    } catch (error) {
      // this.openErrorModal(error);
      this.loading = false;
      this.log.error(error);
    }
  }

  // - -  componentDidLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad() {
    this.log.debug('componentDidLoad');

    document.title = 'Lightform | Scan Scene';
    this.router = await document.querySelector('ion-router').componentOnReady();

    if (this.mode === 'edit' && this.objectId) {
      this.triggerObjectAlignment(this.objectId);
    }
  }

  // ==== LISTENERS SECTION =======================================================================

  @Listen('_deviceSelected', { target: 'document' })
  onDevicesSelectedUpdated() {
    this.deviceSerial = lfAppStateStore?.deviceSelected?.serialNumber;
  }

  @Listen('_lfObjectOutlineImgUrl', { target: 'document' })
  onLfObjectOutlineImgUrl() {
    this.objectOutlineUrl = lfAlignmentStateStore.lfObjectOutlineImgUrl;
    // this.maskPath = null;
  }

  @Listen('_resetAlignmentState', { target: 'document' })
  onAlignmentStateReset(): void {
    this.log.warn('_resetAlignmentState');
    this.maskPath = lfAlignmentStateStore.objectAnalysis?.alignmentCorners || lfAlignmentStateStore.objectAnalysis?.detectionBounds;
    this.octoMask = lfAlignmentStateStore.environmentAnalysis;
    this.scannedImgUrl = lfAlignmentStateStore.scanImageUrl;
    this.objectOutlineUrl = lfAlignmentStateStore.lfObjectOutlineImgUrl;
  }

  @Listen('_layoutUpdated', { target: 'document' })
  onWindowResized(): void {
    this.log.debug('onWindowResized');
    this.isMobileLayout = lfAppStateStore.mobileLayout;
  }

  // ==== LOCAL METHODS SECTION ===================================================================

  private async saveScanScene() {
    // get and apply the new scene info to the home page

    await initializeData();
    initializeDeviceSelected();

    this.router.push('/');

    const sceneToSave = lfAlignmentStateStore.scanType === 'object' ? lfAlignmentStateStore.lfObjectName || 'Your Object' : 'Your Environment';
    const statusText = this.initialMode === 'update' ? 'is updated!' : 'is all set!';
    const message = `Hooray! ${sceneToSave} ${statusText}`;

    await lfAlignmentService.displaySuccessNotification(message);

    lfRemoteApiAlignmentService.oaklightOff(this.deviceSerial);
    lfRemoteApiDeviceService.play(this.deviceSerial);

    lfAlignmentService
      .pollProjectDownloadProgress(this.deviceSelected.name)
      .then(result => {
        this.log.info('pollProjectDownloadProgress');
        this.log.info(result);
      })
      .catch(error => {
        this.log.error(error);
      })
      .finally(() => {
        lfAppStateStore.projectDownloadIsPolling = false;
      });


    resetAlignmentState();
  }

  private async onEditAlignment() {
    if (this.scanType === 'object') {
      this.triggerObjectAlignment(this.objectId);
    }
  }

  private async triggerObjectAlignment(objectId: string) {
    const alignmentSucceeded = await lfAlignmentService.triggerObjectAlignment(this.deviceSerial, objectId, this.oaklightMode);

    console.log(alignmentSucceeded);
    if (!alignmentSucceeded) {
      const handler = () => {
        this.router.push(`/scene-setup/scan/${lfAlignmentStateStore.scanType}`);
      };
      this.openErrorModal("Something went wrong trying to setting up for manually aligning your object for you. Let's try rescanning your object.", handler);
    } else {
      this.mode = 'edit';
      if (lfAlignmentStateStore.scanImageUrl && !this.scannedImgUrl) {
        this.scannedImgUrl = lfAlignmentStateStore.scanImageUrl;
      }
    }
  }

  private async openErrorModal(msg: string, handlerFn = null) {
    this.alertDialog = await alertController.create({
      cssClass: 'lf-alert-modal',
      message: msg,
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'secondary-button',
          handler: handlerFn,
        },
      ],
    });

    await this.alertDialog.present();
  }

  private triggerRescan() {
    document.dispatchEvent(new CustomEvent('restartScan'));
    resetAlignmentState();
    lfAlignmentStateStore.scanType = this.scanType;

    this.router.push(`/scene-setup/scan/${lfAlignmentStateStore.scanType}`);
  }

  private editEnvironmentAlignment() {
    this.mode = 'edit';
    // this.octoMask = []; // todo better implementation
  }

  // ==== RENDERING SECTION =======================================================================

  private renderSceneImage() {
    this.log.debug('renderSceneImage');

    if (this.scannedImgUrl) {
      return <lf-scene-alignment-p5 maskPath={this.maskPath} scanImgUrl={this.scannedImgUrl} lfObjectOutlineImageUrl={this.objectOutlineUrl} octoMask={this.octoMask} />;
    } else {
      return <img class="lf-alignment--img" src="/assets/images/no-image-icon.png" />;
    }
  }

  private renderActionButtons() {
    this.log.debug('renderActionButtons');

    if (this.mode === 'update') {
      return (
        <div class="scene-setup--action-btns mode--update">
          <ion-button
            class="action-button secondary"
            fill="clear"
            onClick={() => {
              this.onEditAlignment();
            }}
          >
            Edit Alignment
          </ion-button>
          <ion-button
            class="action-button destructive"
            fill="clear"
            onClick={() => {
              this.displayRemovalConfirmation();
            }}
          >
            Remove Object
          </ion-button>
        </div>
      );
    } else if (this.mode === 'edit' && lfAlignmentStateStore.scanType === 'object') {
      return this.renderObjectAlignmentControls();
    }
  }

  private async displayRemovalConfirmation() {
    this.log.debug('removeObject');

    this.alertDialog = await alertController.create({
      cssClass: 'lf-alert-modal',
      message: `Are you sure sure you want to remove ${this.projectName} from your projects?`,
      backdropDismiss: true,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary-button',
        },
        {
          text: 'Remove',
          role: 'destructive',
          cssClass: 'destructive-button',
          handler: () => {
            this.removeObject();
          },
        },
      ],
    });

    await this.alertDialog.present();
  }

  private async removeObject() {
    this.log.info('removeObject');

    try {
      await lfRemoteApiDeviceService.depublishProject(this.deviceSerial, this.objectId).then(result => {
        this.log.warn(result);
        if (!result?.response.ok) {
          const errorMsg = result?.body?.error || result?.response?.statusText || 'N/A';
          throw new Error(errorMsg);
        }
      });

      updatePlaybackState(this.deviceSelected);
      this.router.push('/');
      lfAlignmentService.displaySuccessNotification(`${this.projectName} was successfully removed.`);
    } catch (error) {
      const handler = null;
      this.openErrorModal('Sorry, we were not able to remove this project. \n\n' + error, handler);
    }
  }

  private renderObjectAlignmentControls() {
    this.log.debug('renderObjectAlignmentControls');

    return (
      <div class="lf-alignment-controller--container scene-setup--action-btns">
        <lf-alignment-d-pad helpText="nudge a point" />
        <lf-button
          class="lf-alignment-action-button"
          size={this.getButtonSize()}
          context="primary"
          onClick={() => {
            this.saveScanScene();
          }}
        >
          {this.initialMode === 'edit' ? 'Finish' : 'Update'}
        </lf-button>
      </div>
    );
  }

  private getButtonSize() {
    this.log.debug('getButtonSize');
    if (this.isMobileLayout === null) {
      return 'small';
    } else {
      return this.isMobileLayout ? 'small' : 'large';
    }
  }

  private renderBackButton() {
    this.log.debug('renderBackButton');

    return (
      <div
        class="back-button"
        onClick={() => {
          if (this.initialMode === 'update' && this.mode === 'edit') {
            console.log('HERE');
            lfRemoteApiAlignmentService.setObjectAlignment(this.deviceSerial, this.initialAlignmentPoints);
            this.maskPath = this.initialAlignmentPoints;
            this.objectOutlineUrl = null;
            this.mode = 'update';
          } else if (this.initialMode === 'update' && this.mode === 'update') {
            this.router.back();
          } else if (this.initialMode === 'edit') {
            this.router.back();
          }
        }}
      >
        <ion-icon name="chevron-back-outline" color="#FFFFFF" size="large" />
      </div>
    );
  }

  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - -

  public render() {
    this.log.debug('render');

    const title = this.projectName;
    const layoutClassName = this.isMobileLayout ? 'lf-layout--mobile' : 'lf-layout--desktop';

    try {
      if (this.loading) {
        return <lf-loading-message />;
      } else {
        return (
          <Host class={`lf-scene-setup-alignment scroll-y ${layoutClassName}`}>
            <h1 class="scene-setup--title">{title}</h1>
            <div class="lf-scene-setup-alignment--content-container">
              <div class="scene-setup--img-wrapper">
                <p class="scene-setup--subtitle">{this.mode === 'edit' ? 'drag a point' : ''}</p>
                <div class="image-alignment-container">{this.renderSceneImage()}</div>
              </div>

              {this.renderActionButtons()}
            </div>
            {this.renderBackButton()}
          </Host>
        );
      }
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
