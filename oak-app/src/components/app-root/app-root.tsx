// ==== Library Imports =======================================================
import { Component, h, Host, Prop} from '@stencil/core';
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
  @Prop() history: RouterHistory;

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================

  // ==== LISTENERS SECTION =====================================================================

  // ==== RENDERING SECTION =========================================================================

  private renderRouter() {
    return (
      <stencil-router id="router" historyType="hash">
        <stencil-route-switch scrollTopOffset={0}>
          <stencil-route url={LfAppRoute.HOME.urlPath} component={LfAppRoute.HOME.component} exact={true} />
          <stencil-route url={LfAppRoute.PAIRING.urlPath} component={LfAppRoute.PAIRING.component} />
          <stencil-route url={LfAppRoute.FIRMWARE.urlPath} component={LfAppRoute.FIRMWARE.component} />
          <stencil-route url={LfAppRoute.REGISTRATION.urlPath} component={LfAppRoute.REGISTRATION.component} />
          <stencil-route url={LfAppRoute.REGISTRATION.urlPath} component={LfAppRoute.REGISTRATION.component} />
          <stencil-route url={LfAppRoute.OAKSEED.urlPath} component={LfAppRoute.OAKSEED.component} />
          <stencil-route url={LfAppRoute.REBOOT.urlPath} component={LfAppRoute.REBOOT.component} />
          <stencil-route component="lf-app-home" />
        </stencil-route-switch>
      </stencil-router>
    );
  }

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');
    return (
      <Host class="app-root">
        <div class="lf-background-image"></div>
        {this.renderRouter()}
      </Host>
    );
  }
}
