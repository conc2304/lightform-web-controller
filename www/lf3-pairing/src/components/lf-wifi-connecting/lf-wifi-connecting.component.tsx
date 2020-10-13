// ==== Library Imports =======================================================
import { Component, Event, EventEmitter, h, State } from "@stencil/core";
import { WifiEntry } from "../../shared/interfaces/wifi-entry.interface";

// ==== App Imports ===========================================================
import { LfAppState } from "../../shared/services/lf-app-state.service";
import { LfConf } from "../../global/resources";

enum ConnectionStatus {
  Connecting,
  Successful,
  Failed,
}

@Component({
  tag: "lf-wifi-connecting",
  styleUrls: ["lf-wifi-connecting.component.scss"],
  shadow: true,
})
export class LfWifiConnecting {
  // ==== OWN PROPERTIES SECTION =======================================================================
  // Dependency Injections
  private lfAppState = LfAppState;

  // ---- Private  -----------------------------------------------------------------------------
  private connectionActionBtn: HTMLElement;

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  // @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() connectionStatus: ConnectionStatus = ConnectionStatus.Connecting;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  // @Prop() propName: string = "string";

  // ==== EVENTS SECTION ========================================================================
  @Event() restartPairingProcess: EventEmitter;

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public componentWillLoad() {
    // console.group("componentWillLoad");

    try {
      const network = this.lfAppState.selectedNetwork;

      if (LfConf.device) {
        this.connectToNetwork(network);
      }
    } catch (e) {
      // console.error(e);
    } finally {
      // console.groupEnd();
    }
  }

  // - -  componentDidRender Implementation - - - - - - - - - - - - - - - - - - - - - - - - - -
  public componentDidRender() {
    // console.group("componentDidRender");

    try {
      // do stuff on render complete
      setTimeout(() => {
        // console.log("UPDATE");
        this.connectionStatus = ConnectionStatus.Successful;
      }, 3000);
    } catch (e) {
      // console.error(e);
    } finally {
      // console.groupEnd();
    }
  }

  // ==== LISTENERS SECTION =====================================================================
  // @Listen("onEventName")
  // onEventName(event: CustomEvent): void {
  //   // console.group("onEventName");
  //   try {
  //     // event handler logic
  //   } catch (e) {
  //     // console.error(e);
  //   } finally {
  //     // console.groupEnd();
  //   }
  // }

  // ==== PUBLIC METHODS API - @Method() SECTION ========================================================
  // @Method()
  // async publicMethod(): Promise<void> {
  //   return;
  // }

  // ==== LOCAL METHODS SECTION =========================================================================
  private connectToNetwork(network: WifiEntry) {
    // console.group("connectToNetwork");

    try {
      const rand = Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER));
      const body = {
        jsonrpc: "2.0",
        id: rand.toString(),
        method: "connectToNetwork",
        params: network,
      };

      fetch(`${LfConf.apiHost}/rpc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then(() => {
          this.connectionStatus = ConnectionStatus.Successful;
        })
        .catch(error => {
          this.connectionStatus = ConnectionStatus.Failed;
          throw new Error(error);
        });
    } catch (e) {
      // console.error(e);
    } finally {
      // console.groupEnd();
    }
  }

  private onConnectionBtnClick(event: MouseEvent): void {
    // console.group("onConnectionBtnClick");
    try {
      event.stopPropagation();
      // console.log("Focus", document.activeElement);

      if (
        this.connectionStatus === ConnectionStatus.Connecting &&
        document.activeElement !== this.connectionActionBtn
      ) {
        // focus button if it hasn't been focused yet
        this.connectionActionBtn.focus();
      } else {
        switch (this.connectionStatus) {
          case ConnectionStatus.Connecting:
            this.restartPairingProcess.emit();
            break;
          case ConnectionStatus.Successful:
          case ConnectionStatus.Failed:
            this.restartPairingProcess.emit();

            break;
        }
      }
    } catch (e) {
      // console.error(e);
    } finally {
      // console.groupEnd();
    }
  }

  // ==== RENDERING SECTION =========================================================================
  private renderConnectingStatus(): HTMLAllCollection {
    switch (this.connectionStatus) {
      case ConnectionStatus.Connecting:
        return (
          <ion-progress-bar
            class="wifi-connecting-progress-bar"
            color="success"
            type="indeterminate"
          ></ion-progress-bar>
        );
      case ConnectionStatus.Successful:
        return (
          <img
            src={LfConf.imageHost + "/icons/checkmark--rounded-green.svg"}
            class="wifi-connecting--status-icon success-icon animation--pop-in"
            style={{ "--animation-order": 1 } as any}
          ></img>
        );
      case ConnectionStatus.Failed:
        return (
          <img
            src={LfConf.imageHost + "/icons/x--flat-red.svg"}
            class="wifi-connecting--status-icon failed-icon animation--pop-in"
            style={{ "--animation-order": 1 } as any}
          ></img>
        );
    }
  }

  private renderStatusMsg(): HTMLAllCollection {
    const className = "wifi-connecting--status-msg";

    switch (this.connectionStatus) {
      case ConnectionStatus.Connecting:
        return <p class={className}>Connecting to the internet ...</p>;
      case ConnectionStatus.Successful:
        return <p class={className}>Successfully Connected.</p>;
      case ConnectionStatus.Failed:
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
      <div class="wifi-connecting--container">
        {/* start status container */}
        <div class="wifi-connecting--status-container animation--pop-in" style={{ "--animation-order": 1 } as any}>
          <div class="wifi-connecting--points">
            <div class="wifi-connecting--img-frame">
              <img src={LfConf.imageHost + "/logos/Logomark Black@60px.svg"} class="wifi-connecting--img"></img>
            </div>
            <p>Lightform</p>
          </div>

          <div class="wifi-connecting--status-wrapper">{this.renderConnectingStatus()}</div>

          <div class="wifi-connecting--points">
            <div class="wifi-connecting--img-frame">
              <img src={LfConf.imageHost + "/icons/globe.svg"} class="wifi-connecting--img"></img>
            </div>
            <p>Internet</p>
          </div>
        </div>
        {/* end status container */}

        <div class="wifi-connecting--status-msg-container animation--pop-in" style={{ "--animation-order": 2 } as any}>
          {this.renderStatusMsg()}
        </div>

        <div class="wifi-connecting--action-btn-container animation--pop-in" style={{ "--animation-order": 3 } as any}>
          <div
            onClick={(e: MouseEvent) => this.onConnectionBtnClick(e)}
            ref={el => (this.connectionActionBtn = el as HTMLInputElement)}
            class="wifi-connecting--action-btn wifi-list-item"
            tabindex="0"
          >
            <div class="action-btn--text">
              {this.connectionStatus === ConnectionStatus.Connecting ? "Cancel" : "OK"}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
