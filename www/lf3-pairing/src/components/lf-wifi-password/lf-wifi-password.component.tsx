// ==== Library Imports =======================================================
import { Component, Element, h, Listen, Prop, State, Method } from "@stencil/core";
import { Key } from "ts-keycode-enum";

// ==== App Imports ===========================================================
import { LfAppState } from "../../shared/services/lf-app-state.service";
import { KeyboardCharMap } from "../../shared/enums/v-keyboar-char-map.enum";
import { LfKeyboardBlurDirection as BlurDirection } from "../lf-keyboard/lf-keyboard-blur-direction.enum";

// import { LfKeyboard } from "../lf-keyboard/lf-keyboard.component";

enum InputType {
  Password = "password",
  Text = "text",
}

@Component({
  tag: "lf-wifi-password",
  styleUrls: ["lf-wifi-password.component.scss"],
  shadow: false,
})
export class LfWifiPassword {
  // ==== OWN PROPERTIES SECTION =======================================================================
  // Dependency Injections
  private lfAppState = LfAppState;

  // Getters/Setters
  public get toggleContainer(): HTMLElement {
    return this._toggleContainer;
  }
  public set toggleContainer(newValue: HTMLElement) {
    this._toggleContainer = newValue;
  }
  public get inputTextEl(): HTMLInputElement {
    return this._inputTextEl;
  }
  public set inputTextEl(newValue: HTMLInputElement) {
    this._inputTextEl = newValue;
  }
  public get checkboxEl(): HTMLInputElement {
    return this._checkboxEl;
  }
  public set checkboxEl(newValue: HTMLInputElement) {
    this._checkboxEl = newValue;
  }
  public get lfKeyboardEl(): HTMLElement {
    return this._lfKeyboardEl;
  }
  public set lfKeyboardEl(newValue: HTMLElement) {
    this._lfKeyboardEl = newValue;
  }

  // Getter/Setter backing variables and defaults
  private _toggleContainer: HTMLElement;
  private _checkboxEl: HTMLInputElement;
  private _inputTextEl: HTMLInputElement;
  private _lfKeyboardEl: HTMLElement;

  // ---- Protected -----------------------------------------------------------------------------
  protected LfFocusClass = "lf-item-focused";
  protected checkBoxElId = "show-password-toggle";

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() el: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() inputElemClassName: string;
  @State() inputIsDirty: boolean = false;
  @State() inputType: InputType = InputType.Text;
  @State() showPassword: boolean = true;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() networkName: string;

