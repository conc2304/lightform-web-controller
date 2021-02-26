// ==== Library Imports =======================================================
import { Component, Element, Event, EventEmitter, Listen, h, Prop, State } from '@stencil/core';
import { modalController, toastController } from '@ionic/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfAppStateStore, { initializeData, initializeDeviceSelected } from '../../../store/lf-app-state.store';
import lfRemoteApiAlignmentService, { LfOaklightMode } from '../../../shared/services/lf-remote-api/lf-remote-api-alignment.service';
import lfAlignmentStateStore, { resetAlignmentState } from '../../../store/lf-alignment-state.store';
import { LfObjectDetails, LfSceneSetupState } from '../../../shared/interfaces/lf-web-controller.interface';
import lfAlignmentService from '../../../shared/services/lf-alignment.service';
import { LfEnvironmentAlignmentMode } from './lf-environment-alignment-mode.enum';

@Component({
  tag: 'lf-scene-setup-scan-completed',
  styleUrls: ['lf-scene-setup-scan-completed.component.scss'],
})
export class LfSceneScanCompleted {
  // ==== OWN PROPERTIES SECTION ==================================================================
  // ---- Private  --------------------------------------------------------------------------------
  private log = new LfLoggerService('LfSceneScanCompleted').logger;
  private router: HTMLIonRouterElement;
  private oaklightMode: LfOaklightMode = lfAlignmentService.getOaklightMode();
  private deviceSelected = lfAppStateStore.deviceSelected;
  private deviceSerial = this.deviceSelected?.serialNumber;

  // ==== HOST HTML REFERENCE =====================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION ===============================================================
  @State() alignmentFound = !!(lfAlignmentStateStore.objectAnalysis?.alignmentCorners || lfAlignmentStateStore.objectAnalysis?.detectionBounds);
  @State() sceneFound = lfAlignmentService.sceneWasFound();

  @State() maskPath = lfAlignmentStateStore.objectAnalysis?.alignmentCorners || lfAlignmentStateStore.objectAnalysis?.detectionBounds;
  @State() octoMask = lfAlignmentStateStore.environmentAnalysis;
  @State() scannedImgUrl = lfAlignmentStateStore.scanImageUrl;
  @State() objectOutlineUrl = lfAlignmentStateStore.lfObjectOutlineImgUrl;
  @State() lfObjectName = lfAlignmentStateStore.lfObjectName;
  @State() canvasWidth: number = lfAlignmentService.getCanvasMaxWidth();
  @State() mode: 'pending' | 'edit' = 'pending'; // TODO MAKE SURE PENDING
  @State() environmentMode: LfEnvironmentAlignmentMode = null;

  // @State() viewTitle: string;
  // @State() alignmentPrompt: string;
  // @State() buttonText: {left: string, right: string};

  // ==== PUBLIC PROPERTY API - Prop() SECTION ====================================================
  @Prop() isMobileLayout: boolean = lfAppStateStore.mobileLayout;

  // ==== EVENTS SECTION ==========================================================================
  @Event() scanProgressUpdated: EventEmitter<LfSceneSetupState>;

  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================
  // - -  componentDidLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad() {
    this.log.debug('componentDidLoad');

