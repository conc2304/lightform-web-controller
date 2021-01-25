// ==== Library Imports =======================================================
import { Component, Element, h, State } from '@stencil/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfRemoteApiAuthService from '../../../shared/services/lf-remote-api/lf-remote-api-auth.service';
import lfAppStateStore from '../../../store/lf-app-state.store';

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
  private slider: HTMLIonSlidesElement;
  private slideOpts = {
    initialSlide: 0,
    speed: 400,
    allowTouchMove: false,
  };
  private swiperInstance;

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
  }

  // - -  componentDidLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad() {
    this.log.debug('componentDidLoad');

    this.router = await document.querySelector('ion-router').componentOnReady();

    await customElements.whenDefined('ion-slides');
    this.slider = document.querySelector('ion-slides');
    this.swiperInstance = await this.slider.getSwiper();

    if (!this.isMobileLayout) {
      setTimeout(() => {
        // slides sizes are a little off on desktop do to removing the sidebar
        this.swiperInstance.width = window.innerWidth;
        this.swiperInstance.height = window.innerHeight;
        this.swiperInstance.resize.resizeHandler();
      }, 1000);
    }
  }

  // ==== LISTENERS SECTION =======================================================================
  // ==== PUBLIC METHODS API - @Method() SECTION ==================================================
  // ==== LOCAL METHODS SECTION ===================================================================

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

  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    return [
      <div class="page-registration--container">
        <ion-icon
          class="close-btn"
          name="close"
          size="large"
          onClick={() => {
            this.router.push('/');
          }}
        />

        <ion-slides class="registration--slider" pager={true} options={this.slideOpts}>
          {/* STEP 1 */}
          <ion-slide class="registration--slide">
            <div class="registration--slide-content">
              <div class="slide-content--top">
                <h1>Add a device</h1>

                <img class="registration--hero-img" src="./assets/images/device-registration-oak-interface.jpg" />
                <p class="registration--prompt">When you see this view from your device, it’s ready to be added to your account. Confirm to continue.</p>
              </div>

              <div class="slide-content--bottom">
                <p class="registration--help">Not seeing this view?</p>
                <lf-button
                  class="registration--action-btn"
                  context="secondary"
                  onClick={() => {
                    this.slider.slideNext();
                  }}
                >
                  Confirm
                </lf-button>
              </div>
            </div>
          </ion-slide>

          {/* STEP 2 */}
          <ion-slide class="registration--slide">
            <div class="registration--slide-content">
              <div class="slide-content--top">
                <h1>Add a device</h1>

                <img class="registration--hero-img resize" src="./assets/images/device-registration-remote.jpg" />
                <p class="registration--prompt">Use your remote control to enter the following keys to your device.</p>
              </div>

              <div class="slide-content--bottom">
                <div class="lf-registration-input--input-container">
                  {this.registrationCode.map((unicodeDirection: LfUnicodeArrowChar) => {
                    return this.renderRegistrationInput(unicodeDirection);
                  })}
                </div>

                <lf-button class="registration--action-btn" context="secondary" href="/">
                  Finish
                </lf-button>
              </div>
            </div>
          </ion-slide>
        </ion-slides>
      </div>,
    ];
  }
}
