// ==== Library Imports =======================================================
import { Component, Element, Event, EventEmitter, h, Listen, Prop, State } from '@stencil/core';
import Keyboard from 'simple-keyboard';
import keyNavigation from 'simple-keyboard-key-navigation'; // see documentation of unexposed internal keyNavigation methods at https://github.com/simple-keyboard/simple-keyboard-key-navigation/blob/master/src/index.js
import { Key as EventKey } from 'ts-key-enum';

// ==== App Imports ===========================================================
import { LfConf } from '../../../global/resources';
import { LfKeyboardBlurDirection } from './lf-keyboard-blur-direction.enum';
import { KeyboardCharMap as KbMap, LayoutName } from '../../../shared/enums/v-keyboard-char-map.enum';
import LfLoggerService from '../../../shared/services/lf-logger.service';

@Component({
  tag: 'lf-keyboard',
  styleUrls: ['lf-keyboard.component.scss'],
  shadow: false,
})
export class LfKeyboard {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private   -----------------------------------------------------------------------------
  private keyboard: Keyboard;
  private log = new LfLoggerService('LfCard').logger;

  private readonly KeyboardLayoutConfig = {
    [LayoutName.Alpha]: [
      `1 2 3 4 5 6 7 8 9 0`,
      `q w e r t y u i o p`,
      `a s d f g h j k l`,
      `${KbMap.AlphaShift} z x c v b n m ${KbMap.Delete}`,
      `${KbMap.Numeric} ${KbMap.Space} ${KbMap.Enter}`,
    ],
    [LayoutName.AlphaShift]: [
      `1 2 3 4 5 6 7 8 9 0`,
      `Q W E R T Y U I O P`,
      `A S D F G H J K L`,
      `${KbMap.AlphaShift} Z X C V B N M ${KbMap.Delete}`,
      `${KbMap.Numeric} ${KbMap.Space} ${KbMap.Enter}`,
    ],
    [LayoutName.Numeric]: [`1 2 3 4 5 6 7 8 9 0`, `- / : ; ( ) $ & @ "`, `${KbMap.NumericShift} . , ? ! ' ${KbMap.Delete}`, `${KbMap.Alpha} ${KbMap.Space} ${KbMap.Enter}`],
    [LayoutName.NumericShift]: [
      `[ ] { } # % ^ * + =`,
      `_ \\ | ~ < > € £ ¥ •`, // note - escaped backslash
      `${KbMap.NumericShift} . , ? ! ' ${KbMap.Delete}`,
      `${KbMap.Alpha} ${KbMap.Space} ${KbMap.Enter}`,
    ],
  };

  private readonly KeyboardDisplayMap = {
    [`${KbMap.Alpha}`]: 'ABC',
    [`${KbMap.AlphaShift}`]: '⇧',
    [`${KbMap.Numeric}`]: '123',
    [`${KbMap.NumericShift}`]: '#+=',
    [`${KbMap.Enter}`]: 'OK',
    [`${KbMap.Delete}`]: '  ', // svg image set in scss
    [`${KbMap.Space}`]: ' ',
  };

  private readonly ButtonTheme = [
    {
      class: 'lf-keyboard-key--short',
      buttons: '1 2 3 4 5 6 7 8 9 0',
    },
    {
      class: 'lf-keyboard-key--dark',
      buttons: `${KbMap.Numeric} ${KbMap.Delete} ${KbMap.NumericShift} ${KbMap.Alpha} ${KbMap.AlphaShift}`,
    },
    {
      class: 'lf-keyboard-key--green',
      buttons: `${KbMap.Enter}`,
    },
  ];

  private readonly MarkerClassName = 'hg-keyMarker';

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() el: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() inputDirty: boolean = false;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() keyNavigationEnabled?: boolean = false;
  @Prop() blurDirection?: LfKeyboardBlurDirection = LfKeyboardBlurDirection.Null;
  @Prop() wrapNavigation: boolean = false;
  @Prop() initialMarkerPosition: { row: number; column: number } = { row: 0, column: 0 };

