import { Component, h, Host } from '@stencil/core';

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
      <Host>
        <stencil-router id="router">
          <stencil-route url="/" component="app-home" />
          <stencil-rout url="/pair" component="lf-pairing-app" />
          <stencil-rout url="/firmware" component="lf-firmware-app" />
        </stencil-router>
        {/* <pairing-app animated-background={false}></pairing-app> */}
      </Host>
    );
  }
}
