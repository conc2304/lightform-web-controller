import { Component, h, State } from "@stencil/core";

interface WifiEntry {
  wifiName: string;
  locked: boolean;
  signalStrength: SignalStrength;
}

enum SignalStrength {
  Weak = "Weak",
  OK = "OK",
  Strong = "Strong",
}

enum LoadingProgress {
  Uninitialized = "Uninitialized",
  Loading = "Loading",
  Loaded = "Loaded",
}

@Component({
  tag: "lf-wifi-list",
  styleUrl: "lf-wifi-list.component.scss",
})
export class LfList {
  @State() wifiEntries: WifiEntry[] = [];
  @State() progress: LoadingProgress = LoadingProgress.Uninitialized;
  @State() activeWifiEntry: WifiEntry = null;

  async componentWillLoad() {
    this.progress = LoadingProgress.Loading;
    this.getWifiList()
      .then((response) => {
        this.wifiEntries = response;
      })
      .catch((e) => {
        throw new Error(e);
      })
      .then(() => {
        this.progress = LoadingProgress.Loaded;
      });
  }

  private async getWifiList(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.listData);
      }, 1000);
    });
  }

  private listData: Array<WifiEntry> = [
    {
      wifiName: "List Item Example w/ Icon Start and End",
      locked: false,
      signalStrength: SignalStrength.Strong,
    },
    {
      wifiName: "Wu-Tang LAN",
      locked: true,
      signalStrength: SignalStrength.Strong,
    },
    {
      wifiName: "It Burns When IP",
      locked: true,
      signalStrength: SignalStrength.Weak,
    },
    {
      wifiName: "Bill Wi The Science Fi",
      locked: true,
      signalStrength: SignalStrength.OK,
    },
    {
      wifiName: "FBI Surveillance Van",
      locked: false,
      signalStrength: SignalStrength.Strong,
    },
  ];

  private onClickHandler(item: WifiEntry) {
    console.group("onClickHandler");
    try {
      this.activeWifiEntry = item;
    } catch (error) {
      console.error(error);
    } finally {
      console.groupEnd();
    }
  }

  render() {
    const iconPath = "/assets/images/icons/";

    function getLockIconPath(locked: boolean): string {
      const iconImageFile = locked ? "Lock.svg" : "Unlock.svg";
      const resolvedFilePath = `${iconPath}${iconImageFile}`;
      return resolvedFilePath;
    }

    function getWifiSignalPath(signalStrength: SignalStrength): string {
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
      const resolvedFilePath = `${iconPath}${wifiSignalFile}`;

      return resolvedFilePath;
    }

    return (
      <lf-list class="wifi-test" striped={true}>
        <lf-subheader inset>
          <div>Inset Subheader Example w/ Appended Icon</div>
          <img slot="end" src={getLockIconPath(true)} />
        </lf-subheader>
        {this.wifiEntries.map((item: any, index: number) => {
          return (
            <lf-list-item
              button
              active={this.activeWifiEntry === item}
              disabled={index === 1}
              onClick={() => {
                this.onClickHandler(item);
              }}
            >
              <img slot="start" src={getWifiSignalPath(item.signalStrength)} />
              <div>{item.wifiName}</div>
              <img
                class="lock-icon"
                slot="end"
                src={getLockIconPath(item.locked)}
              />
            </lf-list-item>
          );
        })}
      </lf-list>
    );
  }
}
