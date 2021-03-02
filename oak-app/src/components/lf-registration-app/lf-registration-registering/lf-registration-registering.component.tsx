// ==== Library Imports =======================================================
import { Component, Element, Event, EventEmitter, h, Listen, Prop, State } from '@stencil/core';
import { Key as EventKey } from 'ts-key-enum';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import { ProcessStatus } from '../../../shared/enums/lf-process-status.enum';
import lfRegistrationApiInterfaceService from '../../../shared/services/lf-registration-api-interface.service';
import { androidGetDeviceName } from '../../../shared/services/lf-android-interface.service';
import { LF_REMOTE_BACK_BUTTON } from '../../../shared/lf-remote-keycodes.constants';
import { RouterHistory } from '@stencil/router';

@Component({
  tag: 'lf-registration-registering',
  styleUrls: ['lf-registration-registering.component.scss'],
})
export class LfRegistrationRegistering {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private restartBtn: HTMLInputElement;
  private log = new LfLoggerService('LfRegistrationRegistering').logger;

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() processStatus: ProcessStatus = ProcessStatus.Pending;
  @State() deviceName = androidGetDeviceName();
  @State() userFirstName: string;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() registrationCode: string;
  @Prop() history: RouterHistory;

  // ==== EVENTS SECTION ========================================================================
  @Event() restartDeviceRegistration: EventEmitter<void>;

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');

    if (!this.registrationCode) {
      this.restartRegistration();
    }

    lfRegistrationApiInterfaceService
      .postRegistrationCode(this.registrationCode)
      .then(async () => {
        await lfRegistrationApiInterfaceService.getUser().then(res => {
          const userData = res.body;
          this.userFirstName = userData?.firstName;
        });

        this.processStatus = ProcessStatus.Successful;

        setTimeout(() => {
          this.restartBtn.focus();
        }, 300);
      })
      .catch(e => {
        this.processStatus = ProcessStatus.Failed;
        this.log.error(e);
      });
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

    const specialKeys = [EventKey.ArrowDown, EventKey.ArrowUp, EventKey.ArrowLeft, EventKey.ArrowRight, EventKey.Enter, LF_REMOTE_BACK_BUTTON];
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

  // ==== RENDERING SECTION =====================================================================

  private renderStatusMsg() {
    const className = 'device-registration--status-msg';

    switch (this.processStatus) {
      case ProcessStatus.Pending:
        return <p class={className}>Registering {this.deviceName || 'Your device'} to your account ...</p>;
      case ProcessStatus.Successful:
        return (
          <p class={className}>
            Congratulations! {this.deviceName || 'Your device'} is <br /> now added to {`${this.userFirstName}'s` || 'your'} account.
          </p>
        );
      case ProcessStatus.Failed:
      default:
        return <p class={className}>Register failed. Please try again.</p>;
    }
  }

  private renderButtonContainer() {
    // Device Pairing Pending / Success
    if (this.processStatus === ProcessStatus.Failed || this.processStatus === ProcessStatus.Successful) {
      return (
        <button
          ref={el => (this.restartBtn = el as HTMLInputElement)}
          class="action-btn full-width"
          tabindex="0"
          onClick={() => {
            if (this.processStatus === ProcessStatus.Successful) {
              this.history.push('/oakseed');
            } else if (this.processStatus === ProcessStatus.Failed) {
              this.restartRegistration();
            }
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
      <div class="in-progress-info--container">
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
