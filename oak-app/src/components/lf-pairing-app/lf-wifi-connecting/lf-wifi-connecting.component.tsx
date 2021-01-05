// ==== Library Imports =======================================================
import { Component, Element, Event, EventEmitter, h, Host, Listen, State } from '@stencil/core';
import { Key as EventKey } from 'ts-key-enum';

// ==== App Imports ===========================================================
import { WifiEntry } from '../../../shared/interfaces/wifi-entry.interface';
import { RpcResponse } from '../../../shared/interfaces/network-rpc-response.interface';
import { LfAppState } from '../../../shared/services/lf-app-state.service';
import LfNetworkConnector from '../../../shared/services/lf-network-connection.service';
import LfLoggerService from '../../../shared/services/lf-logger.service';
import { ProcessStatus } from '../../../shared/enums/lf-process-status.enum';


@Component({
  tag: 'lf-wifi-connecting',
  styleUrls: ['lf-wifi-connecting.component.scss'],
  shadow: true,
})
export class LfWifiConnecting {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private restartPairingBtn: HTMLElement;
  private seeErrorDetailsBtn: HTMLElement;
  private log = new LfLoggerService('LfWifiConnecting').logger;

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() connectionStatus: ProcessStatus = ProcessStatus.Pending;
  @State() errorCode: string | number | null = null;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================

  // ==== EVENTS SECTION ========================================================================
  @Event() restartPairingProcess: EventEmitter;
  @Event() restartPasswordProcess: EventEmitter;
  @Event() appRouteChanged: EventEmitter;

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public componentWillLoad() {
    this.log.debug('componentWillLoad');

    const network = LfAppState.selectedNetwork;
    this.connect(network);
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
    const activeEl = this.hostElement.shadowRoot.activeElement;

    if (specialKeys.includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
    }

    // -------- Remote/Keyboard Navigation ------------ //
    // On "Start Over" Handler
    if (activeEl === this.restartPairingBtn) {
      switch (e.key) {
        case EventKey.ArrowDown:
        case EventKey.ArrowRight:
        case EventKey.ArrowLeft:
        case EventKey.ArrowUp:
          this.seeErrorDetailsBtn.focus();
          break;
        case EventKey.Enter:
          this.restartPairingBtn.click();
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
          this.restartPairingBtn.focus();
          break;
        case EventKey.Enter:
          this.seeErrorDetailsBtn.click();
          break;
      }
    }
    // Default Handler
    else {
      this.restartPairingBtn.focus();
      return;
    }
  }

  private async connect(network: WifiEntry) {
    this.log.debug('connect');

    try {
      this.connectionStatus = ProcessStatus.Pending;
      this.errorCode = null;
      network.psk = LfAppState.password;

      const connection = await LfNetworkConnector.connectToNetwork(network)
        .then((response: RpcResponse) => {
          this.log.debug('Response');
          this.log.debug(response);
          if (!response) {
            throw new Error('No response connecting to network');
          } else if (!response || response.error) {
            const error = response.error.message ? response.error.message : response.error.code;
            throw new Error(error.toString());
          }

          return Promise.resolve(response);
        })
        .catch(error => {
          this.connectionStatus = ProcessStatus.Failed;
          throw new Error(error);
        });

      this.log.debug(connection);
      // a successful response is an empty results object/array ...
      if (connection['result']) {
        this.connectionStatus = ProcessStatus.Successful;
        this.focusRestartButton();
      } else {
        this.connectionStatus = ProcessStatus.Failed;
      }
    } catch (e) {
      console.error(e);
      this.connectionStatus = ProcessStatus.Failed;
    } finally {
      this.focusRestartButton();
    }
  }

  private focusRestartButton(): void {
    if (this.restartPairingBtn) {
      setTimeout(() => {
        this.restartPairingBtn.focus();
      }, 3000);
    }
  }

  private handlePairingRestart(): void {
    this.log.debug('handlePairingRestart');
    if (this.connectionStatus === ProcessStatus.Successful) {
      this.appRouteChanged.emit('firmware');
    } else {
      this.restartPairingProcess.emit();
    }
  }

  private displayErrorDetails(): void {
    this.log.debug('displayErrorDetails');
    // TODO - this hasn't been designed yet
  }

  // ==== RENDERING SECTION =====================================================================
  private renderStatusMsg() {
    const className = 'wifi-connecting--status-msg';

    switch (this.connectionStatus) {
      case ProcessStatus.Pending:
        return <p class={className}>Connecting to the internet ...</p>;
      case ProcessStatus.Successful:
        return <p class={className}>Successfully connected.</p>;
      case ProcessStatus.Failed:
      default:
        return (
          <div class={`${className} error-msg`}>
            <div>Unable to connect. Please check your network settings or make sure the password is correct.</div>
          </div>
        );
    }
  }

  private renderButtonContainer() {
    // Device Pairing Pending / Success
    if (this.connectionStatus !== ProcessStatus.Failed) {
      return (
        <button
          onClick={() => this.handlePairingRestart()}
          ref={el => (this.restartPairingBtn = el as HTMLInputElement)}
          class="wifi-connecting--action-btn full-width wifi-list-item"
          tabindex="0"
        >
          <div class="action-btn--text">{this.connectionStatus === ProcessStatus.Pending ? 'Cancel' : 'OK'}</div>
        </button>
      );
    }
    // Device Pairing Failed
    else {
      return [
        <button
          onClick={() => this.displayErrorDetails()}
          ref={el => (this.seeErrorDetailsBtn = el as HTMLInputElement)}
          class="wifi-connecting--action-btn half-width wifi-list-item"
          tabindex="0"
        >
          <div class="action-btn--text">See Details</div>
        </button>,
        <button
          onClick={() => this.handlePairingRestart()}
          ref={el => (this.restartPairingBtn = el as HTMLInputElement)}
          class="wifi-connecting--action-btn half-width wifi-list-item"
          tabindex="0"
        >
          <div class="action-btn--text">Start Over</div>
        </button>,
      ];
    }
  }

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render(): HTMLAllCollection {
    return (
      <Host>
        <div class="wifi-connecting--container">
          <lf-process-status-diagram
            status={this.connectionStatus}
            processSenderName="Lightform"
            processReceiverName="Internet"
            processSenderImg="./assets/images/logos/Logomark Black@60px.svg"
            processReceiverImg="./assets/images/icons/globe.svg"
          />

          <div class="wifi-connecting--status-msg-container animation--pop-in center-and-shrink" style={{ '--animation-order': 2 } as any}>
            {this.renderStatusMsg()}
          </div>

          <div class="wifi-connecting--action-btn-container animation--pop-in" style={{ '--animation-order': 3 } as any}>
            {this.renderButtonContainer()}
          </div>
        </div>
      </Host>
    );
  }
}
