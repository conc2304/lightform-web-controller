// ==== Library Imports =======================================================
import { Component, Element, Event, EventEmitter, h, Listen, State } from "@stencil/core";
import { Key as EventKey } from "ts-key-enum";

// ==== App Imports ===========================================================
import { WifiEntry } from "../../shared/interfaces/wifi-entry.interface";
import LfNetworkConnector from "../../shared/services/lf-network-connection.service";

enum LoadingProgress {
  Pending,
  Successful,
  Failed,
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
  private refreshButtonEl: HTMLElement;

  // ---- Protected -----------------------------------------------------------------------------
  // none

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() el: HTMLElement;

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
      this.getAvailableNetworks();
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - - -
  componentDidUpdate() {
    console.group("componentDidUpdate");

    try {
      if (this.loadingProgress === LoadingProgress.Failed) {
        setTimeout(() => {
          this.refreshButtonEl.focus();
        }, 500);
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
  private async getAvailableNetworks() {
    console.group("getAvailableNetworks");
    try {
      this.loadingProgress = LoadingProgress.Pending;

      this.NetworkConnector.getAvailableNetworks()
        .then(response => {
          if (!response) {
            throw new Error("No Network Response Received.");
          }

          this.wifiEntries = response;
          this.loadingProgress = LoadingProgress.Successful;
        })
        .catch(e => {
          this.loadingProgress = LoadingProgress.Failed;

          throw new Error(e);
        });
    } catch (e) {
      console.error(e);
      this.loadingProgress = LoadingProgress.Failed;
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
      const parent = document.querySelector(".wifi-list--items-container") as HTMLElement;
      const activeEl = document.activeElement;
      let nextFocusEl;

      if (specialKeys.includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case EventKey.ArrowDown:
          nextFocusEl = (activeEl.nextSibling as HTMLElement)
            ? (activeEl.nextSibling as HTMLElement)
            : (parent.firstChild as HTMLElement);

          nextFocusEl.focus();
          break;

        case EventKey.ArrowUp:
          nextFocusEl = (activeEl.previousSibling as HTMLElement)
            ? (activeEl.previousSibling as HTMLElement)
            : (parent.lastChild as HTMLElement);

          nextFocusEl.focus();

          break;
        case EventKey.Enter:
          const activeIndex = Array.prototype.indexOf.call(parent.childNodes, document.activeElement);

          if (this.loadingProgress === LoadingProgress.Failed || activeIndex === this.wifiEntries.length) {
            this.getAvailableNetworks();
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
      this.renderRefreshButton(),
    ];
  }

  private renderRefreshButton() {
    try {
      return (
        <div
          onClick={() => this.getAvailableNetworks()}
          class="wifi-list--refresh-list wifi-list-item"
          tabindex="0"
          style={{ "--animation-order": this.wifiEntries?.length || 1 } as any}
          ref={el => (this.refreshButtonEl = el as HTMLElement)}
        >
          <div>Refresh Wifi List</div>
        </div>
      );
    } catch (e) {
      console.error(e);
    }
  }

  private renderLoadingContainer() {
    console.group("renderLoadingContainer");
    try {
      return (
        <div class="wifi-list--items-container no-scroll">
          <div class="loading-container">
            <h3>Searching for networks</h3>
            <img alt="Loading" src="/assets/images/progress-spinner-circles.gif" />
          </div>
        </div>
      );
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  private renderFailureContainer() {
    console.group("renderFailureContainer");
    try {
      return (
        <div class="wifi-list--items-container no-scroll">
          <div class="loading-container">
            <h3>Unable to find any available networks</h3>
            {this.renderRefreshButton()}
          </div>
        </div>
      );
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    console.group("render");
    try {
      console.log(this.wifiEntries);
      if (this.loadingProgress === LoadingProgress.Pending) {
        return this.renderLoadingContainer();
      } else if (this.loadingProgress === LoadingProgress.Failed) {
        return this.renderFailureContainer();
      } else if (this.loadingProgress === LoadingProgress.Successful && this.wifiEntries.length) {
        return <div class="wifi-list--items-container scrollable-content">{this.renderListItems()}</div>;
      } else {
        return this.renderFailureContainer();
      }
    } catch (e) {
      console.error(e);
      return this.renderFailureContainer();
    } finally {
      console.groupEnd();
    }
  }
}
