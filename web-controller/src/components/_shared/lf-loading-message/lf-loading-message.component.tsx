// ==== Library Imports =======================================================
import { Component, Element, h, Prop } from '@stencil/core';

// ==== App Imports ===========================================================

@Component({
  tag: 'lf-loading-message',
  styleUrl: 'lf-loading-message.component.scss',
})
export class LfLoadingMessage {
  // ==== HOST HTML REFERENCE ===================================================================
  @Element() lfLoadingMsgEl: HTMLElement;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() message: string = 'Acquiring Magic';

  // ==== RENDERING SECTION ======================================================================
  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - -
  render() {
    return (
      <div class="loading-container">
        <h3>{this.message}</h3>
        <img alt="Loading" src="/assets/images/progress-spinner-circles.gif" />
      </div>
    );
  }
}
