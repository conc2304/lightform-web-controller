// ==== Library Imports =======================================================
import { Component, Event, EventEmitter, h, Listen, Prop } from "@stencil/core";
import Keyboard from "simple-keyboard";
import keyNavigation from "simple-keyboard-key-navigation";
// see documentation of unexposed internal keyNavigation methods at https://github.com/simple-keyboard/simple-keyboard-key-navigation/blob/master/src/index.js
import { Key } from "ts-keycode-enum";

// ==== App Imports ===========================================================
import { LfKeyboardBlurDirection } from "./lf-keyboard-blur-direction.enum";
import { KeyboardCharMap as KbMap, LayoutName } from "../../shared/enums/v-keyboar-char-map.enum";

@Component({
  tag: "lf-keyboard",
  styleUrls: ["lf-keyboard.component.scss"],
  shadow: false,
})
export class LfKeyboard {
  // ==== OWN PROPERTIES SECTION =======================================================================
  // Dependency Injections
  // Getters/Setters
  public get keyboard(): Keyboard {
    return this._keyboard;
  }
  public set keyboard(newValue: Keyboard) {
    this._keyboard = newValue;
  }

  // Getter/Setter backing variables and defaults
  private _keyboard: Keyboard;

  // ---- Protected -----------------------------------------------------------------------------
  protected KeyboardLayoutConfig = {
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
    [LayoutName.Numeric]: [
      `1 2 3 4 5 6 7 8 9 0`,
      `- / : ; ( ) $ & @ "`,
      `${KbMap.NumericShift} . , ? ! ' ${KbMap.Delete}`,
      `${KbMap.Alpha} ${KbMap.Space} ${KbMap.Enter}`,
    ],
    [LayoutName.NumericShift]: [
      `[ ] { } # % ^ * + =`,
      `_ \\ | ~ < > € £ ¥ •`, // note - escaped backslash
      `${KbMap.NumericShift} . , ? ! ' ${KbMap.Delete}`,
      `${KbMap.Alpha} ${KbMap.Space} ${KbMap.Enter}`,
    ],
  };

  protected KeyboardDisplayMap = {
    [`${KbMap.Alpha}`]: "ABC",
    [`${KbMap.AlphaShift}`]: "⇧",
    [`${KbMap.Numeric}`]: "123",
    [`${KbMap.NumericShift}`]: "#+=",
    [`${KbMap.Enter}`]: "OK",
    [`${KbMap.Delete}`]: "delete",
    [`${KbMap.Space}`]: " ",
  };

  protected ButtonTheme = [
    {
      class: "lf-keyboard-key--short",
      buttons: "1 2 3 4 5 6 7 8 9 0",
    },
    {
      class: "lf-keyboard-key--dark",
      buttons: `${KbMap.Numeric} ${KbMap.Delete} ${KbMap.NumericShift} ${KbMap.Alpha} ${KbMap.AlphaShift}`,
    },
    {
      class: "lf-keyboard-key--green",
      buttons: `${KbMap.Enter}`,
    },
  ];

  protected MarkerClassName = "hg-keyMarker";

  // ==== HOST HTML REFERENCE ===================================================================
  // @Element() el: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() keyNavigationEnabled?: boolean = false;
  @Prop() blurDirection?: LfKeyboardBlurDirection = LfKeyboardBlurDirection.Null;
  @Prop() wrapNavigation: boolean = false;

