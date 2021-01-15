// ==== Library Imports =======================================================
import { Component, Element, h, Listen, Prop, State } from '@stencil/core';

// ==== App Imports ===========================================================
import { LF_ROUTES } from '../../../shared/constants/lf-routes.constant';
import { LfAppRoute, LfDevice } from '../../../shared/interfaces/lf-web-controller.interface';
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfAppStateStore from '../../../store/lf-app-state.store';

@Component({
  tag: 'lf-navigation-buttons',
  styleUrl: 'lf-navigation-buttons.component.scss',
  shadow: false,
  scoped: true,
})
export class LfNavigationButtons {
  // ==== OWN PROPERTIES SECTION =================================================================
  // ---- Private  -------------------------------------------------------------------------------
  private log = new LfLoggerService('LfNavigationButtons').logger;
  private routes: Array<LfAppRoute> = LF_ROUTES;

  // ---- Protected -------------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE =====================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION ===============================================================
  @State() deviceSelected: LfDevice = lfAppStateStore.deviceSelected;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ====================================================
  @Prop() currentRoute: string;

  // ==== EVENTS SECTION ==========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================
  // - -  componentWillLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');

    this.updateRoute();
    this.routes = this.routes
      .filter((route: LfAppRoute) => {
        return route.inPrimaryNav;
      })
      .sort((a: LfAppRoute, b: LfAppRoute) => a.order - b.order);
  }

  // ==== LISTENERS SECTION =======================================================================
  @Listen('_deviceSelected', { target: 'document' })
  onDeviceSelected() {
    this.log.debug('onDeviceSelected');

    this.deviceSelected = lfAppStateStore.deviceSelected;
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ==================================================

  // ==== LOCAL METHODS SECTION ===================================================================
  private updateRoute(): void {
    this.log.info('updateRoute');

    this.currentRoute = '/' + window.location.pathname.split('/')[1] || '/';
    console.log(this.currentRoute);
  }

  private formatUrlPath(url: string): string {
    this.log.debug('formatUrlPath');

    const formattedUrl = url.replace(':deviceName', this.deviceSelected?.name).replace(' ', '-').toLowerCase();

    return formattedUrl;
  }

  // ==== RENDERING SECTION =======================================================================
  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');

    return (
      <div class="lf-navigation-buttons--container">
        {this.routes.map((route: LfAppRoute) => {
          return (
            <ion-button
              href={this.formatUrlPath(route.url)}
              onClick={() => {
                this.updateRoute();
              }}
            >
              <div class={`lf-navigation-button--content ${pathActiveClass(this.currentRoute, route.url)}`}>
                <img class="lf-navigation-button--nav-icon" src={route.navbarIconUrl} alt={route.label}></img>
                <ion-label class="lf-navigation-button--label">{route.label}</ion-label>
              </div>
            </ion-button>
          );
        })}
      </div>
    );

    function pathActiveClass(activePathname: string, pathname: string = ''): string {
      return activePathname.split('/')[1] === pathname.split('/')[1] ? 'active-tab-route' : '';
    }
  }
}
