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
  @State() appPage: 'home' | 'pairing' | 'firmware' | 'registration' = 'home';
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

    switch (this.appPage) {
      case 'registration':
        return <lf-registration-app />;
      case 'firmware':
        return <lf-firmware-app />;
      case 'pairing':
        return <lf-pairing-ap />;
      case 'home':
      default:
        return <lf-app-home />;
    }
  }

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');
    return <Host class="app-root">{this.renderRoute()}</Host>;
  }
}
