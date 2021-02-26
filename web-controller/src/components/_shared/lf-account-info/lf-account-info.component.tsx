// ==== Library Imports =======================================================
import { Component, Element, h, Listen, Prop, State } from '@stencil/core';

// ==== App Imports ===========================================================

import { LfDevice } from '../../../shared/interfaces/lf-web-controller.interface';
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfAppState, { initializeData } from '../../../store/lf-app-state.store';

@Component({
  tag: 'lf-account-info',
  styleUrl: 'lf-account-info.component.scss',
})
export class LfAccountInfo {
  // ==== OWN PROPERTIES SECTION ==================================================================
  // ---- Private  --------------------------------------------------------------------------------
  private log = new LfLoggerService('LfAccountInfo').logger;
  private currentAnimationIndex = 0;
  private router: HTMLIonRouterElement;

  // ---- Protected -------------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE =====================================================================
  @Element() lfAccountInfoEl: HTMLElement;

  // ==== State() VARIABLES SECTION ===============================================================
  @State() selectedDevice: LfDevice = lfAppState.accountDeviceSelected;
  @State() userLoaded = false;
  @State() loadingUser = false;
  @State() loadingDevices = false;
  @State() user = lfAppState.user;
  @State() registeredDevices = lfAppState.registeredDevices;
  @State() isMobileLayout: boolean = lfAppState.mobileLayout;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ====================================================
  @Prop() activeAccountDevice: string = null;
  @Prop() animateInContent: boolean = false;

  // ==== EVENTS SECTION ==========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================
  // - -  componentWillLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');

    if (!this.user || !lfAppState.registeredDevices) {
      this.loadingUser = true;

      await initializeData().then(() => {
        this.loadingUser = false;
      });
    }

    this.selectedDevice = lfAppState.accountDeviceSelected;
  }

  // - -  componentDidLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad() {
    this.log.debug('componentWillLoad');

    await customElements.whenDefined('ion-router');
    this.router = document.querySelector('ion-router');
  }

  // ==== LISTENERS SECTION =======================================================================
  @Listen('_userUpdated', { target: 'document' })
  onUserUpdated(): void {
    this.user = lfAppState.user;
  }

  @Listen('_layoutUpdated', { target: 'document' })
  onWindowResized(): void {
    this.log.debug('onWindowResized');
    this.isMobileLayout = lfAppState.mobileLayout;
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ==================================================

  // ==== LOCAL METHODS SECTION ==================================================================
  private formattedName(): string {
    this.log.debug('formattedName');

    if (lfAppState.user.firstName && lfAppState.user.lastName) {
      const { firstName, lastName } = lfAppState.user;

      return `${firstName} ${lastName}`;
    } else {
      return '';
    }
  }

  private goToDevicePage(device: LfDevice) {
    this.log.info('goToDevicePage');
    lfAppState.accountDeviceSelected = device;
    this.router.push(`/account/devices/${device.name.replace(' ', '-').toLowerCase()}`, 'forward');
  }

  private onLogout() {
    this.log.info('onLogout');

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    lfAppState;
    this.router.push('/login', 'forward');
  }

  private getAnimationIndex(): number {
    return this.animateInContent ? this.currentAnimationIndex++ : 0;
  }

  // ==== RENDERING SECTION ======================================================================
  private renderRegisteredDevices() {
    this.log.debug('renderRegisteredDevices');

    return (
      <div class="lf-account-info--details-container registered-devices ">
        <div class="lf-account-info--field-label animate-in lf-pad-left" style={{ '--animation-order': this.getAnimationIndex() } as any}>
          {lfAppState.registeredDevices?.length ? 'Registered Devices' : 'Devices'}
        </div>
        <div class="lf-account-info--field-value">{this.renderDeviceList()}</div>
      </div>
    );
  }

  private renderDeviceList() {
    if (lfAppState.registeredDevices?.length) {
      return (
        <lf-list>
          {lfAppState.registeredDevices.map((device: LfDevice) => {
            return (
              <lf-list-item
                class="animate-in"
                onClick={() => {
                  this.goToDevicePage(device);
                }}
                active={this.selectedDevice === device}
                style={{ '--animation-order': this.getAnimationIndex() } as any}
              >
                <div class="lf-account-info--field-value">{device.name}</div>
                <img class="next-view-icon" slot="end" src="/assets/icons/chevron-right.svg" />
              </lf-list-item>
            );
          })}
        </lf-list>
      );
    } else {
      return <div class="lf-account-info--field-value no-device lf-pad-left">No device</div>;
    }
  }

  private renderUserInfo() {
    this.log.debug('renderUserInfo');

    const layoutClassName = this.isMobileLayout ? 'lf-layout--mobile' : 'lf-layout--desktop';
    return (
      <div class={`lf-account-info lf-account-info--content-container ${layoutClassName}`}>
        <div class="lf-account-info--user-info">
          <h3 class="lf-account-info--user-name lf-account-info--details-container lf-pad-left animate-in" style={{ '--animation-order': this.getAnimationIndex() } as any}>
            {this.formattedName()}
          </h3>

          <lf-info-item class="lf-pad-left" label="Email" value={lfAppState.user.email} animationOrder={this.getAnimationIndex()} />

          {this.renderRegisteredDevices()}
          {!this.isMobileLayout ? this.renderRegisterDeviceLink() : ''}
          <div class="lf-account-info--action-links-container lf-pad-left">
            {this.isMobileLayout && !lfAppState.registeredDevices?.length ? this.renderRegisterDeviceLink() : ''}
          </div>
        </div>

        <div class="divider animate-in" style={{ '--animation-order': this.getAnimationIndex() } as any}></div>

        <div class="lf-account-info--action-links-container lf-pad-left">
          {this.isMobileLayout && lfAppState.registeredDevices?.length > 0 ? this.renderRegisterDeviceLink() : ''}

          <p class="action-link animate-in" style={{ '--animation-order': this.getAnimationIndex() } as any}>
            Change password
          </p>
          <p
            class="action-link animate-in"
            style={{ '--animation-order': this.getAnimationIndex() } as any}
            onClick={() => {
              this.onLogout();
            }}
          >
            Log Out
          </p>
        </div>
      </div>
    );
  }

  private renderRegisterDeviceLink() {
    return (
      <ion-router-link class="register-device-link action-link animate-in" style={{ '--animation-order': this.getAnimationIndex() } as any} href="/register">
        {lfAppState.registeredDevices?.length ? 'Register device' : 'Add device'}
      </ion-router-link>
    );
  }

  // - -  render Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - - - - - - - - -
  render() {
    this.log.debug('render');
    if (lfAppState.user && !this.loadingUser) {
      return this.renderUserInfo();
    } else {
      return <lf-loading-message />;
    }
  }
}
