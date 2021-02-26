// ==== Library Imports =======================================================
import { Component, Element, h, Prop } from '@stencil/core';
import LfLoggerService from '../../../shared/services/lf-logger.service';

// ==== App Imports ===========================================================

@Component({
  tag: 'lf-call-to-action',
  styleUrl: 'lf-call-to-action.component.scss',
})
export class LfCallToAction {
  // ==== OWN PROPERTIES SECTION ==================================================================
  // ---- Private  --------------------------------------------------------------------------------
  private log = new LfLoggerService('LfCallToAction').logger;

  // ==== HOST HTML REFERENCE =====================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION ===============================================================
  // ==== PUBLIC PROPERTY API - Prop() SECTION ====================================================
  @Prop() message: string;
  @Prop() imgSrc: string;
  @Prop() imgAltText: string;

  // ==== EVENTS SECTION ==========================================================================
  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================
  // ==== LISTENERS SECTION =======================================================================
  // ==== PUBLIC METHODS API - @Method() SECTION ==================================================
  // ==== LOCAL METHODS SECTION ===================================================================

  // ==== RENDERING SECTION =======================================================================
  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');

    return (
      <div class="lf-call-to-action">
        <div class="cta--container">
          <img class="cta--hero-image" src={this.imgSrc} alt={this.imgAltText} />
          <p>{this.message}</p>
        </div>
        <slot></slot>
      </div>
    );
  }
}
