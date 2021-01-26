// ==== Library Imports =======================================================
import { Component, h, Host, Listen, Prop, State } from '@stencil/core';
import { RouterHistory } from '@stencil/router';

// ==== App Imports ===========================================================
import '@vaadin/vaadin-progress-bar/vaadin-progress-bar.js';
import LfLoggerService from '../../shared/services/lf-logger.service';
import { LfAppRoute } from '../../shared/enums/lf-app-routes.enum';
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

  @Prop() history: RouterHistory;

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
        return <lf-pairing-app />;
      case 'home':
      default:
        return <lf-app-home />;
    }
  }

  private renderRouter() {
    return (
      <stencil-router id="router" historyType="hash">
        <stencil-route-switch scrollTopOffset={0}>
          <stencil-route url={LfAppRoute.HOME.urlPath} component={LfAppRoute.HOME.component} exact={true} />
          <stencil-route url={LfAppRoute.PAIRING.urlPath} component={LfAppRoute.PAIRING.component} />
          <stencil-route url={LfAppRoute.FIRMWARE.urlPath} component={LfAppRoute.FIRMWARE.component} />
          <stencil-route url={LfAppRoute.REGISTRATION.urlPath} component={LfAppRoute.REGISTRATION.component} />
          <stencil-route component="lf-app-home" />
        </stencil-route-switch>
      </stencil-router>
    );
  }

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');
    // return <Host class="app-root">{this.renderRoute()}</Host>;
    return (
      <Host class="app-root">
        <div class="lf-background-image"></div>
        {this.renderRouter()}
      </Host>
    );
  }
}
