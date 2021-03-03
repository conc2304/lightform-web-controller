// ==== Library Imports =======================================================
import { Component, Element, Event, EventEmitter, h, Listen, Prop } from '@stencil/core';
import { alertController } from '@ionic/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfAppStateStore from '../../../store/lf-app-state.store';
import { LfDeviceScanType, LfSceneSetupState } from '../../../shared/interfaces/lf-web-controller.interface';
import lfRemoteApiAlignmentService from '../../../shared/services/lf-remote-api/lf-remote-api-alignment.service';
import { LfScanStateStatus } from '../../../shared/enums/lf-scan-state-status.enum';
import lfAlignmentStateStore, { getObjectNameById } from '../../../store/lf-alignment-state.store';
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
  @Prop() scanType: LfDeviceScanType = lfAlignmentStateStore.scanType;
  @Prop() deviceSerial: string = lfAppStateStore.deviceSelected.serialNumber;

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

    if (!this.scanType || this.deviceSerial !== lfAppStateStore?.deviceSelected?.serialNumber) {
      this.router.push('/scene-setup');
      return;
    }

    this.startScan();
  }

  // ==== LISTENERS SECTION =======================================================================
  @Listen('_layoutUpdated', { target: 'document' })
  onWindowResized(): void {
    this.log.debug('onWindowResized');
    this.isMobileLayout = lfAppStateStore.mobileLayout;
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ==================================================
  // ==== LOCAL METHODS SECTION ===================================================================

  private async startScan() {
    this.log.debug('startScan');
    const errorMsg = `Unable to initiate scan on ${lfAppStateStore.deviceSelected.serialNumber}`;
    let scanProgress;

    const scanInit = await lfRemoteApiAlignmentService
      .startScan(this.scanType, this.deviceSerial)
      .then(response => {
        if (response.error) {
          return Promise.reject();
        } else {
          return Promise.resolve(response);
        }
      })
      .catch(e => {
        this.log.error(e);
        this.openErrorModal(errorMsg);
        return Promise.reject(e);
      });

    if (scanInit.result && !scanInit.error) {
      scanProgress = await lfAlignmentService
        .checkScanStatus(this.deviceSerial)
        .then(result => {
          return result;
        })
        .catch(errorMsg => {
          return errorMsg;
        });
    } else {
      return this.openErrorModal(errorMsg);
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
            this.scanProgressUpdated.emit(LfSceneSetupState.Pending);
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

    return [
      <div class={`page-scan-scene ${layoutClassName}`}>
        <div class="scene-setup--container">
          <lf-scene-setup-card heroTitle="Scanning Scene" isMobileLayout={this.isMobileLayout}>
            <div class="scene-setup--img-wrapper scanning">
              <img class="scene-setup--scan-image scanning" src="/assets/images/scan-in-progress.gif" />
              <div class="scene-setup--prompt">Please don’t move your device during the scanning process.</div>
            </div>
          </lf-scene-setup-card>
        </div>
      </div>,
    ];
  }
}