  // ==== EVENTS SECTION ========================================================================
  @Event() virtualKeyboardKeyPressed: EventEmitter;
  @Event() submitButtonPressed: EventEmitter;
  @Event() blurLfKeyboard: EventEmitter;

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentDidLoad Implementation - - - - - - - - - - - - - - - - - - - - -
  public componentDidLoad(): void {
    console.group("componentDidLoad");
    try {
      this.initKeyboard();
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  // ==== LISTENERS SECTION =====================================================================
  @Listen("keydown", {
    target: "window",
    capture: true,
  })
  onKeydown(e: KeyboardEvent): void {
    console.group("onKeydown--Keyboard");
    try {
      const activeElement = document.activeElement.tagName;
      console.log(activeElement);
      if (activeElement === "LF-KEYBOARD") {
        this.handleKeyNavigation(e.which);
      }
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ========================================================
  // @Method()
  // async publicMethod(): Promise<void> {return}

  // ==== LOCAL METHODS SECTION =========================================================================
  private initKeyboard(): void {
    console.group("initKeyboard");
    try {
      this._keyboard = new Keyboard({
        onKeyPress: button => this.onKeyboardPressHandler(button),
        layout: this.KeyboardLayoutConfig,
        layoutName: LayoutName.Alpha,
        display: this.KeyboardDisplayMap,
        theme: "lf-keyboard--theme",
        buttonTheme: this.ButtonTheme,
        useMouseEvents: true,
        enableKeyNavigation: true,
        modules: [keyNavigation],
        onModulesLoaded: () => {},
      });

      // setting row to -1 to offset duplication of keyhandlers in lf-keyboard.component and lf-wifi-password.component
      this.keyboard["modules"]["keyNavigation"].markerPosition = {
        row: -1,
        button: 0,
      };
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  private onKeyboardPressHandler(buttonValue: string): void {
    console.group("onKeyboardPressHandler");
    try {
      const layoutUpdateButtons = [KbMap.Alpha, KbMap.AlphaShift, KbMap.Numeric, KbMap.NumericShift];
      const navigationKeys = [Key.UpArrow, Key.DownArrow, Key.LeftArrow, Key.RightArrow];
      const buttonsToString = layoutUpdateButtons.map(buttonName => {
        return buttonName.toString();
      });
      const navigationKeysToString = navigationKeys.map(key => {
        return key.toString();
      });

      this.updateMarkerPosition(buttonValue);

      if (navigationKeysToString.includes(buttonValue)) {
        this.handleKeyNavigation(buttonValue);
      } else if (buttonsToString.includes(buttonValue)) {
        this.updateKeyboardLayout(buttonValue);
      } else if (buttonValue === KbMap.Enter) {
        const keyboardInputValue = this.keyboard.getInput();
        this.submitButtonPressed.emit(keyboardInputValue);
      } else {
        this.virtualKeyboardKeyPressed.emit(buttonValue);
      }
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  private handleKeyNavigation(keyValue: number | string): void {
    console.group("handleKeyNavigation", keyValue);

    try {
      const navModule = this.keyboard["modules"]["keyNavigation"];
      const rowPos = navModule.lastMarkerPos[0];
      const btnPos = navModule.lastMarkerPos[1];
      const keyboardLayoutName = this.keyboard.options.layoutName;
      const rowCharsArr = this.KeyboardLayoutConfig[keyboardLayoutName][rowPos].split(" ");

      if (keyValue === Key.UpArrow) {
        // exiting keyboard - blur keyboard and update last marker position
        const topRow = !navModule.getButtonAt(rowPos - navModule.step, btnPos);
        if (
          topRow &&
          (this.blurDirection === LfKeyboardBlurDirection.Top ||
            this.blurDirection === LfKeyboardBlurDirection.Both)
        ) {
          navModule.markedBtn.classList.remove(this.MarkerClassName);
          navModule.markerPosition = {
            row: -1,
            button: btnPos,
          };
          this.blurLfKeyboard.emit();
        } else {
          navModule.up();
        }
      } else if (keyValue === Key.DownArrow) {
        const btnInLastRow = !navModule.getButtonAt(rowPos - navModule.step, btnPos);
        console.log("DOWN");
        console.log(rowPos, btnPos);
        const triggerKbBlur =
          btnInLastRow &&
          (this.blurDirection === LfKeyboardBlurDirection.Bottom ||
            this.blurDirection === LfKeyboardBlurDirection.Both);

        if (triggerKbBlur) {
          console.log("BLUR");
          navModule.markedBtn.classList.remove(this.MarkerClassName);
          navModule.markerPosition = {
            row: rowPos + 1,
            button: btnPos,
          };
          this.blurLfKeyboard.emit();
        }
        console.log(navModule.markerPosition);
        navModule.down();
      } else if (keyValue === Key.LeftArrow) {
        const btnInFirstRow = !navModule.getButtonAt(rowPos, btnPos - navModule.step);
        if (btnInFirstRow && this.wrapNavigation) {
          const lastBtnIndex = rowCharsArr.length - 1;
          navModule.setMarker(rowPos, lastBtnIndex);
        } else {
          navModule.left();
        }
      } else if (keyValue === Key.RightArrow) {
        const btnIsRowLast = !navModule.getButtonAt(rowPos, btnPos + navModule.step);

        if (btnIsRowLast && this.wrapNavigation) {
          navModule.setMarker(rowPos, 0);
        } else {
          navModule.right();
        }
      } else {
        navModule.press();
      }
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  private updateMarkerPosition(buttonValue: string): void {
    console.group("updateMarkerPosition");

    try {
      const layoutName = this.keyboard.options.layoutName;
      const layout = this.keyboard.options.layout[layoutName];

      for (const rowIndex in layout) {
        const row = layout[rowIndex];
        if (row.includes(buttonValue)) {
          const rowArr = row.split(" ");
          const buttonIndex = rowArr.indexOf(buttonValue);

          this.keyboard["modules"]["keyNavigation"].setMarker(Number(rowIndex), Number(buttonIndex));
          break;
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  private updateKeyboardLayout(button: string): void {
    console.group("updateKeyboardLayout");
    try {
      const currentLayout = this.keyboard.options.layoutName;
      let updatedLayoutName: LayoutName = null;

      if (button === KbMap.AlphaShift) {
        updatedLayoutName =
          currentLayout === LayoutName.AlphaShift ? LayoutName.Alpha : LayoutName.AlphaShift;
      } else if (button === KbMap.Alpha) {
        updatedLayoutName = LayoutName.Alpha;
      } else if (button === KbMap.Numeric) {
        updatedLayoutName = LayoutName.Numeric;
      } else if (button === KbMap.NumericShift) {
        updatedLayoutName =
          currentLayout === LayoutName.NumericShift ? LayoutName.Numeric : LayoutName.NumericShift;
      }

      if (updatedLayoutName) {
        this.keyboard.setOptions({
          layoutName: updatedLayoutName,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }
  // ==== RENDERING SECTION =========================================================================
  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render(): HTMLAllCollection {
    console.group("render");
    try {
      return (
        <div class="keyboard--wrapper">
          <div class="simple-keyboard"></div>
        </div>
      );
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }
}
