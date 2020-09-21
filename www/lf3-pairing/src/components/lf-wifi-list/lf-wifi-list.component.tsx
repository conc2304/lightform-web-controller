// ==== Library Imports =======================================================
import { Component, Event, EventEmitter, h, Listen, State } from "@stencil/core";
import { Key } from "ts-keycode-enum";

// ==== App Imports ===========================================================
import { WifiEntry } from "../../shared/interfaces/wifi-entry.interface";
import { SignalStrength } from "../../shared/enums/wifi-signal-strength.enum";

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
  // Getters/Setters
  // Getter/Setter backing variables and defaults
  // ---- Protected -----------------------------------------------------------------------------

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
      this.getWifiList();
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
      this.STUBfetchNetworksList()
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

  private async STUBfetchNetworksList(): Promise<any> {
    console.group("STUBfetchNetworksList");
    try {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(this.listData);
        }, 1000);
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
      const specialKeys = [Key.DownArrow, Key.UpArrow, Key.Enter];

      if (specialKeys.includes(e.which)) {
        console.log("PREVENT");
        e.preventDefault();
      }
      // TODO HANDLE WIFI LIST KEYBOARD NAVIGATION
      // const activeEl = document.activeElement;
      switch (e.which) {
        case Key.DownArrow:
          console.log("Down");

          break;

        case Key.UpArrow:
          console.log("UP");

          break;
        case Key.Enter:
          console.log("Enter");
          break;
      }
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  // ==== RENDERING SECTION =========================================================================
  private renderListContent() {
    console.group("renderListContent");
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

  private renderListItems() {
    return [
      this.wifiEntries.map((item: WifiEntry, index: number) => {
        return (
          <lf-wifi-list-item
            tabindex={index}
            passwordProtected={item.passwordProtected}
            networkName={item.wifiName}
            signalStrength={item.signalStrength}
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
        tabindex={this.wifiEntries.length}
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
      return this.renderListContent();
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
    console.groupEnd();
  }

  private listData: Array<WifiEntry> = [
    {
      wifiName: "Wu-Tang LAN",
      passwordProtected: true,
      signalStrength: SignalStrength.Strong,
    },
    {
      wifiName: "It Burns When IP",
      passwordProtected: true,
      signalStrength: SignalStrength.Weak,
    },
    {
      wifiName: "Bill Wi The Science Fi",
      passwordProtected: true,
      signalStrength: SignalStrength.OK,
    },
    {
      wifiName: "FBI Surveillance Van",
      passwordProtected: false,
      signalStrength: SignalStrength.Strong,
    },
    {
      wifiName: "FBI Surveillance Van 2",
      passwordProtected: false,
      signalStrength: SignalStrength.Strong,
    },
    {
      wifiName: "FBI Surveillance Van 3",
      passwordProtected: false,
      signalStrength: SignalStrength.Strong,
    },
    {
      wifiName: "FBI Surveillance Van 4",
      passwordProtected: false,
      signalStrength: SignalStrength.Strong,
    },
    {
      wifiName: "FBI Surveillance Van 5",
      passwordProtected: false,
      signalStrength: SignalStrength.Strong,
    },
  ];
}
