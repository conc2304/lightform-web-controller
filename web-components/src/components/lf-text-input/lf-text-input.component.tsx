// Library Imports
import {
  Component,
  ComponentInterface,
  Prop,
  h,
  Element,
  Event,
  EventEmitter,
  Host,
  Method,
  State,
  Watch,
} from '@stencil/core';

// App Imports
import { TextFieldTypes } from './text-field-types.type';
import { debounceEvent } from '../../utils/helper';

@Component({
  tag: 'lf-text-input',
  styleUrl: 'lf-text-input.component.scss',
  scoped: true,
})
export class LfTextInput implements ComponentInterface {
  @Element() el!: HTMLElement;

  // Private Properties
  // --------------------------------------------------
  private nativeInput?: HTMLInputElement;
  private inputId = `lf-text-input-${inputIds++}`;
  private didBlurAfterEdit = false;
  private tabindex?: string | number;

  // Public Properties API
  // --------------------------------------------------
  /**
   * This is required for a WebKit bug which requires us to
   * blur and focus an input to properly focus the input in
   * an item with delegatesFocus. It will no longer be needed
   * with iOS 14.
   */
  @Prop() fireFocusEvents = true;

  /**
   * Indicates whether or not the element has focus.
   */
  @State() hasFocus = false;

  /**
   * Indicates whether the password field should show or obfuscate the password
   */
  @State() passwordVisible = false;

  /**
   * Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user.
   */
  @Prop() autocapitalize = 'off';

  /**
   * This Boolean attribute lets you specify that a form control should have input focus when the page loads.
   */
  @Prop() autofocus = false;

  /**
   * If `true`, a clear icon will appear in the input when there is a value. Clicking it clears the input.
   */
  @Prop() clearInput = false;

  /**
   * The color of the icon used to clear input when there is a value.
   */
  @Prop() clearIconColor: string = '#FFF';

  /**
   * If `true`, the value will be cleared after focus upon edit. Defaults to `true` when `type` is `"password"`, `false` for all other types.
   */
  @Prop() clearOnEdit?: boolean;

  /**
   * Set the amount of time, in milliseconds, to wait to trigger the `lfChange` event after each keystroke.
   */
  @Prop() debounce = 0;

  @Watch('debounce')
  protected debounceChanged() {
    this.lfChange = debounceEvent(this.lfChange, this.debounce);
  }

  @Prop() invalid = false;
  @Watch('disabled')
  protected invalidChanged() {
    this.emitStyle();
  }

  /**
   * If `true`, the user cannot interact with the input.
   */
  @Prop() disabled = false;

  @Watch('disabled')
  protected disabledChanged() {
    this.emitStyle();
  }

  /**
   * The text describing the input field.
   */
  @Prop() label?: string;

  /**
   * The position determines where and how the label behaves inside an item. Defaults to fixed if label is set.
   */
  @Prop() labelPosition?: 'fixed' | 'stacked' | 'stacked-centered';

  /**
   * The maximum value, which must not be less than its minimum (min attribute) value.
   */
  @Prop() max?: string;

  /**
   * If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the maximum number of characters that the user can enter.
   */
  @Prop() maxlength?: number;

  /**
   * The minimum value, which must not be greater than its maximum (max attribute) value.
   */
  @Prop() min?: string;

  /**
   * If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the minimum number of characters that the user can enter.
   */
  @Prop() minlength?: number;

  /**
   * If `true`, the user can enter more than one value. This attribute applies when the type attribute is set to `"email"` or `"file"`, otherwise it is ignored.
   */
  @Prop() multiple?: boolean;

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name: string = this.inputId;

  /**
   * A regular expression that the value is checked against. The pattern must match the entire value, not just some subset. Use the title attribute to describe the pattern to help the user. This attribute applies when the value of the type attribute is `"text"`, `"search"`, `"tel"`, `"url"`, `"email"`, `"date"`, or `"password"`, otherwise it is ignored. When the type attribute is `"date"`, `pattern` will only be used in browsers that do not support the `"date"` input type natively. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date for more information.
   */
  @Prop() pattern?: string;

  /**
   * Instructional text that shows before the input has a value.
   */
  @Prop() placeholder?: string | null;

  /**
   * If `true`, the user cannot modify the value.
   */
  @Prop() readonly = false;

  /**
   * If `true`, the user must fill in a value before submitting a form.
   */
  @Prop() required = false;

  /**
   * Works with the min and max attributes to limit the increments at which a value can be set.
   * Possible values are: `"any"` or a positive floating point number.
   */
  @Prop() step?: string;

  /**
   * The initial size of the control. This value is in pixels unless the value of the type attribute is
   * `"text"` or `"password"`, in which case it is an integer number of characters. This attribute applies
   * only when the `type` attribute is set to `"text"`, `"search"`, `"tel"`, `"url"`, `"email"`, or `"password"`, otherwise it is ignored.
   */
  @Prop() size?: number;

  /**
   * Determines wether the input container should fill the rest of the container or remain at its initial width/
   */
  @Prop() expand?: 'block' | 'fill' = 'block';

  /**
   * The type of control to display. The default type is text.
   */
  @Prop() type: TextFieldTypes = 'text';

