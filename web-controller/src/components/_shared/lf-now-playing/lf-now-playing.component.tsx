// ==== Library Imports =======================================================
import { Component, Element, h, Host } from '@stencil/core';
import LfLoggerService from '../../../shared/services/lf-logger.service';

// ==== App Imports ===========================================================
import state from '../../../store/lf-app-state.store';

@Component({
  tag: 'lf-now-playing',
  styleUrls: ['lf-now-playing.component.scss'],
  shadow: false,
  scoped: true,
})
export class LfHeaderToolbar {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService("LfHeaderToolbar").logger;

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  // ==== EVENTS SECTION ========================================================================
  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // ==== LISTENERS SECTION =====================================================================
  // ==== PUBLIC METHODS API - @Method() SECTION ================================================
  // ==== LOCAL METHODS SECTION =================================================================

  // ==== RENDERING SECTION =====================================================================
  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');

    return (
      <Host>
        <div class="lf-now-playing--container">
          <div class="lf-now-playing--content flex-parent">
            <div class="lf-now-playing--img-wrapper flex-fixed">
              <img src={state?.sceneSelected?.sceneImgURl || ''}></img>
            </div>
            <div class="lf-now-playing--text flex-expand">
              <div class="truncate-wrapper">
                <div class="lf-now-playing--hero truncate">NOW PLAYING ON OBJECT</div>
                <div class="lf-now-playing--scene-title truncate">{state?.sceneSelected?.name || '...'}</div>
              </div>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
