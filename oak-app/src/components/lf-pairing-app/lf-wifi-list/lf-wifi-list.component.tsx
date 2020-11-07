// ==== Library Imports =======================================================
import { Component, Element, Event, EventEmitter, h, Listen, State } from '@stencil/core';
import { Key as EventKey } from 'ts-key-enum';
import { LfConf } from '../../../global/resources';

// ==== App Imports ===========================================================
import { WifiEntry } from '../../../shared/interfaces/wifi-entry.interface';
import LfNetworkConnector from '../../../shared/services/lf-network-connection.service';

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
  // Dependency Injections
  private NetworkConnector = LfNetworkConnector;

  // ---- Private   -----------------------------------------------------------------------------
  private refreshButtonEl: HTMLElement;

  // ---- Protected -----------------------------------------------------------------------------
  // none

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() el: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() loadingProgress: LoadingProgress;
  @State() wifiEntries: WifiEntry[] = [];
  @State() refreshBtnFocused = false;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  // @Prop() propName: string;

  // ==== EVENTS SECTION ========================================================================
  @Event() networkSelected: EventEmitter;

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - - -
  componentWillLoad() {
    console.log('componentWillLoad');
    this.getAvailableNetworks();
  }

  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - - -
  componentDidUpdate() {
    console.log('componentDidUpdate');

    if (this.loadingProgress === LoadingProgress.Failed) {
      setTimeout(() => {
        this.refreshButtonEl.focus();
      }, 500);
    }
  }

  // ==== LISTENERS SECTION =====================================================================
  @Listen('keydown', {
    target: 'window',
    capture: true,
  })
  onKeydown(e: KeyboardEvent) {
    console.log('onKeydown');
    this.handleKeys(e);
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ========================================================
  // @Method()
  // async publicMethod(): Promise<void> {return}

  // ==== LOCAL METHODS SECTION =========================================================================
  private async getAvailableNetworks() {
    console.log('getAvailableNetworks');

    try {
      this.loadingProgress = LoadingProgress.Pending;
      this.wifiEntries = [];

      // if on device make it look like we are actively doing something (when in reality the result is immediate)
      const timeout = LfConf.device ? Math.random() * (5 - 3) + 3 * 1000 : 0;
      setTimeout(() => {
        this.NetworkConnector.fetchAvailableNetworks()
          .then(response => {
            if (!response) {
              throw new Error('No Network Response Received.');
            }

            let last: WifiEntry = {
              ssid: 'LAST ONE',
              signal: 1,
              uuid: 'LAST ONE',
            };
            this.wifiEntries = response;
            this.wifiEntries.push(last);
            this.wifiEntries = this.wifiEntries.concat(response).concat(response);
            this.loadingProgress = LoadingProgress.Successful;
          })
          .catch(e => {
            this.loadingProgress = LoadingProgress.Failed;

            throw new Error(e);
          });
      }, timeout);
    } catch (e) {
      console.error(e);
      this.loadingProgress = LoadingProgress.Failed;
    }
  }

  private onWifiEntryClicked(network: WifiEntry) {
    console.log('onWifiEntryClicked');
    this.networkSelected.emit(network);
  }

  private onRefreshListClicked(): void {
    console.log('onRefreshListClicked');
    this.wifiEntries = [];
    this.getAvailableNetworks();
  }

  private handleKeys(e) {
    console.log('handleKeys');

    const specialKeys = [EventKey.ArrowDown, EventKey.ArrowUp, EventKey.Enter];
    const parent = document.querySelector('.wifi-list--items-container') as HTMLElement;
    const activeEl = document.activeElement;
    const activeElIndex = Number(activeEl.getAttribute('data-index')) || 0;
    let nextFocusEl;

    if (specialKeys.includes(e.key)) {
      e.preventDefault();
    }

    switch (e.key) {
      case EventKey.ArrowDown:
        nextFocusEl = (activeEl.nextSibling as HTMLElement) ? (activeEl.nextSibling as HTMLElement) : (parent.firstChild as HTMLElement);
        this.handleNextElFocus(nextFocusEl, activeElIndex);

        break;

      case EventKey.ArrowUp:
        nextFocusEl = (activeEl.previousSibling as HTMLElement) ? (activeEl.previousSibling as HTMLElement) : (parent.lastChild as HTMLElement);
        this.handleNextElFocus(nextFocusEl, activeElIndex);

        break;
      case EventKey.Enter:
        const activeIndex = Array.prototype.indexOf.call(parent.childNodes, document.activeElement);

        if (this.loadingProgress === LoadingProgress.Failed || activeIndex === this.wifiEntries.length) {
          this.onRefreshListClicked();
        } else {
          this.onWifiEntryClicked(this.wifiEntries[activeIndex]);
        }

        break;
    }
  }

  private handleNextElFocus(nextFocusEl: HTMLElement, activeIndex: number): void {
    console.log("handleNextElFocus")
    const distanceToRefresh = this.wifiEntries.length - activeIndex;
    this.refreshBtnFocused = distanceToRefresh < 3;
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
          <img alt="Loading" src="assets/images/progress-spinner-circles.gif" />
        </div>
      </div>
    );
  }

  private renderFailureContainer() {
    return (
      <div class="wifi-list--items-container no-scroll">
        <div class="loading-container">
          <h3>Unable to find any available networks</h3>
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
      const className = `wifi-list--items-container scrollable-content ${refreshFocusedClass}`;
      return <div class={className}>{this.renderListItems()}</div>;
    } else {
      return this.renderFailureContainer();
    }
  }
}