  // ==== EVENTS SECTION ========================================================================
  // @Event() eventName: EventEmitter;

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public componentWillLoad() {
    console.group("componentWillLoad");
    try {
      this.setInputElClassNames();
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  // - -  componentDidRender Implementation - - - - - - - - - - - - - - - - - - - - - - - - - -
  public componentDidRender() {
    console.group("componentDidRender");
    try {
      setTimeout(() => {
        this.checkboxEl.focus();
      }, 1000);
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  // ==== LISTENERS SECTION =====================================================================

  @Listen("virtualKeyboardKeyPressed")
  onVKeyboardPress(event: CustomEvent): void {
    console.group("onVKeyboardPress");
    try {
      if (event.detail !== null) {
        const receivedInput = event.detail;
        const currentInputValue = this.inputTextEl.value;
        let updatedValue;
        if (receivedInput !== KeyboardCharMap.Delete) {
          updatedValue = `${currentInputValue}${receivedInput}`;
        } else {
          updatedValue = currentInputValue.slice(0, -1);
        }
        this.inputTextEl.value = updatedValue;
      }
      this.checkInputDirty();
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  @Listen("blurLfKeyboard")
  onBlurKeyboardEvent(event: CustomEvent) {
    console.group("onBlurKeyboardEvent");
    try {
      this.lfKeyboardEl.blur();
      this.checkboxEl.focus();
      this.checkboxInFocus();
    } catch (e) {
      console.error(e);
    }
    console.groupEnd();
  }

  @Listen("submitButtonPressed")
  onKeyboardSubmit(event: CustomEvent): void {
    console.group("onKeyboardSubmit");

    try {
      const keyboardInputValue = event.detail || null;
      // this.lfAppState.
      console.log("Submit Pressed");
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  @Listen("keydown", {
    target: "window",
    capture: true,
  })
  onKeydown(e: KeyboardEvent): void {
    console.group("onKeydown--Password");
    try {
      this.keyHandler(e);
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
  private checkboxInFocus(): void {
    console.group("checkboxInFocus");
    try {
      let className = this.toggleContainer.className;
      if (!className.includes(this.LfFocusClass)) {
        this.toggleContainer.className = `${className} ${this.LfFocusClass}`;
      }
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  private checkboxInBlur(): void {
    console.group("checkboxInBlur");
    try {
      let className = this.toggleContainer.className;
      if (className.includes(this.LfFocusClass)) {
        className = className.replace(this.LfFocusClass, "");
        this.toggleContainer.className = className;
      }
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  private checkInputDirty(): void {
    console.group("checkInputDirty");
    try {
      this.inputIsDirty = this.inputTextEl?.value?.length > 0;
      this.setInputElClassNames();
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  private setInputElClassNames() {
    console.group("setInputElClassNames");
    try {
      const className = this.inputIsDirty ? `dirty` : `clean`;
      this.inputElemClassName = className;
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  private togglePasswordDisplay(): void {
    console.group("togglePasswordDisplay");
    try {
      this.showPassword = !this.showPassword;
      this.inputType = this.showPassword ? InputType.Text : InputType.Password;
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  private keyHandler(e: KeyboardEvent) {
    console.group("KeyHandler");
    try {
      const specialKeys = [Key.DownArrow, Key.UpArrow];
      // e.preventDefault();
      const tabIndex = document.activeElement["tabIndex"];

      console.log(document.activeElement.tagName, tabIndex);
      console.log(document.activeElement.id);

      if (specialKeys.includes(e.which)) {
        console.log("PREVENT");
        e.preventDefault();
      }

      const activeEl = document.activeElement;
      console.log(activeEl);
      switch (e.which) {
        case Key.DownArrow:
          console.log("Down");

          if (document.activeElement.id === this.checkBoxElId) {
            this.toggleContainer.blur();
            this.checkboxInBlur();
            this.lfKeyboardEl.focus();
          }

          break;

        case Key.UpArrow:
          console.log("UP");

          break;
        case Key.Enter:
          console.log("Enter");
          break;
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
    return (
      <div class="wifi-password--container">
        <div class="wifi-password--input-container">
          <p class="wifi-password--prompt">
            Please enter the password for <strong>{this.networkName}</strong>
          </p>
          <div class="wifi-password--input-wrapper">
            <input
              onInput={() => this.checkInputDirty()}
              ref={el => (this.inputTextEl = el as HTMLInputElement)}
              class={`wifi-password--input ${this.inputElemClassName}`}
              type={this.inputType}
              placeholder="Enter Wifi Password"
            ></input>
          </div>
          <div
            class="wifi-password--display-toggle-container"
            ref={el => (this.toggleContainer = el as HTMLElement)}
          >
            <input
              tabindex="0"
              checked={this.showPassword}
              onChange={() => {
                this.togglePasswordDisplay();
              }}
              onFocus={() => {
                this.checkboxInFocus();
              }}
              onBlur={() => {
                this.checkboxInBlur();
              }}
              ref={el => (this.checkboxEl = el as HTMLInputElement)}
              class="wifi-password--display-toggle"
              type="checkbox"
              id={this.checkBoxElId}
            ></input>
            <label htmlFor={this.checkBoxElId} class="wifi-password--display-toggle-label">
              show password
            </label>
          </div>
        </div>
        <lf-keyboard
          ref={el => (this.lfKeyboardEl = el as HTMLElement)}
          tabindex="0"
          id="lf-keyboard-component"
          blurDirection={BlurDirection.Top}
          wrapNavigation={true}
        ></lf-keyboard>
      </div>
    );
  }
}
