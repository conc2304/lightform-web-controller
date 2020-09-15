import { Component, Event, EventEmitter, Host, h, Listen, Prop, State } from '@stencil/core';
import { WifiEntry } from '../../shared/interfaces/wifi-entry.interface';
import { SignalStrength } from '../../shared/enums/wifi-signal-strength.enum';

enum InputType {
  Password = "password",
  Text = "text",
}

@Component({
  tag: 'lf-wifi-password',
  styleUrl: 'lf-wifi-password.scss',
  shadow: true,
})
export class LfWifiPassword {
  @Prop() pairingNetwork: WifiEntry;
  @Prop() test!: string;

  @State() inputType: InputType = InputType.Text;
  @State() showPassword: boolean = true;
  // @Event() passwordSubmitted: EventEmitter;

  private togglePasswordDisplay():void {
    this.showPassword = !this.showPassword;
    this.inputType = (this.showPassword) ? InputType.Text : InputType.Password;
  }

  async componentWillLoad() {
    console.log('LOAD', this.pairingNetwork);
  }

  render() {
    return (
      <Host>
        <div class="wifi-password--container">
          <div class="wifi-password--input-container">
            <p class="wifi-password--prompt">
              Please enter the password for <strong>{this.test}</strong>
            </p>
            {/* <h1>{this.pairingNetwork.wifiName}</h1> */}
            <div class="wifi-password--input-wrapper">
              <input class="wifi-password--input" type={this.inputType} placeholder="Enter Wifi Password"></input>
            </div>
            <div class="wifi-password--display-toggle-container">
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
      </Host>
    );
  }
}
