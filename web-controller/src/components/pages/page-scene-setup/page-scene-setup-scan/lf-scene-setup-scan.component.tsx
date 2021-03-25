// ==== Library Imports =======================================================
import { Component, Element, h, Host, Listen, Prop, State, Watch } from '@stencil/core';
import { alertController } from '@ionic/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../../shared/services/lf-logger.service';
import lfAppStateStore from '../../../../store/lf-app-state.store';
import { LfDeviceScanType } from '../../../../shared/interfaces/lf-web-controller.interface';
import lfRemoteApiAlignmentService from '../../../../shared/services/lf-remote-api/lf-remote-api-alignment.service';
import { LfScanStateStatus } from '../../../../shared/enums/lf-scan-state-status.enum';
import lfAlignmentStateStore, { getObjectNameById, resetAlignmentState } from '../../../../store/lf-alignment-state.store';
import lfAlignmentService from '../../../../shared/services/lf-alignment.service';
import { LfScanState } from '../../../../shared/models/lf-scan-state.model';
import { LfImageResponse } from '../../../../shared/models/lf-camera-scan-image.model';
import lfRemoteApiDeviceService from '../../../../shared/services/lf-remote-api/lf-remote-api-device.service';

@Component({
  tag: 'lf-scene-setup-scan',
  styleUrls: ['lf-scene-setup-scan.component.scss'],
  shadow: false,
})
export class PageSceneSetup {
  // ==== OWN PROPERTIES SECTION ==================================================================
  // ---- Private  --------------------------------------------------------------------------------
  private log = new LfLoggerService('LfSceneSetupScan').logger;
  private router: HTMLIonRouterElement;
  private alertDialog: HTMLIonAlertElement;
  private intervalFn;

  private readonly scanStateTextMap: { [key: string]: { interval: number; text: Array<string> } } = {
    'ready': {
      interval: null,
      text: ['Getting ready'],
    },
    'initializing': {
      interval: null,
      text: ['Initializing'],
    },
    'scanning': {
      interval: null,
      text: ['Scanning scene'],
    },
    'processing': {
      interval: 3,
      text: ['Processing scene data', 'Finding Object', 'Analyzing data'],
    },
    'uploading': {
      interval: 3,
      text: ['Finalizing results', 'Almost there'],
    },
  };

  // ==== HOST HTML REFERENCE =====================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION ===============================================================
  @State() deviceSerial: string = lfAppStateStore.deviceSelected?.serialNumber;
  @State() scanStateStatus: LfScanStateStatus;
  @State() progressText: string = this.scanStateTextMap.ready.text[0] || 'Getting ready';

  // ==== PUBLIC PROPERTY API - Prop() SECTION ====================================================
  @Prop() scanType: LfDeviceScanType = lfAlignmentStateStore.scanType;
  @Prop() isMobileLayout: boolean = lfAppStateStore.mobileLayout;

  // ==== EVENTS SECTION ==========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================

  public async componentWillLoad() {
    this.log.debug('componentWillLoad');

    if (!this.scanType || !lfAppStateStore.deviceSelected?.serialNumber || this.deviceSerial !== lfAppStateStore?.deviceSelected?.serialNumber) {
      resetAlignmentState();
      window.location.replace('/scene-setup');
      return;
    }

    this.startScan();
  }

  // - -  componentDidLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad() {
    this.log.debug('componentDidLoad');

