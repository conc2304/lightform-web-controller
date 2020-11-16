// Library Imports
import { Component, h, Host } from '@stencil/core';

// App Imports
import '@vaadin/vaadin-progress-bar/vaadin-progress-bar.js';
import { LfAppRoute } from '../../shared/enums/lf-app-routes.enum';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
})
export class LfAppRoot {
  // ==== PUBLIC ============================================================

  // ---- Properties --------------------------------------------------------

  // ---- Methods -----------------------------------------------------------

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    return (
      <Host class="app-root">
        <stencil-router id="router">
          <stencil-route-switch scrollTopOffset={0}>
            <stencil-route url={LfAppRoute.HOME.urlPath} component="lf-app-home" exact={true} />
            <stencil-route url={LfAppRoute.PAIRING.urlPath} component={LfAppRoute.PAIRING.component} />
            <stencil-route url={LfAppRoute.FIRMWARE.urlPath} component={LfAppRoute.FIRMWARE.component} />
            <stencil-route component="lf-pairing-app" />
          </stencil-route-switch>
        </stencil-router>
        {/* <pairing-app animated-background={false}></pairing-app> */}
      </Host>
    );
  }
}
