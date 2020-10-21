// ==== Library Imports =======================================================
import { Component, h, Prop, Element } from "@stencil/core";

// ==== App Imports ===========================================================
import { LfConf } from "../../global/resources";

@Component({
  tag: "lf-wifi-list-item",
  styleUrl: "lf-wifi-list-item.component.scss",
  shadow: true,
})
export class LfWifiListItem {
  // ==== OWN PROPERTIES SECTION =======================================================
  // Dependency Injections
  private Conf = LfConf;

  // ---- Private --------------------------------------------------------------------

  // ---- Protected -----------------------------------------------------------------------------
  // none

  // ==== HOST HTML REFERENCE ==========================================================
  @Element() element: HTMLElement;

  // ==== State() VARIABLES SECTION ====================================================
  // @State() stateProp: string;

  // ==== PUBLIC PROPERTY API - Prop() SECTION =========================================
  @Prop() passwordProtected!: string;
  @Prop() networkName!: string;
  @Prop() signalStrength!: number;
  @Prop() focusElem?: boolean = false;
  @Prop() index?: number;

  // ==== EVENTS SECTION ===============================================================
  // @Event() eventName: EventEmitter;

  // ==== COMPONENT LIFECYCLE EVENTS ===================================================
  // - -  componentDidRender Implementation - - - - - - - - - - - - - - - - - - - - - -
  public componentDidRender() {
    console.group("componentDidRender");
    try {
      if (this.focusElem) {
        setTimeout(() => {
          this.element.focus();
        }, 500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  // ==== LISTENERS SECTION ==============================================================
  // @Listen("eventName")
  // onEventNameReceived(event: CustomEvent): void { /** do stuff */}

  // ==== PUBLIC METHODS API - @Method() SECTION =========================================
  // @Method()
  // async publicMethod(): Promise<void> { /** do stuff */}

  // ==== LOCAL METHODS SECTION ==========================================================
  private getNetworkIconPath(signalStrength: number): string {
    console.group("getNetworkIconPath");
    try {
      let wifiSignalFile = "network-1bar.svg";
      if (signalStrength >= 66) {
        wifiSignalFile = "network-3bars.svg";
      } else if (signalStrength >= 33) {
        wifiSignalFile = "network-2bars.svg";
      }

      const fileName = typeof wifiSignalFile !== "undefined" ? `${wifiSignalFile}` : "";

      return fileName;
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  private networkIsSecure(security: string): boolean {
    console.group("networkIsUnsecured");
    try {
      return !(security == undefined || security.toUpperCase() == "UNSECURED");
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  // ==== RENDERING SECTION ===============================================
  private renderLockIcon(security: string): HTMLElement {
    console.group("renderLockIcon");
    try {
      if (this.networkIsSecure(security)) {
        const iconImageFile = "Lock.svg";
        const resolvedFilePath = `${this.Conf.imageHost}/icons/${iconImageFile}`;
        return <img class="list-item--icon" alt="protected network" src={resolvedFilePath}></img>;
      } else {
        // don't show an unlock icon, just a blank div for UI
        return <div class="list-item--icon img--empty"></div>;
      }
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  private renderNetworkStrengthIcon(signalStrength: number) {
    console.group("renderNetworkStrengthIcon");
    try {
      return (
        <img
          class="list-item--icon"
          src={`${this.Conf.imageHost}/icons/${this.getNetworkIconPath(signalStrength)}`}
          alt={`${signalStrength} Signal Strength}`}
        ></img>
      );
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    console.group("render");
    try {
      return (
        <div class="wifi-list-item">
          <div class="list-item--inner-wrapper">
            <div class="list-item--network-name">{this.networkName}</div>
            <div class="list-item--icons-container">
              <div class="list-item--icon-wrapper">{this.renderNetworkStrengthIcon(this.signalStrength)}</div>
              <div class="list-item--icon--wrapper">{this.renderLockIcon(this.passwordProtected)}</div>
            </div>
          </div>
        </div>
      );
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }
}
