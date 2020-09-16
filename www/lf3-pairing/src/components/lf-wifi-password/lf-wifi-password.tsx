// ==== Library Imports =======================================================
import { Component, Element, h, Listen, Prop, State } from "@stencil/core";

// ==== App Imports ===========================================================
// import { LfAppState } from "../../shared/services/lf-app-state.service";

enum InputType {
  Password = "password",
  Text = "text",
}

@Component({
  tag: "lf-wifi-password",
  styleUrls: ["lf-wifi-password.scss"],
  shadow: false,
})
export class LfWifiPassword {
  // ==== PUBLIC ============================================================

  // ---- Properties --------------------------------------------------------
  @Prop() networkName: string;

  @State() inputType: InputType = InputType.Text;
  @State() showPassword: boolean = true;
  @State() inputIsDirty: boolean = false;
  @State() inputElemClassName: string;

  @Element() element: HTMLElement;

  @Listen("keyboardKeyPressed")
  keyboardKeyPressedHandler(event: CustomEvent) {
    console.group("keyboardKeyPressedHandler");
    try {
      console.log("Received:", event);
      if (event.detail !== null) {
        this.inputTextEl.value = event.detail;
      }
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

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

  // ---- Methods -----------------------------------------------------------

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - -
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
            tabindex="0"
          >
            <ion-checkbox
              onIonChange={() => {
                this.togglePasswordDisplay();
              }}
              class="wifi-password--display-toggle"
              color="primary"
              checked={this.showPassword}
            ></ion-checkbox>
            <ion-label class="wifi-password--display-toggle-label">
              show password
            </ion-label>
          </div>
        </div>
        <lf-keyboard></lf-keyboard>
      </div>
    );
  }

  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - -
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

  // - -  componentDidRender Implementation - - - - - - - - - - - - - - - - - - - - -
  public componentDidRender() {
    console.group("componentDidRender");
    try {
      this.focusToggleContainer();
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  // ==== PROTECTED =========================================================
  // ---- Properties --------------------------------------------------------
  // ---- Methods -----------------------------------------------------------

  // ==== PRIVATE ===========================================================
  // ---- Properties --------------------------------------------------------

  // Getter/Setter backing variables and defaults
  private _toggleContainer: HTMLElement;
  private _inputTextEl: HTMLInputElement;

  // ---- Methods -----------------------------------------------------------

  private focusToggleContainer() {
    console.group("focusToggleContainer");
    try {
      setTimeout(() => {
        this.toggleContainer.focus();
      }, 300);
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
}
