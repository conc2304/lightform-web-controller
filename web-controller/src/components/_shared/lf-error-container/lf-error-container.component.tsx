// ==== Library Imports =======================================================
import { Component, Element, h, Prop } from '@stencil/core';
import LfLoggerService from '../../../shared/services/lf-logger.service';

// ==== App Imports ===========================================================

@Component({
  tag: 'lf-error-container',
  styleUrl: 'lf-error-container.component.scss',
})
export class LfErrorContainer {
  // ==== OWN PROPERTIES SECTION ==================================================================
  // ---- Private  --------------------------------------------------------------------------------
  private log = new LfLoggerService('LfErrorContainer').logger;

  // ---- Protected -------------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE =====================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION ===============================================================
  // ==== PUBLIC PROPERTY API - Prop() SECTION ====================================================
  // ==== EVENTS SECTION ==========================================================================
  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================
  // ==== LISTENERS SECTION =======================================================================

  // ==== PUBLIC METHODS API - @Method() SECTION ==================================================
  @Prop() errorTitle: string = null;
  @Prop() errorMessage: string = null;

  // ==== LOCAL METHODS SECTION ===================================================================

  // ==== RENDERING SECTION =======================================================================
  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');

    return (
      <div class="lf-error-container">
        {this.errorTitle ? <h3 class="lf-home-page--error-msg-hero">{this.errorTitle}</h3> : ''}
        {this.errorMessage ? <h3 class="lf-home-page--error-msg-desc">{this.errorMessage}</h3> : ''}
        <slot></slot>
      </div>
    );
  }
}
