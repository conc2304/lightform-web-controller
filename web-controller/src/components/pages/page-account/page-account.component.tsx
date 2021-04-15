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
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() isMobileLayout: boolean = lfAppState.mobileLayout;
  @State() loading = !(lfAppState.appDataInitialized && lfAppState.deviceDataInitialized);

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

  @Listen('_appDataInitialized', { target: 'document' })
  onAppDataInitialized(): void {
    this.loading = !(lfAppState.appDataInitialized && lfAppState.deviceDataInitialized);
  }

  @Listen('_deviceDataInitialized', { target: 'document' })
  onDeviceDataInitialized(): void {
    this.loading = !(lfAppState.appDataInitialized && lfAppState.deviceDataInitialized);
  }

  // ==== PUBLIC METHODS API - @Method() SECTION =================================================
  // ==== LOCAL METHODS SECTION ==================================================================

  // ==== RENDERING SECTION ======================================================================
  private renderContent() {
    if (this.loading) {
      return <lf-loading-message />;
    } else {
      const layoutClassName = this.isMobileLayout ? 'lf-layout--mobile' : 'lf-layout--desktop';
      return (
        <div class={`lf-account scroll-y ${layoutClassName}`}>
          <lf-account-info />
        </div>
      );
    }
  }

  // - -  render Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    try {
      this.log.debug('render');

      return this.renderContent();
    } catch (error) {
      this.log ? this.log.error(error) : console.error(error);

      if (error?.message && error?.code) {
        return <lf-error-message errorCode={error?.code} errorMessage={error?.message} hasResetButton={true} />;
      }
    }
  }
}
