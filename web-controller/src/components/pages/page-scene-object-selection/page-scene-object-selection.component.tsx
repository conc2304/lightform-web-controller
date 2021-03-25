// ==== Library Imports =======================================================
import { Component, Element, h, Host, Listen, Prop } from '@stencil/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfRemoteApiAlignmentService from '../../../shared/services/lf-remote-api/lf-remote-api-alignment.service';
import lfAppStateStore from '../../../store/lf-app-state.store';
import { LfObjectDetails } from '../../../shared/interfaces/lf-web-controller.interface';
import lfAlignmentStateStore from '../../../store/lf-alignment-state.store';

@Component({
  tag: 'page-scene-object-selection',
  styleUrls: ['page-scene-object-selection.component.scss'],
  shadow: true,
})
export class PageSceneObjectSelection {
  // ==== OWN PROPERTIES SECTION ==================================================================
  // ---- Private  --------------------------------------------------------------------------------
  private log = new LfLoggerService('PageSceneObjectSelection').logger;
  private router: HTMLIonRouterElement;

  // ==== HOST HTML REFERENCE =====================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION ===============================================================
  @Prop() isMobileLayout: boolean = lfAppStateStore.mobileLayout;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ====================================================

  // ==== EVENTS SECTION ==========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================
  // - -  componentWillLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');

    lfAlignmentStateStore.registeredObjects =
      lfAlignmentStateStore.registeredObjects ||
      (await lfRemoteApiAlignmentService.getLfObjects().then(response => {
        return response.body;
      }));
  }

  // - -  componentDidLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad() {
    this.log.debug('componentDidLoad');
    document.title = 'Lightform | Select Your Object';
    this.router = await document.querySelector('ion-router').componentOnReady();
  }

  // ==== LISTENERS SECTION =======================================================================
  @Listen('_layoutUpdated', { target: 'document' })
  onWindowResized(): void {
    this.log.debug('onWindowResized');
    this.isMobileLayout = lfAppStateStore.mobileLayout;
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ==================================================

  // ==== LOCAL METHODS SECTION ===================================================================

  private onObjectSelect(objectSelected: LfObjectDetails) {
    lfAlignmentStateStore.lfObjectName = objectSelected.name;
    lfAlignmentStateStore.lfObjectId = objectSelected.id;
    this.router.push(`/scene-setup-align/object/${objectSelected.name}/edit`);
  }
  // ==== RENDERING SECTION =======================================================================

  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');

    const layoutClassName = this.isMobileLayout ? 'lf-layout--mobile' : 'lf-layout--desktop';

    return (
      <Host class={`page-scene-setup-object-selection scroll-y ${layoutClassName}`}>
        <div class="scene-setup--container">
          <h1 class="scene-setup--title">Select Object</h1>
          <div class="scene-setup--content">
            {lfAlignmentStateStore.registeredObjects.map((objectDetails: LfObjectDetails) => {
              return (
                <div
                  class="scene-setup--object-option-wrapper"
                  onClick={() => {
                    this.onObjectSelect(objectDetails);
                  }}
                >
                  <div class="object-option--title">{objectDetails.name} </div>
                </div>
              );
            })}
          </div>
        </div>
      </Host>
    );
  }
}
