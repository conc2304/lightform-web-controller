// ==== Library Imports =======================================================
import { Component, h, Element, Listen, Event, EventEmitter, State, Host, Prop } from '@stencil/core';
import { Key as EventKey } from 'ts-key-enum';
import { LfAppState } from '../../../shared/services/lf-app-state.service';
import { RouterHistory } from '@stencil/router';

// ==== App Imports ===========================================================
import LfFirmwareApiInterface from '../../../shared/services/lf-firmware-api-interface.service';
import LfLoggerService from '../../../shared/services/lf-logger.service';
import { firmwareUpdateRequired } from '../../../shared/services/lf-utilities.service';
import { LF_REMOTE_BACK_BUTTON } from '../../../shared/lf-remote-keycodes.constants';
import { LF_CTA_URL } from '../../../shared/lf-cta-url.constant';
import lfRegistrationApiInterfaceService from '../../../shared/services/lf-registration-api-interface.service';

@Component({
  tag: 'lf-firmware-app',
  styleUrl: 'lf-firmware-app.component.scss',
})
export class LfFirmwareApp {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private -------------------------------------------------------------------------------
  private errorCode: number;
  private restartButtonEl: HTMLInputElement;
  private log = new LfLoggerService('LfFirmwareApp').logger;

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() firmwarePageEl: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() updateStatus: 'pending' | 'failed' = 'pending';
  @State() updateProgress: number = 0;
  @State() currentVersion = LfAppState.currentFirmware || null;
  @State() availableVersion = LfAppState.availableFirmware || null;
  @State() processStatus: 'Downloading' | 'Installing' = 'Downloading';

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() history: RouterHistory;

  // ==== EVENTS SECTION ========================================================================
  @Event() restartPairingProcess: EventEmitter<void>;

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - -
  public componentWillLoad(): void {
    this.log.debug('Current', this.currentVersion);
    this.log.debug('Available', this.currentVersion);
    this.log.debug('componentWillLoad');

    if (!this.currentVersion) {
      this.currentVersion = lfRegistrationApiInterfaceService.getCurrentFirmwareVersion();
    }
    setTimeout(() => {
      // Wait for android to maybe be ready
      this.initiateFirmwareUpdate();
    }, 2000);
  }

  // ==== LISTENERS SECTION =====================================================================
  @Listen('downloadProgressUpdated', {
    target: 'window',
    capture: true,
  })
  onDownloadProgressUpdated(event: any) {
    this.log.debug('onDownloadProgressUpdated');

    this.log.debug(`Downloaded: ${event.detail}%`);

    const { progress, status } = event?.detail;
    this.updateStatus = status ? 'pending' : 'failed';
    this.updateProgress = Math.floor(progress);

    if (progress >= 100) {
      this.processStatus = 'Installing';
      LfFirmwareApiInterface.unregisterCallback();
      LfFirmwareApiInterface.installFirmware();
      // the device should now reboot after installation
    }
  }

  @Listen('keydown', {
    target: 'window',
    capture: true,
  })
  onKeydown(e: KeyboardEvent): void {
    this.log.debug('onKeydown');
    this.keyHandler(e);
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ========================================================

  // ==== LOCAL METHODS SECTION =========================================================================

  private async initiateFirmwareUpdate() {
    this.log.debug('initiateFirmwareUpdate');

    const { currentVersion, availableVersion } =
      !this.availableVersion || !this.currentVersion
        ? await LfFirmwareApiInterface.getFirmwareState()
        : { currentVersion: this.currentVersion, availableVersion: this.availableVersion };

    this.log.debug(currentVersion, availableVersion);

    this.currentVersion = currentVersion;
    this.availableVersion = availableVersion;

    if (firmwareUpdateRequired(availableVersion, currentVersion)) {
      LfFirmwareApiInterface.registerChangeCallback();
      LfFirmwareApiInterface.downloadFirmware();
    } else {
      // firmware versions are the same
      this.history.push('/registration');
    }
  }

  private async handleDownloadRestart() {
    this.log.debug('handleDownloadRestart');
    this.initiateFirmwareUpdate();
  }

  private keyHandler(e: KeyboardEvent) {
    this.log.debug('keyHandler');

    const specialKeys = [EventKey.ArrowDown, EventKey.ArrowUp].map(key => {
      return key.toString();
    });

    const activeElement = document.activeElement;

    if (specialKeys.includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (e.key === LF_REMOTE_BACK_BUTTON && this.updateStatus === 'failed') {
      this.restartPairingProcess.emit();
      return;
    }

    if (activeElement !== this.restartButtonEl && this.restartButtonEl) {
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
    this.log.debug('renderFirmwareUpdateContent');
    const firmwareStateClass = `status-${this.updateStatus}`;

    return (
      <div class="firmware-update--container">
        {/* start status container */}
        <div class="firmware-update--status-container animation--pop-in center-and-shrink" style={{ '--animation-order': 1 } as any}>
          <div class="firmware-update--points old-firmware">
            <div class="firmware-version--wrapper">{this.currentVersion || 'X.X.X.XXX'}</div>
          </div>

          <div class="firmware-update--status-wrapper">
            <div class={`firmware-update--status-icon ${firmwareStateClass}`}></div>
          </div>

          <div class="firmware-update--points new-firmware">
            <div class="firmware-version--wrapper">{this.availableVersion || 'Checking'}</div>
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
        <p class={msgClass}>
          Please leave your LF2+ powered on during the process. It will restart once the download is completed.
          <br />
          <br /> <span class="learn-more">Learn more at {LF_CTA_URL}</span>
        </p>,
        // implementation of vaadin-progress-bar
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
        <br />,
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

  private getTitle() {
    return this.processStatus === 'Downloading' ? 'Download Latest Firmware' : 'Firmware Update';
  }

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    return (
      <Host class="app-flow-container">
        <div class="background-fader"></div>
        <lf-card cardTitle={this.getTitle()}>{this.renderFirmwareUpdateContent()}</lf-card>
        <lf-cta-container faded={true} />
      </Host>
    );
  }
}
