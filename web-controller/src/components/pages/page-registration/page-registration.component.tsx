// ==== Library Imports =======================================================
import { Component, Element, h, Listen, Host, State } from '@stencil/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfRemoteApiAuthService from '../../../shared/services/lf-remote-api/lf-remote-api-auth.service';
import lfAppStateStore, { initializeData } from '../../../store/lf-app-state.store';

type LfUnicodeArrowChar = '←' | '↑' | '→' | '↓' | null;
@Component({
  tag: 'page-registration',
  styleUrls: ['page-registration.component.scss'],
  shadow: false,
})
export class PageRegistration {
  // ==== OWN PROPERTIES SECTION ==================================================================
  // ---- Private  --------------------------------------------------------------------------------
  private log = new LfLoggerService('PageRegistration').logger;
  private router: HTMLIonRouterElement;

  private readonly inputElemClassName = 'lf-registration-input-item';
  private readonly unicodeArrowMap = {
    '←': 'left',
    '↑': 'up',
    '→': 'right',
    '↓': 'down',
  };

  // ---- Protected -------------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE =====================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION ===============================================================
  @State() registrationCode: Array<LfUnicodeArrowChar> = [];
  @State() isMobileLayout: boolean = lfAppStateStore.mobileLayout;
  @State() currentSlide = 0;
  @State() buttonSize = 'regular';

  // ==== PUBLIC PROPERTY API - Prop() SECTION ====================================================
  // ==== EVENTS SECTION ==========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================
  // - -  componentWillLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -

  public async componentWillLoad() {
    this.log.debug('componentWillLoad');
    this.isMobileLayout = lfAppStateStore.mobileLayout;

    const response = await lfRemoteApiAuthService.getRegistrationCode();
    const registrationCode = response?.body?.code?.split('');
    if (!registrationCode) {
      this.log.error('No registration code found');
    }
    this.registrationCode = registrationCode;

    document.title = `Lightform | Device Registration `;
  }

  // - -  componentDidLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad() {
    this.log.debug('componentDidLoad');

    this.router = await document.querySelector('ion-router').componentOnReady();
  }

  // ==== LISTENERS SECTION =======================================================================

  // ==== LISTENERS SECTION =======================================================================
  @Listen('_layoutUpdated', { target: 'document' })
  onWindowResized(): void {
    this.log.debug('onWindowResized');
    this.isMobileLayout = lfAppStateStore.mobileLayout;
    this.buttonSize = this.isMobileLayout ? 'small' : 'regular';
  }
  // ==== PUBLIC METHODS API - @Method() SECTION ==================================================
  // ==== LOCAL METHODS SECTION ===================================================================

  private async finishRegistration() {
    lfAppStateStore.deviceDataInitialized = false;

    const registeredDevicesBefore = [...lfAppStateStore.registeredDevices];

    lfAppStateStore.deviceDataInitialized = false;
    lfAppStateStore.appDataInitialized = false;
    await initializeData();

    const registeredDevicesAfter = [...lfAppStateStore.registeredDevices];

    const difference = registeredDevicesAfter.filter(({ name: id1 }) => !registeredDevicesBefore.some(({ name: id2 }) => id2 === id1));
    const newestDevice = difference[0];

    if (newestDevice && typeof newestDevice !== 'undefined') {
      lfAppStateStore.deviceSelected = newestDevice;

    } else if (lfAppStateStore.registeredDevices?.length) {
      lfAppStateStore.deviceSelected = lfAppStateStore.registeredDevices[0];
    }

    lfAppStateStore.deviceDataInitialized = true;

    this.router.push('/');
  }

  // ==== RENDERING SECTION =======================================================================
  private renderRegistrationInput(unicodeDirection: LfUnicodeArrowChar) {
    this.log.debug('renderRegistrationInput');

    const imgClassName = `lf-input-img direction-${this.unicodeArrowMap[unicodeDirection]}`;

    return (
      <div class={`${this.inputElemClassName} lf-registration-input--border-box`}>
        <div class="lf-registration-input--content">
          <div class={imgClassName}></div>
        </div>
      </div>
    );
  }

  private renderSlide() {
    if (this.currentSlide === 0) {
      return (
        <div class="registration--slide">
          <div class="registration--slide-content">
            <div class="slide-content--top">
              <h1>Add a device</h1>

              <img class="registration--hero-img" src="/assets/images/device-registration-oak-interface.jpg" />
              <p class="registration--prompt">When you see this view from your device, it’s ready to be added to your account. Confirm to continue.</p>
            </div>

            <div class="slide-content--bottom">
              {/* <p class="registration--help">Not seeing this view?</p> */}

              <lf-button
                size={this.buttonSize}
                class="registration--action-btn"
                context="primary"
                onClick={() => {
                  this.currentSlide = 1;
                }}
              >
                Confirm
              </lf-button>
            </div>
          </div>
        </div>
      );
    } else if (this.currentSlide === 1) {
      return (
        <div class="registration--slide-content">
          <div class="slide-content--top">
            <h1>Add a device</h1>

            <img class="registration--hero-img resize" src="/assets/images/device-registration-hero.gif" />
            <p class="registration--prompt">Use your remote control to enter the following keys to your device.</p>
          </div>

          <div class="slide-content--bottom">
            <div class="lf-registration-input--input-container">
              {this.registrationCode.map((unicodeDirection: LfUnicodeArrowChar, i: number) => {
                if (i === 3) {
                  // create a 4 then 3 row layout
                  return [this.renderRegistrationInput(unicodeDirection), <div class="break"></div>];
                } else {
                  return this.renderRegistrationInput(unicodeDirection);
                }
              })}
            </div>
            <lf-button
              size={this.buttonSize}
              class="registration--action-btn"
              context="primary"
              onClick={() => {
                this.finishRegistration();
              }}
            >
              Finish
            </lf-button>
          </div>
        </div>
      );
    }
  }

  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    try {
      const layoutClassName = this.isMobileLayout ? 'lf-layout--mobile' : 'lf-layout--desktop';

      return (
        <Host class={`page-registration--container scroll-y ${layoutClassName}`}>
          <ion-icon
            class="close-btn"
            name="close"
            size="large"
            onClick={() => {
              this.router.push('/');
            }}
          />
          <div class="registration--slider">{this.renderSlide()}</div>
        </Host>
      );
    } catch (error) {
      this.log ? this.log.error(error) : console.error(error);

      if (error?.message && error?.code) {
        return <lf-error-message errorCode={error?.code} errorMessage={error?.message} hasResetButton={true} />;
      } else {
        return <lf-error-message hasResetButton={true} />;
      }
    }
  }
}
