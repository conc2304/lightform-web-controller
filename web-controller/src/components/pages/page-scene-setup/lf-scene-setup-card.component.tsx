// ==== Library Imports =======================================================
import { Component, Element, Event, EventEmitter, h, Prop } from '@stencil/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfAppStateStore from '../../../store/lf-app-state.store';
import { LfDeviceScanType } from '../../../shared/interfaces/lf-web-controller.interface';

@Component({
  tag: 'lf-scene-setup-card',
  styleUrls: ['lf-scene-setup-card.component.scss'],
  shadow: true,
})
export class LfSceneSetupCard {
  // ==== OWN PROPERTIES SECTION ==================================================================
  // ---- Private  --------------------------------------------------------------------------------
  private log = new LfLoggerService('LfSceneSetupCard').logger;

  // ==== HOST HTML REFERENCE =====================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION ===============================================================

  // ==== PUBLIC PROPERTY API - Prop() SECTION ====================================================
  @Prop() isMobileLayout: boolean = lfAppStateStore.mobileLayout;
  @Prop() heroTitle: string = 'Scene Setup';

  // ==== EVENTS SECTION ==========================================================================
  @Event() startScan: EventEmitter<LfDeviceScanType>;

  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================

  // ==== LISTENERS SECTION =======================================================================

  // ==== RENDERING SECTION =======================================================================
  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');

    const layoutClassName = this.isMobileLayout ? 'lf-layout--mobile' : 'lf-layout--desktop';

    return (
      <div class={`scene-setup-card--container ${layoutClassName}`}>
        <h1 class="scene-setup--title">{this.heroTitle}</h1>
        <slot></slot>
      </div>
    );
  }
}
