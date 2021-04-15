// ==== Library Imports =======================================================
import { Component, h, Element, Listen, State } from '@stencil/core';
import { defineCustomElements } from '../../assets/js/custom-elements';
import { toastController } from '@ionic/core';

// ==== App Imports ===========================================================
import { LfViewportBreakpoint } from '../../shared/interfaces/lf-web-controller.interface';
import lfAppState, { initializeData, initializeDeviceSelected } from '../../store/lf-app-state.store';
import { LfViewportSize } from '../../shared/enums/lf-viewport-query-sizes.enum';
import { LF_MOBILE_QUERIES, LF_VIEWPORT_BREAKPOINTS } from '../../shared/constants/lf-viewport-breakpoints.constant';
import lfLoggerService from '../../shared/services/lf-logger.service';
import lfRemoteApiAuth from '../../shared/services/lf-remote-api/lf-remote-api-auth.service';
import lfRemoteApiAlignmentService from '../../shared/services/lf-remote-api/lf-remote-api-alignment.service';
import { LF_ROUTES } from '../../shared/constants/lf-routes.constant';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
})
export class AppRoot {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new lfLoggerService('AppRoot').logger;
  private router: HTMLIonRouterElement;

  private readonly routesWithoutNav = this.getRoutesWithoutNav();
  private readonly viewportBreakpoint: Array<LfViewportBreakpoint> = LF_VIEWPORT_BREAKPOINTS;
  private readonly refreshableRoutes = ['/', '/account', '/control'];

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() appRootEl: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() viewport: LfViewportSize;
  @State() isMobileLayout: boolean;
  @State() currentRoute: string = window.location.pathname;
  @State() projects = lfAppState.projects;
  @State() registeredDevices = lfAppState.registeredDevices;
  @State() refreshing = false;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  // ==== EVENTS SECTION ========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - -
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration?.active) {
          navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload());
        }
      });
    }

    defineCustomElements();

    this.currentRoute = window.location.pathname;

    if (lfRemoteApiAuth.isLoggedIn()) {
      await initializeData();
      initializeDeviceSelected();
    }
  }

  // - -  componentDidLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad() {
    this.log.debug('componentDidLoad');

    await customElements.whenDefined('lf-viewport-size-publisher');
    const viewportSizePubElem = document.querySelector('lf-viewport-size-publisher');
    const viewportSize = (await viewportSizePubElem.getCurrentSize()) as LfViewportSize;
    this.isMobileLayout = lfAppState.mobileLayout = LF_MOBILE_QUERIES.includes(viewportSize);
    await customElements.whenDefined('ion-router');
    this.router = document.querySelector('ion-router');

    if (!lfRemoteApiAuth.isLoggedIn()) {
      this.router.push('/login');
    }
  }

  // ==== LISTENERS SECTION =====================================================================

  @Listen('_playbackStateUpdated', { target: 'document' })
  async onPlaybackStateUpdated(): Promise<void> {
    this.log.debug('_playbackStateUpdated');
    this.projects = lfAppState.playbackState.projectMetadata;
    this.registeredDevices = lfAppState.registeredDevices;
  }

  @Listen('beforeunload', { target: 'window' })
  onUnLoadEvent() {
    if (lfAppState.deviceSelected?.serialNumber) {
      lfRemoteApiAlignmentService.oaklightOff(lfAppState.deviceSelected.serialNumber).then().catch();
    }
  }
  @Listen('_layoutUpdated', { target: 'document' })
  onWindowResized(): void {
    this.log.debug('onWindowResized');
    this.isMobileLayout = lfAppState.mobileLayout;
  }

  @Listen('swUpdate', { target: 'window' })
  async onServiceWorkerUpdate() {
    const registration = await navigator.serviceWorker.getRegistration();

    if (!registration?.waiting) {
      // If there is no waiting registration, this is the first service
      // worker being installed.
      return;
    }

    const toast = await toastController.create({
      message: 'New version available.',
      position: 'top',
      color: 'primary',
      buttons: [{ text: 'Reload', role: 'reload' }],
      duration: 0,
    });

    await toast.present();

    const { role } = await toast.onWillDismiss();

    if (role === 'reload') {
      registration.waiting.postMessage('skipWaiting');
    }
  }

  // ==== PUBLIC METHODS API - @Method() SECTION =================================================

  // ==== LOCAL METHODS SECTION ==================================================================
  private getRoutesWithoutNav() {
    this.log.debug('getRoutesWithoutNav');
    const routes = LF_ROUTES;
    const routesWithoutNav = Object.keys(routes)
      .filter((routeName) => {
        return !routes[routeName].displayAppNav;
      })
      .map((routeName) => {
        return '/' + routes[routeName].url.split('/')[1];
      });

    return routesWithoutNav;
  }

  private async doRefresh(ev: Event) {
    this.log.info('doRefresh');
    ev.preventDefault();
    ev.stopPropagation();
    console.log(ev);

    try {
      this.refreshing = true;
      await initializeData();
      initializeDeviceSelected();
      if (this.isMobileLayout && typeof (ev.target as HTMLIonRefresherElement)?.complete === 'function')
        (ev.target as HTMLIonRefresherElement)?.complete();
    } catch (e) {
      console.warn(e);
    } finally {
      this.refreshing = false;
    }
  }

  private routeDidChange(event: CustomEvent) {
    this.log.debug('routeDidChange', event.detail);
    this.currentRoute = event.detail || window.location.pathname;
  }

  // ==== RENDERING SECTION =====================================================================
  private renderMobileToolbar() {
    this.log.debug('renderMobileToolbar');
    if (this.isMobileLayout && !this.hideAppBars()) {
      return <lf-header-toolbar currentRoute={this.currentRoute} />;
    }
  }

  private renderMobileFooter() {
    this.log.debug('renderMobileFooter');
    if (this.isMobileLayout && !this.hideAppBars()) {
      return [
        lfAppState.projects ? <lf-now-playing /> : '',
        <lf-tab-bar-navigation currentRoute={this.currentRoute} />,
      ];
    }
  }

  private renderDesktopSideMenu() {
    this.log.debug('renderDesktopSideMenu');
    console.log(this.currentRoute);
    if (!this.isMobileLayout && !this.hideAppBars()) {
      return <lf-side-menu />;
    }
  }

  private hideAppBars(): boolean {
    return this.routesWithoutNav.includes(`/${this.currentRoute.split('/')[1]}`);
  }

  public renderAppRefresher() {
    if (this.isMobileLayout) {
      return (
        <ion-refresher
          slot="fixed"
          onIonRefresh={(ev) => this.doRefresh(ev)}
          pullMin={150}
          pullMax={205}
          pullFactor={0.15}
        >
          <ion-refresher-content
            pullingIcon="chevron-down-circle-outline"
            pullingText="Pull to refresh"
            refreshingSpinner="crescent"
            refreshingText="Refreshing..."
          ></ion-refresher-content>
        </ion-refresher>
      );
    } else {
      return (
        <div class="desktop-refresher-wrapper">
          {!this.refreshing ? (
            <ion-icon
              color="medium"
              name="reload-circle-outline"
              size="large"
              onClick={(ev) => {
                this.doRefresh(ev);
              }}
            ></ion-icon>
          ) : (
            <ion-spinner color="primary" name="crescent"></ion-spinner>
          )}
        </div>
      );
    }
  }

  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    try {
      this.log.debug('render');
      const pageHasRefresher =
        this.currentRoute === '/' || this.refreshableRoutes.includes(`/${this.currentRoute.split('/')[1]}`);

      return (
        <ion-app>
          {this.renderMobileToolbar()}
          <div class="lf-app--content-container">
            {this.renderDesktopSideMenu()}
            <ion-content class="ion-padding">
              <lf-router onLfRouteUpdate={(ev) => this.routeDidChange(ev)} />

              {pageHasRefresher && this.renderAppRefresher()}
            </ion-content>
          </div>
          {this.renderMobileFooter()}

          <lf-viewport-size-publisher sizes={this.viewportBreakpoint} />
        </ion-app>
      );
    } catch (error) {
      if (error?.message && error?.code) {
        return <lf-error-message errorCode={error?.code} errorMessage={error?.message} hasResetButton={true} />;
      } else {
        return <lf-error-message hasResetButton={true} />;
      }
    }
  }
}
