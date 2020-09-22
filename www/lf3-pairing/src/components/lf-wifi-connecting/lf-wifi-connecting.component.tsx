// ==== Library Imports =======================================================
import { Component, Event, EventEmitter, h, Listen, Prop, State, Method } from "@stencil/core";

// ==== App Imports ===========================================================
import { LfAppState } from "../../shared/services/lf-app-state.service";

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

  // Getters/Setters
  public get connectionActionBtn(): HTMLElement {
    return this._connectionActionBtn;
  }
  public set connectionActionBtn(newValue: HTMLElement) {
    this._connectionActionBtn = newValue;
  }

  // Getter/Setter backing variables and defaults
  private _connectionActionBtn: HTMLElement;

  // ---- Protected -----------------------------------------------------------------------------
  protected imagesPath = "../../assets/images/";

  // ==== HOST HTML REFERENCE ===================================================================
  // @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() connectionStatus: ConnectionStatus = ConnectionStatus.Successful;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() propName: string = "string";

  // ==== EVENTS SECTION ========================================================================
  @Event() restartPairingProcess: EventEmitter;

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public componentWillLoad() {
    console.group("componentWillLoad");
    try {
      // do stuff on load
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  // - -  componentDidRender Implementation - - - - - - - - - - - - - - - - - - - - - - - - - -
  public componentDidRender() {
    console.group("componentDidRender");
    try {
      // do stuff on render complete
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  // ==== LISTENERS SECTION =====================================================================
  @Listen("onEventName")
  onEventName(event: CustomEvent): void {
    console.group("onEventName");
    try {
      // event handler logic
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ========================================================
  @Method()
  async publicMethod(): Promise<void> {
    return;
  }

  // ==== LOCAL METHODS SECTION =========================================================================
  private onConnectionBtnClick(event: MouseEvent): void {
    console.group("onConnectionBtnClick");
    try {
      event.stopPropagation();
      console.log("Focus", document.activeElement);
      switch (this.connectionStatus) {
        case ConnectionStatus.Connecting:
          break;
        case ConnectionStatus.Successful:
        case ConnectionStatus.Failed:
          this.restartPairingProcess.emit();

          break;
      }
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  // private restartPairingProcess(): void {
  //   console.group("restartPairingProcess");
  //   try {
  //     const inFocus = document.activeElement;
  //     console.log("FOCUS", inFocus);
  //   } catch (e) {
  //     console.error(e);
  //   } finally {
  //     console.groupEnd();
  //   }
  // }

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
            src={this.imagesPath + "icons/checkmark--rounded-green.svg"}
            class="wifi-connecting--status-icon success-icon"
          ></img>
        );
      case ConnectionStatus.Failed:
        return (
          <img
            src={this.imagesPath + "icons/x--flat-red.svg"}
            class="wifi-connecting--status-icon failed-icon"
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
      <div class="wifi-connecting--container " style={{ "--animation-order": 0 } as any}>
        {/* start status container */}
        <div
          class="wifi-connecting--status-container animation--pop-in"
          style={{ "--animation-order": 1 } as any}
        >
          <div class="wifi-connecting--points">
            <div class="wifi-connecting--img-frame">
              <img
                src={this.imagesPath + "logos/Logomark Black@60px.svg"}
                class="wifi-connecting--img"
              ></img>
            </div>
            <p>LF3</p>
          </div>

          <div class="wifi-connecting--status-wrapper">{this.renderConnectingStatus()}</div>

          <div class="wifi-connecting--points">
            <div class="wifi-connecting--img-frame">
              <img src={this.imagesPath + "icons/globe.svg"} class="wifi-connecting--img"></img>
            </div>
            <p>Internet</p>
          </div>
        </div>
        {/* end status container */}

        <div
          class="wifi-connecting--status-msg-container animation--pop-in"
          style={{ "--animation-order": 2 } as any}
        >
          {this.renderStatusMsg()}
        </div>

        <div
          class="wifi-connecting--action-btn-container animation--pop-in"
          style={{ "--animation-order": 3 } as any}
        >
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
