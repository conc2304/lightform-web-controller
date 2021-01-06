// ==== Library Imports =======================================================
import { Component, Element, h, Prop } from '@stencil/core';
import LfLoggerService from '../../../shared/services/lf-logger.service';

// ==== App Imports ===========================================================

@Component({
  tag: 'lf-info-item',
  styleUrl: 'lf-info-item.component.scss',
})
export class LfInfoItem {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('LfAccountInfo').logger;

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() lfDeviceInfoEl: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() value: string;
  @Prop() label: string;
  @Prop() animationOrder: number;

  // ==== EVENTS SECTION ========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // ==== LISTENERS SECTION =====================================================================
  // ==== PUBLIC METHODS API - @Method() SECTION ================================================
  // ==== LOCAL METHODS SECTION =================================================================

  // ==== RENDERING SECTION =====================================================================
  // - -  render Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - - - - - - - -
  render() {
    this.log.debug('render');

    let className = 'lf-info-item--container';
    if (this.animationOrder >= 0) {
      className = `${className} animate-in`;
    }
    return (
      <div class={className} style={{ '--animation-order': this.animationOrder } as any}>
        <div class="lf-info-item--label">{this.label}</div>
        <div class="lf-info-item--value">{this.value}</div>
      </div>
    );
  }
}
