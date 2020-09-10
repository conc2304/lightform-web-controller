import { Component, h, State } from '@stencil/core';
import { WifiEntry } from './wifi-entry.interface';
import { SignalStrength } from './wifi-signal-strength.enum';

enum LoadingProgress {
  Uninitialized = 'Uninitialized',
  Loading = 'Loading',
  Loaded = 'Loaded',
}

@Component({
  tag: 'lf-wifi-list-2',
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
        resolve(this.stubData);
      }, 1000);
    });
  }

  private stubData: Array<WifiEntry> = [
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
            <div>Refresh Network List</div>
            <i>refresh</i>
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
      <div class="wifi-list--card theme--dark">
        <div class="wifi-list--card-content">
          <div class="wifi-list--list">
            <div class="wifi-list--header">Internet Settings</div>
            {this.renderListContent()}
          </div>
        </div>
      </div>
    );
  }
}
