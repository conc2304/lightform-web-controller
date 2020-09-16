// ==== Library Imports =======================================================
import { Component, Event, EventEmitter, h } from "@stencil/core";
import Keyboard from "simple-keyboard";
import KeyboardLayoutObject from "simple-keyboard";

// ==== App Imports ===========================================================

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
    default: [
      "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
      "{tab} q w e r t y u i o p [ ] \\",
      "{lock} a s d f g h j k l ; ' {enter}",
      "{shift} z x c v b n m , . / {shift}",
      ".com @ {space}",
    ],
    shift: [
      "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
      "{tab} Q W E R T Y U I O P { } |",
      '{lock} A S D F G H J K L : " {enter}',
      "{shift} Z X C V B N M < > ? {shift}",
      ".com @ {space}",
    ],
  };

  // ---- Methods -----------------------------------------------------------

  // ==== PRIVATE ===========================================================
  // ---- Properties --------------------------------------------------------

  // Getter/Setter backing variables and defaults
  private _keyboard: Keyboard;

  // ---- Methods -----------------------------------------------------------
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

  private initKeyboard(): void {
    console.group("initKeyboard");
    try {
      this._keyboard = new Keyboard({
        onChange: input => this.onKeyboardChange(input),
        onKeyPress: button => this.onKeyboardPress(button),
        layout: this.KeyboardLayoutConfig,
      });
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
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }
}
