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

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() isMobileLayout: boolean;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() deviceName: string; // from the url

  // ==== EVENTS SECTION ========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - -
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');

    document.title = `Lightform | Device Details `;

    this.isMobileLayout = state.mobileLayout;
    // allow for url to have a - instead of a space
    this.deviceName = this.deviceName.replace('-', ' ');

    if (!lfAppState.registeredDevices) {
      await initializeData();
    }
    if (!lfAppState.deviceSelected) {
      initializeDeviceSelected();
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
    this.deviceName = lfAppState.deviceSelected?.name;
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
        <lf-account-info activeAccountDevice={this.deviceName}/>
      </div>,
      <div class={`lf-device-info--wrapper ${this.getLayoutClass()}`}>
        <lf-device-info deviceName={this.deviceName} />
      </div>,
    ];
  }

  // - -  render Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - - - - - - - - -
  render() {
    try {
      this.log.debug('render');
      return [<div class={`lf-device--page scroll-y ${this.getLayoutClass()}`}>{this.renderContent()}</div>];
    } catch (error) {
      this.log ? this.log.error(error) : console.error(error);

      if (error?.message && error?.code) {
        return <lf-error-message errorCode={error?.code} errorMessage={error?.message} hasResetButton={true} />;
      } else {
        return <lf-error-message hasResetButton={true} />;
      }
    }
  }
}
