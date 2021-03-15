// ==== Library Imports =======================================================
import { Component, Element, h, Listen, Prop, State } from '@stencil/core';

// ==== App Imports ===========================================================
import state, { initializeData, initializeDeviceSelected, updateSceneSelected } from '../../../store/lf-app-state.store';
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfAppState from '../../../store/lf-app-state.store';
import { LfProjectType } from '../../../shared/enums/lf-project-type.enum';
import { LfProjectMetadata, LfScene } from '../../../shared/interfaces/lf-web-controller.interface';
import lfRemoteApiDeviceService from '../../../shared/services/lf-remote-api/lf-remote-api-device.service';

@Component({
  tag: 'page-environments',
  styleUrl: 'page-environments.component.scss',
})
export class PageEnvironment {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('PageEnvironment').logger;

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() isMobileLayout: boolean;
  @State() sceneSelected: LfScene = lfAppState.sceneSelected;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() category: string; // from the url

  // ==== EVENTS SECTION ========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - -
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');

    this.isMobileLayout = state.mobileLayout;
    // allow for url to have a - instead of a space
    this.category = this.category?.replace('-', ' ');

    if (!lfAppState.registeredDevices) {
      await initializeData();
    }
    if (!lfAppState.deviceSelected) {
      initializeDeviceSelected();
    }
    document.title = `Environments | ${this.category || 'Categories'} `;
  }

  public async componentDidLoad() {
    this.log.debug('componentDidUpdate');
  }

  // ==== LISTENERS SECTION =====================================================================
  @Listen('_layoutUpdated', { target: 'document' })
  onWindowResized(): void {
    this.log.debug('onWindowResized');
    this.isMobileLayout = state.mobileLayout;
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ================================================
  // ==== LOCAL METHODS SECTION =================================================================
  private getLayoutClass() {
    this.log.debug('getLayoutClass');

    return this.isMobileLayout ? 'lf-layout--mobile' : 'lf-layout--desktop';
  }

  private onSceneSelected(scene: LfScene) {
    this.log.debug('onSceneSelected');

    if (lfAppState.playbackState && lfAppState.playbackState.projectMetadata) {
      const projectId = scene?.projectId;
      const slideIndex = scene.index;
      const hdmiIndex = scene?.type === 'hdmi' ? scene.index : null;

      const params = {
        deviceSerial: lfAppState.deviceSelected.serialNumber,
        projectId: projectId,
        slideIndex: slideIndex,
        hdmiIndex: hdmiIndex,
      };

      lfRemoteApiDeviceService
        .setContent(params)
        .then(response => {
          if (response.error) {
            Promise.reject(response.error);
            // todo error handling (MVP?)
          } else {
            // this.playbackState.slide = slideIndex || null;
            updateSceneSelected(scene, slideIndex);
            lfAppState.sceneSelected = scene;
            lfAppState.projectSelectedName = scene.projectName;

            this.sceneSelected = scene;
            Promise.resolve();
          }
        })
        .then(() => {
          lfRemoteApiDeviceService.play(lfAppState.deviceSelected.serialNumber);
        })
        .catch(e => {
          this.log.error(e);
        });
    }
  }
  // ==== RENDERING SECTION =====================================================================

  private renderProjectSlides(project: LfProjectMetadata) {
    this.log.debug('renderProjectSlides');
    if (!project?.slides?.length) return '';

    return project.slides.map(scene => {
      return (
        <lf-scene-card
          class="animate-in"
          scene={scene}
          onClick={() => {
            this.onSceneSelected(scene);
          }}
          isMobileLayout={this.isMobileLayout}
          selected={this.sceneSelected === scene}
          style={{ '--animation-order': 1 } as any}
        />
      );
    });
  }

  // - -  render Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - - - - - - - - -
  render() {
    try {
      this.log.debug('render');
      const projects = lfAppState.playbackState?.projectMetadata || [];

      const environmentProject = projects.find(project => {
        return project.name === this.category && project.type === LfProjectType.EnvironmentProject;
      });

      return [
        <div class={`lf-environments--page scroll-y ion-padding ${this.getLayoutClass()}`}>
          <div class="lf-environment-projects--container">
            <lf-project-group title={null}>{this.renderProjectSlides(environmentProject)}</lf-project-group>
          </div>
        </div>,
      ];
    } catch (error) {
      this.log ? this.log.error(error) : console.error(error);

      if (error?.message && error?.code) {
        return <lf-error-message errorCode={error?.code} errorMessage={error?.message} hasResetButton={true} />;
      } else {
        return <lf-error-message hasResetButton={true} />;
      }
    }
  }
}