    document.title = 'Lightform | Scan Scene';
    this.router = await document.querySelector('ion-router').componentOnReady();
  }

  // ==== LISTENERS SECTION =======================================================================
  @Listen('_layoutUpdated', { target: 'document' })
  onWindowResized(): void {
    this.log.debug('onWindowResized');
    this.isMobileLayout = lfAppStateStore.mobileLayout;
  }

  @Listen('restartScan', { target: 'document' })
  onRestartScan(): void {
    this.startScan();
  }

  @Watch('scanStateStatus')
  onScanStateStatusUpdated(newState: LfScanStateStatus, oldState: LfScanStateStatus) {
    if (newState !== oldState) {
      this.updateProgressText();
    }
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ==================================================
  // ==== LOCAL METHODS SECTION ===================================================================

  private async startScan() {
    this.log.debug('startScan');
    let errorMsg = `Unable to initiate scan on ${lfAppStateStore.deviceSelected?.serialNumber || 'this device'}.`;

    try {
      await lfRemoteApiDeviceService.hideTestcard(this.deviceSerial).catch();
      await lfRemoteApiAlignmentService.startScan(this.scanType, this.deviceSerial);

      await this.getScanStatus(this.deviceSerial);

      if (this.scanType === 'object') {
        const scanData = await lfAlignmentService.getObjectScanData(this.deviceSerial);
        const lfObjectName = getObjectNameById(scanData.objectAnalysis?.objectId);
        lfAlignmentStateStore.lfObjectName = lfObjectName || null;
        lfAlignmentStateStore.objectAnalysis = scanData.objectAnalysis;
        lfAlignmentStateStore.scanImageUrl = scanData.scanImageUrl;
        console.warn(scanData);

        const analysisFound = scanData.objectAnalysis.alignmentCorners || scanData.objectAnalysis.detectionBounds;
        console.warn(analysisFound);
        if (analysisFound && scanData.scanImageUrl) {
          lfAlignmentService.onSuccessfulAlignment();
          return;
        } else if (scanData.scanImageUrl && !analysisFound) {
          this.onFailedObjectAlignment();
          return;
        } else {
          this.openErrorModal("Something went wrong retrieving your preview.\nLet's try again.");
        }
      } else if (this.scanType === 'environment') {
        // get camera image with mask
        lfAlignmentService
          .getCameraImageMasked(this.deviceSerial)
          .then((res: LfImageResponse) => {
            if (res.imgUrl) {
              lfAlignmentStateStore.scanImageUrl = res.imgUrl;
              lfAlignmentStateStore.lfObjectName = 'Wall space';

              lfAlignmentService.onSuccessfulAlignment();
              return Promise.resolve(res.imgUrl);
            } else {
              return Promise.reject('Environment Image Unavailable');
            }
          })
          .catch(e => {
            return this.openErrorModal(e);
          });
      }
    } catch (error) {
      this.log.error(error);

      const errorDetails = error.message ? `Error: ${error.message}` : error;
      errorMsg = `${errorMsg} \n\n ${errorDetails}`;
      this.openErrorModal(errorMsg);
    }
  }

  // end start scan

  public async getScanStatus(deviceSerial: string) {
    this.log.debug('getScanStatus');

    let complete = false;
    let lastProgress = 0;
    let lastTime = +new Date();
    let scanState: LfScanState;

    while (!complete) {
      const response = lfRemoteApiAlignmentService.getScanState(deviceSerial);
      scanState = (await response).body;

      const failed = !!(scanState.error || scanState.errorMessage);
      const finished = scanState.state === LfScanStateStatus.Finished;

      const change = scanState.percentComplete - lastProgress || 0;
      const now = +new Date();
      const elapsed = Math.abs(now - lastTime);
      const rate = change && elapsed ? (change / elapsed) * 1000 : 5000;

      lastProgress = scanState.percentComplete;
      lastTime = +new Date();

      complete = failed || finished;
      this.scanStateStatus = scanState.state;

      if (!complete) {
        await new Promise(r => setTimeout(r, rate));
      } else if (failed) {
        throw new Error(scanState.errorMessage || scanState.error);
      }
    }
  }

  private async openErrorModal(msg: string) {
    this.alertDialog = await alertController.create({
      cssClass: 'lf-alert-modal',
      message: msg,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'secondary-button',
          handler: () => {
            lfAlignmentStateStore.scanType = null;
            resetAlignmentState();
            this.router.push('/scene-setup');
            lfRemoteApiDeviceService.stop(this.deviceSerial);
          },
        },
      ],
    });

    await this.alertDialog.present();
  }

  private onFailedObjectAlignment() {
    this.log.debug('onFailedObjectAlignment');

    this.router.push('/scene-setup-select-object');
  }

  private async updateProgressText() {
    this.log.debug('updateProgressText');

    const state = this.scanStateStatus.toString().toLowerCase();
    const updateInterval = this.scanStateTextMap[state]?.interval;
    const textArray = this.scanStateTextMap[state]?.text;

    clearInterval(this.intervalFn);

    if (updateInterval > 0 || textArray.length > 1) {
      let index = 0;
      await new Promise(
        () =>
          (this.intervalFn = setInterval(() => {
            this.progressText = textArray[index];
            let length = textArray.length;

            index = index === length - 1 ? 0 : ++index;
          }, updateInterval * 1000)),
      );
    } else {
      this.progressText = textArray[0];
    }
  }

  // ==== RENDERING SECTION =======================================================================
  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');

    const layoutClassName = this.isMobileLayout ? 'lf-layout--mobile' : 'lf-layout--desktop';

    return (
      <Host class={`page-lf-scene-scanning ion-page scroll-y ${layoutClassName}`}>
        <div class="scene-scanning--content">
          <div class="hero-text--container">
            <h1 class="hero-text--title">Preparing Your Scene</h1>
            <p class="hero-text--subtitle">Please don’t move your LF2+ in the meantime.</p>
          </div>
          <div class="scene-setup--progress-image-container">
            <img class="loading-spiral" src="/assets/icons/loading-spiral.svg" />
            <img class="scene-setup--background-image" src="/assets/images/LF2_plus.png" />
          </div>
          <div class="scene-setup--prompt">{this.progressText}</div>
        </div>
      </Host>
    );
  }
}
