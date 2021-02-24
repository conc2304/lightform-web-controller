// ==== Library Imports =======================================================
import { Component, Element, Event, EventEmitter, h, Prop, State } from '@stencil/core';
import { LfDirection } from '../../../shared/enums/lf-direction.enum';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';

@Component({
  tag: 'lf-alignment-d-pad',
  styleUrls: ['lf-alignment-d-pad.component.scss'],
})
export class LfAlignmentDPad {
  // ==== OWN PROPERTIES SECTION ==================================================================
  // ---- Private  --------------------------------------------------------------------------------
  private log = new LfLoggerService('LfAlignmentDPad').logger;

  // ==== HOST HTML REFERENCE =====================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION ===============================================================
  @State() directionArr: Array<LfDirection> = [];

  // ==== PUBLIC PROPERTY API - Prop() SECTION ====================================================
  @Prop() incrementAmount = 0.5;

  // ==== EVENTS SECTION ==========================================================================
  @Event()
  directionalPadPressed: EventEmitter<LfDirection>;

  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================
  public componentWillLoad() {
    Object.values(LfDirection).forEach((direction: LfDirection) => {
      this.directionArr.push(direction);
    });
  }
  // ==== LISTENERS SECTION =======================================================================
  // ==== LOCAL METHODS SECTION ===================================================================
  // ==== RENDERING SECTION =======================================================================

  private renderDirectionalButton(direction: LfDirection) {
    this.log.debug('renderDirectionalButton');

    const directionClassName = `direction-${direction.toString()}`;

    return (
      <div
        class={`lf-d-pad-button--container ${directionClassName}`}
        onClick={() => {
          const event = new CustomEvent('onDirectionalPadPressed', {
            detail: {
              direction,
              incrementAmount: this.incrementAmount,
            },
          });
          document.dispatchEvent(event);
        }}
      ></div>
    );
  }

  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');

    return (
      <div class="lf-alignment-d-pad--container">
        <div class="lf-alignment-d-pad--inner-wrapper">
          <div class="row">{this.renderDirectionalButton(LfDirection.Up)}</div>
          <div class="row middle">
            {this.renderDirectionalButton(LfDirection.Left)}
            {this.renderDirectionalButton(LfDirection.Right)}
          </div>
          <div class="row">{this.renderDirectionalButton(LfDirection.Down)}</div>
        </div>
      </div>
    );
  }
}
