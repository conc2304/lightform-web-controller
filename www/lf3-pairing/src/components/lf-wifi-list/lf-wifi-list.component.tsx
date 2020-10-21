// ==== Library Imports =======================================================
import { Component, Event, EventEmitter, h, Listen, State } from "@stencil/core";
import { Key as EventKey } from "ts-key-enum";

// ==== App Imports ===========================================================
import { LfConf } from "../../global/resources";
import { WifiEntry } from "../../shared/interfaces/wifi-entry.interface";
import LfNetworkConnector from "../../shared/services/lf-network-connection.service";

enum LoadingProgress {
  Pending,
  Complete,
}

@Component({
  tag: "lf-wifi-list",
  styleUrl: "lf-wifi-list.component.scss",
  shadow: false,
})
export class LfWifiList {
  // ==== OWN PROPERTIES SECTION =================================================================
  // Dependency Injections
  private NetworkConnector = LfNetworkConnector;

  // ---- Private   -----------------------------------------------------------------------------
  // none

  // ---- Protected -----------------------------------------------------------------------------
  // none

  // ==== HOST HTML REFERENCE ===================================================================
  // @Element() el: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() loadingProgress: LoadingProgress;
  @State() wifiEntries: WifiEntry[] = [];

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  // @Prop() propName: string;

  // ==== EVENTS SECTION ========================================================================
  @Event() networkSelected: EventEmitter;

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - - -
  componentWillLoad() {
    console.group("componentWillLoad");

    try {
      if (LfConf.dev) {
        this.getWifiList();
      } else if (LfConf.device) {
        this.getNetworks();
      }
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  // ==== LISTENERS SECTION =====================================================================
  @Listen("keydown", {
    target: "window",
    capture: true,
  })
  onKeydown(e: KeyboardEvent) {
    console.group("onKeydown");
    try {
      this.handleKeys(e);
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ========================================================
  // @Method()
  // async publicMethod(): Promise<void> {return}

  // ==== LOCAL METHODS SECTION =========================================================================
  private async getWifiList(): Promise<any> {
    console.group("getWifiList");

    try {
      this.loadingProgress = LoadingProgress.Pending;

      this.NetworkConnector.getAvailableNetworks()
        .then(response => {
          this.wifiEntries = response;
        })
        .catch(e => {
          throw new Error(e);
        })
        .then(() => {
          this.loadingProgress = LoadingProgress.Complete;
        });
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  private async getNetworks() {
    console.group("getNetworks");
    try {
      // TODO replace with env var

      const apiUrl = LfConf.apiHost;

      fetch(`${apiUrl}/networkState`)
        .then(response => {
          // console.log(response);
          const networks = response.json()["availableWifiNetworks"];
          this.wifiEntries = networks;
        })
        .catch(error => {
          throw new Error(error);
        })
        .then(() => {
          this.loadingProgress = LoadingProgress.Complete;
        });
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  private onWifiEntryClicked(network: WifiEntry) {
    console.group("onWifiEntryClicked");
    try {
      this.networkSelected.emit(network);
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  private handleKeys(e) {
    console.group("handleKeys");

    try {
      const specialKeys = [EventKey.ArrowDown, EventKey.ArrowUp, EventKey.Enter];
      const parent = document.querySelector(".wifi-list--items-container");
      // console.log("PARENT",   parent)
      if (specialKeys.includes(e.key)) {
        // console.log("PREVENT");
        e.preventDefault();
      }

      // TODO HANDLE WIFI LIST KEYBOARD NAVIGATION
      // const activeEl = document.activeElement;
      switch (e.key) {
        case EventKey.ArrowDown:
          console.log("Down");

          break;

        case EventKey.ArrowUp:
          console.log("UP");

          break;
        case EventKey.Enter:
          console.log("Enter");

          const activeIndex = Array.prototype.indexOf.call(parent.childNodes, document.activeElement);

          if (activeIndex === this.wifiEntries.length) {
            this.getWifiList();
          } else {
            this.onWifiEntryClicked(this.wifiEntries[activeIndex]);
          }

          break;
      }
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  // ==== RENDERING SECTION =========================================================================
  private renderListItems() {
    return [
      this.wifiEntries.map((item: WifiEntry, index: number) => {
        return (
          <lf-wifi-list-item
            tabindex="0"
            passwordProtected={item.security}
            networkName={item.ssid}
            signalStrength={item.signal}
            index={index}
            focusElem={index === 0}
            style={{ "--animation-order": index } as any}
            class="wifi-list-item"
            onClick={() => this.onWifiEntryClicked(item)}
          ></lf-wifi-list-item>
        );
      }),

      <div
        onClick={() => this.getWifiList()}
        class="wifi-list--refresh-list wifi-list-item"
        tabindex="0"
        style={{ "--animation-order": this.wifiEntries.length } as any}
      >
        <div>Refresh Wifi List</div>
      </div>,
    ];
  }

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    console.group("render");
    try {
      if (this.loadingProgress !== LoadingProgress.Pending && this.wifiEntries.length) {
        return <div class="wifi-list--items-container scrollable-content">{this.renderListItems()}</div>;
      } else {
        return (
          <div class="wifi-list--items-container no-scroll">
            <div class="loading-container">
              <h3>Searching for networks</h3>
              <img alt="Loading" src="/assets/images/progress-spinner-circles.gif" />
            </div>
          </div>
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }
}