    document.title = 'Lightform | Scan Scene';
    this.router = await document.querySelector('ion-router').componentOnReady();
    this.canvasWidth = lfAlignmentService.getCanvasMaxWidth();
  }


  // ==== LISTENERS SECTION =======================================================================
  @Listen('_viewportSizeUpdated', { target: 'document' })
  onViewportSizeUpdated() {
    this.canvasWidth = lfAlignmentService.getCanvasMaxWidth();
  }

  @Listen('_deviceSelected', { target: 'document' })
  onDevicesSelectedUpdated() {
    this.deviceSerial = lfAppStateStore?.deviceSelected?.serialNumber;
  }

  @Listen('_lfObjectOutlineImgUrl', { target: 'document' })
  onLfObjectOutlineImgUrl() {
    this.objectOutlineUrl = lfAlignmentStateStore.lfObjectOutlineImgUrl;
    // this.maskPath = null;
  }

  // ==== LOCAL METHODS SECTION ===================================================================

  private getButtonSize() {
    this.log.debug('getButtonSize');
    if (this.isMobileLayout === null) {
      return 'small';
    } else {
      return this.isMobileLayout ? 'small' : 'large';
    }
  }

  private async saveScanScene() {
    this.router.push('/');

    // get and apply the new scene info to the home page
    await initializeData().then(() => {
      initializeDeviceSelected();
    });

    resetAlignmentState();
    this.scanProgressUpdated.emit(LfSceneSetupState.Pending); // reset back to initial
    lfRemoteApiAlignmentService.oaklightOff(this.deviceSerial);
    this.displaySuccessNotification();
  }

  private async displaySuccessNotification() {
    const sceneToSave = lfAlignmentStateStore.scanType === 'object' ? this.lfObjectName || 'Your Object' : 'Your Environment';

    const toast = await toastController.create({
      message: `<ion-icon size="large" name="checkmark-outline" color={#FFFFFF}></ion-icon> ${sceneToSave} is all set!`,
      position: 'top',
      color: 'success',
      duration: 3000,
    });
    setTimeout(() => {
      toast.present();
    }, 1000);
  }

  private async selectManualAlignmentObject() {
    this.log.debug('selectManualAlignmentObject');

    const availableLfObjects: Array<LfObjectDetails> =
      lfAlignmentStateStore.registeredObjects ||
      (await lfRemoteApiAlignmentService.getLfObjects().then(response => {
        return response.body;
      }));

    const modal = await modalController.create({
      component: 'lf-item-selector-modal',
      cssClass: 'lf-item-selector--modal',
      showBackdrop: true,
      swipeToClose: true,
      componentProps: {
        modalTitle: 'Select Object',
        listItems: availableLfObjects,
        isSelectedConditionFn: null,
        returnDisplayTextFn: (object: LfObjectDetails) => {
          return object.name;
        },
        dismissButton: false,
      },
    });

    modal.onDidDismiss().then((modalResponse: any) => {
      const { dismissed, result } = modalResponse.data;
      const objectId = result?.id;
      if (dismissed && objectId) {
        this.triggerObjectAlignment(objectId);
        lfAlignmentStateStore.lfObjectName = result.name;
      } else {
        return Promise.reject();
      }
    });

    await modal.present();
  }

  private async onEditAlignment() {
    if (lfAlignmentStateStore.scanType === 'object') {
      this.triggerObjectAlignment(lfAlignmentStateStore.objectAnalysis.objectId);
    }
  }

  private async triggerObjectAlignment(objectId: string) {
    lfAlignmentService.triggerObjectAlignment(this.deviceSerial, objectId, this.oaklightMode, this.maskPath);
    this.mode = 'edit';
  }

  private callLeftButtonFn() {
    let lfAlignmentSuccess: boolean;

    if (lfAlignmentStateStore.scanType === 'object') {
      lfAlignmentSuccess = !!this.alignmentFound && !!lfAlignmentStateStore.lfObjectName;
    } else if (lfAlignmentStateStore.scanType === 'environment') {
      lfAlignmentSuccess = !!this.scannedImgUrl && !!lfAlignmentStateStore.lfObjectName;
    }

    if (lfAlignmentStateStore.scanType === 'object') {
      if (lfAlignmentSuccess) {
        this.onEditAlignment();
      } else {
        this.selectManualAlignmentObject();
      }
    }
    // end object
    else if (lfAlignmentStateStore.scanType === 'environment') {
      if (lfAlignmentSuccess) {
        this.editEnvironmentAlignment(); // custom mask
      } else {
        this.editEnvironmentAlignment(); // manual setup
      }
    }
  }

  private triggerRescan() {
    this.scanProgressUpdated.emit(LfSceneSetupState.Scanning);
  }

  private callRightButtonFn() {
    let lfAlignmentSuccess: boolean;

    if (lfAlignmentStateStore.scanType === 'object') {
      lfAlignmentSuccess = !!this.alignmentFound && !!lfAlignmentStateStore.lfObjectName;
    } else if (lfAlignmentStateStore.scanType === 'environment') {
      lfAlignmentSuccess = !!this.scannedImgUrl && !!lfAlignmentStateStore.lfObjectName;
    }

    if (lfAlignmentStateStore.scanType === 'object') {
      if (lfAlignmentSuccess) {
        this.saveScanScene();
      } else {
        this.triggerRescan();
      }
    }
    // end object
    else if (lfAlignmentStateStore.scanType === 'environment') {
      if (lfAlignmentSuccess) {
        this.saveScanScene();
      } else {
        this.triggerRescan();
      }
    }
  }
  // ==== RENDERING SECTION =======================================================================

  private renderSceneImage() {
    this.log.debug('renderSceneImage');

    if (this.scannedImgUrl && this.canvasWidth) {
      return (
        <lf-scene-alignment-p5
          maskPath={this.maskPath}
          scanImgUrl={this.scannedImgUrl}
          canvasWidth={this.canvasWidth}
          lfObjectOutlineImageUrl={this.objectOutlineUrl}
          octoMask={this.octoMask}
        />
      );
    } else {
      return <img class="lf-alignment--img" src="/assets/images/no-image-icon.png" />;
    }
  }

  private renderActionButtons() {
    this.log.debug('renderActionButtons');
    const { leftButtonLabel, rightButtonLabel } = lfAlignmentService.getActionButtonLabel();
    if (this.mode === 'pending' && leftButtonLabel && rightButtonLabel) {
      return (
        <div class="scene-setup--action-btns flex-item--bottom">
          <lf-button
            context="primary"
            size={this.getButtonSize()}
            onClick={() => {
              this.callLeftButtonFn();
            }}
          >
            {leftButtonLabel}
          </lf-button>

          <lf-button
            context="secondary"
            size={this.getButtonSize()}
            onClick={() => {
              this.callRightButtonFn();
            }}
          >
            {rightButtonLabel}
          </lf-button>
        </div>
      );
    } else if (this.mode === 'edit' && lfAlignmentStateStore.scanType === 'object') {
      return this.renderObjectAlignmentControls();
    } else if (this.mode === 'edit' && lfAlignmentStateStore.scanType === 'environment') {
      return this.renderEnvironmentAlignmentControls();
    }
  }

  private renderEnvironmentAlignmentControls() {
    return (
      <div class="scene-setup--environment-controls">
        <lf-alignment-environment-controls
          buttonSize={this.getButtonSize()}
          onSaveAlignment={() => {
            this.saveScanScene();
          }}
          onModeChanged={(event: CustomEvent) => {
            if (event.detail === LfEnvironmentAlignmentMode.Mask) {
              this.environmentMode = null;
            } else {
              this.environmentMode = event.detail;
            }
          }}
        />
      </div>
    );
  }

  private editEnvironmentAlignment() {
    this.mode = 'edit';
    // this.octoMask = []; // tod better implementation
  }

  private renderObjectAlignmentControls() {
    return (
      <div class="lf-alignment-controller--container scene-setup--action-btns">
        <lf-alignment-d-pad />
        <lf-button
          size={this.getButtonSize()}
          context="primary"
          onClick={() => {
            this.saveScanScene();
          }}
        >
          Save
        </lf-button>
      </div>
    );
  }

  private getPrompt() {
    if (lfAlignmentStateStore.scanType === 'object') {
      if (this.mode === 'edit') return '';
      return this.sceneFound && lfAlignmentStateStore.lfObjectName
        ? `We found ${lfAlignmentStateStore.lfObjectName} and auto-align the projection for you.`
        : 'We didn’t find any Object in this scene. Try XYZ and re-scan, or manual setup.';
    } else if (lfAlignmentStateStore.scanType === 'environment') {
      if (this.mode === 'edit') return '';

      return this.sceneFound ? (
        'We found a wall space and created a mask in your scene. The environment projection will appear within the mask.'
      ) : (
        <div class="long-prompt">
          <p>We didn’t find any wall space in the scene.</p>
          <p>This scene might not be the best for an immersive environment experience. Consider a different scene with more wall space, or add the mask manually.</p>
          <p>
            For best effects in complicated scenes, try using{' '}
            <a href="https://guide.lightform.com/hc/en-us" target="_blank">
              Lightform Creator.
            </a>
          </p>
        </div>
      );
    }
  }

  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');

    const title = lfAlignmentService.getAlignmentViewTitle(this.mode, this.environmentMode);
    const layoutClassName = this.isMobileLayout ? 'lf-layout--mobile' : 'lf-layout--desktop';

    return (
      <div class={`lf-scene-scan-completed ${layoutClassName}`}>
        <h1 class="scene-setup--title">{title}</h1>

        <div class="lf-scene-scan-completed--content-container">
          <div class="scene-setup--img-wrapper">
            <div class="image-alignment-container">{this.renderSceneImage()}</div>
            <div class="scene-setup--prompt">{this.getPrompt()}</div>
          </div>

          {this.renderActionButtons()}
        </div>
      </div>
    );
  }
}
