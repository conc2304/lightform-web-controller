// ==== Library Imports =======================================================
import { Component, Element, Event, EventEmitter, h, Host, Listen, State } from '@stencil/core';
import { Key as EventKey } from 'ts-key-enum';

// ==== App Imports ===========================================================
import { WifiEntry } from '../../shared/interfaces/wifi-entry.interface';
import { RpcResponse } from '../../shared/interfaces/network-rpc-response.interface';
import { LfAppState } from '../../shared/services/lf-app-state.service';
import LfNetworkConnector from '../../shared/services/lf-network-connection.service';
import { LfConf } from '../../global/resources';

enum ConnectionStatus {
  Connecting,
  Successful,
  Failed,
}

@Component({
  tag: 'lf-wifi-connecting',
  styleUrls: ['lf-wifi-connecting.component.scss'],
  shadow: true,
})
export class LfWifiConnecting {
  // ==== OWN PROPERTIES SECTION =======================================================================
  // Dependency Injections
  private lfAppState = LfAppState;
  private NetworkConnector = LfNetworkConnector;

  // ---- Private  -----------------------------------------------------------------------------
  private connectionActionBtn: HTMLElement;

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() connectionStatus: ConnectionStatus = ConnectionStatus.Connecting;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  // @Prop() propName: string = "string";

  // ==== EVENTS SECTION ========================================================================
  @Event() restartPairingProcess: EventEmitter;

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public componentWillLoad() {
    console.log('componentWillLoad');

    const network = this.lfAppState.selectedNetwork;

    // For on device Build - Simulate progress even though the responses are instant
    const timeout = LfConf.device ? 1000 * (Math.random() * (6 - 3) + 3) : 0;
    this.connectionStatus = ConnectionStatus.Connecting;
    setTimeout(() => {
      this.connectToNetwork(network);
    }, timeout);
  }

  // ==== LISTENERS SECTION =====================================================================
  @Listen('keydown', {
    target: 'window',
    capture: true,
  })
  onKeydown(e: KeyboardEvent) {
    console.log('onKeydown');
    this.handleKeys(e);
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ========================================================
  // @Method()
  // async publicMethod(): Promise<void> {
  //   return;
  // }

  // ==== LOCAL METHODS SECTION =========================================================================
  private handleKeys(e) {
    console.log('handleKeys');

    const specialKeys = [EventKey.ArrowDown, EventKey.ArrowUp, EventKey.ArrowLeft, EventKey.ArrowRight, EventKey.Enter];
    const activeEl = this.hostElement.shadowRoot.activeElement;

    if (specialKeys.includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
    }

    switch (e.key) {
      case EventKey.ArrowDown:
      case EventKey.ArrowUp:
      case EventKey.ArrowLeft:
      case EventKey.ArrowRight:
        console.log('KEY', e.key);
        this.connectionActionBtn.focus();
        break;

      case EventKey.Enter:
        if (activeEl !== this.connectionActionBtn) {
          this.connectionActionBtn.focus();
        } else {
          this.onConnectionBtnClick();
        }
        break;
    }
  }

  private async connectToNetwork(network: WifiEntry) {
    console.log('connectToNetwork');

    try {
      this.connectionStatus = ConnectionStatus.Connecting;
      network.psk = LfAppState.password;

      this.NetworkConnector.connectToNetwork(network)
        .then((response: RpcResponse) => {
          console.log('Response');
          console.log(response);
          if (!response) {
            throw new Error('No response connecting to network');
          } else if (!response || response.error) {
            const error = response.error.message ? response.error.message : response.error.code;
            throw new Error(error.toString());
          }
          this.connectionStatus = ConnectionStatus.Successful;
          this.connectionActionBtn.focus();
        })
        .catch(error => {
          this.connectionStatus = ConnectionStatus.Failed;
          this.connectionActionBtn.focus();
          throw new Error(error);
        });
    } catch (e) {
      console.error(e);
      this.connectionStatus = ConnectionStatus.Failed;
    }
  }

  private onConnectionBtnClick(): void {
    console.log('onConnectionBtnClick');
    this.restartPairingProcess.emit();
  }

  // ==== RENDERING SECTION =========================================================================
  private renderConnectingStatus(): HTMLAllCollection {
    switch (this.connectionStatus) {
      case ConnectionStatus.Connecting:
        return <div class="progress-line"></div>;
      case ConnectionStatus.Successful:
        return (
          <img
            src="assets/images/icons/checkmark--rounded-green.svg"
            class="wifi-connecting--status-icon success-icon animation--pop-in"
            style={{ '--animation-order': 1 } as any}
          ></img>
        );
      case ConnectionStatus.Failed:
        return <img src="assets/images/icons/x--flat-red.svg" class="wifi-connecting--status-icon failed-icon animation--pop-in" style={{ '--animation-order': 1 } as any}></img>;
    }
  }

  private renderStatusMsg(): HTMLAllCollection {
    const className = 'wifi-connecting--status-msg';

    switch (this.connectionStatus) {
      case ConnectionStatus.Connecting:
        return <p class={className}>Connecting to the internet ...</p>;
      case ConnectionStatus.Successful:
        return <p class={className}>Successfully Connected.</p>;
      case ConnectionStatus.Failed:
      default:
        return (
          <p class={className}>
            Unable to connect to the network.<br></br>
            Please check your network settings or make sure the password is correct.
          </p>
        );
    }
  }

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render(): HTMLAllCollection {
    return (
      <Host>
        <div class="wifi-connecting--container">
          {/* start status container */}
          <div class="wifi-connecting--status-container animation--pop-in" style={{ '--animation-order': 1 } as any}>
            <div class="wifi-connecting--points">
              <div class="wifi-connecting--img-frame">
                <img src="assets/images/logos/Logomark Black@60px.svg" class="wifi-connecting--img"></img>
              </div>
              <p>Lightform</p>
            </div>

            <div class="wifi-connecting--status-wrapper">{this.renderConnectingStatus()}</div>

            <div class="wifi-connecting--points">
              <div class="wifi-connecting--img-frame">
                <img src="assets/images/icons/globe.svg" class="wifi-connecting--img"></img>
              </div>
              <p>Internet</p>
            </div>
          </div>
          {/* end status container */}

          <div class="wifi-connecting--status-msg-container animation--pop-in" style={{ '--animation-order': 2 } as any}>
            {this.renderStatusMsg()}
          </div>

          <div class="wifi-connecting--action-btn-container animation--pop-in" style={{ '--animation-order': 3 } as any}>
            <div
              onClick={() => this.onConnectionBtnClick()}
              ref={el => (this.connectionActionBtn = el as HTMLInputElement)}
              class="wifi-connecting--action-btn wifi-list-item"
              tabindex="0"
            >
              <div class="action-btn--text">{this.connectionStatus === ConnectionStatus.Connecting ? 'Cancel' : 'OK'}</div>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
