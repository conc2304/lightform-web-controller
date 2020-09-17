// ==== Library Imports =======================================================
import { Component, Event, EventEmitter, h, State } from "@stencil/core";

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
  shadow: true,
})
export class LfWifiList {
  // ==== PUBLIC ============================================================

  // ---- Properties --------------------------------------------------------
  @State() wifiEntries: WifiEntry[] = [];
  @State() loadingProgress: LoadingProgress;
  @Event() networkSelected: EventEmitter;

  // ---- Methods -----------------------------------------------------------
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

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    console.group("render");
    try {
      return (
        <div class="wifi-list--items-container scrollable-content">
          {this.renderListContent()}
        </div>
      );
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
    console.groupEnd();
  }

  // ==== PROTECTED =========================================================
  // ---- Properties --------------------------------------------------------
  // ---- Methods -----------------------------------------------------------

  // ==== PRIVATE ===========================================================
  // ---- Properties --------------------------------------------------------
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

  // Getter/Setter backing variables and defaults

  // ---- Methods -----------------------------------------------------------

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

  private renderListContent() {
    console.group("renderListContent");
    try {
      if (
        this.loadingProgress !== LoadingProgress.Pending && this.wifiEntries.length
      ) {
        return [
          this.wifiEntries.map((item: WifiEntry, index: number) => {
            return (
              <lf-wifi-list-item
                tabindex="0"
                passwordProtected={item.passwordProtected}
                networkName={item.wifiName}
                signalStrength={item.signalStrength}
                index={index}
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
      } else {
        return (
          <div class="loading-container">
            <h3>Searching for networks</h3>
            <img
              alt="Loading"
              src="/assets/images/progress-spinner-circles.gif"
            />
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
