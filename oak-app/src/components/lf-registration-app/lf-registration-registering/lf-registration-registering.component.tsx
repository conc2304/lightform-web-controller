// ==== Library Imports =======================================================
import { Component, Element, Event, EventEmitter, h, Host, Listen, Prop, State } from '@stencil/core';
import { Key as EventKey } from 'ts-key-enum';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import { ProcessStatus } from '../../../shared/enums/lf-process-status.enum';

@Component({
  tag: 'lf-registration-registering',
  styleUrls: ['lf-registration-registering.component.scss'],
})
export class LfRegistrationRegistering {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private restartBtn: HTMLInputElement;
  private seeErrorDetailsBtn: HTMLElement;
  private log = new LfLoggerService('LfRegistrationRegistering').logger;

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() processStatus: ProcessStatus = ProcessStatus.Pending;
  @State() errorCode: string | number | null = null;
  @State() userFirstName: string;
  @State() deviceName: string;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() registrationCode;

  // ==== EVENTS SECTION ========================================================================
  @Event() restartPairingProcess: EventEmitter;
  @Event() restartPasswordProcess: EventEmitter;
  @Event() appRouteChanged: EventEmitter;

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public componentWillLoad() {
    this.log.debug('componentWillLoad');

    // make call to register device
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
        case EventKey.ArrowDown:
        case EventKey.ArrowRight:
        case EventKey.ArrowLeft:
        case EventKey.ArrowUp:
          this.seeErrorDetailsBtn.focus();
          break;
        case EventKey.Enter:
          this.restartBtn.click();
          break;
      }
    }
    // On "See Details" Handler
    else if (activeEl === this.seeErrorDetailsBtn) {
      switch (e.key) {
        case EventKey.ArrowDown:
        case EventKey.ArrowLeft:
        case EventKey.ArrowRight:
        case EventKey.ArrowUp:
          this.restartBtn.focus();
          break;
        case EventKey.Enter:
          this.seeErrorDetailsBtn.click();
          break;
      }
    }
    // Default Handler
    else {
      this.restartBtn.focus();
      return;
    }
  }

  private focusRestartButton(): void {
    if (this.restartBtn) {
      setTimeout(() => {
        this.restartBtn.focus();
      }, 3000);
    }
  }





  // ==== RENDERING SECTION =====================================================================


  private renderStatusMsg() {
    const className = 'wifi-connecting--status-msg';

    switch (this.processStatus) {
      case ProcessStatus.Pending:
        return <p class={className}>Adding the device to your account ...</p>;
      case ProcessStatus.Successful:
        return (
          <p class={className}>
            Congratulations! {this.deviceName} is now added to {this.userFirstName}’s account.
          </p>
        );
      case ProcessStatus.Failed:
      default:
        return (
          <div class={`${className} error-msg`}>
            <div>Adding failed. Please try again.</div>
          </div>
        );
    }
  }

  private renderButtonContainer() {
    // Device Pairing Pending / Success
    if (this.processStatus === ProcessStatus.Failed) {
      return (
        <button
          ref={el => (this.restartBtn = el as HTMLInputElement)}
          class="wifi-connecting--action-btn full-width wifi-list-item"
          tabindex="0"
        >
          <div class="action-btn--text">OK</div>
        </button>
      );
    }
  }

  // - -  render Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render(): HTMLAllCollection {
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

        <div class="wifi-connecting--status-msg-container animation--pop-in center-and-shrink" style={{ '--animation-order': 2 } as any}>
          {this.renderStatusMsg()}
        </div>

          <div class="wifi-connecting--action-btn-container animation--pop-in" style={{ '--animation-order': 3 } as any}>
            {this.renderButtonContainer()}
          </div>
        </div>
    );
  }
}
