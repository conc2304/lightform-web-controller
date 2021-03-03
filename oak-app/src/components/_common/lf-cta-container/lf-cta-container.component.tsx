// ==== Library Imports =======================================================
import { Component, Element, h, Prop, Host } from '@stencil/core';

// ==== App Imports ===========================================================
import { LF_CTA_URL } from '../../../shared/lf-cta-url.constant';

@Component({
  tag: 'lf-cta-container',
  styleUrls: ['lf-cta-container.component.scss'],
  shadow: false,
})
export class LfCtaContainer {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() faded = false;

  // ==== EVENTS SECTION ========================================================================
  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // ==== LISTENERS SECTION =====================================================================
  // ==== PUBLIC METHODS API - @Method() SECTION ================================================
  // ==== LOCAL METHODS SECTION =================================================================

  // ==== RENDERING SECTION =====================================================================
  // - -  render Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    const fadedClass = this.faded ? 'faded' : '';
    return (
      <Host class={`lf-cta--container ${fadedClass}`}>
        Visit <strong>{LF_CTA_URL}</strong> for a full setup guide
      </Host>
    );
  }
}
