// Library Imports
import { Component, h, Host } from '@stencil/core';

// App Imports
import '@vaadin/vaadin-progress-bar/vaadin-progress-bar.js';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
})
export class AppRoot {
  // ==== PUBLIC ============================================================

  // ---- Properties --------------------------------------------------------

  // ---- Methods -----------------------------------------------------------

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    return (
      <Host class="app-root">
        <stencil-router id="router">
          <stencil-route-switch scrollTopOffset={0}>
            <stencil-route url={["/", "/home"]}  component="app-home" exact={true}/>
            <stencil-route url="/pair" component="lf-pairing-app"/>
            <stencil-route url="/firmware" component="lf-firmware-app"/>
            <stencil-route component="lf-pairing-app"/>
          </stencil-route-switch>
        </stencil-router>
        {/* <pairing-app animated-background={false}></pairing-app> */}
      </Host>
    );
  }
}