  @State() currentType: TextFieldTypes = null;

  /**
   * The value of the input.
   */
  @Prop({ mutable: true }) value?: string | number | null = '';

  /**
   * Update the native input element when the value changes
   */
  @Watch('value')
  protected valueChanged() {
    this.emitStyle();
    this.lfChange.emit({
      value: this.value == null ? this.value : this.value.toString(),
    });
  }

  /**
   * Emitted when a keyboard input occurred.
   */
  @Event() lfInput!: EventEmitter<KeyboardEvent>;

  /**
   * Emitted when the value has changed.
   */
  @Event() lfChange!: EventEmitter<any>;

  /**
   * Emitted when the input loses focus.
   */
  @Event() lfBlur!: EventEmitter<FocusEvent>;

  /**
   * Emitted when the input has focus.
   */
  @Event() lfFocus!: EventEmitter<FocusEvent>;

  /**
   * Emitted when the styles change.
   */
  @Event() lfStyle!: EventEmitter<any>;

  // Component Lifecycle Hooks
  // --------------------------------------------------
  componentWillLoad() {
    // If the lf-text-input has a tabindex attribute we get the value
    // and pass it down to the native input, then remove it from the
    // lf-text-input to avoid causing tabbing twice on the same element
    if (this.el.hasAttribute('tabindex')) {
      const tabindex = this.el.getAttribute('tabindex');
      this.tabindex = tabindex !== null ? tabindex : undefined;
      this.el.removeAttribute('tabindex');
    }

    if (this.label && typeof this.labelPosition === 'undefined') {
      this.labelPosition = 'fixed';
    }

    this.currentType = this.currentType || this.type;
  }

  // Public Methods API
  // --------------------------------------------------

  /**
   * Sets focus on the native `input` in `lf-text-input`. Use this method instead of the global
   * `input.focus()`.
   */
  @Method()
  async setFocus() {
    if (this.nativeInput) {
      this.nativeInput.focus();
    }
  }

  /**
   * Sets blur on the native `input` in `lf-text-input`. Use this method instead of the global
   * `input.blur()`.
   * @internal
   */
  @Method()
  async setBlur() {
    if (this.nativeInput) {
      this.nativeInput.blur();
    }
  }

  /**
   * Returns the native `<input>` element used under the hood.
   */
  @Method()
  getInputElement(): Promise<HTMLInputElement> {
    return Promise.resolve(this.nativeInput!);
  }

  // Private Methods
  // --------------------------------------------------
  private shouldClearOnEdit() {
    const { type, clearOnEdit } = this;
    return clearOnEdit === undefined ? type === 'password' : clearOnEdit;
  }

  private getValue(): string {
    return typeof this.value === 'number' ? this.value.toString() : (this.value || '').toString();
  }

  private emitStyle() {
    this.lfStyle.emit({
      interactive: true,
      input: true,
      'has-placeholder': this.placeholder != null,
      'has-value': this.hasValue(),
      'has-focus': this.hasFocus,
      'interactive-disabled': this.disabled,
      'input-invalid': this.invalid,
    });
  }

  private onInput = (ev: Event) => {
    const input = ev.target as HTMLInputElement | null;
    if (input) {
      this.value = input.value || '';
    }
    this.lfInput.emit(ev as KeyboardEvent);
  };

  private onBlur = (ev: FocusEvent) => {
    this.hasFocus = false;
    this.focusChanged();
    this.emitStyle();

    if (this.fireFocusEvents) {
      this.lfBlur.emit(ev);
    }
  };

  private onFocus = (ev: FocusEvent) => {
    this.hasFocus = true;
    this.focusChanged();
    this.emitStyle();

    if (this.fireFocusEvents) {
      this.lfFocus.emit(ev);
    }
  };

  private renderVisibilityIcon() {
    //inlined svg in order to change the path color in css
    if (!this.passwordVisible) {
      return (
        // visibility icon
        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20">
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z" />
        </svg>
      );
    } else {
      return (
        // visibility off icon
        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20">
          <path d="M0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none" />
          <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5-.59 1.22-1.42 2.27-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6 12 6zm-1.07 1.14L13 9.21c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.14-.7.14-1.07C16.5 9.01 14.48 7 12 7c-.37 0-.72.05-1.07.14zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.98-.29 4.32-.82l3.42 3.42 1.41-1.41L3.42 2.45 2.01 3.87zm7.5 7.5l2.61 2.61c-.04.01-.08.02-.12.02-1.38 0-2.5-1.12-2.5-2.5 0-.05.01-.08.01-.13zm-3.4-3.4l1.75 1.75c-.23.55-.36 1.15-.36 1.78 0 2.48 2.02 4.5 4.5 4.5.63 0 1.23-.13 1.77-.36l.98.98c-.88.24-1.8.38-2.75.38-3.79 0-7.17-2.13-8.82-5.5.7-1.43 1.72-2.61 2.93-3.53z" />
        </svg>
      );
    }
  }

