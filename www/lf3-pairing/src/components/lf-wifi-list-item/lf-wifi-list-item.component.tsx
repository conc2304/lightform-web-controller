// ==== Library Imports =======================================================
import { Component, h, Prop, Element } from "@stencil/core";

// ==== App Imports ===========================================================
import { SignalStrength } from "../../shared/enums/wifi-signal-strength.enum";
import { LfConf } from "../../global/resources";

@Component({
  tag: "lf-wifi-list-item",
  styleUrl: "lf-wifi-list-item.component.scss",
  shadow: true,
})
export class LfWifiListItem {
  // ==== OWN PROPERTIES SECTION =======================================================
  // Dependency Injections
  // none

  // ---- Private --------------------------------------------------------------------

  // ---- Protected -----------------------------------------------------------------------------
  // none

  // ==== HOST HTML REFERENCE ==========================================================
  @Element() element: HTMLElement;

  // ==== State() VARIABLES SECTION ====================================================
  // @State() stateProp: string;

  // ==== PUBLIC PROPERTY API - Prop() SECTION =========================================
  @Prop() passwordProtected!: boolean;
  @Prop() networkName!: string;
  @Prop() signalStrength!: SignalStrength;
  @Prop() focusElem?: boolean = false;
  @Prop() index?: number;

  // ==== EVENTS SECTION ===============================================================
  // @Event() eventName: EventEmitter;

  // ==== COMPONENT LIFECYCLE EVENTS ===================================================
  // - -  componentDidRender Implementation - - - - - - - - - - - - - - - - - - - - - -
  public componentDidRender() {
    // console.group("componentDidRender");
    try {
      if (this.focusElem) {
        setTimeout(() => {
          this.element.focus();
        }, 500);
      }
    } catch (e) {
      // console.error(e);
    } finally {
      // console.groupEnd();
    }
  }

  // ==== LISTENERS SECTION ==============================================================
  // @Listen("eventName")
  // onEventNameReceived(event: CustomEvent): void { /** do stuff */}

  // ==== PUBLIC METHODS API - @Method() SECTION =========================================
  // @Method()
  // async publicMethod(): Promise<void> { /** do stuff */}

  // ==== LOCAL METHODS SECTION ==========================================================
  private getNetworkIconPath(signalStrength: SignalStrength): string {
    // console.group("getNetworkIconPath");
    try {
      let wifiSignalFile: string;

      console.warn(signalStrength);

      switch (signalStrength) {
        case SignalStrength.Strong:
          wifiSignalFile = "network-3bars.svg";
          break;
        case SignalStrength.OK:
          wifiSignalFile = "network-2bars.svg";
          break;
        case SignalStrength.Weak:
          wifiSignalFile = "network-1bar.svg";
          break;
      }

      const fileName = typeof wifiSignalFile !== "undefined" ? `${wifiSignalFile}` : null;

      console.warn(fileName);

      return fileName;
    } catch (e) {
      // console.error(e);
    } finally {
      // console.groupEnd();
    }
  }

  // ==== RENDERING SECTION ===============================================
  private renderLockIcon(protectedNetwork: boolean): HTMLElement {
    // console.group("renderLockIcon");
    try {

      if (protectedNetwork && typeof protectedNetwork !== "undefined") {
        const iconImageFile = protectedNetwork ? "Lock.svg" : "Unlock.svg";
        const resolvedFilePath = `${LfConf.imageHost}/${iconImageFile}`;
        return <img class="list-item--icon" alt="protected network" src={resolvedFilePath}></img>;
      } else {
        // don't show an unlock icon, just a blank div for UI
        return <div class="list-item--icon img--empty"></div>;
      }
    } catch (e) {
      // console.error(e);
    } finally {
      // console.groupEnd();
    }
  }

  private renderNetworkStrengthIcon(signalStrength: SignalStrength) {
    // console.group("renderNetworkStrengthIcon");
    try {
      return (
        <img
          class="list-item--icon"
          src={`${LfConf.imageHost}/${this.getNetworkIconPath(signalStrength)}`}
          alt={`${signalStrength} Signal Strength}`}
        ></img>
      );
    } catch (e) {
      // console.error(e);
    } finally {
      // console.groupEnd();
    }
  }

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    // console.group("render");
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
      // console.error(e);
    } finally {
      // console.groupEnd();
    }
  }
}
