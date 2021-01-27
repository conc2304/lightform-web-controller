// ==== Library Imports =======================================================
import { Component, h, Element, Event, EventEmitter, State, Listen } from '@stencil/core';
import { Key as EventKey } from 'ts-key-enum';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';

type LfArrowName = 'left' | 'up' | 'right' | 'down' | null;
type LfUnicodeArrowChar = '←' | '↑' | '→' | '↓' | null;

interface LfDirectionalArrow {
  char: LfUnicodeArrowChar;
  name: LfArrowName;
}

@Component({
  tag: 'lf-registration-input',
  styleUrl: 'lf-registration-input.component.scss',
})
export class LfRegistrationInput {
  // ==== OWN PROPERTIES SECTION ==================================================================
  // ---- Private ---------------------------------------------------------------------------------
  private log = new LfLoggerService('LfRegistrationInput').logger;
  private readonly inputsQty = 7;
  private readonly inputElemClassName = 'lf-registration-input-item';

  private readonly unicodeArrowMap = {
    [EventKey.ArrowLeft]: {
      char: '←',
      name: 'left',
    },
    [EventKey.ArrowUp]: {
      char: '↑',
      name: 'up',
    },
    [EventKey.ArrowRight]: {
      char: '→',
      name: 'right',
    },
    [EventKey.ArrowDown]: {
      char: '↓',
      name: 'down',
    },
  };

  // ---- Protected -------------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE =====================================================================
  @Element() el: HTMLElement;

  // ==== State() VARIABLES SECTION ===============================================================
  @State() inputValuesArray: Array<LfDirectionalArrow> = [];
  @State() activeInputIndex = 0;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ====================================================
  // ==== EVENTS SECTION ==========================================================================
  @Event() registrationCodeCompleted: EventEmitter<string>;

  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================
  // - -  componentWillLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');
    this.inputValuesArray = new Array(this.inputsQty).fill(null);
  }

  // ==== LISTENERS SECTION =======================================================================
  @Listen('keydown', {
    target: 'window',
    capture: true,
  })
  onKeydown(e: KeyboardEvent): void {
    this.log.debug('onKeydown');
    this.keyHandler(e);
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ==================================================

  // ==== LOCAL METHODS SECTION ===================================================================
  private keyHandler(e: KeyboardEvent) {
    this.log.debug('keyHandler');

    const specialKeys = [EventKey.ArrowLeft, EventKey.ArrowUp, EventKey.ArrowRight, EventKey.ArrowDown].map(key => {
      return key.toString();
    });

    if (specialKeys.includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
    }

    const arrowObject: LfDirectionalArrow = this.unicodeArrowMap[e.key];

    if (!arrowObject) {
      return;
    }


    const newValues = this.inputValuesArray;
    newValues[this.activeInputIndex] = arrowObject;
    this.inputValuesArray = newValues;
    this.activeInputIndex++;


    if (this.activeInputIndex >= this.inputsQty) {

      const registrationCodeString = this.inputValuesArray.join();
      this.log.info('Input Complete', registrationCodeString);
      this.log.info('Input Complete', registrationCodeString);
      this.registrationCodeCompleted.emit(registrationCodeString);
    }
  }

  // ==== RENDERING SECTION =======================================================================
  private renderRegistrationInput(arrowDirection: LfDirectionalArrow, index: number) {
    this.log.debug('renderRegistrationInput');

    const elemIsActive = index === this.activeInputIndex;

    const imgClassName = arrowDirection !== null ? `lf-input-img direction-${arrowDirection.name}` : '';
    const activeElemClass = elemIsActive ? 'lf-input--active' : '';

    return (
      <div class={`${this.inputElemClassName} ${activeElemClass} lf-registration-input--border-box`} data-index={index} tabIndex={index}>
        <div class={`lf-registration-input--content`}>
          <div class={imgClassName}>
          </div>
        </div>
      </div>
    );
  }

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.info('render');

    return (
      <div class="lf-registration-input--content-container">
        <div class="lf-registration-input--content-title">Sign in and follow the steps in Oak App.</div>
        <div class="lf-registration-input--input-container">
          {this.inputValuesArray.map((arrowDirection: LfDirectionalArrow, index: number) => {
            return this.renderRegistrationInput(arrowDirection, index);
          })}
        </div>
      </div>
    );
  }
}
