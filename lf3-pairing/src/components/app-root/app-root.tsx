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
        <app-home animated-background={false}></app-home>
      </Host>
    );
  }
}
