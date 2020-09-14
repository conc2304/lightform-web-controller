// Library Imports
import { Component, Host, h, State } from '@stencil/core';
import { loadingController } from '@ionic/core';

// App Imports
import { WifiEntry } from '../lf-wifi-list/wifi-entry.interface';
import { SignalStrength } from '../lf-wifi-list/wifi-signal-strength.enum';
import { GetLockIconPath, GetNetworkIconPath } from '../../helpers/assetFinder';

enum LoadingProgress {
  Uninitialized = 'Uninitialized',
  Loading = 'Loading',
  Loaded = 'Loaded',
}

@Component({
  tag: 'ionic-component-test',
  styleUrl: 'ionic-component-test.scss',
  shadow: true,
})
export class IonicComponentTest {
  @State() wifiEntries: WifiEntry[] = [];
  @State() progress: LoadingProgress = LoadingProgress.Uninitialized;

  async componentWillLoad() {
    this.progress = LoadingProgress.Loading;
    const loading = await loadingController.create({
      spinner: 'circular',
      // duration: 5000,
      message: 'Loading Wifi Network List',
      translucent: true,
      cssClass: 'custom-class custom-loading',
      backdropDismiss: true,
    });
    loading.present();

    this.getWifiList()
      .then(response => {
        this.wifiEntries = response;
      })
      .catch(e => {
        throw new Error(e);
      })
      .then(() => {
        this.progress = LoadingProgress.Loaded;
        loading.dismiss();
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

  render() {
    return (
      <Host>
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button defaultHref="/" />
            </ion-buttons>
            <ion-title>Lightform UI R&amp;D - Ionic Web Components</ion-title>
          </ion-toolbar>

          <ion-toolbar>
            <ion-title>Routes</ion-title>
            <ion-router-link href="/">Wifi Pairing Test</ion-router-link>
          </ion-toolbar>
        </ion-header>
        ,
        <ion-grid class="ionic-component-test-container">
          <ion-row>
            <ion-col>{this.renderWifiList()}</ion-col>
            <ion-col>{this.renderStubToggles()}</ion-col>
          </ion-row>

          <ion-row>
            <ion-col>
              <h3>Ionic Range Sliders</h3>
              {this.renderStubRangeSliders()}
            </ion-col>
            <ion-col>
              <h3>Ionic Inputs</h3>
              {this.renderStubInputTextBox()}
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <h3>Ionic Buttons</h3>
              {this.renderStubButtons()}
            </ion-col>
          </ion-row>

          <ion-row></ion-row>
        </ion-grid>
      </Host>
    );
  }

  private themeColors = ['primary', 'secondary', 'success', 'warning', 'danger', 'light', 'dark'];

  private renderStubToggles() {
    return (
      <ion-list>
        <h3>Themed Toggles</h3>
        {this.themeColors.map(value => {
          return (
            <ion-item>
              <ion-label>{value.toUpperCase()} Toggle</ion-label>
              <ion-toggle color={value} checked={true}></ion-toggle>
            </ion-item>
          );
        })}
      </ion-list>
    );
  }

  private renderStubButtons() {
    return [
      // Default
      <ion-button>Default</ion-button>,
      // Anchor
      <ion-button href="#">Anchor</ion-button>,
      // Colors
      <span class="button-wrapper">
        {this.themeColors.map(value => {
          return <ion-button color={value}>{value.toUpperCase()}</ion-button>;
        })}
      </span>,
      // Expand
      <ion-button expand="full">Full Button</ion-button>,
      <ion-button expand="block">Block Button</ion-button>,
      // Round
      <ion-button shape="round">Round Button</ion-button>,
      // Fill
      <ion-button expand="full" fill="outline">
        Outline + Full
      </ion-button>,
      <ion-button expand="block" fill="outline">
        Outline + Block
      </ion-button>,
      <ion-button shape="round" fill="outline">
        Outline + Round
      </ion-button>,
      // Icons
      <ion-button>
        <ion-icon slot="start" name="star"></ion-icon>
        Left Icon
      </ion-button>,
      <ion-button>
        Right Icon
        <ion-icon slot="end" name="star"></ion-icon>
      </ion-button>,
      <ion-button>
        <ion-icon slot="icon-only" name="star"></ion-icon>
      </ion-button>,
      // Sizes
      <ion-button size="large">Large</ion-button>,
      <ion-button>Default</ion-button>,
      <ion-button size="small">Small</ion-button>,
    ];
  }

  private renderStubInputTextBox() {
    return (
      <ion-list>
        {this.themeColors.map(value => {
          return (
            <ion-item>
              <ion-label color={value} position="stacked">
                Stacked Label
              </ion-label>
              <ion-input placeholder={value + ' Enter Stuff Here ...'}></ion-input>
            </ion-item>
          );
        })}
      </ion-list>
    );
  }

  private renderWifiList() {
    // if (this.wifiEntries.length) {
    return (
      <ion-card color="primary">
        <ion-list lines="none" class="internet-settings">
          <ion-list-header>
            <h3>Internet Settings</h3>
          </ion-list-header>

          {this.progress !== LoadingProgress.Loaded ? <ion-progress-bar color="success" type="indeterminate"></ion-progress-bar> : ''}

          {this.wifiEntries.map((item: WifiEntry) => {
            return (
              <ion-item button class="wifi-list--item" tabindex="0">
                <div>{item.wifiName} </div>
                <div slot="end">
                  <div class="list-item--icons-wrapper">
                    <ion-img src={GetNetworkIconPath(item.signalStrength)}></ion-img>
                    <ion-img src={GetLockIconPath(item.passwordProtected)}></ion-img>
                  </div>
                </div>
              </ion-item>
            );
          })}
          <ion-item button class="wifi-list--refresh-list wifi-list-item" tabindex="0">
            <div class="wifi-list--refresh-list--inner">
              <div>Refresh Network List</div>
              <ion-icon name="refresh"></ion-icon>
            </div>
          </ion-item>
        </ion-list>
      </ion-card>
    );
    // } else {
    // return (
    //   <ion-card>
    //     <div class="loading-container">
    //       <h3>Loading...</h3>
    //       <img alt="loading" src="/assets/images/progress-spinner-circles.gif" />
    //     </div>
    //   </ion-card>
    // );
    // }
  }

  private renderStubRangeSliders() {
    return [
      <ion-list lines="none">
        <ion-item>
          <ion-label>Basic</ion-label>
          <ion-range color="primary" pin={true}></ion-range>
        </ion-item>

        <ion-item>
          <ion-label>Disabled</ion-label>
          <ion-range color="primary" pin={true} disabled></ion-range>
        </ion-item>

        <ion-item>
          <ion-label>With Min/Max Label</ion-label>
          <ion-range min={-200} max={200} color="secondary">
            <ion-label slot="start">-200</ion-label>
            <ion-label slot="end">200</ion-label>
          </ion-range>
        </ion-item>

        <ion-item>
          <ion-label>Icons</ion-label>
          <ion-range min={20} max={80} step={2} color="success">
            <ion-icon size="small" slot="start" name="sunny"></ion-icon>
            <ion-icon slot="end" name="sunny"></ion-icon>
          </ion-range>
        </ion-item>

        <ion-item>
          <ion-label>Snap w/ Ticsks</ion-label>
          <ion-range min={1000} max={2000} step={100} snaps={true} color="secondary"></ion-range>
        </ion-item>

        <ion-item>
          <ion-label>Snap w/o Ticks</ion-label>
          <ion-range value={1200} min={1000} max={2000} step={100} snaps={true} ticks={false} color="secondary"></ion-range>
        </ion-item>

        <ion-item>
          <ion-label>Dual Knobs</ion-label>
          <ion-range dualKnobs={true} min={21} max={72} step={3} snaps={true} value={{lower: 25, upper: 50}}></ion-range>
        </ion-item>
      </ion-list>,
    ];
  }
}
