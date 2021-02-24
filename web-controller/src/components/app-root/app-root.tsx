// ==== Library Imports =======================================================
import { Component, h, Element, Listen, State } from '@stencil/core';
import { defineCustomElements } from '../../assets/js/custom-elements';

// ==== App Imports ===========================================================
import { LfViewportBreakpoint } from '../../shared/interfaces/lf-web-controller.interface';
import lfAppState, { initializeData } from '../../store/lf-app-state.store';
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

  private readonly routesWithoutNav = ['/login', '/register', '/scene-setup'];
  private readonly viewportBreakpoint: Array<LfViewportBreakpoint> = LF_VIEWPORT_BREAKPOINTS;

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() appRootEl: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() viewport: LfViewportSize;
  @State() isMobileLayout: boolean;
  @State() currentRoute: string = window.location.pathname;
  @State() experiences = lfAppState.experiences;
  @State() registeredDevices = lfAppState.registeredDevices;
  @State() appInitialized = lfAppState.deviceDataInitialized || lfAppState.appDataInitialized;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================

  // ==== LISTENERS SECTION =====================================================================

  @Listen('_playbackStateUpdated', { target: 'document' })
  async onPlaybackStateUpdated(): Promise<void> {
    this.log.debug('_playbackStateUpdated');
    this.experiences = lfAppState.playbackState.projectMetadata;
    this.registeredDevices = lfAppState.registeredDevices;
  }
  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - -
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');
    defineCustomElements();

    this.currentRoute = window.location.pathname;

    if (!lfRemoteApiAuth.isLoggedIn()) {
      window.location.pathname = '/login';
    } else if (!lfAppState.user) {
      lfRemoteApiAuth.getCurrentUser().then(response => {
        if (response.response.status == 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');

          if (window.location.pathname !== '/login') {
            window.location.pathname = '/login';
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

    await customElements.whenDefined('lf-viewport-size-publisher');
    const viewportSizePubElem = document.querySelector('lf-viewport-size-publisher');
    const viewportBreakpoint = (await viewportSizePubElem.getCurrentViewportBreakPoints()) as LfViewportBreakpoint;
    const viewportSize = (await viewportSizePubElem.getCurrentSize()) as LfViewportSize;
    this.isMobileLayout = lfAppState.mobileLayout = LF_MOBILE_QUERIES.includes(viewportSize);
    lfAppState.viewportSize = viewportBreakpoint;
  }

  // ==== LISTENERS SECTION =====================================================================
  @Listen('_layoutUpdated', { target: 'document' })
  onWindowResized(): void {
    this.log.debug('onWindowResized');
    this.isMobileLayout = lfAppState.mobileLayout;
  }

  // ==== PUBLIC METHODS API - @Method() SECTION =================================================

  // ==== LOCAL METHODS SECTION ==================================================================
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
      return [lfAppState.experiences ? <lf-now-playing /> : '', <lf-tab-bar-navigation currentRoute={this.currentRoute} />];
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

  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');

    return (
      <ion-app>
        {this.renderMobileToolbar()}
        <div class="lf-app--content-container">
          {this.renderDesktopSideMenu()}
          <ion-content class="ion-padding">
            <lf-router onLfRouteUpdate={ev => this.routeDidChange(ev)} />
          </ion-content>
        </div>
        {this.renderMobileFooter()}

        <lf-viewport-size-publisher sizes={this.viewportBreakpoint} />
      </ion-app>
    );
  }
}
