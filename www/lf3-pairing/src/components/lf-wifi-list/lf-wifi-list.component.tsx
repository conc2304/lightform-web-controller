// Library Imports
import { Component, Event, EventEmitter, h, State } from '@stencil/core';

// App Imports
import { WifiEntry } from '../../shared/interfaces/wifi-entry.interface';
import { SignalStrength } from '../../shared/enums/wifi-signal-strength.enum';

@Component({
  tag: 'lf-wifi-list',
  styleUrl: 'lf-wifi-list.component.scss',
  shadow: true,
})
export class LfWifiList {
  @State() wifiEntries: WifiEntry[] = [];
  @Event() networkSelected: EventEmitter;

  async componentWillLoad() {
    this.getWifiList()
      .then(response => {
        this.wifiEntries = response;
      })
      .catch(e => {
        throw new Error(e);
      });
  }

  private async getWifiList(): Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.listData);
      }, 1000);
    });
  }

  private onWifiEntryClicked(network: WifiEntry) {
    console.log(network);
    this.networkSelected.emit(network);
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

  render() {
    return <div class="wifi-list--items-container scrollable-content">{this.renderListContent()}</div>;
  }

  private renderListContent() {
    if (this.wifiEntries.length) {
      return [
        this.wifiEntries.map((item: WifiEntry, index: number) => {
          return (
            <lf-wifi-list-item
              tabindex="0"
              passwordProtected={item.passwordProtected}
              networkName={item.wifiName}
              signalStrength={item.signalStrength}
              index={index}
              style={{ '--animation-order': index } as any}
              class="wifi-list-item"
              onClick={() => this.onWifiEntryClicked(item)}
            ></lf-wifi-list-item>
          );
        }),
        <div class="wifi-list--refresh-list wifi-list-item" tabindex="0" style={{ '--animation-order': this.wifiEntries.length } as any}>
          <div>Refresh Wifi List</div>
        </div>,
      ];
    } else {
      return (
        <div class="loading-container">
          <h3>Searching for networks</h3>
          <img alt="Loading" src="/assets/images/progress-spinner-circles.gif" />
        </div>
      );
    }
  }
}
