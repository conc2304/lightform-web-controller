import { Component, Element, Event, EventEmitter, Host, h, Listen, Prop, State } from '@stencil/core';

enum InputType {
  Password = 'password',
  Text = 'text',
}

@Component({
  tag: 'lf-wifi-password',
  styleUrl: 'lf-wifi-password.scss',
  shadow: true,
})
export class LfWifiPassword {
  @Prop() networkName: string;

  @State() inputType: InputType = InputType.Text;
  @State() showPassword: boolean = true;
  @State() inputIsDirty: boolean = false;
  @State() inputElemClassName: string;

  @Element() element: HTMLElement;

  private toggleContainer: HTMLElement;
  private inputTextEl: HTMLInputElement;

  private checkInputDirty(): void {
    this.inputIsDirty = this.inputTextEl?.value?.length > 0;
    this.setInputElClassNames();
  }

  private setInputElClassNames() {
    const className = this.inputIsDirty ? `dirty` : `clean`;
    this.inputElemClassName = className;
  }

  // @Event() passwordSubmitted: EventEmitter;

  private togglePasswordDisplay(): void {
    this.showPassword = !this.showPassword;
    this.inputType = this.showPassword ? InputType.Text : InputType.Password;
  }

  componentWillLoad() {
    this.setInputElClassNames();

    setTimeout(() => {
      this.toggleContainer.focus();
    }, 300);
  }

  render() {
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
          <div class="wifi-password--display-toggle-container" ref={el => (this.toggleContainer = el as HTMLElement)} tabindex="0">
            <ion-checkbox
              onIonChange={() => {
                this.togglePasswordDisplay();
              }}
              class="wifi-password--display-toggle"
              color="primary"
              checked={this.showPassword}
            ></ion-checkbox>
            <ion-label class="wifi-password--display-toggle-label">show password</ion-label>
          </div>
        </div>
        <div class="virtual-keyboard-wrapper"></div>
      </div>
    );
  }
}
