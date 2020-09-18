// Library Imports
import { Component, h, Prop, Element } from "@stencil/core";

// App Imports
import { SignalStrength } from "../../shared/enums/wifi-signal-strength.enum";

@Component({
  tag: "lf-wifi-list-item",
  styleUrl: "lf-wifi-list-item.component.scss",
  shadow: true,
})
export class LfWifiListItem {
  // ==== PUBLIC ============================================================
  // ---- Properties --------------------------------------------------------

  @Prop() passwordProtected!: boolean;
  @Prop() networkName!: string;
  @Prop() signalStrength!: SignalStrength;
  @Prop() focusElem?: boolean =  false;
  @Prop() index?: number;

  @Element() element: HTMLElement;

  // ---- Methods -----------------------------------------------------------

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

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    console.group("render");
    try {
      return (
        <div class="wifi-list-item">
          <div class="list-item--inner-wrapper">
            <div class="list-item--network-name">{this.networkName}</div>
            <div class="list-item--icons-container">
              <div class="list-item--icon-wrapper">
                {this.renderNetworkStrengthIcon(this.signalStrength)}
              </div>
              <div class="list-item--icon--wrapper">
                {this.renderLockIcon(this.passwordProtected)}
              </div>
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

  // ==== PROTECTED =========================================================
  // ---- Properties --------------------------------------------------------
  protected iconPath = "/assets/images/icons/";

  // ---- Methods -----------------------------------------------------------

  // ==== PRIVATE ===========================================================
  // ---- Properties --------------------------------------------------------

  // Getter/Setter backing variables and defaults

  // ---- Methods -----------------------------------------------------------
  private renderLockIcon(protectedNetwork: boolean): HTMLElement {
    console.group("renderLockIcon");
    try {
      const iconImageFile = protectedNetwork ? "Lock.svg" : "Unlock.svg";
      const resolvedFilePath = `${this.iconPath}${iconImageFile}`;
      if (protectedNetwork) {
        return (
          <ion-img
            class="list-item--icon"
            alt="protected network"
            src={resolvedFilePath}
          ></ion-img>
        );
      } else {
        // don't show an unlock icon, just a blank div for UI
        return <div class="list-item--icon"></div>;
      }
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  private renderNetworkStrengthIcon(signalStrength: SignalStrength) {
    console.group("renderNetworkStrengthIcon");
    try {
      return (
        <ion-img
          class="list-item--icon"
          src={this.getNetworkIconPath(signalStrength)}
          alt={`${signalStrength} Signal Strength}`}
        ></ion-img>
      );
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
    return (
      <ion-img
        class="list-item--icon"
        src={this.getNetworkIconPath(signalStrength)}
        alt={`${signalStrength} Signal Strength}`}
      ></ion-img>
    );
  }

  private getNetworkIconPath(signalStrength: SignalStrength): string {
    console.group("getNetworkIconPath");
    try {
      let wifiSignalFile: string;

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
      const resolvedFilePath = `${this.iconPath}${wifiSignalFile}`;

      return resolvedFilePath;
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }
}
