// ==== Library Imports =======================================================
import { Component, h, Host, Listen, State } from '@stencil/core';

// ==== App Imports ===========================================================
import '@vaadin/vaadin-progress-bar/vaadin-progress-bar.js';
import LfLoggerService from '../../shared/services/lf-logger.service';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
})
export class LfAppRoot {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private   -----------------------------------------------------------------------------
  private log = new LfLoggerService('LfAppRoot').logger;

  // ---- Protected -----------------------------------------------------------------------------

  // ==== State() VARIABLES SECTION =============================================================
  @State() appPage: 'home' | 'pairing' | 'firmware' = 'pairing';
  // ---- Methods -----------------------------------------------------------

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================

  // ==== LISTENERS SECTION =====================================================================
  @Listen('appRouteChanged')
  onAppRouteChanged(event: CustomEvent) {
    this.log.info('appRouteChanged');
    const routeName = event.detail;
    if (this.appPage !== routeName) {
      this.appPage = routeName;
    }
  }

  // ==== RENDERING SECTION =========================================================================

  private renderRoute() {
    this.log.debug('renderRoute');

    if (this.appPage === 'home') {
      return <lf-app-home />;
    } else if (this.appPage === 'pairing') {
      return <lf-pairing-app />;
    } else if (this.appPage === 'firmware') {
      return <lf-firmware-app />;
    } else {
      this.appPage = 'home';
    }
  }

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');
    return <Host class="app-root">{this.renderRoute()}</Host>;
  }
}
