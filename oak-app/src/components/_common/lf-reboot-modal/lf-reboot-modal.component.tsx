// ==== Library Imports =======================================================
import { Component, Element, h, Prop, Host, State } from '@stencil/core';

// ==== App Imports ===========================================================
import { androidReboot } from '../../../shared/services/lf-android-interface.service';
import LfLoggerService from '../../../shared/services/lf-logger.service';

@Component({
  tag: 'lf-reboot-modal',
  styleUrls: ['lf-reboot-modal.component.scss'],
  shadow: false,
})
export class LfRebootModal {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('LfRebootModal').logger;
  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() countdownTime: number;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() secondsToReboot = 10;

  // ==== EVENTS SECTION ========================================================================
  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - -
  public componentWillLoad(): void {
    this.log.debug('componentWillLoad');

    this.countdownTime = this.secondsToReboot;
    console.warn(this.countdownTime);
  }

  public componentDidLoad(): void {
    this.log.debug('componentDidLoad');

    console.log(this.countdownTime, 'again');
    let countdownTimer = setInterval(() => {
      if (this.countdownTime <= 0) {
        clearInterval(countdownTimer);
        // TODO reboot device
        androidReboot();
      } else {
        this.countdownTime--;
      }
      console.log(this.countdownTime);
    }, 1000);
  }
  // ==== LISTENERS SECTION =====================================================================
  // ==== PUBLIC METHODS API - @Method() SECTION ================================================
  // ==== LOCAL METHODS SECTION =================================================================

  // ==== RENDERING SECTION =====================================================================
  // - -  render Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    return (
      <Host class={`lf-reboot-modal app-flow-container`}>
        <div class="background-fader"></div>
        <lf-card cardTitle="No Internet Connection">
          <div class="lf-reboot-modal--content">
            <div class="lf-reboot-modal--text">We couldn't connect your device to the Internet. <br />Your device will reboot to try to fix the issue.</div>
            <div class="lf-countdown--timer">{this.countdownTime} s</div>
          </div>
        </lf-card>
        <lf-cta-container faded={true} />
      </Host>
    );
  }
}
