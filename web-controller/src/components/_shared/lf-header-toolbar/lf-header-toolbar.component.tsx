// ==== Library Imports =======================================================
import { Component, Element, h, Prop, Listen, State, Watch } from '@stencil/core';

// ==== App Imports ===========================================================
import lfAppState from '../../../store/lf-app-state.store';
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

  // ---- Protected -------------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE =====================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION ===============================================================
  @State() expanded = false;
  @State() backNavigationMode: false;
  @State() displayedDeviceName: string;
  @State() registeredDevices: Array<LfDevice> = lfAppState.registeredDevices;

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
    this.router = await document.querySelector('ion-router').componentOnReady();
  }

  // ==== LISTENERS SECTION =======================================================================
  @Listen('_registeredDevicesUpdated', { target: 'document' })
  onRegisteredDevicesUpdated() {
    this.log.info('_registeredDevicesUpdated');
    this.registeredDevices = lfAppState.registeredDevices;
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

    lfAppState.deviceSelected = device;
    this.registeredDevices = lfAppState.registeredDevices;
    this.setDeviceSelected();
    this.expanded = false;
  }

  private setDeviceSelected(): void {
    this.log.debug('setDeviceSelected');

    this.displayedDeviceName = this.getModeType() === LfHeaderBarMode.DEVICE_SELECTOR ? lfAppState.deviceSelected?.name : lfAppState.accountDeviceSelected?.name;
  }

  private toggleDropdown(): void {
    this.log.debug('toggleDropdown');

    this.expanded = !this.expanded;
  }

  private dropdownAvailable(): boolean {
    this.log.debug('dropdownAvailable');
    return !!(lfAppState.deviceSelected && lfAppState.registeredDevices.length);
  }

  private getModeType(): LfHeaderBarMode {
    this.log.debug('getModeType');

    return this.currentRoute.includes('/devices') ? LfHeaderBarMode.DEVICE_VIEWER : LfHeaderBarMode.DEVICE_SELECTOR;
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
              const isSelected = device === lfAppState.deviceSelected ? 'selected' : '';

              return (
                <lf-list-item
                  class="device-selector--item"
                  onClick={() => {
                    this.onDeviceSelected(device);
                  }}
                >
                  <div slot="start" class={`device-selector--selected-icon ${isSelected}`}></div>
                  <p class="device-selector--device-name">{device?.name || 'Lightform Device'}</p>
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

    if (mode === LfHeaderBarMode.DEVICE_VIEWER) {
      return (
        <img
          slot="start"
          onClick={() => {
            this.router.push('/account');
          }}
          class="lf-header--back-button"
          src="/assets/icons/chevron-left.svg"
          alt="Back"
        ></img>
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
          <h3 class="lf-header--device-title">{this.displayedDeviceName || 'No Device'}</h3>
          {this.getModeType() === LfHeaderBarMode.DEVICE_SELECTOR ? this.renderDropdownToggle(headerStateClass) : []}
        </ion-toolbar>
        <div class={`device-selector--container ${headerStateClass}`}>{this.renderDeviceSelector()}</div>
      </ion-header>,
      <div
        onClick={() => {
          this.toggleDropdown();
        }}
        class={`lf-menu--modal-background ${headerStateClass}`}
      ></div>,
    ];
  }
}