  // ==== EVENTS SECTION ========================================================================
  @Event() virtualKeyboardKeyPressed: EventEmitter;
  @Event() submitButtonPressed: EventEmitter;
  @Event() blurLfKeyboard: EventEmitter;

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentDidLoad Implementation - - - - - - - - - - - - - - - - - - - - -
  public componentDidLoad(): void {
    this.log.debug('componentDidLoad');
    this.initKeyboard();
    const { row, column } = this.initialMarkerPosition;
    this.keyboard['modules']['keyNavigation'].setMarker(row, column);
  }

  // ==== LISTENERS SECTION =====================================================================
  @Listen('keydown', {
    target: 'window',
    capture: true,
  })
  onKeydown(e: KeyboardEvent): void {
    this.log.debug('onKeydown--Keyboard');
    e.preventDefault();
    e.stopPropagation();

    const activeElement = document.activeElement.tagName;
    if (activeElement === 'LF-KEYBOARD') {
      this.handleKeyNavigation(e.key);
    }
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ========================================================

  // ==== LOCAL METHODS SECTION =========================================================================
  private initKeyboard(): void {
    this.log.debug('initKeyboard');

    this.keyboard = new Keyboard({
      onKeyPress: button => this.onKeyboardPressHandler(button),
      layout: this.KeyboardLayoutConfig,
      layoutName: LayoutName.Alpha,
      display: this.KeyboardDisplayMap,
      theme: 'lf-keyboard--theme',
      buttonTheme: this.ButtonTheme,
      useMouseEvents: true,
      enableKeyNavigation: true,
      modules: [keyNavigation],
      disableButtonHold: true,
    });
  }

  private onKeyboardPressHandler(buttonValue: string): void {
    this.log.debug('onKeyboardPressHandler');

    const layoutUpdateBtnsTyped = [KbMap.Alpha, KbMap.AlphaShift, KbMap.Numeric, KbMap.NumericShift];
    const navigationKeys = [EventKey.ArrowUp, EventKey.ArrowDown, EventKey.ArrowLeft, EventKey.ArrowRight];
    // const funcBtnsTyped = [KbMap.Delete, KbMap.Enter, ...layoutUpdateBtnsTyped];

    // const currentLayout = this.keyboard.options.layoutName;
    const layoutBtnsArr = layoutUpdateBtnsTyped.map(buttonName => {
      return buttonName.toString();
    });
    // const funcBtnsArr = funcBtnsTyped.map(buttonName => {
    //   return buttonName.toString();
    // });
    const navigationKeysToString = navigationKeys.map(key => {
      return key.toString();
    });

    // Navigation
    if (navigationKeysToString.includes(buttonValue)) {
      this.handleKeyNavigation(buttonValue);
    }
    // Layout Update
    else if (layoutBtnsArr.includes(buttonValue)) {
      this.updateKeyboardLayout(buttonValue);
    }
    // Enter Button
    else if (buttonValue === KbMap.Enter) {
      const keyboardInputValue = this.keyboard.getInput();
      this.submitButtonPressed.emit(keyboardInputValue);
    }
    // Text Input Key
    else {
      if (buttonValue === KbMap.Space) {
        buttonValue = ' ';
      }

      this.virtualKeyboardKeyPressed.emit(buttonValue);
    }

    // switch out of caps after the first keypress that isn't a function button
    // if (currentLayout === LayoutName.AlphaShift && !funcBtnsArr.includes(buttonValue)) {
    //   this.keyboard.setOptions({
    //     layoutName: LayoutName.Alpha,
    //   });
    // }

    this.log.debug(buttonValue);
    this.updateMarkerPosition(buttonValue);
  }

  private handleKeyNavigation(eventKey: number | string): void {
    this.log.debug('handleKeyNavigation', eventKey);

    const navModule = this.keyboard['modules']['keyNavigation'];
    const rowPos = navModule.lastMarkerPos[0];
    const btnPos = navModule.lastMarkerPos[1];
    const keyboardLayoutName = this.keyboard.options.layoutName;
    const rowCharsArr = this.KeyboardLayoutConfig[keyboardLayoutName][rowPos].split(' ');

    // Up Arrow
    // -----------------------------------------
    if (eventKey === EventKey.ArrowUp) {
      // TODO - better handling of going up from space bar and enter key

      // Exiting Keyboard - blur keyboard and update last marker position
      const topRow = !navModule.getButtonAt(rowPos - navModule.step, btnPos);
      if (topRow && (this.blurDirection === LfKeyboardBlurDirection.Top || this.blurDirection === LfKeyboardBlurDirection.Both)) {
        navModule.markedBtn.classList.remove(this.MarkerClassName);
        navModule.markerPosition = {
          row: -1,
          button: btnPos,
        };
        this.blurLfKeyboard.emit();
      } else {
        navModule.up();
      }
    }
    // Down Arrow
    // -----------------------------------------
    else if (eventKey === EventKey.ArrowDown) {
      const btnInLastRow = !navModule.getButtonAt(rowPos - navModule.step, btnPos);
      const triggerKbBlur = btnInLastRow && (this.blurDirection === LfKeyboardBlurDirection.Bottom || this.blurDirection === LfKeyboardBlurDirection.Both);

      if (triggerKbBlur) {
        navModule.markedBtn.classList.remove(this.MarkerClassName);
        navModule.markerPosition = {
          row: rowPos + 1,
          button: btnPos,
        };
        this.blurLfKeyboard.emit();
      }
      navModule.down();
    }
    // Left Arrow
    // -----------------------------------------
    else if (eventKey === EventKey.ArrowLeft) {
      const btnInFirstRow = !navModule.getButtonAt(rowPos, btnPos - navModule.step);
      // cursor wrap logic
      if (btnInFirstRow && this.wrapNavigation) {
        const lastBtnIndex = rowCharsArr.length - 1;
        navModule.setMarker(rowPos, lastBtnIndex);
      } else {
        navModule.left();
      }
    }
    // Right Arrow
    // -----------------------------------------
    else if (eventKey === EventKey.ArrowRight) {
      const btnIsRowLast = !navModule.getButtonAt(rowPos, btnPos + navModule.step);

      // cursor wrap logic
      if (btnIsRowLast && this.wrapNavigation) {
        navModule.setMarker(rowPos, 0);
      } else {
        navModule.right();
      }
    } else {
      navModule.press();
    }
  }

  private updateMarkerPosition(buttonValue: string): void {
    this.log.debug('updateMarkerPosition');

    const layoutName = this.keyboard.options.layoutName;
    const layout = this.keyboard.options.layout[layoutName];

    for (const rowIndex in layout) {
      const row = layout[rowIndex];
      if (row.includes(buttonValue)) {
        const rowArr = row.split(' ');
        const buttonIndex = rowArr.indexOf(buttonValue);

        this.keyboard['modules']['keyNavigation'].setMarker(Number(rowIndex), Number(buttonIndex));
        break;
      }
    }
  }

  private updateKeyboardLayout(button: string): void {
    this.log.debug('updateKeyboardLayout');

    const currentLayout = this.keyboard.options.layoutName;
    let updatedLayoutName: LayoutName = null;

    if (button === KbMap.AlphaShift) {
      updatedLayoutName = currentLayout === LayoutName.AlphaShift ? LayoutName.Alpha : LayoutName.AlphaShift;
    } else if (button === KbMap.Alpha) {
      updatedLayoutName = LayoutName.Alpha;
    } else if (button === KbMap.Numeric) {
      updatedLayoutName = LayoutName.Numeric;
    } else if (button === KbMap.NumericShift) {
      updatedLayoutName = currentLayout === LayoutName.NumericShift ? LayoutName.Numeric : LayoutName.NumericShift;
    }

    if (updatedLayoutName) {
      this.keyboard.setOptions({
        layoutName: updatedLayoutName,
      });
    }
  }

  // ==== RENDERING SECTION =========================================================================
  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    // keyboard html created on initialization via componentWillLoad()
    return (
      <div class="keyboard--wrapper">
        <div class="simple-keyboard"></div>
      </div>
    );
  }
}
