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

  // ---- Protected -----------------------------------------------------------------------------
  protected static viewportBreakpoint: Array<LfViewportBreakpoint> = LF_VIEWPORT_BREAKPOINTS;

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() appRootEl: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() redirectToLogin = false;
  @State() viewport: LfViewportSize;
  @State() isMobileLayout: boolean;
  @State() deviceSelected: LfDevice = lfAppState.deviceSelected;
  @State() currentRoute: string;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');
    defineCustomElements();

    this.currentRoute = window.location.pathname;

    if (!lfAppState.user) {
      await lfRemoteApiAuth.getCurrentUser().then(response => {

        if (response.response.status == 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');

          if (window.location.pathname !== "/login"){
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

  // - -  componentWillLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad() {
    this.log.debug('componentDidLoad');

    await customElements.whenDefined('lf-viewport-size-publisher');
    const viewportSizePubElem = document.querySelector('lf-viewport-size-publisher');
    const viewportSize = (await viewportSizePubElem.getCurrentSize()) as LfViewportSize;
    this.isMobileLayout = lfAppState.mobileLayout = LF_MOBILE_QUERIES.includes(viewportSize);
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
    this.currentRoute = event.detail.to
  }

  // ==== RENDERING SECTION =====================================================================
  private renderRouter() {
    this.log.debug('renderRouter');

    return [
      <ion-router useHash={false} onIonRouteDidChange={(event) => this.onRouteChanged(event)}>
        
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
    if (this.isMobileLayout && this.currentRoute !== "/login") {
      return <lf-header-toolbar />;
    }
  }

  private renderMobileFooter() {
    if (this.isMobileLayout && this.currentRoute !== '/login') {
      return [<lf-now-playing />, <lf-tab-bar-navigation currentRoute={this.currentRoute} />];
    }
  }

  private renderDesktopSideMenu() {
    if (!this.isMobileLayout && this.currentRoute !== "/login") {
      return <lf-side-menu />;
    }
  }

  private async isLoggedInGuard() {
    const isLoggedIn = await lfRemoteApiAuth.isLoggedIn();

    if (isLoggedIn) {
      return true;
    } else {
      return { redirect: '/login' };
    }
  }

  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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
// End Component

// ================   MOCK DATA ========================== //
// const mockSceneList = [
//   {
//     sceneImgURl: 'http://www.fillmurray.com/120/120',
//     title: 'Pachamama Default',
//     description: 'This is a placeholder text for a one line summary that paints a picture of this video for the user.',
//     duration: 1000,
//     id: Math.random(),
//   },

//   {
//     sceneImgURl: 'http://www.fillmurray.com/120/120',
//     title: 'Deep Mood',
//     description: 'This is a placeholder text for a one line summary that paints a picture of this video for the user.',
//     duration: 1000,
//     id: Math.random(),
//   },

//   {
//     sceneImgURl: 'http://www.fillmurray.com/120/120',
//     title: 'THIS IS A REALLY LONG TITLE TO TEST IT OUT SO HERE WE GO',
//     description:
//       'LONG - This is a placeholder text for a one line summary that paints a picture of this video for the user. LONG - This is a placeholder text for a one line summary that paints a picture of this video for the user. ',
//     duration: 1000,
//     id: Math.random(),
//   },

//   {
//     sceneImgURl: 'http://www.fillmurray.com/120/120',
//     title: 'Deep Mood',
//     description:
//       'LONG - This is a placeholder text for a one line summary that paints a picture of this video for the user. LONG - This is a placeholder text for a one line summary that paints a picture of this video for the user. ',
//     duration: 1000,
//     id: Math.random(),
//   },
// ];

// const mockSceneListBeta = mockSceneList.map(({ id, ...rest }) => {
//   id += Math.random();
//   return { id, ...rest };
// });

// const mockExperiences = [
//   {
//     title: 'Pachamama',
//     scenes: mockSceneList,
//   },
//   {
//     title: 'Ambience',
//     scenes: mockSceneListBeta,
//   },
//   {
//     title: 'Other Inputs',
//     scenes: [
//       {
//         title: 'Creator',
//       },
//       {
//         title: 'HDMI 1',
//       },
//       {
//         title: 'HDMI 2',
//       },
//     ],
//   },
// ];

// const mockDevices: Array<LfDevice> = [
//   {
//     name: 'Jolly Banshee',
//     serial: '0fasdf0',
//     status: false,
//     deviceType: 'LF2+',
//     firmwareVersion: '0.1.1.1.XX',
//     ipAddress: '127.0.0.10',
//     resolution: { width: 1920, height: 1080, fps: 60 },
//     lenseType: 'LF2+ Lense',
//     lastOnline: new Date('now'),
//   },
//   {
//     name: 'Gentle Goat',
//     serial: '0fasdf1',
//     status: false,
//     deviceType: 'LF2+',
//     firmwareVersion: '0.1.1.1.XX',
//     ipAddress: '127.0.0.10',
//     resolution: { width: 1920, height: 1080, fps: 60 },
//     lenseType: 'LF2+ Lense',
//     lastOnline: new Date('now'),
//   },
//   {
//     name: 'Silly Banana',
//     serial: '666666',
//     status: false,
//     deviceType: 'LF2+',
//     firmwareVersion: '0.1.1.1.XX',
//     ipAddress: '127.0.0.10',
//     resolution: { width: 1920, height: 1080, fps: 60 },
//     lenseType: 'LF2+ Lense',
//     lastOnline: new Date('now'),
//   },
//   {
//     name: 'Ineffable Badger',
//     serial: '22222',
//     status: false,
//     deviceType: 'LF2+',
//     firmwareVersion: '0.1.1.1.XX',
//     ipAddress: '127.0.0.10',
//     resolution: { width: 1920, height: 1080, fps: 60 },
//     lenseType: 'LF2+ Lense',
//     lastOnline: new Date('now'),
//   },
//   {
//     name: 'Angry Banana',
//     serial: '55555',
//     status: false,
//     deviceType: 'LF2+',
//     firmwareVersion: '0.1.1.1.XX',
//     ipAddress: '127.0.0.10',
//     resolution: { width: 1920, height: 1080, fps: 60 },
//     lenseType: 'LF2+ Lense',
//     lastOnline: new Date('now'),
//   },
// ];

// const mockUser: LfUser = {
//   firstName: 'Tony',
//   lastName: 'Stark',
//   email: 'tony@starkindustries_THIS_IS_REALLY_NOW_OK.com',
// };
