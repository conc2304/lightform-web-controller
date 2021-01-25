// ==== Library Imports =======================================================
import { Component, Element, h, Prop } from '@stencil/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';

@Component({
  tag: 'lf-tab-bar-navigation',
  styleUrl: 'lf-tab-bar-navigation.component.scss',
  shadow: false,
  scoped: false,
})
export class LfTabBarNavigation {
  // ==== OWN PROPERTIES SECTION =================================================================
  // ---- Private  -------------------------------------------------------------------------------
  private log = new LfLoggerService('LfTabBarNavigation').logger;

  // ---- Protected -------------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE =====================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION ===============================================================

  // ==== PUBLIC PROPERTY API - Prop() SECTION ====================================================
  @Prop() currentRoute: string;

  // ==== EVENTS SECTION ==========================================================================
  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================
  // ==== LISTENERS SECTION =======================================================================
  // ==== PUBLIC METHODS API - @Method() SECTION ==================================================
  // ==== LOCAL METHODS SECTION ===================================================================


  // ==== RENDERING SECTION =======================================================================
  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');

    return [
      <ion-tab-bar slot="bottom">
        <lf-navigation-buttons currentRoute={this.currentRoute} />
      </ion-tab-bar>,
    ];
  }
}
