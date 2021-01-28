// ==== Library Imports =======================================================
import { Component, Element, Event, EventEmitter, h, Listen, Prop, State } from '@stencil/core';
import { Key as EventKey } from 'ts-key-enum';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import { ProcessStatus } from '../../../shared/enums/lf-process-status.enum';
import { androidExit, androidSetDoneFlag, callAndroidAsync } from '../../../shared/services/lf-android-interface.service';
import { randomToString } from '../../../shared/services/lf-utilities.service';

@Component({
  tag: 'lf-registration-registering',
  styleUrls: ['lf-registration-registering.component.scss'],
})
export class LfRegistrationRegistering {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private restartBtn: HTMLInputElement;
  private log = new LfLoggerService('LfRegistrationRegistering').logger;

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() processStatus: ProcessStatus = ProcessStatus.Pending;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() registrationCode;

  // ==== EVENTS SECTION ========================================================================
  @Event() restartDeviceRegistration: EventEmitter<void>;

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');

    if (!this.registrationCode) {
      this.restartRegistration();
    }

    this.registerDevice();
  }

  // ==== LISTENERS SECTION =====================================================================
  @Listen('keydown', {
    target: 'window',
    capture: true,
  })
  onKeydown(e: KeyboardEvent) {
    this.log.debug('onKeydown');
    this.handleKeys(e);
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ================================================

  // ==== LOCAL METHODS SECTION =================================================================
  private handleKeys(e) {
    this.log.debug('handleKeys');

    const specialKeys = [EventKey.ArrowDown, EventKey.ArrowUp, EventKey.ArrowLeft, EventKey.ArrowRight, EventKey.Enter];
    const activeEl = document.activeElement;

    if (specialKeys.includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
    }

    // -------- Remote/Keyboard Navigation ------------ //
    // On "Start Over" Handler
    if (activeEl === this.restartBtn) {
      switch (e.key) {
        case EventKey.Enter:
          this.restartBtn.click();
          break;
      }
    }
    // Default Handler
    else {
      this.restartBtn.focus();
      return;
    }
  }

  private restartRegistration() {
    this.log.debug('restartRegistration');
    this.restartDeviceRegistration.emit();
  }

  private async registerDevice() {
    this.log.debug('registerDevice');

    const command = {
      jsonrpc: '2.0',
      id: randomToString(),
      method: 'registerDevice - TODO',
      params: { registrationCode: this.registrationCode },
    };

    callAndroidAsync(command)
      .then((response: any) => JSON.parse(response))
      .then(data => {
        if (data.error) {
          return Promise.reject(data.error);
        }

        return data?.result ? Promise.resolve(data.result) : Promise.reject('No registration details available');
      })
      .then(result => {
        Promise.resolve(result);
        this.processStatus = ProcessStatus.Successful;
        androidSetDoneFlag();
        androidExit();
      })
      .catch(error => {
        this.processStatus = ProcessStatus.Failed;
        throw new Error(error);
      });
  }

  // ==== RENDERING SECTION =====================================================================

  private renderStatusMsg() {
    const className = 'device-registration--status-msg';

    switch (this.processStatus) {
      case ProcessStatus.Pending:
        return <p class={className}>Adding the device to your account ...</p>;
      case ProcessStatus.Successful:
        return <p class={className}>Congratulations! Your device is now added to your account.</p>;
      case ProcessStatus.Failed:
      default:
        return <p class={className}>Adding failed. Please try again.</p>;
    }
  }

  private renderButtonContainer() {
    // Device Pairing Pending / Success
    if (this.processStatus === ProcessStatus.Failed) {
      return (
        <button
          ref={el => (this.restartBtn = el as HTMLInputElement)}
          class="action-btn full-width"
          tabindex="0"
          onClick={() => {
            this.restartRegistration();
          }}
        >
          <div class="action-btn--text">OK</div>
        </button>
      );
    }
  }

  // - -  render Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    return (
      <div class="wifi-connecting--container">
        {/* start status container */}
        <lf-process-status-diagram
          status={this.processStatus}
          processSenderName="Lightform"
          processReceiverName="Account"
          processSenderImg="./assets/images/logos/Logomark Black@60px.svg"
          processReceiverImg="./assets/images/icons/account-circle-icon.svg"
        />

        <div class="status-msg-container animation--pop-in" style={{ '--animation-order': 2 } as any}>
          {this.renderStatusMsg()}
        </div>

        <div class="action-btn--container animation--pop-in" style={{ '--animation-order': 3 } as any}>
          {this.renderButtonContainer()}
        </div>
      </div>
    );
  }
}
