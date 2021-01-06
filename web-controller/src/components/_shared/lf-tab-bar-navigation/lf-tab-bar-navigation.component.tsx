// ==== Library Imports =======================================================
import { Component, Element, h, Prop } from '@stencil/core';

// ==== App Imports ===========================================================
import { LF_ROUTES } from '../../../shared/constants/lf-routes.constant';
import { LfAppRoute } from '../../../shared/interfaces/lf-web-controller.interface';
import LfLoggerService from '../../../shared/services/lf-logger.service';

@Component({
  tag: 'lf-tab-bar-navigation',
  styleUrl: 'lf-tab-bar-navigation.component.scss',
  shadow: false,
  scoped: true,
})
export class LfTabBarNavigation {
  // ==== OWN PROPERTIES SECTION =================================================================
  // ---- Private  -------------------------------------------------------------------------------
  private log = new LfLoggerService('LfTabBarNavigation').logger;
  private routes: Array<LfAppRoute> = LF_ROUTES;

  // ---- Protected -------------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE =====================================================================
  @Element() lfTabBarNavigationEl: HTMLElement;

  // ==== State() VARIABLES SECTION ===============================================================

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

  // ==== PUBLIC METHODS API - @Method() SECTION ==================================================

  // ==== LOCAL METHODS SECTION ===================================================================
  private updateRoute(): void {
    this.log.info('updateRoute');

    this.currentRoute = '/' + window.location.pathname.split('/')[1] || '/';
  }

  // ==== RENDERING SECTION =======================================================================
  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');

    return [
      <ion-tab-bar slot="bottom">
        {this.routes.map((route: LfAppRoute) => {
          return (
            <ion-button
              href={route.url}
              onClick={() => {
                this.updateRoute();
              }}
            >
              <div class={`tab-bar-button--content ${pathActiveClass(this.currentRoute, route.url)}`}>
                <img class="lf-tab-bar--nav-icon" src={route.navbarIconUrl} alt={route.label}></img>
                <ion-label class="lf-tab-bar--label">{route.label}</ion-label>
              </div>
            </ion-button>
          );
        })}
      </ion-tab-bar>,
    ];

    function pathActiveClass(activePathname: string, pathname: string = ''): string {
      return activePathname === pathname ? 'active-tab-route' : '';
    }
  }
}
