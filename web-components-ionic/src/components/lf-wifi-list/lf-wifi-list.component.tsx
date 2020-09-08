import { Component, h, State } from '@stencil/core';
import { WifiEntry } from './wifi-entry.interface';
import { SignalStrength } from './wifi-signal-strength.enum';

enum LoadingProgress {
  Uninitialized = 'Uninitialized',
  Loading = 'Loading',
  Loaded = 'Loaded',
}

@Component({
  tag: 'lf-wifi-list',
  styleUrl: 'lf-wifi-list.component.scss',
})
export class LfWifiList {
  @State() wifiEntries: WifiEntry[] = [];
  @State() progress: LoadingProgress = LoadingProgress.Uninitialized;

  async componentWillLoad() {
    console.log('load');
    this.progress = LoadingProgress.Loading;
    this.getWifiList()
      .then(response => {
        console.log(response);
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
  ];


  private renderListContent() {
    if (this.wifiEntries.length) {
      return this.wifiEntries.map((item: WifiEntry) => {
        return <lf-wifi-list-item passwordProtected={item.passwordProtected} networkName={item.wifiName} signalStrength={item.signalStrength}></lf-wifi-list-item>;
      });
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
            <ion-list-header>Wifi Networks</ion-list-header>
            {this.renderListContent()}
          </ion-list>
        </ion-card-content>
      </ion-card>
    );
  }
}
