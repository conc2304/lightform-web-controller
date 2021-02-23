// ==== Library Imports =======================================================
import { Component, h, Element, Host, Prop } from '@stencil/core';
import LfLoggerService from '../../../shared/services/lf-logger.service';

// ==== App Imports ===========================================================

@Component({
  tag: 'lf-card',
  styleUrl: 'lf-card.component.scss',
  shadow: true,
})
export class LfCard {
  // ==== OWN PROPERTIES SECTION ================================================================

  // ---- Private -------------------------------------------------------------------------------
  private log = new LfLoggerService("LfCard").logger;
  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() el: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() cardTitle!: string;

  // ==== EVENTS SECTION ========================================================================
  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // ==== LISTENERS SECTION =====================================================================
  // ==== PUBLIC METHODS API - @Method() SECTION ================================================
  // ==== LOCAL METHODS SECTION =================================================================

  // ==== RENDERING SECTION =====================================================================
  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug("render");
    return (
      <Host class="lf-card">
        <div class="lf-card--content">
          <div class="lf-card--header">
            <div class="lf-card--title">{this.cardTitle}</div>
            <div class="lf-card--divider"></div>
          </div>

          <div class="lf-card--body">
            <slot></slot>
          </div>
        </div>
      </Host>
    );
  }
}
