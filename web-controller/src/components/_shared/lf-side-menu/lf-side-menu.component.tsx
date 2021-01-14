// ==== Library Imports =======================================================
import { Component, Element, h, Listen, State } from '@stencil/core';
import { modalController } from '@ionic/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import { LfAppRoute, LfDevice } from '../../../shared/interfaces/lf-web-controller.interface';
import state from '../../../store/lf-app-state.store';
import { LF_ROUTES } from '../../../shared/constants/lf-routes.constant';
import lfAppStateStore from '../../../store/lf-app-state.store';

@Component({
  tag: 'lf-side-menu',
  styleUrl: 'lf-side-menu.component.scss',
})
export class LfSideMenu {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('LfSideMenu').logger;
  private routes: Array<LfAppRoute> = LF_ROUTES;

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() deviceInfo: LfDevice;
  @State() pathnameActive: string = '/';
  @State() registeredDevices: Array<LfDevice> = lfAppStateStore.registeredDevices;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  // ==== EVENTS SECTION ========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - -
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');

    this.updateRoute();

    this.routes = this.routes
      .filter((route: LfAppRoute) => {
        return route.inPrimaryNav;
      })
      .sort((a: LfAppRoute, b: LfAppRoute) => a.order - b.order);
  }

  // ==== LISTENERS SECTION =====================================================================
  @Listen('_registeredDevicesUpdated', { target: 'document' })
  onRegisteredDevicesUpdated() {
    this.log.info('_registeredDevicesUpdated');
    this.registeredDevices = lfAppStateStore.registeredDevices;
  }

  // ==== PUBLIC METHODS API - @Method() SECTION =================================================
  // ==== LOCAL METHODS SECTION ==================================================================
  private updateRoute(): void {
    this.log.debug('updateRoute');
    this.pathnameActive = '/' + window.location.pathname.split('/')[1] || '/';
  }

  private async openDeviceSelector(): Promise<void> {
    this.log.debug('openDeviceSelector');

    const modal = await modalController.create({
      component: 'lf-device-selector-modal',
      cssClass: 'lf-device-selector--modal',
    });
    await modal.present();
  }

  // ==== RENDERING SECTION ======================================================================
  private renderMenuHeader() {
    this.log.debug('renderMenuHeader');

    const deviceDisplayName = state?.deviceSelected?.name || 'No Device';

    return (
      <div class="menu-header--inner">
        <img slot="start" class="menu-header--logomark" src="/assets/images/logos/Logomark White.svg" alt="Lightform"></img>
        <h3 class="menu-header--device-title">{deviceDisplayName}</h3>
        {this.registeredDevices?.length ? (
          <div class="menu-header--link-button" onClick={() => this.openDeviceSelector()}>
            change
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }

  private renderMenuNavigation() {
    this.log.debug('renderMenuNavigation');

    return (
      <div class="menu-nav--inner">
        {this.routes.map((route: LfAppRoute) => {
          return (
            <ion-button
              href={route.url}
              onClick={() => {
                this.updateRoute();
              }}
            >
              <div class={`lf-navbar-button--content ${pathActiveClass(this.pathnameActive, route.url)}`}>
                <img class="lf-navbar--nav-icon" src={route.navbarIconUrl} alt={route.label}></img>
                <ion-label class="lf-navbar--label">{route.label}</ion-label>
              </div>
            </ion-button>
          );
        })}
      </div>
    );

    function pathActiveClass(activePathname: string, pathname: string = ''): string {
      return activePathname === pathname ? 'active-route' : '';
    }
  }

  private renderNowPlaying() {
    this.log.debug('renderNowPlaying');

    const imgSrc = state?.sceneSelected?.sceneImgURl || '/assets/icons/image-placeholder-white.svg';
    const imgClassName = !state?.sceneSelected?.sceneImgURl ? 'placeholder' : '';
    return (
      <div class="now-playing--inner">
        <div class="lf-now-playing--img-wrapper">
          <img src={imgSrc} class={`lf-now-playing--img ${imgClassName}`} />
        </div>
        <div class="lf-now-playing--text">
          <div class="lf-now-playing--hero truncate-text">NOW PLAYING ON OBJECT</div>
          <div class="lf-now-playing--scene-title truncate-text">{state?.sceneSelected?.name || '...'}</div>
        </div>
      </div>
    );
  }

  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - -
  render() {
    this.log.debug('render');

    return (
      <div class="lf-side-menu">
        <div class="lf-side-menu--header-container">{this.renderMenuHeader()}</div>
        <div class="lf-side-menu--navigation-container">{this.renderMenuNavigation()}</div>
        <div class="lf-side-menu--now-playing-container">{this.renderNowPlaying()}</div>
      </div>
    );
  }
}
