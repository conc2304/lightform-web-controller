// ==== Library Imports =======================================================
import { Component, Element, h, Listen, State, Watch } from '@stencil/core';

// ==== App Imports ===========================================================
import { LfDevice, LfDevicePlaybackState, LfExperience, LfScene } from '../../../shared/interfaces/lf-web-controller.interface';
import lfRemoteApiDevice, { SetContentParams } from '../../../shared/services/lf-remote-api/lf-remote-api-device.service';
import lfLoggerService from '../../../shared/services/lf-logger.service';
import lfAppState from '../../../store/lf-app-state.store';

@Component({
  tag: 'page-home',
  styleUrl: 'page-home.component.scss',
})
export class PageHome {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new lfLoggerService('PageHome').logger;
  private currentAnimationIndex = 0;

  // ---- Protected -----------------------------------------------------------------------------
  protected defaultExperienceGroup: LfExperience = {
    name: 'Other Inputs',
    slides: [
      {
        name: 'Creator',
        type: 'creator',
        index: 0,
      },
      {
        name: 'HDMI 1',
        type: 'hdmi',
        index: 1,
      },
      {
        name: 'HDMI 2',
        type: 'hdmi',
        index: 2,
      },
    ],
  };

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() loading = true;
  @State() errorMsg: string = null;
  @State() currentSlideIndex: number = null;
  @State() playbackState: LfDevicePlaybackState = lfAppState.playbackState;
  @State() registeredDevices: Array<LfDevice> = lfAppState.registeredDevices;
  @State() experiences: Array<LfExperience> = lfAppState.experiences;
  @State() sceneSelected: LfScene = lfAppState.sceneSelected;
  @State() mobileLayout: boolean = lfAppState.mobileLayout;
  @State() deviceSelected: LfDevice = lfAppState.deviceSelected;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  // ==== EVENTS SECTION ========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - -
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');

