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
    [LayoutName.Default]: [
      `q w e r t y u i o p`,
      `a s d f g h j k l`,
      `${KbMap.Shift} z x c v b n m ${KbMap.Delete}`,
      `${KbMap.Alt} ${KbMap.Space} ${KbMap.Enter}`,
    ],
    [LayoutName.Shift]: [
      `Q W E R T Y U I O P`,
      `A S D F G H J K L`,
      `${KbMap.Shift} Z X C V B N M ${KbMap.Delete}`,
      `${KbMap.Alt} ${KbMap.Space} ${KbMap.Enter}`,
    ],
    [LayoutName.Alt]: [
      `1 2 3 4 5 6 7 8 9 0`,
      `@ # $ & * ( ) ' "`,
      `% - + = / ; : ! ? ${KbMap.Delete}`,
      `${KbMap.Default} ${KbMap.Space} ${KbMap.Enter}`,
    ],
  };

  protected keyboardDisplayMap = {
    [`${KbMap.Alt}`]: ".?123",
    [`${KbMap.Shift}`]: "⇧",
    [`${KbMap.Enter}`]: "OK",
    [`${KbMap.Delete}`]: "delete",
    [`${KbMap.Space}`]: " ",
    [`${KbMap.Default}`]: "ABC",
  };

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
        onChange: input => this.onKeyboardChange(input),
        onKeyPress: button => this.onKeyboardPress(button),
        layout: this.KeyboardLayoutConfig,
        layoutName: "default",
        display: this.keyboardDisplayMap,
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

  private onKeyboardChange(input): void {
    console.group("onKeyboardChange");
    try {
      console.log("Input changed", input);
      this.keyboardKeyPressed.emit(input);
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  private onKeyboardPress(button) {
    console.group("onKeyboardPress");
    try {
      console.log("Button pressed", button);
      let updatedLayoutName: string = null;

      if (button === KbMap.Shift) {
        const currentLayout = this.keyboard.options.layoutName;
        updatedLayoutName =
          currentLayout === LayoutName.Shift
            ? LayoutName.Default
            : LayoutName.Shift;
      } else if (button === KbMap.Alt) {
        updatedLayoutName = LayoutName.Alt;
      } else if (button === KbMap.Default) {
        updatedLayoutName = LayoutName.Default;
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
