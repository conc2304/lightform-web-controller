// ==== Library Imports =======================================================
import { Component, h, Element, Listen, Method, State, Host, Prop } from '@stencil/core';

// ==== App Imports ===========================================================
// import { LfAppState } from '../../../shared/services/lf-app-state.service';

@Component({
  tag: 'lf-firmware-app',
  styleUrl: 'lf-firmware-app.component.scss',
})
export class LfFirmwareApp {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private -------------------------------------------------------------------------------

  private currentFirmware = 'X.X.X.XXX';
  private nextFirmware = 'Y.Y.Y.YYY';
  private errorCode: number | string = 1234;
  private restartFirmwareBtn: HTMLElement;

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() el: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() firmwareUpdateState: 'pending' | 'failed' = 'pending';
  @State() firmwareDownloadProgress: number = 50;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================

  // ==== EVENTS SECTION ========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentDidLoad Implementation - - - - - - - - - - - - - - - - - - - - -
  public componentWillRender(): void {
    console.log('componentWillRender');
  }
  // ==== LISTENERS SECTION =====================================================================

  @Listen('firmwareDownloadProgress', {
    target: 'window',
    capture: true,
  })
  onDownloadProgressUpdated(event: any) {
    console.log('onDownloadProgressUpdated');
    const progress = event?.detail?.progress || 0;
    this.firmwareDownloadProgress = progress;
  }

  /**
   * Samples
   const event = new Event("firmwareDownloadProgress");
   event.detail = { progress: 50, }
   window.dispatchEvent(event)

   const event = new Event("firmwareDownloadStatus");
   event.detail = { downloadStatus: "failed", }
   event.detail = { downloadStatus: "pending", }
   window.dispatchEvent(event)
   */

  /**
   *
    let progress = 0;
    setInterval(function() {
      progress = progress < 100 ? progress + 1 : 0;
      const event = new Event("firmwareDownloadProgress");
      event.detail = { progress: progress, }
      window.dispatchEvent(event)
    }, 500);
   */

  @Listen('firmwareDownloadStatus', {
    target: 'window',
    capture: true,
  })
  onFirmwareStatusUpdated(event: any) {
    console.log('onFirmwareStatusUpdated');
    const downloadStatus = event?.detail?.downloadStatus;
    this.firmwareUpdateState = downloadStatus;

    if (this.firmwareUpdateState === 'failed') {
      setTimeout(() => {
        this.restartFirmwareBtn.focus();
      }, 3000);
    }
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ========================================================
  @Method()
  async updateFirmwareProgress() {
    console.log('Method - updateFirmwareProgress');
  }

  // ==== LOCAL METHODS SECTION =========================================================================
  private handleDownloadRestart(): void {
    console.log('handleDownloadRestart');
  }

  // ==== RENDERING SECTION =========================================================================
  private renderFirmwareUpdateContent() {
    console.log('renderFirmwareUpdateContent');
    const firmwareStateClass = `status-${this.firmwareUpdateState}`;

    return (
      <div class="firmware-update--container">
        {/* start status container */}
        <div class="firmware-update--status-container animation--pop-in center-and-shrink" style={{ '--animation-order': 1 } as any}>
          <div class="firmware-update--points old-firmware">
            <div class="firmware-version--wrapper">{this.currentFirmware}</div>
          </div>

          <div class="firmware-update--status-wrapper">
            <div class={`firmware-update--status-icon ${firmwareStateClass}`}></div>
          </div>

          <div class="firmware-update--points new-firmware">
            <div class="firmware-version--wrapper">{this.nextFirmware}</div>
          </div>
        </div>
        {/* end status container */}
        {this.renderStatusMsg()}

        <div class="firmware-update--action-btn-container animation--pop-in" style={{ '--animation-order': 3 } as any}>
          {this.renderButtonContainer()}
        </div>
      </div>
    );
  }

  private renderStatusMsg() {
    return (
      <div class="firmware-update--status-msg-container animation--pop-in" style={{ '--animation-order': 2 } as any}>
        {this.renderStatusMsgText()}
      </div>
    );
  }

  private renderButtonContainer() {
    if (this.firmwareUpdateState === 'failed') {
      return (
        <button
          onClick={() => this.handleDownloadRestart()}
          ref={el => (this.restartFirmwareBtn = el as HTMLInputElement)}
          class="action-btn--floating-bottom full-width"
          tabindex="0"
        >
          <div>Download Again</div>
        </button>
      );
    }
  }

  private renderStatusMsgText() {
    // implementation of vaadin-progress-bar
    const msgClass = 'firmware-update--status-msg';
    // About to update
    if (this.firmwareUpdateState === 'pending') {
      return [
        <p class={msgClass}>Downloading latest firmware.</p>,
        <p class={msgClass}>Please keep the device plugged in during the process.</p>,
        <p class={msgClass}>The device will restart when finish downloading.</p>,
        <div class="progress-bar--wrapper">
          <vaadin-progress-bar id="progress-bar-custom-bounds" min="0" max="100" value={this.firmwareDownloadProgress}></vaadin-progress-bar>
          <span class="progress-bar--value">{this.firmwareDownloadProgress}%</span>
        </div>,
      ];
    }
    // Update Failed
    else if (this.firmwareUpdateState === 'failed') {
      return [
        <p class={msgClass}>Download Failed.</p>,
        <p class={msgClass}>
          Please try again, or contact us on <strong>lightform.com/contact</strong> for support.
        </p>,
        errorInfo(this.errorCode),
      ];
    }

    function errorInfo(errorCode: number | string | null) {
      if (errorCode) {
        return <p class="error-info">Error code: {errorCode}</p>;
      }
    }
  }

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    return (
      <Host class="lf-pairing-app appflow-container">
        <lf-card cardTitle="Firmware Update">{this.renderFirmwareUpdateContent()}</lf-card>
      </Host>
    );
  }
}
