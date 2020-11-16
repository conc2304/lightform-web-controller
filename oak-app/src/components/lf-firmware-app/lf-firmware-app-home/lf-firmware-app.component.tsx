// ==== Library Imports =======================================================
import { Component, h, Element, Listen, Method, State, Host, Prop } from '@stencil/core';
import { Key as EventKey } from 'ts-key-enum';

// ==== App Imports ===========================================================
import LfFirmwareApiInterface from '../../../shared/services/lf-firmware-api-interface.service';

@Component({
  tag: 'lf-firmware-app',
  styleUrl: 'lf-firmware-app.component.scss',
})
export class LfFirmwareApp {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private -------------------------------------------------------------------------------
  private currentVersion = 'X.X.X.XXX';
  private updateVersion = 'Y.Y.Y.YYY';
  private errorCode: number;
  private errorMessage: string;
  private restartButtonEl: HTMLInputElement;

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() el: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() updateStatus: 'pending' | 'failed' = 'pending';
  @State() updateProgress: number = 0;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================

  // ==== EVENTS SECTION ========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentDidLoad Implementation - - - - - - - - - - - - - - - - - - - - -
  public componentWillRender(): void {
    console.log('componentWillRender');
    // make a call to get the firmware versions to display
    // Waiting for endpoints
    this.getDeviceFirmwareInfo();
  }

  public componentDidRender(): void {
    console.log('componentDidRender');
    // maybe make a call to the android webview to let them know we are ready
  }

  // ==== LISTENERS SECTION =====================================================================
  @Listen('firmwareDownloadProgress', {
    target: 'window',
    capture: true,
  })
  onDownloadProgressUpdated(event: any) {
    console.log('onDownloadProgressUpdated');

    const { progress, status } = event?.detail;
    this.updateStatus = status ? 'pending' : 'failed';
    this.updateProgress = Math.floor(progress);

    if (this.updateStatus === 'failed') {
      this.getFirmwareErrorDetails();
    }
  }

  @Listen('keydown', {
    target: 'window',
    capture: true,
  })
  onKeydown(e: KeyboardEvent): void {
    console.log('onKeydown--Firmware');
    this.keyHandler(e);
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ========================================================
  @Method()
  async updateFirmwareProgress() {
    console.log('Method - updateFirmwareProgress');
  }

  // ==== LOCAL METHODS SECTION =========================================================================
  private async getDeviceFirmwareInfo(): Promise<any> {
    console.log('getDeviceFirmwareInfo');

    try {
      await LfFirmwareApiInterface.getDeviceFirmwareInfo()
        .then(response => {
          if (!response) {
            throw new Error('No Firmware Info Response Received.');
          }

          this.currentVersion = response.currentVersion;
          this.updateVersion = response.updateVersion;
        })
        .catch(error => {
          throw new Error(error);
        });
    } catch (error) {
      console.error(error);
      this.updateStatus = 'failed';
    }
  }

  private async getFirmwareErrorDetails(): Promise<any> {
    await LfFirmwareApiInterface.getFirmwareErrorDetails()
      .then(response => {
        if (!response) {
          throw new Error('No Error Response Received.');
        }

        this.errorCode = response.errorCode;
        this.errorMessage = response.errorMessage;
      })
      .catch(error => {
        throw new Error(error);
      });
  }

  private async handleDownloadRestart() {
    console.log('handleDownloadRestart');

    // TODO Make A Call to the Android Back End To re-trigger the download
    await LfFirmwareApiInterface.restartFirmwareDownload();
  }

  private keyHandler(e: KeyboardEvent) {
    console.log('keyHandler');

    const specialKeys = [EventKey.ArrowDown, EventKey.ArrowUp].map(key => {
      return key.toString();
    });

    const activeElement = document.activeElement;

    if (specialKeys.includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (activeElement !== this.restartButtonEl) {
      this.restartButtonEl.focus();
    }
    switch (e.key) {
      case EventKey.ArrowDown:
        break;
      case EventKey.ArrowUp:
        break;
      case EventKey.Enter:
        break;
    }
  }

  // ==== RENDERING SECTION =========================================================================
  private renderFirmwareUpdateContent() {
    console.log('renderFirmwareUpdateContent');
    const firmwareStateClass = `status-${this.updateStatus}`;

    return (
      <div class="firmware-update--container">
        {/* start status container */}
        <div class="firmware-update--status-container animation--pop-in center-and-shrink" style={{ '--animation-order': 1 } as any}>
          <div class="firmware-update--points old-firmware">
            <div class="firmware-version--wrapper">{this.currentVersion}</div>
          </div>

          <div class="firmware-update--status-wrapper">
            <div class={`firmware-update--status-icon ${firmwareStateClass}`}></div>
          </div>

          <div class="firmware-update--points new-firmware">
            <div class="firmware-version--wrapper">{this.updateVersion}</div>
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
    if (this.updateStatus === 'failed') {
      return (
        <button
          onClick={() => this.handleDownloadRestart()}
          ref={el => (this.restartButtonEl = el as HTMLInputElement)}
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
    const msgClass = 'firmware-update--status-msg animation--fade-in';
    // About to update
    if (this.updateStatus === 'pending') {
      return [
        <p class={msgClass}>Downloading latest firmware.</p>,
        <p class={msgClass}>Please keep the device plugged in during the process.</p>,
        <p class={msgClass}>The device will restart when finish downloading.</p>,
        <div class="progress-bar--wrapper">
          <vaadin-progress-bar id="progress-bar-custom-bounds" min="0" max="100" value={this.updateProgress}></vaadin-progress-bar>
          <span class="progress-bar--value">{this.updateProgress}%</span>
        </div>,
      ];
    }
    // Update Failed
    else if (this.updateStatus === 'failed') {
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
