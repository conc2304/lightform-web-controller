// ==== Library Imports =======================================================
import { Component, Element, h, Event, EventEmitter } from '@stencil/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import { LfAppRoute, LF_ROUTES } from '../../../shared/constants/lf-routes.constant';
import lfRemoteApiAuthService from '../../../shared/services/lf-remote-api/lf-remote-api-auth.service';
import { NavigationHookOptions } from '@ionic/core/dist/types/components/route/route-interface';

@Component({
  tag: 'lf-router',
})
export class LfRouter {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('LfRouter').logger;
  private routes: Array<LfAppRoute> = Object.values(LF_ROUTES);

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================

  // ==== EVENTS SECTION ============================
  @Event() lfRouteUpdate: EventEmitter<string>;

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // ==== LISTENERS SECTION =====================================================================
  // ==== PUBLIC METHODS API - @Method() SECTION =================================================

  // ==== LOCAL METHODS SECTION ==================================================================
  private async isLoggedInGuard(): Promise<boolean | NavigationHookOptions> {
    // no log here
    const isLoggedIn = lfRemoteApiAuthService.isLoggedIn();

    if (isLoggedIn) {
      return true;
    } else {
      return { redirect: '/login' };
    }
  }

  private onRouteChanged(event: CustomEvent) {
    this.log.debug('onRouteChanged');
    this.lfRouteUpdate.emit(event.detail.to);
  }

  // ==== RENDERING SECTION ======================================================================
  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - -
  render() {
    this.log.debug('render');
    return [
      <ion-router useHash={false} onIonRouteDidChange={event => this.onRouteChanged(event)}>
        {this.routes.map(routeObject => {
          const beforeEnterCallback =
            routeObject.url !== '/login'
              ? this.isLoggedInGuard
              : () => {
                  return true;
                };

          return <ion-route url={routeObject.url} component={routeObject.component} beforeEnter={beforeEnterCallback} />;
        })}
      </ion-router>,
      <ion-nav />,
    ];
  }
}
