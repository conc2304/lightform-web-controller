// ==== Library Imports =======================================================
import { Component, Element, Event, EventEmitter, h, Listen, Prop, State } from '@stencil/core';
import { Key as EventKey } from 'ts-key-enum';

// ==== App Imports ===========================================================
import { KeyboardCharMap } from '../../shared/enums/v-keyboar-char-map.enum';
import { LfKeyboardBlurDirection as BlurDirection } from '../lf-keyboard/lf-keyboard-blur-direction.enum';

enum InputType {
  Password = 'password',
  Text = 'text',
}

@Component({
  tag: 'lf-wifi-password',
  styleUrls: ['lf-wifi-password.component.scss'],
  shadow: false,
})
export class LfWifiPassword {
  // ==== OWN PROPERTIES SECTION ===============================================================
  // ---- Private  -----------------------------------------------------------------------------
  private toggleContainer: HTMLElement;
  private checkboxEl: HTMLInputElement;
  private inputTextEl: HTMLInputElement;
  private lfKeyboardEl: HTMLElement;

  private readonly LfFocusClass = 'lf-item-focused';
  private readonly checkBoxElId = 'show-password-toggle';

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

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
    console.log('componentWillLoad');
    this.setInputElClassNames();
  }

  // - -  componentDidLoad Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public componentDidLoad() {
    console.log('componentDidLoad');
    setTimeout(() => {
      this.checkboxEl.focus();
    }, 1000);
  }

  // ==== LISTENERS SECTION =====================================================================
  @Listen('virtualKeyboardKeyPressed')
  onVKeyboardPress(event: CustomEvent): void {
    console.log('onVKeyboardPress');

    event.preventDefault();
    event.stopPropagation();

    if (event.detail !== null) {
      const receivedInput = event.detail;
      console.log(event.detail);
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
  }

  @Listen('blurLfKeyboard')
  onBlurKeyboardEvent() {
    console.log('onBlurKeyboardEvent');
    this.lfKeyboardEl.blur();
    this.checkboxEl.focus();
    this.checkboxInFocus();
  }

  @Listen('submitButtonPressed')
  onKeyboardSubmit(): void {
    console.log('onKeyboardSubmit');
    this.passwordSubmitted.emit(this.inputTextEl.value);
  }

  @Listen('keydown', {
    target: 'window',
    capture: true,
  })
  onKeydown(e: KeyboardEvent): void {
    console.log('onKeydown--Password');
    this.keyHandler(e);
  }

  // ==== PUBLIC METHODS API - @Method() SECTION =================================================

  // ==== LOCAL METHODS SECTION ==================================================================
  private checkboxInFocus(): void {
    console.log('checkboxInFocus');

    let className = this.toggleContainer.className;
    if (!className.includes(this.LfFocusClass)) {
      this.toggleContainer.className = `${className} ${this.LfFocusClass}`;
    }
  }

  private checkboxInBlur(): void {
    console.log('checkboxInBlur');

    let className = this.toggleContainer.className;
    if (className.includes(this.LfFocusClass)) {
      className = className.replace(this.LfFocusClass, '');
      this.toggleContainer.className = className;
    }
  }

  private checkInputDirty(): void {
    console.log('checkInputDirty');

    this.inputIsDirty = this.inputTextEl?.value?.length > 0;
    this.setInputElClassNames();
  }

  private setInputElClassNames() {
    console.log('setInputElClassNames');

    const className = this.inputIsDirty ? `dirty` : `clean`;
    this.inputElemClassName = className;
  }

  private togglePasswordDisplay(): void {
    console.log('togglePasswordDisplay');

    this.showPassword = !this.showPassword;
    this.inputType = this.showPassword ? InputType.Text : InputType.Password;
  }

  private keyHandler(e: KeyboardEvent) {
    console.log('keyHandler');
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
  }

  // ==== RENDERING SECTION =========================================================================
  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
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
