// ==== Library Imports =======================================================
import { Component, Element, h, Listen, State } from '@stencil/core';
import LfLoggerService from '../../../shared/services/lf-logger.service';

// ==== App Imports ===========================================================
import lfAppState, { initializeData, initializeDeviceSelected } from '../../../store/lf-app-state.store';

@Component({
  tag: 'page-account',
  styleUrl: 'page-account.component.scss',
})
export class PageAccount {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('PageAccount').logger;

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() pageAccountEl: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() isMobileLayout: boolean = lfAppState.mobileLayout;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  // ==== EVENTS SECTION ========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - -
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');

    if (!lfAppState.registeredDevices) {
      await initializeData();
    }

    if (!lfAppState.deviceSelected) {
      initializeDeviceSelected();
    }
  }

  public componentWillRender() {
    document.title = `Lightform | Account `;
  }

  // ==== LISTENERS SECTION =====================================================================
  @Listen('_layoutUpdated', { target: 'document' })
  onWindowResized(): void {
    this.log.debug('onWindowResized');
    this.isMobileLayout = lfAppState.mobileLayout;
  }

  // ==== PUBLIC METHODS API - @Method() SECTION =================================================
  // ==== LOCAL METHODS SECTION ==================================================================

  // ==== RENDERING SECTION ======================================================================
  // - -  render Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - - - - - - - -
  render() {
    try {
      this.log.debug('render');

      const layoutClassName = this.isMobileLayout ? 'lf-layout--mobile' : 'lf-layout--desktop';

      return [
        <div class={`lf-account scroll-y ${layoutClassName}`}>
          <lf-account-info />
        </div>,
      ];
    } catch (error) {
      if (error?.message && error?.code) {
        return <lf-error-message errorCode={error?.name} errorMessage={error?.message} hasResetButton={true} />;
      }
    }
  }
}
