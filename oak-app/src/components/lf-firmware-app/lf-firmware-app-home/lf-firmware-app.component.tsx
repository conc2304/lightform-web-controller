// ==== Library Imports =======================================================
import { Component, h, Element, State, Host, Prop } from '@stencil/core';

// ==== App Imports ===========================================================
// import { LfAppState } from '../../../shared/services/lf-app-state.service';

@Component({
  tag: 'lf-firmware-app',
  styleUrl: 'lf-firmware-app.component.scss',
})
export class LfFirmwareApp {
  // ==== OWN PROPERTIES SECTION =======================================================================
  // Dependency Injections
  // private lfAppState = LfAppState;
  private currentFirmware = 'X.X.X.XXX';
  private nextFirmware = 'Y.Y.Y.YYY';
  private errorCode: number | string = 1234;
  private restartFirmwareBtn: HTMLElement;
  // Getters/Setters

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() el: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() firmwareUpdateState: 'pending' | 'failed' = 'failed';

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() device = {
    name: 'Jolly Banshee',
  };

  // ==== EVENTS SECTION ========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentDidLoad Implementation - - - - - - - - - - - - - - - - - - - - -
  public componentWillRender(): void {
    console.log('componentWillRender');
  }
  // ==== LISTENERS SECTION =====================================================================

  // @Listen('networkSelected')
  // onNetworkSelected(event: CustomEvent) {
  //   console.log('onNetworkSelected');
  // }

  // ==== PUBLIC METHODS API - @Method() SECTION ========================================================
  // @Method()
  // async publicMethod(): Promise<void> {return}

  // ==== LOCAL METHODS SECTION =========================================================================
  private handleDownloadRestart(): void {
    console.log('handleDownloadRestart');
  }

  // ==== RENDERING SECTION =========================================================================
  private renderFirmwareUpdateContent() {
    console.log('renderFirmwareUpdateContent');
    const firmwareStateClass = `status-${this.firmwareUpdateState}`;

    return (
      <div class="firmware-update--container">
        {/* start status container */}
        <div class="firmware-update--status-container animation--pop-in center-and-shrink" style={{ '--animation-order': 1 } as any}>
          <div class="firmware-update--points old-firmware">{this.currentFirmware}</div>

          <div class="firmware-update--status-wrapper">
            <div class={`firmware-update--status-icon ${firmwareStateClass}`}></div>
          </div>

          <div class="firmware-update--points new-firmware">{this.nextFirmware}</div>
        </div>
        {/* end status container */}
        {this.renderStatusMsg()}

        <div class="firmware-update--action-btn-container animation--pop-in" style={{ '--animation-order': 3 } as any}>
          {this.renderButtonContainer()}
        </div>
      </div>
    );
  }

  private renderStatusMsg() {
    return (
      <div class="firmware-update--status-msg-container animation--pop-in" style={{ '--animation-order': 2 } as any}>
        {this.renderStatusMsgText()}
      </div>
    );
  }

  private renderButtonContainer() {
    if (this.firmwareUpdateState === 'failed') {
      return (
        <button
          onClick={() => this.handleDownloadRestart()}
          ref={el => (this.restartFirmwareBtn = el as HTMLInputElement)}
          class="action-btn--floating-bottom full-width"
          tabindex="0"
        >
          <div>Download Again</div>
        </button>
      );
    }
  }

  private renderStatusMsgText() {
    const msgClass = 'firmware-update--status-msg';
    // About to update
    if (this.firmwareUpdateState === 'pending') {
      return [
        <p class={msgClass}>Downloading latest firmware.</p>,
        <p class={msgClass}>Please keep the device plugged in during the process.</p>,
        <p class={msgClass}>The device will restart when finish downloading.</p>,
      ];
    }
    // Failed
    else if (this.firmwareUpdateState === 'failed') {
      return [
        <p class={msgClass}>Download Failed.</p>,
        <p class={msgClass}>
          Please try again, or contact us on <strong>lightform.com/contact</strong> for support.
        </p>,
        errorInfo(this.errorCode),
      ];
    }

    function errorInfo(errorCode: number | string | null) {
      if (errorCode) {
        return <p class="error-info">Error code: {errorCode}</p>;
      }
    }
  }

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    return (
      <Host class="lf-pairing-app appflow-container">
        <lf-card cardTitle="Firmware Update">{this.renderFirmwareUpdateContent()}</lf-card>
      </Host>
    );
  }
}
