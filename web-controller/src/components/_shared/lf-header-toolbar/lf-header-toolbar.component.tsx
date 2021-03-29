// ==== Library Imports =======================================================
import { Component, Element, h, Prop, Listen, State, Watch } from '@stencil/core';

// ==== App Imports ===========================================================
import state from '../../../store/lf-app-state.store';
import { LfDevice, LfHeaderBarMode } from '../../../shared/interfaces/lf-web-controller.interface';
import LfLoggerService from '../../../shared/services/lf-logger.service';

@Component({
  tag: 'lf-header-toolbar',
  styleUrls: ['lf-header-toolbar.component.scss'],
})
export class LfHeaderToolbar {
  // ==== OWN PROPERTIES SECTION ==================================================================
  // ---- Private  --------------------------------------------------------------------------------
  private log = new LfLoggerService('LfHeaderToolbar').logger;
  private router: HTMLIonRouterElement;
  private envRegex = /\/environments\/\d+-(\w+)/;

  // ---- Protected -------------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE =====================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION ===============================================================
  @State() expanded = false;
  @State() backNavigationMode: false;
  @State() displayTitle: string = state?.deviceSelected?.name || 'No Device';
  @State() registeredDevices: Array<LfDevice> = state.registeredDevices;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ====================================================
  @Prop() currentRoute: string = window.location.pathname;

  // ==== EVENTS SECTION ==========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================
  // - -  componentWillLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');
    this.setDeviceSelected();
  }

  // - -  componentDidLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad() {
    this.log.debug('componentDidLoad');
    this.router = await document.querySelector('ion-router')?.componentOnReady();
  }

  // ==== LISTENERS SECTION =======================================================================
  @Listen('_registeredDevicesUpdated', { target: 'document' })
  onRegisteredDevicesUpdated() {
    this.log.info('_registeredDevicesUpdated');
    this.registeredDevices = state.registeredDevices;
    this.setDeviceSelected();
  }

  @Listen('_deviceSelected', { target: 'document' })
  onDevicesSelectedUpdated() {
    this.setDeviceSelected();
  }

  @Watch('currentRoute')
  onRouteChange() {
    this.log.debug('onRouteChange');
    this.setDeviceSelected();
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ==================================================

  // ==== LOCAL METHODS SECTION ===================================================================
  private onDeviceSelected(device: LfDevice): void {
    this.log.debug('onDeviceSelected');

    state.deviceSelected = device;
    this.registeredDevices = state.registeredDevices;
    this.setDeviceSelected();
    this.expanded = false;
  }

  private setDeviceSelected(): void {
    this.log.debug('setDeviceSelected');
    if (this.getModeType() === LfHeaderBarMode.ENVIRONMENT_CATEGORY) return;

    this.displayTitle = this.getModeType() === LfHeaderBarMode.DEVICE_SELECTOR ? state.deviceSelected?.name : state.accountDeviceSelected?.name;
  }

  private toggleDropdown(): void {
    this.log.debug('toggleDropdown');

    this.expanded = !this.expanded;
  }

  private getDisplayTitle() {
    const mode = this.getModeType();

    switch (mode) {
      case LfHeaderBarMode.ENVIRONMENT_CATEGORY:
        return this.currentRoute.match(this.envRegex)[1];
      case LfHeaderBarMode.DEVICE_SELECTOR:
        return state?.deviceSelected?.name || 'No Device';
      case LfHeaderBarMode.DEVICE_VIEWER:
        return state.accountDeviceSelected?.name || 'No Device';
    }
  }

  private dropdownAvailable(): boolean {
    this.log.debug('dropdownAvailable');
    return !!(state.deviceSelected && state.registeredDevices?.length > 1);
  }

  private getModeType(): LfHeaderBarMode {
    this.log.debug('getModeType');

    if (this.currentRoute.match(this.envRegex)) {
      return LfHeaderBarMode.ENVIRONMENT_CATEGORY;
    } else if (this.currentRoute.includes('/account/devices')) {
      return LfHeaderBarMode.DEVICE_VIEWER;
    } else {
      return LfHeaderBarMode.DEVICE_SELECTOR;
    }
  }

  // ==== RENDERING SECTION =========================================================================
  private renderDeviceSelector() {
    this.log.debug('renderDeviceSelector');

    if (this.dropdownAvailable()) {
      return [
        <div class="lf-header--device-selector">
          <lf-list class="device-selector--list">
            <ion-label>Select the main device</ion-label>
            {this.registeredDevices.map((device: LfDevice) => {
              const isSelected = device === state.deviceSelected ? 'selected' : '';
              const deviceOnline = !device?._embedded?.info?.offlineSince;

              return (
                <lf-list-item
                  class="device-selector--item"
                  onClick={() => {
                    this.onDeviceSelected(device);
                  }}
                >
                  <div slot="start">
                    <lf-device-status-marker online={deviceOnline} size="small" />
                  </div>

                  <p class="device-selector--device-name">{device?.name || 'Lightform Device'}</p>
                  <div slot="end" class={`device-selector--selected-icon ${isSelected}`}></div>
                </lf-list-item>
              );
            })}
          </lf-list>
        </div>,
      ];
    }
  }

  private renderDropdownToggle(headerStateClass: string) {
    this.log.debug('renderDropdownToggle');

    if (this.dropdownAvailable()) {
      return (
        <div
          class={`lf-header--dropdown-icon ${headerStateClass}`}
          onClick={() => {
            this.toggleDropdown();
          }}
          slot="end"
        ></div>
      );
    }
  }

  private renderLeftIcon() {
    this.log.debug('renderLeftIcon');

    const mode = this.getModeType();
    if (mode === LfHeaderBarMode.DEVICE_VIEWER || mode === LfHeaderBarMode.ENVIRONMENT_CATEGORY) {
      return (
        <img
          slot="start"
          onClick={() => {
            mode === LfHeaderBarMode.DEVICE_VIEWER ? this.router.push('/account') : this.router.push('/');
          }}
          class="lf-header--back-button"
          src="/assets/icons/chevron-left.svg"
          alt="Back"
        />
      );
    } else {
      return <img slot="start" class="lf-header--logomark" src="/assets/images/logos/Logomark White.svg" alt="Lightform"></img>;
    }
  }

  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');

    const headerStateClass = this.expanded ? 'expanded' : '';
    return [
      <ion-header class={`lf-header ${headerStateClass}`}>
        <ion-toolbar class="lf-header--toolbar">
          {this.renderLeftIcon()}
          <h3 class="lf-header--device-title">{this.getDisplayTitle()}</h3>
          {this.getModeType() === LfHeaderBarMode.DEVICE_SELECTOR ? this.renderDropdownToggle(headerStateClass) : []}
        </ion-toolbar>
        <div class={`device-selector--container ${headerStateClass}`}>{this.renderDeviceSelector()}</div>
      </ion-header>,
      <div
        onClick={() => {
          this.expanded = false;
        }}
        class={`lf-menu--modal-background ${headerStateClass}`}
      ></div>,
    ];
  }
}
