// ==== Library Imports =======================================================
import { Component, Element, h, Listen, State } from '@stencil/core';
import LfLoggerService from '../../../shared/services/lf-logger.service';

// ==== App Imports ===========================================================
import lfAppState, { initializeData } from '../../../store/lf-app-state.store';

@Component({
  tag: 'page-account',
  styleUrl: 'page-account.component.scss',
})
export class PageAccount {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('PageAccount').logger;

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() pageAccountEl: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() isMobileLayout: boolean = lfAppState.mobileLayout;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  // ==== EVENTS SECTION ========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - -
  public componentWillLoad() {
    this.log.debug('componentWillLoad');
    initializeData();
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
    this.log.debug('render');

    const layoutClassName = this.isMobileLayout ? 'lf-layout--mobile' : 'lf-layout--desktop';

    return [
      <div class={`lf-account scroll-y ${layoutClassName}`}>
        <lf-account-info />
      </div>,
    ];
  }
}
