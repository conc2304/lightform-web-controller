// ==== Library Imports =======================================================
import { Component, Element, Event, EventEmitter, h, Listen, State } from '@stencil/core';
import { Key as EventKey } from 'ts-key-enum';

// ==== App Imports ===========================================================
import { WifiEntry } from '../../../shared/interfaces/wifi-entry.interface';
import { LF_REMOTE_BACK_BUTTON } from '../../../shared/lf-remote-keycodes.constants';
import { LfAppState } from '../../../shared/services/lf-app-state.service';
import LfLoggerService from '../../../shared/services/lf-logger.service';
import LfNetworkApiInterface from '../../../shared/services/lf-network-api-interface.service';

enum LoadingProgress {
  Pending,
  Successful,
  Failed,
}

@Component({
  tag: 'lf-wifi-list',
  styleUrl: 'lf-wifi-list.component.scss',
  shadow: false,
})
export class LfWifiList {
  // ==== OWN PROPERTIES SECTION =================================================================
  // ---- Private   -----------------------------------------------------------------------------
  private refreshButtonEl: HTMLElement;
  private log = new LfLoggerService('LfWifiList').logger;

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() el: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() loadingProgress: LoadingProgress;
  // @State() wifiEntries: Array<WifiEntry> = LfAppState.availableNetworks || [];
  @State() wifiEntries: Array<WifiEntry> = [
    {
      security: 'Wpa',
      signal: 0,
      ssid: 'ATT7vdK9Nb-2G',
      uuid: '33237984-f83a-44c8-bcd3-d57a3a074d23',
    },
    {
      security: 'Wep',
      signal: 0,
      ssid: 'Bonita204D',
      uuid: '58e6c266-6a35-4dc2-adea-89ea36827a46',
    },
    {
      security: 'Wpa',
      signal: 0,
      ssid: 'ATTkhdkMvS',
      uuid: '66ab4915-021b-4338-abea-6588a87f2e86',
    },
    {
      security: 'Wpa',
      signal: 0,
      ssid: 'ATT7vdK9Nb',
      uuid: 'd0e72b80-c86b-4056-aeec-c5190bf58d6f',
    },
    {
      security: 'Wpa',
      signal: 0,
      ssid: 'ATT7vdK9Nb',
      uuid: 'a0cd4c4c-b6e6-4be4-91ed-2a67ff6c8d42',
    },
  ];


  @State() refreshBtnFocused = false;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================

  // ==== EVENTS SECTION ========================================================================
  @Event() networkSelected: EventEmitter;

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - - -
  componentWillLoad() {
    this.log.debug('componentWillLoad');
    this.getAvailableNetworks();
  }

  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - - -
  componentDidUpdate() {
    this.log.debug('componentDidUpdate');

    if (this.loadingProgress === LoadingProgress.Failed) {
      setTimeout(() => {
        this.refreshButtonEl.focus();
      }, 1000);
    }
  }

