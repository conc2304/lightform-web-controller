// ==== Library Imports =======================================================
import { Component, h, Element, Event, EventEmitter, State, Listen } from '@stencil/core';
import { Key as EventKey } from 'ts-key-enum';
import { LF_CTA_URL } from '../../../shared/lf-cta-url.constant';
import { LF_REMOTE_BACK_BUTTON } from '../../../shared/lf-remote-keycodes.constants';

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
    this.log.warn('keyHandler');

    console.log(e.key, e.keyCode, e.charCode);

    const specialKeys = [EventKey.ArrowLeft, EventKey.ArrowUp, EventKey.ArrowRight, EventKey.ArrowDown, LF_REMOTE_BACK_BUTTON].map(key => {
      return key.toString();
    });

    if (specialKeys.includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
    }

    // delete functionality
    if (e.key === LF_REMOTE_BACK_BUTTON) {
      const newValues = this.inputValuesArray;
      newValues[this.activeInputIndex - 1] = null;
      this.inputValuesArray = newValues;

      if (this.activeInputIndex >= 0) {
        this.activeInputIndex--;
      }
      return;
    }

    const arrowObject: LfDirectionalArrow = this.unicodeArrowMap[e.key];

    if (!arrowObject) {
      return;
    }

    if (this.activeInputIndex >= this.inputsQty) {
      return;
    }

    if (this.activeInputIndex < this.inputsQty) {
      const newValues = this.inputValuesArray;
      newValues[this.activeInputIndex] = arrowObject;
      this.inputValuesArray = newValues;
      this.activeInputIndex++;
    }

    if (this.inputValuesArray.length > this.inputsQty) {
      this.inputValuesArray.slice(0, this.inputsQty);
    }

    if (this.activeInputIndex >= this.inputsQty) {
      setTimeout(() => {
        // allow the last input to be shown for a hot second before moving on
        let registrationCodeString = '';

        this.inputValuesArray.map((arrowObject: LfDirectionalArrow) => {
          registrationCodeString += arrowObject.char;
        });

        this.log.info('Input Complete', registrationCodeString);
        this.registrationCodeCompleted.emit(registrationCodeString);
      }, 1000);
    }
  }

  // ==== RENDERING SECTION =======================================================================
  private renderRegistrationInput(arrowDirection: LfDirectionalArrow, index: number) {
    const elemIsActive = index === this.activeInputIndex;
    const imgClassName = arrowDirection !== null ? `lf-input-img direction-${arrowDirection.name}` : '';
    const activeElemClass = elemIsActive ? 'lf-input--active' : '';

    return [
      <div class={`${this.inputElemClassName} ${activeElemClass} lf-registration-input--border-box`} data-index={index} tabIndex={index}>
        <div class={`lf-registration-input--content`}>
          <div class={imgClassName}></div>
        </div>
      </div>,
    ];
  }

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    return (
      <div class="lf-registration-input--content-container">
        <div class="lf-registration-input--content-title">
          Follow the steps in Lightform Web App on <strong>{LF_CTA_URL}</strong>
        </div>
        <div class="lf-registration-input--input-container">
          {this.inputValuesArray.map((arrowDirection: LfDirectionalArrow, index: number) => {
            const breakDiv = index === 3 ? <div class="break"></div> : '';

            return [this.renderRegistrationInput(arrowDirection, index), breakDiv];
          })}
        </div>
      </div>
    );
  }
}
