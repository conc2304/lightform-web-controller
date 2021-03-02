// ==== Library Imports =======================================================
import { Component, h, Element, State, Listen, Host, Prop } from '@stencil/core';
import { RouterHistory } from '@stencil/router';
import { androidExit, androidSetDoneFlag } from '../../shared/services/lf-android-interface.service';
import lfFirmwareApiInterfaceService from '../../shared/services/lf-firmware-api-interface.service';

// ==== App Imports ===========================================================
import LfLoggerService from '../../shared/services/lf-logger.service';

@Component({
  tag: 'lf-oakseed-app',
  styleUrl: 'lf-oakseed-app.component.scss',
})
export class LfPairingApp {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private -------------------------------------------------------------------------------
  private log = new LfLoggerService('LfOakseedApp').logger;

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() el: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() downloadProgress: number = 0;
  @State() downloadStatus: 'pending' | 'failed' | 'success' = 'pending';

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() history: RouterHistory;

  // ==== EVENTS SECTION ========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - -
  public componentWillLoad(): void {
    this.log.debug('componentWillLoad');
    setTimeout(() => {
      // Wait for android to maybe be ready
      this.initiateOakseedDownload();
    }, 1000);
  }
  // ==== LISTENERS SECTION =====================================================================
  @Listen('oakseedDownloadProgress', { // TODO is this the implementation
    target: 'window',
    capture: true,
  })
  onDownloadProgressUpdated(event: any) {
    this.log.debug('onDownloadProgressUpdated');

    this.log.debug(event.detail);

    const { progress, status } = event?.detail;
    this.downloadStatus = status ? 'pending' : 'failed';
    this.downloadProgress = Math.floor(progress);

    if (progress >= 100) {
      lfFirmwareApiInterfaceService.unregisterCallback(); // todo depends on implementation
      this.downloadStatus = 'success';
      // the device should now reboot after installation
    }

    if (this.downloadStatus === 'failed') {
      // todo no api yet
      // this.getFirmwareErrorDetails();
    } else if (this.downloadStatus === 'success') {
      setTimeout(() => {
        androidSetDoneFlag();
        androidExit();
      }, 2000);
    }
  }
  // ==== PUBLIC METHODS API - @Method() SECTION ========================================================

  // ==== LOCAL METHODS SECTION =========================================================================
  private initiateOakseedDownload() {
    // register callback and init download

    lfFirmwareApiInterfaceService.registerChangeCallback(); // maybe - TODO
    lfFirmwareApiInterfaceService.downloadOakseed();
  }

  // ==== RENDERING SECTION =========================================================================
  private renderOakseedContent() {
    return [
      <div class="lf-oakseed--content-container">
        <div class="lf-oakseed-prompt">
          <p>
            Just a few more minutes so we can <br />
            provide you the latest experience.
          </p>
          <p>
            Meanwhile, visit the Lightform <br />
            Web App at <strong>lght.fm/app</strong>
          </p>
        </div>
        <div class="progress-bar--wrapper">
          <vaadin-progress-bar id="progress-bar-custom-bounds" min="0" max="100" value={this.downloadProgress}></vaadin-progress-bar>
          <span class="progress-bar--value">{this.downloadProgress}%</span>
        </div>
      </div>,
    ];
  }

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    return (
      <Host class="lf-oakseed-app app-flow-container">
        <div class="background-fader"></div>
        <lf-card cardTitle="Getting Device Ready">{this.renderOakseedContent()}</lf-card>
        <lf-cta-container faded={true} />
      </Host>
    );
  }
}
