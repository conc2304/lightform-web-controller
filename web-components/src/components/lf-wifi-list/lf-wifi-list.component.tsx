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
  shadow: true,
})
export class LfList {
  @State() wifiEntries: WifiEntry[] = [];
  @State() progress: LoadingProgress = LoadingProgress.Uninitialized;

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
      <lf-list outlined dark zebra class="wifi-test">
        <lf-subheader>
          <div>WIFI Networks</div>
        </lf-subheader>
        {this.wifiEntries.map((item: any) => {
          return (
            <lf-list-item outlined>
              <div slot="lf-list-item--icon-prepend">
                <img src={getWifiSignalPath(item.signalStrength)} />
              </div>
              <div slot="lf-list-item--content">{item.wifiName}</div>
              <div slot="lf-list-item--icon-append">
                <img src={getLockIconPath(item.locked)} />
              </div>
            </lf-list-item>
          );
        })}
      </lf-list>
    );
  }
}
