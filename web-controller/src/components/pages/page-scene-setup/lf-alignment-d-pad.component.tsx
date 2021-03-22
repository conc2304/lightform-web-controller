// ==== Library Imports =======================================================
import { Component, Element, Event, EventEmitter, h, Host, Listen, Prop, State } from '@stencil/core';
import { LfDirection } from '../../../shared/enums/lf-direction.enum';
import { Key as EventKey } from 'ts-key-enum';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';

@Component({
  tag: 'lf-alignment-d-pad',
  styleUrls: ['lf-alignment-d-pad.component.scss'],
  shadow: true,
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
  @Prop() incrementAmount = 1;
  @Prop() helpText: string;

  // ==== EVENTS SECTION ==========================================================================
  @Event() directionalPadPressed: EventEmitter<LfDirection>;

  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================
  // - -  componentWillLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public componentWillLoad() {
    this.log.debug('componentWillLoad');
    Object.values(LfDirection).forEach((direction: LfDirection) => {
      this.directionArr.push(direction);
    });
  }

  // ==== LISTENERS SECTION =======================================================================
  @Listen('keydown', {
    target: 'window',
    capture: true,
  })
  onKeydown(e: KeyboardEvent): void {
    this.log.debug('onKeydown');

    const navigationKeys = [EventKey.ArrowUp, EventKey.ArrowDown, EventKey.ArrowLeft, EventKey.ArrowRight];
    const navigationKeysToString = navigationKeys.map(key => {
      return key.toString();
    });

    if (navigationKeysToString.includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();

      let direction: LfDirection;
      switch (e.key) {
        case EventKey.ArrowLeft:
          direction = LfDirection.Left;
          break;
        case EventKey.ArrowUp:
          direction = LfDirection.Up;
          break;
        case EventKey.ArrowDown:
          direction = LfDirection.Down;
          break;
        case EventKey.ArrowRight:
          direction = LfDirection.Right;
          break;
      }

      if (direction) {
        this.emitDirectionEvent(direction);
      }
    }
  }

  // ==== LOCAL METHODS SECTION ===================================================================
  private emitDirectionEvent(direction: LfDirection): void {
    const event = new CustomEvent('onDirectionalPadPressed', {
      detail: {
        direction,
        incrementAmount: this.incrementAmount,
      },
    });
    document.dispatchEvent(event);
  }

  // ==== RENDERING SECTION =======================================================================

  private renderDirectionalButton(direction: LfDirection) {
    this.log.debug('renderDirectionalButton');

    const directionClassName = `direction-${direction.toString()}`;

    return (
      <div
        class={`lf-d-pad-button--container ${directionClassName}`}
        onClick={() => {
          this.emitDirectionEvent(direction);
        }}
      ></div>
    );
  }

  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');

    return (
      <Host class="lf-alignment-d-pad--container">
        {this.helpText ? <p class="lf-alignment-d-pad--help-text">{this.helpText}</p> : ''}
        <div>
          <div class="lf-alignment-d-pad--inner-wrapper">
            <div class="col">{this.renderDirectionalButton(LfDirection.Left)}</div>
            <div class="col middle">
              {this.renderDirectionalButton(LfDirection.Up)}
              {this.renderDirectionalButton(LfDirection.Down)}
            </div>
            <div class="col">{this.renderDirectionalButton(LfDirection.Right)}</div>
          </div>
        </div>
      </Host>
    );
  }
}
