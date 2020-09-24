// ==== Library Imports =======================================================
import { Component, Event, EventEmitter, h, Listen, Prop, State } from "@stencil/core";
import { Key as EventKey } from "ts-key-enum";

// ==== App Imports ===========================================================
import { KeyboardCharMap } from "../../shared/enums/v-keyboar-char-map.enum";
import { LfKeyboardBlurDirection as BlurDirection } from "../lf-keyboard/lf-keyboard-blur-direction.enum";

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
  // ==== OWN PROPERTIES SECTION ===============================================================
  // Dependency Injections
  // private lfAppState = LfAppState;

  // ---- Private  -----------------------------------------------------------------------------
  private toggleContainer: HTMLElement;
  private checkboxEl: HTMLInputElement;
  private inputTextEl: HTMLInputElement;
  private lfKeyboardEl: HTMLElement;

  private readonly LfFocusClass = "lf-item-focused";
  private readonly checkBoxElId = "show-password-toggle";

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  // @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() inputElemClassName: string;
  @State() inputIsDirty: boolean = false;
  @State() inputType: InputType = InputType.Text;
  @State() showPassword: boolean = true;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() networkName: string;

  // ==== EVENTS SECTION ========================================================================
  @Event() passwordSubmitted: EventEmitter;

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

  // - -  componentDidLoad Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public componentDidLoad() {
    console.group("componentDidLoad");
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
  onBlurKeyboardEvent() {
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
  onKeyboardSubmit(): void {
    console.group("onKeyboardSubmit");

    try {
      this.passwordSubmitted.emit(this.inputTextEl.value);
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

  // ==== PUBLIC METHODS API - @Method() SECTION =================================================
  // @Method()
  // async publicMethod(): Promise<void> {return}

  // ==== LOCAL METHODS SECTION ==================================================================
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
    console.log(e);
    try {
      const specialKeys = [EventKey.ArrowDown, EventKey.ArrowUp].map(key => {
        return key.toString();
      });

      if (specialKeys.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }

      switch (e.key) {
        case EventKey.ArrowDown:
          if (document.activeElement.id === this.checkBoxElId) {
            this.toggleContainer.blur();
            this.lfKeyboardEl.focus();
          }
          break;
        case EventKey.ArrowUp:
          break;
        case EventKey.Enter:
          if (document.activeElement.id === this.checkBoxElId) {
            this.togglePasswordDisplay();
          }
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
          <div class="wifi-password--display-toggle-container" ref={el => (this.toggleContainer = el as HTMLElement)}>
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
        {/* implementation of simple-keyboard */}
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
