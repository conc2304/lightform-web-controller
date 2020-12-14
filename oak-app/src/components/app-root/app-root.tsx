// Library Imports
import { Component, h, Host, Listen, State } from '@stencil/core';

// App Imports
import '@vaadin/vaadin-progress-bar/vaadin-progress-bar.js';
// import { LfAppRoute } from '../../shared/enums/lf-app-routes.enum';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
})
export class LfAppRoot {
  // ==== PUBLIC ============================================================

  // ---- Properties --------------------------------------------------------

  // ==== State() VARIABLES SECTION =============================================================
  @State() appPage: 'home' | 'pairing' | 'firmware' = 'home';
  // ---- Methods -----------------------------------------------------------

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================


  // ==== LISTENERS SECTION =====================================================================
  @Listen('appRouteChanged')
  onAppRouteChanged(event: CustomEvent) {
    const routeName = event.detail;
    if (this.appPage !== routeName) {
      this.appPage = routeName;
    }
  }

  // ==== RENDERING SECTION =========================================================================

  private renderRoute() {
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
    return <Host class="app-root">{this.renderRoute()}</Host>;
  }
}
