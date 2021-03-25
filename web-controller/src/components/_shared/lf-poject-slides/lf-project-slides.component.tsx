// ==== Library Imports =======================================================
import { Component, Element, h, Host, Prop, State, Listen } from '@stencil/core';
import { LfProjectType } from '../../../shared/enums/lf-project-type.enum';
import { LfProjectMetadata, LfScene } from '../../../shared/interfaces/lf-web-controller.interface';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfRemoteApiDeviceService from '../../../shared/services/lf-remote-api/lf-remote-api-device.service';
import lfAppState, { updateSceneSelected } from '../../../store/lf-app-state.store';

@Component({
  tag: 'lf-project-slides',
  styleUrl: 'lf-project-slides.component.scss',
  shadow: true,
})
export class LfEnvironmentCategories {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('LfProjectSlides').logger;

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() playbackState = lfAppState.playbackState;
  @State() sceneSelected: LfScene = lfAppState.sceneSelected;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() project: LfProjectMetadata;
  @Prop() isMobileLayout = lfAppState.mobileLayout;

  // ==== EVENTS SECTION ========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================

  // ==== LISTENERS SECTION =====================================================================

  @Listen('_playbackStateUpdated', { target: 'document' })
  async onPlaybackStateUpdated(): Promise<void> {
    this.log.debug('_playbackStateUpdated');

    this.playbackState = lfAppState.playbackState;

    if (!lfAppState.sceneSelected) {
      updateSceneSelected(null, lfAppState.playbackState.slide);
    }
    this.sceneSelected = lfAppState.sceneSelected;
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ================================================
  // ==== LOCAL METHODS SECTION =================================================================
  private getLayoutClass() {
    this.log.debug('getLayoutClass');

    return this.isMobileLayout ? 'lf-layout--mobile' : 'lf-layout--desktop';
  }

  private onSceneSelected(scene: LfScene) {
    this.log.debug('onSceneSelected');

    if (this.playbackState && this.playbackState.projectMetadata) {
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
            this.playbackState.slide = slideIndex || null;
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

  private renderContent() {
    if (!this.project?.slides?.length) return '';

    return this.project.slides.map(scene => {
      return (
        <lf-scene-card
          scene={scene}
          onClick={() => {
            this.onSceneSelected(scene);
          }}
          isMobileLayout={this.isMobileLayout}
          selected={this.sceneSelected === scene}
        />
      );
    });
  }

  private renderSkeletonCards(numCards: number = 3) {
    return new Array(numCards).fill(null).map(() => {
      return <lf-scene-card skeleton />;
    });
  }

  // - -  render Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - - - - - - - - -
  render() {
    try {
      this.log.debug('render');
      const downloadInProgress = lfAppState.projectDownloadProgress && lfAppState.projectDownloadProgress.hasOwnProperty(this.project?.id);

      return (
        <Host class={`lf-project-slides ${this.getLayoutClass()}`}>
          {this.renderContent()}
          {downloadInProgress && this.project.type !== LfProjectType.EnvironmentProject ? this.renderSkeletonCards(3) : ''}
        </Host>
      );
    } catch (error) {
      this.log ? this.log.error(error) : console.error(error);

      return '';
    }
  }
}
