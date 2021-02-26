// ==== Library Imports =======================================================
import { Component, Element, h, Prop } from '@stencil/core';
import LfLoggerService from '../../../shared/services/lf-logger.service';

// ==== App Imports ===========================================================

@Component({
  tag: 'lf-error-message',
  styleUrl: 'lf-error-message.component.scss',
})
export class LfErrorCMessage {
  // ==== OWN PROPERTIES SECTION ==================================================================
  // ---- Private  --------------------------------------------------------------------------------
  private log = new LfLoggerService('LfErrorMessage').logger;

  // ==== HOST HTML REFERENCE =====================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION ===============================================================
  // ==== PUBLIC PROPERTY API - Prop() SECTION ====================================================
  @Prop() errorMessage: string;
  @Prop() errorCode: number | string;
  @Prop() hasResetButton: boolean;

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
      <div class="lf-error-message">
        <img class="lf-error-message--image" src="/assets/icons/error-lightbulb.svg" />
        <h3 class="lf-error-message--error-msg-desc">{this.errorMessage || 'Oops! There has been an error.'}</h3>
        {this.errorCode ? <h3 class="lf-error-message--error-msg-desc">{this.errorMessage}</h3> : ''}
        {this.errorCode ? <h3 class="lf-error-message--error-msg-desc">(error code: {this.errorCode})</h3> : ''}

        {this.hasResetButton ? (
          <lf-button
            context="primary"
            onClick={() => {
              // make sure nothing fishy is going on here
              document.cookie.split(';').forEach(function (c) {
                document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
              });
              localStorage.clear();

              // not using ion router in case that was the reason for the error
              window.location.pathname = '/';
            }}
          >
            Web Controller Home
          </lf-button>
        ) : (
          ''
        )}
        <slot></slot>
      </div>
    );
  }
}
