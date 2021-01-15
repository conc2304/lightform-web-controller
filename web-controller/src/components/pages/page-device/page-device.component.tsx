// ==== Library Imports =======================================================
import { Component, Element, h, Listen, Prop, State } from '@stencil/core';

// ==== App Imports ===========================================================
import state, { initializeData, initializeDeviceSelected } from '../../../store/lf-app-state.store';
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfAppState from '../../../store/lf-app-state.store';

@Component({
  tag: 'page-device',
  styleUrl: 'page-device.component.scss',
})
export class PageDevice {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('PageDevice').logger;

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() pageAccountEl: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() isMobileLayout: boolean;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() deviceName: string; // from the url

  // ==== EVENTS SECTION ========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - -
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');

    this.isMobileLayout = state.mobileLayout;
    // allow for url to have a - instead of a space
    this.deviceName = this.deviceName.replace('-', ' ');

    if (!lfAppState.registeredDevices) {
      initializeData().then(() => {
        if (!lfAppState.deviceSelected) {
          initializeDeviceSelected();
        }
      });
    }
  }

  public async componentDidLoad() {
    this.log.debug('componentDidUpdate');
  }

  // ==== LISTENERS SECTION =====================================================================
  @Listen('_layoutUpdated', { target: 'document' })
  onWindowResized(): void {
    this.log.debug('onWindowResized');
    this.isMobileLayout = state.mobileLayout;
  }

  @Listen('_deviceSelected', { target: 'document' })
  onDeviceSelected(): void {
    this.log.debug('onDeviceSelected');
    this.deviceName = lfAppState.deviceSelected.name;
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ================================================
  // ==== LOCAL METHODS SECTION =================================================================
  private getLayoutClass() {
    this.log.debug('getLayoutClass');

    return this.isMobileLayout ? 'lf-layout--mobile' : 'lf-layout--desktop';
  }

  // ==== RENDERING SECTION =====================================================================

  private renderContent() {
    this.log.debug('renderDesktopView');

    return [
      <div class={`lf-account-info--wrapper ${this.getLayoutClass()}`}>
        <lf-account-info activeAccountDevice={this.deviceName} animateInContent={false} />
      </div>,
      <div class={`lf-device-info--wrapper ${this.getLayoutClass()}`}>
        <lf-device-info deviceName={this.deviceName} />
      </div>,
    ];
  }

  // - -  render Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - - - - - - - - -
  render() {
    this.log.debug('render');
    return [<div class={`lf-device--page scroll-y ${this.getLayoutClass()}`}>{this.renderContent()}</div>];
  }
}
