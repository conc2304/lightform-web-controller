import { Component, h, State } from '@stencil/core';
import { WifiEntry } from '../../shared/interfaces/wifi-entry.interface';
import { SignalStrength } from '../../shared/enums/wifi-signal-strength.enum';

enum LoadingProgress {
  Uninitialized = 'Uninitialized',
  Loading = 'Loading',
  Loaded = 'Loaded',
}

@Component({
  tag: 'lf-wifi-list',
  styleUrl: 'lf-wifi-list.component.scss',
  shadow: true,
})
export class LfWifiList {
  @State() wifiEntries: WifiEntry[] = [];
  @State() progress: LoadingProgress = LoadingProgress.Uninitialized;

  async componentWillLoad() {
    this.progress = LoadingProgress.Loading;
    this.getWifiList()
      .then(response => {
        this.wifiEntries = response;
      })
      .catch(e => {
        throw new Error(e);
      })
      .then(() => {
        this.progress = LoadingProgress.Loaded;
      });
  }

  private async getWifiList(): Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.listData);
      }, 1000);
    });
  }

  private listData: Array<WifiEntry> = [
    {
      wifiName: 'Wu-Tang LAN',
      passwordProtected: true,
      signalStrength: SignalStrength.Strong,
    },
    {
      wifiName: 'It Burns When IP',
      passwordProtected: true,
      signalStrength: SignalStrength.Weak,
    },
    {
      wifiName: 'Bill Wi The Science Fi',
      passwordProtected: true,
      signalStrength: SignalStrength.OK,
    },
    {
      wifiName: 'FBI Surveillance Van',
      passwordProtected: false,
      signalStrength: SignalStrength.Strong,
    },
    {
      wifiName: 'FBI Surveillance Van 2',
      passwordProtected: false,
      signalStrength: SignalStrength.Strong,
    },
    {
      wifiName: 'FBI Surveillance Van 3',
      passwordProtected: false,
      signalStrength: SignalStrength.Strong,
    },
    {
      wifiName: 'FBI Surveillance Van 4',
      passwordProtected: false,
      signalStrength: SignalStrength.Strong,
    },
    {
      wifiName: 'FBI Surveillance Van 5',
      passwordProtected: false,
      signalStrength: SignalStrength.Strong,
    },
  ];

  private renderListContent() {
    if (this.wifiEntries.length) {
      return (
        <div class="wifi-list--item-container">
          {this.wifiEntries.map((item: WifiEntry, index: number) => {
            return (
              <lf-wifi-list-item
                tabindex="0"
                passwordProtected={item.passwordProtected}
                networkName={item.wifiName}
                signalStrength={item.signalStrength}
                index={index}
                style={{ '--animation-order': index } as any}
                class="wifi-list-item"
              ></lf-wifi-list-item>
            );
          })}
          <div class="wifi-list--refresh-list wifi-list-item" tabindex="0" style={{ '--animation-order': this.wifiEntries.length } as any}>
            <div>Refresh Wifi List</div>
          </div>
        </div>
      );
    } else {
      return (
        <div class="loading-container">
          <h3>Loading...</h3>
          <img alt="loading" src="/assets/images/progress-spinner-circles.gif" />
        </div>
      );
    }
  }

  render() {
    return (
      <ion-card class="wifi-list--card theme--dark">
        <ion-card-content>
          <ion-list lines="none">
            <div class="wifi-list--header-wrapper">
              <div class="wifi-list--header-text">Internet Settings</div>
              <div class="wifi-list--header-divider"></div>
            </div>

            {this.renderListContent()}
          </ion-list>
        </ion-card-content>
      </ion-card>
    );
  }
}