    this.playbackState = lfAppState.playbackState;
    this.experiences = lfAppState.playbackState?.projectMetadata;
  }

  // ==== LISTENERS SECTION =====================================================================
  @Listen('_deviceSelected', { target: 'document' })
  onDeviceSelected() {
    this.log.info('_deviceSelected');
    this.errorMsg = null;
    this.deviceSelected = lfAppState.deviceSelected;
  }

  @Listen('_playbackStateUpdated', { target: 'document' })
  async onPlaybackStateUpdated(): Promise<void> {
    this.log.debug('_playbackStateUpdated');

    this.playbackState = lfAppState.playbackState;
    this.experiences = lfAppState.playbackState.projectMetadata;

    if (this.playbackState) {
      this.updateSceneSelected();
    }
    this.loading = false;
  }

  @Watch('experiences')
  onExperiencesChange(newValue: Array<LfExperience>) {
    this.log.debug('onExperiencesChange');
    if (newValue?.length) {
      this.loading = false;
    }
  }

  // ==== PUBLIC METHODS API - @Method() SECTION =================================================

  // ==== LOCAL METHODS SECTION ==================================================================
  private onSceneSelected(scene: LfScene) {
    this.log.debug('onSceneSelected');

    if (this.playbackState && this.experiences) {
      const currentProjectIndex = 0; // TODO - handle multiple projects
      const currentProject = this.experiences[currentProjectIndex];
      const slideIndex = currentProject.slides.indexOf(scene);
      const hdmiIndex = scene?.type === 'hdmi' ? scene.index : null;
      const projectId = hdmiIndex === null ? this.playbackState.projectMetadata[currentProjectIndex].id : null;
      const params: SetContentParams = {
        deviceSerial: this.deviceSelected.serialNumber,
        projectId: projectId,
        slideIndex: slideIndex,
        hdmiIndex: hdmiIndex,
      };

      lfRemoteApiDevice
        .setContent(params)
        .then(response => {
          if (response.error) {
            Promise.reject(response.error);
            // todo error handling (MVP?)
          } else {
            this.playbackState.slide = slideIndex || null;
            this.currentSlideIndex = slideIndex || null;

            lfAppState.sceneSelected = scene;
            this.sceneSelected = scene;
            Promise.resolve();
          }
        })
        .catch(e => {
          this.log.error(e);
        });
    }
  }

  private updateSceneSelected(scene: LfScene = null) {
    this.log.debug('updateSceneSelected');
    let currentlyPlayingScene: LfScene;
    let slideIndex: number;

    if (!this.experiences) {
      return;
    }

    if (!this.currentSlideIndex) {
      this.currentSlideIndex = this.playbackState.slide;
    }

    const currentProjectIndex = 0; // TODO - handle multiple projects
    const currentProject = this.experiences[currentProjectIndex];

    if (!currentProject) {
      return;
    }

    if (scene) {
      currentlyPlayingScene = scene;
      slideIndex = currentProject.slides.indexOf(scene);
    } else if (this.experiences && this.currentSlideIndex) {
      slideIndex = this.playbackState.slide;
      currentlyPlayingScene = currentProject.slides[this.currentSlideIndex];
    }

    if (currentlyPlayingScene) {
      lfAppState.sceneSelected = this.sceneSelected = currentlyPlayingScene;
    }

    if (slideIndex >= 0) {
      lfAppState.playbackState.slide = this.currentSlideIndex = slideIndex;
    }
  }

  // ==== RENDERING SECTION ======================================================================
  private renderExperiences() {
    this.log.debug('renderExperiences');

    if (this.experiences?.length) {
      return (
        <div class="lf-experiences--container">
          {this.experiences.map((experience: LfExperience) => {
            this.currentAnimationIndex++;
            return this.renderExperienceGroup(experience);
          })}

          {this.renderExperienceGroup(this.defaultExperienceGroup)}
        </div>
      );
    }
  }

  private renderExperienceGroup(experience: LfExperience) {
    this.log.debug('renderExperienceGroup');

    return (
      <div class="lf-experience--group">
        <h3 class="lf-experience--title animate-in" style={{ '--animation-order': this.currentAnimationIndex++ } as any}>
          {experience.name}
        </h3>
        <div class="lf-experience--scenes-container">
          {experience.slides.map(scene => {
            return (
              <lf-scene-card
                class="animate-in"
                scene={scene}
                onClick={() => {
                  this.onSceneSelected(scene);
                }}
                selected={this.sceneSelected === scene}
                style={{ '--animation-order': this.currentAnimationIndex++ } as any}
              />
            );
          })}
        </div>
      </div>
    );
  }

  private renderErrorMsg(errorMsgDesc: string = '', errorMsgHero: string = '') {
    this.log.debug('renderErrorMsg');
    const deviceName = this.deviceSelected ? this.deviceSelected.name : 'Device';
    const heroMsg = errorMsgHero.length ? errorMsgHero : `Error: ${deviceName}`;

    return (
      <div class="lf-home-page--error-container">
        <h3 class="lf-home-page--error-msg-hero">{heroMsg}</h3>
        <h3 class="lf-home-page--error-msg-desc">{errorMsgDesc}</h3>
      </div>
    );
  }

  private renderContent() {
    this.log.debug('renderContent');

    this.currentAnimationIndex = 0;
    const layoutClass = lfAppState.mobileLayout ? 'lf-layout--mobile' : 'lf-layout--desktop';

    if (this.loading) {
      return <lf-loading-message />;
    } else if (this.errorMsg && !this.loading) {
      return this.renderErrorMsg(this.errorMsg);
    } else if (this?.experiences?.length) {
      return [
        this.renderExperiences(),
        <div class={`new-scan--btn-wrapper animate-in ${layoutClass}`} style={{ '--animation-order': this.currentAnimationIndex++ } as any}>
          <lf-button context="secondary" expand="full">
            New Scan
          </lf-button>
        </div>,
      ];
    } else {
      return [
        <div>
          {this.renderErrorMsg('Unable to load device scenes. Check that the device is online and has Live Scenes published')}
          <div class="lf-home-page--error-msg"></div>
          {this.renderExperienceGroup(this.defaultExperienceGroup)}
        </div>,
      ];
    }
  }

  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');

    return (
      <div class="scroll-y ion-padding">
        <div class="lf-home--content-container">{this.renderContent()}</div>
      </div>
    );
  }
}