  // ==== LISTENERS SECTION =====================================================================
  @Listen('keydown', {
    target: 'window',
    capture: true,
  })
  onKeydown(e: KeyboardEvent) {
    this.log.debug('onKeydown');
    this.handleKeys(e);
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ========================================================

  // ==== LOCAL METHODS SECTION =========================================================================
  private async getAvailableNetworks() {
    this.log.debug('getAvailableNetworks');

    try {
      this.loadingProgress = LoadingProgress.Pending;
      this.wifiEntries = [];

      LfNetworkApiInterface.fetchAvailableNetworks()
        .then(networks => {
          this.log.debug('fetchAvailableNetworks - then');
          this.log.debug(networks);

          if (!networks) {
            throw new Error('No Network Response Received.');
          }
          if (!Array.isArray(networks)) {
            throw new Error('Network list is not iterable');
          }
          if (!networks.length) {
            throw new Error('No Networks available');
          }

          this.wifiEntries = networks.sort((a: WifiEntry, b: WifiEntry) => {
            return -1 * (a.signal - b.signal);
          });

          this.loadingProgress = LoadingProgress.Successful;
        })
        .catch(e => {
          this.loadingProgress = LoadingProgress.Failed;
          throw new Error(e);
        });
    } catch (e) {
      this.log.debug(e);
      this.loadingProgress = LoadingProgress.Failed;
    }
  }

  private onWifiEntryClicked(network: WifiEntry) {
    this.log.debug('onWifiEntryClicked');
    this.networkSelected.emit(network);
  }

  private onRefreshListClicked(): void {
    this.log.debug('onRefreshListClicked');
    this.refreshBtnFocused = false;
    this.wifiEntries = [];
    this.getAvailableNetworks();
  }

  private handleKeys(e) {
    this.log.debug('handleKeys');

    const specialKeys = [EventKey.ArrowDown, EventKey.ArrowUp, EventKey.Enter, LF_REMOTE_BACK_BUTTON];
    const parent = document.querySelector('.wifi-list--items-container') as HTMLElement;
    const activeEl = document.activeElement;
    let nextFocusEl;

    if (specialKeys.includes(e.key)) {
      e.preventDefault();
    }

    switch (e.key) {
      case EventKey.ArrowDown:
        nextFocusEl = (activeEl.nextSibling as HTMLElement) ? (activeEl.nextSibling as HTMLElement) : (parent.firstChild as HTMLElement);
        this.handleNextElFocus(nextFocusEl);

        break;

      case EventKey.ArrowUp:
        nextFocusEl = (activeEl.previousSibling as HTMLElement) ? (activeEl.previousSibling as HTMLElement) : (parent.lastChild as HTMLElement);
        this.handleNextElFocus(nextFocusEl);

        break;

      case EventKey.Enter:
        const activeIndex = Array.prototype.indexOf.call(parent.childNodes, document.activeElement);

        this.log.debug('Progress', this.loadingProgress);
        this.log.debug('activeIndex', activeIndex);

        if (this.loadingProgress === LoadingProgress.Failed || activeIndex === this.wifiEntries.length || this.wifiEntries.length === 0) {
          this.onRefreshListClicked();
        } else {
          this.onWifiEntryClicked(this.wifiEntries[activeIndex]);
        }

        break;
    }
  }

  private handleNextElFocus(nextFocusEl: HTMLElement): void {
    this.log.debug('handleNextElFocus');

    const parent = document.querySelector('.wifi-list--items-container') as HTMLElement;
    const nextFocusIndex = Number(nextFocusEl.getAttribute('data-index'));
    const distanceToRefresh = this.wifiEntries.length - nextFocusIndex;
    const firstItemActive = nextFocusIndex === 0;
    const nextOffsetTop = nextFocusEl.offsetTop;

    let scrollTo = 0;
    if (this.wifiEntries.length === nextFocusIndex) {
      scrollTo = parent.scrollHeight;
    } else if (firstItemActive) {
      scrollTo = 0;
    } else {
      scrollTo = nextOffsetTop - 300; // try to keep the active one in the middle ish
    }

    parent.scrollTo({
      top: scrollTo,
      left: 0,
      behavior: 'smooth',
    });

    this.refreshBtnFocused = distanceToRefresh <= 2 && !firstItemActive;
    nextFocusEl.focus();
  }

  // ==== RENDERING SECTION =========================================================================
  private renderListItems() {
    return [
      this.wifiEntries.map((item: WifiEntry, index: number) => {
        const lastItemClass = index === this.wifiEntries?.length - 1 ? 'wifi-list-item--last' : '';
        const className = `wifi-list-item ${lastItemClass}`;
        return (
          <lf-wifi-list-item
            tabindex="0"
            passwordProtected={item.security}
            networkName={item.ssid}
            signalStrength={item.signal}
            index={index}
            data-index={index}
            focusElem={index === 0}
            style={{ '--animation-order': index } as any}
            class={className}
            onClick={() => this.onWifiEntryClicked(item)}
          ></lf-wifi-list-item>
        );
      }),
      this.renderRefreshButton(),
    ];
  }

  private renderRefreshButton() {
    const index = this.wifiEntries?.length || 1;
    return (
      <button
        onClick={() => this.onRefreshListClicked()}
        class="wifi-list--refresh-list wifi-list-item"
        tabindex="0"
        data-index={index}
        style={{ '--animation-order': this.wifiEntries?.length || 1 } as any}
        ref={el => (this.refreshButtonEl = el as HTMLElement)}
      >
        <div>Refresh Wifi List</div>
      </button>
    );
  }

  private renderLoadingContainer() {
    return (
      <div class="wifi-list--items-container no-scroll">
        <div class="loading-container">
          <img alt="Loading" src="./assets/images/progress-spinner-circles.gif" />
        </div>
      </div>
    );
  }

  private renderFailureContainer() {
    return (
      <div class="wifi-list--items-container no-scroll">
        <div class="loading-container">
          <h3 class="status-msg">
            Unable to find any <br />
            available networks
          </h3>
          {this.renderRefreshButton()}
        </div>
      </div>
    );
  }

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    if (this.loadingProgress === LoadingProgress.Pending) {
      return this.renderLoadingContainer();
    } else if (this.loadingProgress === LoadingProgress.Failed) {
      return this.renderFailureContainer();
    } else if (this.loadingProgress === LoadingProgress.Successful && this.wifiEntries.length) {
      const refreshFocusedClass = this.refreshBtnFocused ? 'refresh-focused' : 'refresh-blurred';
      const className = `wifi-list--items-container content-can-scroll ${refreshFocusedClass}`;
      return <div class={className}>{this.renderListItems()}</div>;
    } else {
      return this.renderFailureContainer();
    }
  }
}


