// ==== Library Imports =======================================================
import { Component, h, Element, Listen, State } from '@stencil/core';
import { defineCustomElements } from '../../assets/js/custom-elements';

// ==== App Imports ===========================================================
import { LfAppRoute, LfDevice, LfViewportBreakpoint } from '../../shared/interfaces/lf-web-controller.interface';
import lfAppState, { initializeData } from '../../store/lf-app-state.store';
import { LF_ROUTES } from '../../shared/constants/lf-routes.constant';
import { LfViewportSize } from '../../shared/enums/lf-viewport-query-sizes.enum';
import { LF_MOBILE_QUERIES, LF_VIEWPORT_BREAKPOINTS } from '../../shared/constants/lf-viewport-breakpoints.constant';
import lfLoggerService from '../../shared/services/lf-logger.service';
import lfRemoteApiAuth from '../../shared/services/lf-remote-api/lf-remote-api-auth.service';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
})
export class AppRoot {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new lfLoggerService('AppRoot').logger;
  private routes: Array<LfAppRoute> = LF_ROUTES;
  private framelessRoutes = ['/login', '/register'];
  private router: HTMLIonRouterElement;

  // ---- Protected -----------------------------------------------------------------------------
  protected static viewportBreakpoint: Array<LfViewportBreakpoint> = LF_VIEWPORT_BREAKPOINTS;

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() appRootEl: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() redirectToLogin = false;
  @State() viewport: LfViewportSize;
  @State() isMobileLayout: boolean;
  @State() deviceSelected: LfDevice = lfAppState.deviceSelected;
  @State() currentRoute: string = window.location.pathname;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - -
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');
    defineCustomElements();

    this.currentRoute = window.location.pathname;

    if (!lfRemoteApiAuth.isLoggedIn()) {
      this.redirectToLogin = true;
    } else if (!lfAppState.user) {
      lfRemoteApiAuth.getCurrentUser().then(response => {
        if (response.response.status == 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');

          if (window.location.pathname !== '/login') {
            this.redirectToLogin = true;
          }
        } else {
          initializeData();
        }
      });
    } else {
      initializeData();
    }
  }

  // - -  componentDidLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad() {
    this.log.debug('componentDidLoad');
    this.router = await document.querySelector('ion-router').componentOnReady();

    await customElements.whenDefined('lf-viewport-size-publisher');
    const viewportSizePubElem = document.querySelector('lf-viewport-size-publisher');
    const viewportSize = (await viewportSizePubElem.getCurrentSize()) as LfViewportSize;
    this.isMobileLayout = lfAppState.mobileLayout = LF_MOBILE_QUERIES.includes(viewportSize);

    if (this.redirectToLogin) {
      this.log.warn('user not logged in');
      this.redirectToLogin = false;
      this.router.push('/login');
    }
  }

  // ==== LISTENERS SECTION =====================================================================
  @Listen('_layoutUpdated', { target: 'document' })
  onWindowResized(): void {
    this.log.debug('onWindowResized');
    this.isMobileLayout = lfAppState.mobileLayout;
  }

  // ==== PUBLIC METHODS API - @Method() SECTION =================================================

  // ==== LOCAL METHODS SECTION ==================================================================
  private onRouteChanged(event: CustomEvent) {
    this.log.debug('onRouteChanged', event.detail.to);
    this.currentRoute = event.detail.to;
  }

  // ==== RENDERING SECTION =====================================================================
  private renderRouter() {
    this.log.debug('renderRouter');

    return [
      <ion-router useHash={false} onIonRouteDidChange={event => this.onRouteChanged(event)}>
        {this.routes.map(routeObject => {
          const beforeEnterCallback =
            routeObject.url !== '/login'
              ? this.isLoggedInGuard
              : () => {
                  return true;
                };

          return <ion-route url={routeObject.url} component={routeObject.component} beforeEnter={beforeEnterCallback}></ion-route>;
        })}
      </ion-router>,
      <ion-nav />,
    ];
  }

  private renderMobileToolbar() {
    this.log.debug('renderMobileToolbar');
    if (this.isMobileLayout && !this.framelessRoutes.includes(this.currentRoute)) {
      return <lf-header-toolbar currentRoute={this.currentRoute}/>;
    }
  }

  private renderMobileFooter() {
    this.log.debug('renderMobileFooter');
    if (this.isMobileLayout && !this.framelessRoutes.includes(this.currentRoute)) {
      return [<lf-now-playing />, <lf-tab-bar-navigation currentRoute={this.currentRoute} />];
    }
  }

  private renderDesktopSideMenu() {
    this.log.debug('renderDesktopSideMenu');
    if (!this.isMobileLayout && !this.framelessRoutes.includes(this.currentRoute)) {
      return <lf-side-menu />;
    }
  }

  private async isLoggedInGuard() {
    const isLoggedIn = lfRemoteApiAuth.isLoggedIn();

    if (isLoggedIn) {
      return true;
    } else {
      return { redirect: '/login' };
    }
  }

  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');

    return (
      <ion-app>
        {this.renderMobileToolbar()}
        <div class="lf-app--content-container">
          {this.renderDesktopSideMenu()}
          <ion-content class="ion-padding">{this.renderRouter()}</ion-content>
        </div>
        {this.renderMobileFooter()}

        <lf-viewport-size-publisher sizes={AppRoot.viewportBreakpoint} />
      </ion-app>
    );
  }
}
