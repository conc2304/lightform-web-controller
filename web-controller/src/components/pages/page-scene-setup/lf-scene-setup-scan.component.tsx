// ==== Library Imports =======================================================
import { Component, Element, h, Host, Listen, Prop } from '@stencil/core';
import { alertController } from '@ionic/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfAppStateStore from '../../../store/lf-app-state.store';
import { LfDeviceScanType, LfRpcResponse } from '../../../shared/interfaces/lf-web-controller.interface';
import lfRemoteApiAlignmentService from '../../../shared/services/lf-remote-api/lf-remote-api-alignment.service';
import { LfScanStateStatus } from '../../../shared/enums/lf-scan-state-status.enum';
import lfAlignmentStateStore, { getObjectNameById, resetAlignmentState } from '../../../store/lf-alignment-state.store';
import lfAlignmentService from '../../../shared/services/lf-alignment.service';
import { LfImageResponse } from '../../../shared/models/lf-camera-scan-image.model';

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

  // ==== HOST HTML REFERENCE =====================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION ===============================================================

  // ==== PUBLIC PROPERTY API - Prop() SECTION ====================================================
  @Prop() scanType: LfDeviceScanType = lfAlignmentStateStore.scanType;
  @Prop() deviceSerial: string = lfAppStateStore.deviceSelected?.serialNumber;
  @Prop() isMobileLayout: boolean = lfAppStateStore.mobileLayout;

  // ==== EVENTS SECTION ==========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================

  public async componentWillLoad() {
    this.log.warn('componentWillLoad');

    if (!this.scanType || !lfAppStateStore.deviceSelected?.serialNumber || this.deviceSerial !== lfAppStateStore?.deviceSelected?.serialNumber) {
      resetAlignmentState();
      window.location.replace('/scene-setup');
      return;
    }

    this.startScan();
  }

  // - -  componentDidLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad() {
    this.log.warn('componentDidLoad');

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

  // ==== PUBLIC METHODS API - @Method() SECTION ==================================================
  // ==== LOCAL METHODS SECTION ===================================================================

  private async startScan() {
    this.log.info('startScan');
    let errorMsg = `Unable to initiate scan on ${lfAppStateStore.deviceSelected?.serialNumber || 'this device'}.`;
    let scanProgress;

    const scanInit = await lfRemoteApiAlignmentService
      .startScan(this.scanType, this.deviceSerial)
      .then(response => {
        if (response.error) {
          if (response.error.message) {
            errorMsg += `  Error: ${response.error.message}`;
          }
          return Promise.reject(response.error);
        } else {
          return Promise.resolve(response);
        }
      })
      .catch((response: LfRpcResponse) => {
        this.log.error(response);
        if (response.error?.message) {
          errorMsg += `  Error: ${response.error.message}`;
        }
        this.openErrorModal(errorMsg);
        return Promise.reject(response);
      });

    if (scanInit.result && !scanInit.error) {
      scanProgress = await lfAlignmentService
        .checkScanStatus(this.deviceSerial)
        .then(result => {
          return result;
        })
        .catch(error => {
          errorMsg += `  Error: ${error}`;
          this.openErrorModal(errorMsg);
          return Promise.reject(errorMsg);
        });
    } else {
      console.error('No Scan init results or error');
      return;
    }

    if (scanProgress?.state === LfScanStateStatus.Finished) {
      if (this.scanType === 'object') {
        const scanData = await lfAlignmentService.getObjectScanData(this.deviceSerial);
        const lfObjectName = getObjectNameById(scanData.objectAnalysis?.objectId);
        lfAlignmentStateStore.lfObjectName = lfObjectName || null;
        lfAlignmentStateStore.objectAnalysis = scanData.objectAnalysis;
        lfAlignmentStateStore.scanImageUrl = scanData.scanImageUrl;

        this.router.push(`/scene-setup/align/${this.scanType}`);
      } else if (this.scanType === 'environment') {
        // get camera image with mask
        lfAlignmentService
          .getCameraImageMasked(this.deviceSerial)
          .then((res: LfImageResponse) => {
            if (res.imgUrl) {
              lfAlignmentStateStore.scanImageUrl = res.imgUrl;
              lfAlignmentStateStore.lfObjectName = 'Wall space';

              this.router.push(`/scene-setup/align/${this.scanType}`);
              return Promise.resolve(res.imgUrl);
            } else {
              return Promise.reject('Environment Image Unavailable');
            }
          })
          .catch(e => {
            return this.openErrorModal(e);
          });
      }
    } else {
      return this.openErrorModal(errorMsg);
    }
  }

  // end start scan

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
          },
        },
      ],
    });

    await this.alertDialog.present();
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
          <div class="scene-setup--prompt">Scanning Scene...</div>
        </div>
      </Host>
    );
  }
}
