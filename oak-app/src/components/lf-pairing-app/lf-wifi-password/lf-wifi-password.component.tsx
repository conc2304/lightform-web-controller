// ==== Library Imports =======================================================
import { Component, Element, Event, EventEmitter, h, Listen, Prop, State } from '@stencil/core';
import { Key as EventKey } from 'ts-key-enum';

// ==== App Imports ===========================================================
import { KeyboardCharMap } from '../../../shared/enums/v-keyboard-char-map.enum';
import { LF_REMOTE_BACK_BUTTON } from '../../../shared/lf-remote-keycodes.constants';
import LfLoggerService from '../../../shared/services/lf-logger.service';
import { LfKeyboardBlurDirection as BlurDirection } from '../../_common/lf-keyboard/lf-keyboard-blur-direction.enum';

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
  private visibilityEl: HTMLElement;
  // private inputTextEl: HTMLInputElement;
  private lfKeyboardEl: HTMLElement;
  private log = new LfLoggerService('LfWifiPassword').logger;

  private readonly visToggleElId = 'show-password-toggle';

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() inputElemClassName: string;
  @State() inputIsDirty: boolean = false;
  @State() inputType: InputType = InputType.Text;
  @State() showPassword: boolean = true;

  @State() password: string = '';

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() networkName: string;
  @Prop() initialFocus: 'passwordToggle' | 'keyboard' = 'keyboard';

  // ==== EVENTS SECTION ========================================================================
  @Event() passwordSubmitted: EventEmitter<string>;
  @Event() restartPairingProcess: EventEmitter<void>;

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public componentWillLoad() {
    this.log.debug('componentWillLoad');
  }

  // - -  componentDidLoad Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public componentDidLoad() {
    this.log.debug('componentDidLoad');
    setTimeout(() => {
      if (this.initialFocus === 'keyboard') {
        this.lfKeyboardEl.focus();
      } else if (this.initialFocus === 'passwordToggle') {
        this.visibilityEl.focus();
      }
    }, 1000);
  }

  // ==== LISTENERS SECTION =====================================================================
  @Listen('virtualKeyboardKeyPressed')
  onVKeyboardPress(event: CustomEvent): void {
    this.log.debug('onVKeyboardPress');

    event.preventDefault();
    event.stopPropagation();

    if (event.detail !== null) {
      const receivedInput = event.detail;
      this.log.debug(event.detail);
      // const currentInputValue = this.inputTextEl.value;
      const currentInputValue = this.password;

      let updatedValue;
      if (receivedInput !== KeyboardCharMap.Delete) {
        updatedValue = `${currentInputValue}${receivedInput}`;
      } else {
        updatedValue = currentInputValue.slice(0, -1);
      }
      this.password = updatedValue;
    }
    this.checkInputDirty();
  }

  @Listen('blurLfKeyboard')
  onBlurKeyboardEvent() {
    this.log.debug('onBlurKeyboardEvent');
    this.lfKeyboardEl.blur();
    this.visibilityEl.focus();
  }

  @Listen('submitButtonPressed')
  onKeyboardSubmit(): void {
    this.log.debug('onKeyboardSubmit');
    this.passwordSubmitted.emit(this.password);
  }

  @Listen('keydown', {
    target: 'window',
    capture: true,
  })
  onKeydown(e: KeyboardEvent): void {
    this.log.debug('onKeydown--Password');
    this.keyHandler(e);
  }

  // ==== PUBLIC METHODS API - @Method() SECTION =================================================

  // ==== LOCAL METHODS SECTION ==================================================================
  private checkInputDirty(): void {
    this.log.debug('checkInputDirty');
    this.inputIsDirty = this.password.length > 0;
  }

  private togglePasswordDisplay(): void {
    this.log.debug('togglePasswordDisplay');

    this.showPassword = !this.showPassword;
    this.inputType = this.showPassword ? InputType.Text : InputType.Password;
  }

  private keyHandler(e: KeyboardEvent) {
    this.log.debug('keyHandler');

    const specialKeys = [EventKey.ArrowDown, EventKey.ArrowUp, EventKey.Enter, LF_REMOTE_BACK_BUTTON].map(key => {
      return key.toString();
    });

    if (specialKeys.includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
    }

    switch (e.key) {
      case LF_REMOTE_BACK_BUTTON:
        this.restartPairingProcess.emit();
        break;
      case EventKey.ArrowDown:
        if (document.activeElement.id === this.visToggleElId) {
          this.visibilityEl.blur();
          this.lfKeyboardEl.focus();
        }
        break;
      case EventKey.ArrowUp:
        // Up Arrow is only used while in the keyboard container: @see lf-keyboard
        break;
      case EventKey.Enter:
        // Enter is handled natively by the native html button element
        if (document.activeElement.id === this.visToggleElId) {
          this.visibilityEl.click();
        }
        break;
    }
  }

  // ==== RENDERING SECTION =========================================================================
  private renderVisibilityIcon() {
    //inlined svg in order to change the path color in css
    if (this.showPassword) {
      return (
        // visibility icon
        // @see src/assets/images/icons/visibility.svg
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z" />
        </svg>
      );
    } else {
      return (
        // visibility off icon
        // @see src/assets/images/icons/visibility_off.svg
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
          <path d="M0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none" />
          <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5-.59 1.22-1.42 2.27-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6 12 6zm-1.07 1.14L13 9.21c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.14-.7.14-1.07C16.5 9.01 14.48 7 12 7c-.37 0-.72.05-1.07.14zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.98-.29 4.32-.82l3.42 3.42 1.41-1.41L3.42 2.45 2.01 3.87zm7.5 7.5l2.61 2.61c-.04.01-.08.02-.12.02-1.38 0-2.5-1.12-2.5-2.5 0-.05.01-.08.01-.13zm-3.4-3.4l1.75 1.75c-.23.55-.36 1.15-.36 1.78 0 2.48 2.02 4.5 4.5 4.5.63 0 1.23-.13 1.77-.36l.98.98c-.88.24-1.8.38-2.75.38-3.79 0-7.17-2.13-8.82-5.5.7-1.43 1.72-2.61 2.93-3.53z" />
        </svg>
      );
    }
  }

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    const initialKeyboardMarkerPos = {
      row: this.initialFocus === 'keyboard' ? 0 : -1,
      column: 0,
    };

    return (
      <div class="wifi-password--container">
        <div class="wifi-password--input-container">
          <p class="wifi-password--prompt">Network: {this.networkName}</p>
          <div class="wifi-password--input-wrapper">
            <div class={`wifi-password--input ${this.inputType.toString()}`}>
              {this.inputIsDirty ? (
                this.password.split('').map((char: string) => {
                  return <div class={`wifi-password--char ${char === ' ' ? 'space' : ''}`}>{char}</div>;
                })
              ) : (
                <div class="wifi-password--input-placeholder">Enter Wifi Password</div>
              )}
              {this.inputIsDirty ? <div class="wifi-password--input-cursor">|</div> : ''}
            </div>

            <button
              class="wifi-password--visibility-toggle"
              id={this.visToggleElId}
              onClick={() => {
                this.togglePasswordDisplay();
              }}
              ref={el => (this.visibilityEl = el as HTMLElement)}
            >
              <div id={this.visToggleElId} class="wifi-password--svg-wrapper">
                {this.renderVisibilityIcon()}
              </div>
            </button>
          </div>
        </div>

        {/* implementation of simple-keyboard */}
        <lf-keyboard
          ref={el => (this.lfKeyboardEl = el as HTMLElement)}
          tabindex="0"
          id="lf-keyboard-component"
          blurDirection={BlurDirection.Top}
          wrapNavigation={true}
          initialMarkerPosition={initialKeyboardMarkerPos}
        ></lf-keyboard>
      </div>
    );
  }
}