  private onKeydown = (ev: KeyboardEvent) => {
    if (this.shouldClearOnEdit()) {
      // Did the input value change after it was blurred and edited?
      // Do not clear if user is hitting Enter to submit form
      if (this.didBlurAfterEdit && this.hasValue() && ev.key !== 'Enter') {
        // Clear the input
        this.clearTextInput();
      }

      // Reset the flag
      this.didBlurAfterEdit = false;
    }
  };

  private clearTextOnEnter = (ev: KeyboardEvent) => {
    if (ev.key === 'Enter') {
      this.clearTextInput(ev);
    }
  };

  private clearTextInput = (ev?: Event) => {
    if (this.clearInput && !this.readonly && !this.disabled && ev) {
      ev.preventDefault();
      ev.stopPropagation();

      // Attempt to focus input again after pressing clear button
      this.setFocus();
    }

    this.value = '';

    /**
     * This is needed for clearOnEdit
     * Otherwise the value will not be cleared
     * if user is inside the input
     */
    if (this.nativeInput) {
      this.nativeInput.value = '';
    }
    return false;
  };

  private togglePasswordVisibility = (ev?: Event) => {
    ev.preventDefault();
    ev.stopPropagation();

    this.passwordVisible = !this.passwordVisible;
    this.currentType = !this.passwordVisible ? 'password' : 'text';
    return false;
  };

  private focusChanged() {
    // If clearOnEdit is enabled and the input blurred but has a value, set a flag
    if (!this.hasFocus && this.shouldClearOnEdit() && this.hasValue()) {
      this.didBlurAfterEdit = true;
    }
  }

  private hasValue(): boolean {
    return this.getValue().length > 0;
  }

  private getClassName(): string {
    try {
      let className = 'lf-text-input';

      if (this.disabled) {
        className = `${className} lf-text-input--disabled`;
      }

      if (this.invalid) {
        className = `${className} lf-text-input--invalid`;
      }

      if (this.hasValue()) {
        className = `${className} lf-text-input--has-value`;
      } else {
        className = `${className} lf-text-input--empty`;
      }

      if (this.hasFocus) {
        className = `${className} lf-text-input--has-focus`;
      }

      if (this.expand) {
        className = `${className} lf-text-input--expand-${this.expand}`;
      }

      if (this.labelPosition) {
        className = `${className} lf-text-input--label-position-${this.labelPosition}`;
      } else {
        className = `${className} lf-text-input--label-position-fixed`;
      }

      return className;
    } catch (error) {
      console.error(error);
    }
  }

  // Rendering Section
  // --------------------------------------------------
  render() {
    try {
      const value = this.getValue();
      const labelId = this.inputId + '--label';
      const TagType = this.type === 'textarea' ? 'textarea' : 'input';

      let labelAttr;
      if (this.label) {
        labelAttr = {
          id: labelId,
          class: 'lf-text-input--label',
          htmlFor: this.inputId,
          'aria-owns': this.inputId,
        };
      }

      return (
        <Host aria-disabled={this.disabled ? 'true' : null} class={this.getClassName()}>
          {this.label && (
            <span class="lf-text-input--label-wrapper">
              <label {...labelAttr}>{this.label}</label>
            </span>
          )}

          <div class="lf-text-input--wrapper">
            <TagType
              id={this.inputId}
              class="native-input"
              ref={(input) => (this.nativeInput = input)}
              aria-labelledby={labelId}
              disabled={this.disabled}
              autoCapitalize={this.autocapitalize}
              autoFocus={this.autofocus}
              min={this.min}
              max={this.max}
              minLength={this.minlength}
              maxLength={this.maxlength}
              multiple={this.multiple}
              name={this.name}
              pattern={this.pattern}
              placeholder={this.placeholder || ''}
              readOnly={this.readonly}
              required={this.required}
              step={this.step}
              size={this.size}
              tabindex={this.tabindex}
              type={this.currentType}
              value={value}
              onInput={this.onInput}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              onKeyDown={this.onKeydown}
            />

            {this.clearInput && !this.readonly && !this.disabled && (
              <button
                aria-label="reset"
                type="button"
                class="input--inner-button input--clear-icon"
                tabindex={-1}
                onTouchStart={this.clearTextInput}
                onMouseDown={this.clearTextInput}
                onKeyDown={this.clearTextOnEnter}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.5 1.5L10.5 10.5" stroke={this.clearIconColor} stroke-width="2" />
                  <path d="M1.5 10.5L10.5 1.5" stroke={this.clearIconColor} stroke-width="2" />
                </svg>
              </button>
            )}

            {this.type === 'password' && !this.clearInput && !this.disabled && (
              <button
                tabindex={-1}
                type="button"
                aria-label="Toggle Password"
                class="input--inner-button input--visibility-icon"
                onTouchStart={(event) => {
                  this.togglePasswordVisibility(event);
                }}
                onMouseDown={(event) => {
                  this.togglePasswordVisibility(event);
                }}
                onKeyDown={(event) => {
                  this.togglePasswordVisibility(event);
                }}
              >
                <div class="password-visibility--svg-wrapper">{this.renderVisibilityIcon()}</div>
              </button>
            )}
          </div>
        </Host>
      );
    } catch (error) {
      console.error(error);
    }
  }
}

let inputIds = 0;
