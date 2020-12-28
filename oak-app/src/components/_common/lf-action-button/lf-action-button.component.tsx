// ==== Library Imports =======================================================
import { Component, Element, Event, EventEmitter, h, Host, Listen, Prop, State } from '@stencil/core';
import { Key as EventKey } from 'ts-key-enum';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import { ProcessStatus } from '../../../shared/enums/lf-process-status.enum';

@Component({
  tag: 'lf-action-button',
  styleUrls: ['lf-action-button.component.scss'],
  shadow: true,
})
export class LfActionButton{
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('LfActionButton').logger;

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() buttonText: string;
  @Prop() expandSize: 'full' | 'half' = 'full';

  // ==== EVENTS SECTION ========================================================================
  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // ==== LISTENERS SECTION =====================================================================
  // ==== PUBLIC METHODS API - @Method() SECTION ================================================
  // ==== LOCAL METHODS SECTION =================================================================
  // ==== RENDERING SECTION =====================================================================


  // - -  render Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render(): HTMLAllCollection {
    this.log.debug("render");

    const className = `action-btn--native-element ${this.expandSize}-width`;

    return (
      <Host>
        <button class={className} tabindex="0">
          <div class="action-btn--text">{this.buttonText}</div>
        </button>
      </Host>
    );
  }
}
