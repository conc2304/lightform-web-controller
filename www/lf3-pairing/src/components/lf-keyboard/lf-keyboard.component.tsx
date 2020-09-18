// ==== Library Imports =======================================================
import { Component, Event, EventEmitter, h } from "@stencil/core";
import Keyboard from "simple-keyboard";
import keyNavigation from "simple-keyboard-key-navigation";
// import { Key } from "ts-keycode-enum";

// ==== App Imports ===========================================================
import {
  KeyboardCharMap as KbMap,
  LayoutName,
} from "../../shared/enums/v-keyboar-char-map.enum";

@Component({
  tag: "lf-keyboard",
  styleUrls: ["lf-keyboard.component.scss", "simple-keyboard.css"],
  shadow: false,
})
export class LfKeyboard {
  // ==== PUBLIC ============================================================
  // ---- Properties --------------------------------------------------------
  @Event() keyboardKeyPressed: EventEmitter;
  @Event() submitButtonPressed: EventEmitter;

  // Getters/Setters
  public get keyboard(): Keyboard {
    return this._keyboard;
  }

  // ---- Methods -----------------------------------------------------------

  // - -  componentDidRender Implementation - - - - - - - - - - - - - - - - - - - - -
  public componentDidRender(): void {
    console.group("componentDidRender");
    try {
      this.initKeyboard();
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - -
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

  // ==== PROTECTED =========================================================
  // ---- Properties --------------------------------------------------------
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

  // ---- Methods -----------------------------------------------------------

  // ==== PRIVATE ===========================================================
  // ---- Properties --------------------------------------------------------

  // Getter/Setter backing variables and defaults
  private _keyboard: Keyboard;

  // ---- Methods -----------------------------------------------------------
  private initKeyboard(): void {
    console.group("initKeyboard");
    try {
      this._keyboard = new Keyboard({
        onKeyPress: button => this.onKeyboardPress(button),
        layout: this.KeyboardLayoutConfig,
        layoutName: LayoutName.Alpha,
        display: this.KeyboardDisplayMap,
        theme: "lf-keyboard--theme",
        buttonTheme: this.ButtonTheme,
        useMouseEvents: true,
        enableKeyNavigation: true,
        modules: [keyNavigation],
      });
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  private onKeyboardPress(buttonValue: string): void {
    console.group("onKeyboardPress");
    try {
      console.log("Button pressed", buttonValue);

      const layoutUpdateButtons = [
        KbMap.Alpha,
        KbMap.AlphaShift,
        KbMap.Numeric,
        KbMap.NumericShift,
      ];

      const buttonsToString = layoutUpdateButtons.map(buttonName => {
        return buttonName.toString();
      });

      if (buttonsToString.includes(buttonValue)) {
        this.updateKeyboardLayout(buttonValue);
      } else if (buttonValue === KbMap.Enter) {
        console.log("ENTER");
        const keyboardInputValue = this.keyboard.getInput();
        this.submitButtonPressed.emit(keyboardInputValue);
      } else {
        this.keyboardKeyPressed.emit(buttonValue);
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
          currentLayout === LayoutName.AlphaShift
            ? LayoutName.Alpha
            : LayoutName.AlphaShift;
      } else if (button === KbMap.Alpha) {
        updatedLayoutName = LayoutName.Alpha;
      } else if (button === KbMap.Numeric) {
        updatedLayoutName = LayoutName.Numeric;
      } else if (button === KbMap.NumericShift) {
        updatedLayoutName =
          currentLayout === LayoutName.NumericShift
            ? LayoutName.Numeric
            : LayoutName.NumericShift;
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
}
