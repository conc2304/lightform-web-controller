// ==== Library Imports =======================================================
import { Component, Element, h, Listen, State, Watch } from '@stencil/core';

// ==== App Imports ===========================================================
import { LfDevice, LfDevicePlaybackState, LfProjectMetadata, LfScene } from '../../../shared/interfaces/lf-web-controller.interface';
import lfRemoteApiDevice, { SetContentParams } from '../../../shared/services/lf-remote-api/lf-remote-api-device.service';
import lfLoggerService from '../../../shared/services/lf-logger.service';
import { getProjectIndex } from '../../../shared/services/lf_utils.service';
import lfAppState, { initializeData } from '../../../store/lf-app-state.store';

@Component({
  tag: 'page-home',
  styleUrl: 'page-home.component.scss',
})
export class PageHome {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new lfLoggerService('PageHome').logger;
  private router: HTMLIonRouterElement;
  private currentAnimationIndex = 0;

  private readonly defaultExperienceGroup: LfProjectMetadata = {
    name: 'Other Inputs',
    id: null,
    slides: [
      // // TODO - wait for implementation of switching to creator project
      // {
      //   name: 'Creator',
      //   type: 'creator',
      //   index: 0,
      //   projectId: null,
      //   projectName: 'Device',
      // },
      {
        name: 'HDMI 1',
        type: 'hdmi',
        index: 1,
        thumbnail: './assets/icons/HDMI-input.svg',
        projectId: null,
        projectName: 'Device',
      },
      {
        name: 'HDMI 2',
        type: 'hdmi',
        index: 2,
        thumbnail: './assets/icons/HDMI-input.svg',
        projectId: null,
        projectName: 'Device',
      },
    ],
  };

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() loading = false;
  @State() errorMsg: string = null;
  @State() currentSlideIndex: number = null;
  @State() playbackState: LfDevicePlaybackState = lfAppState.playbackState;
  @State() registeredDevices: Array<LfDevice> = lfAppState.registeredDevices;
  @State() experiences: Array<LfProjectMetadata> = lfAppState.experiences;
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
    if (!this.registeredDevices || !this.playbackState) {
      this.loading = true;
      initializeData();
    }
  }

  // - -  componentDidLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad() {
    this.log.debug('componentDidLoad');
    this.router = await document.querySelector('ion-router').componentOnReady();
  }

  // ==== LISTENERS SECTION =====================================================================
  @Listen('_deviceSelected', { target: 'document' })
  onDeviceSelected() {
    this.log.info('_deviceSelected');
    this.errorMsg = null;
    this.deviceSelected = lfAppState.deviceSelected;

    if (this.deviceSelected?._embedded.info.offlineSince) {
      const date = new Date(this.deviceSelected._embedded.info.offlineSince);
      const formattedLastOnlineDate = `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
      this.errorMsg = `Device Offline since ${formattedLastOnlineDate}.`;
    }
  }

  @Listen('_playbackStateUpdated', { target: 'document' })
  async onPlaybackStateUpdated(): Promise<void> {
    this.log.debug('_playbackStateUpdated');

    this.playbackState = lfAppState.playbackState;
    this.experiences = lfAppState.playbackState.projectMetadata;
    this.registeredDevices = lfAppState.registeredDevices;

    if (this.playbackState) {
      this.updateSceneSelected();
    }
    this.loading = false;
  }

  @Listen('_registeredDevicesUpdated', { target: 'document' })
  onRegisteredDevicesUpdated() {
    this.log.info('_registeredDevicesUpdated');
    this.errorMsg = null;
    this.registeredDevices = lfAppState.registeredDevices;

    this.loading = false;
  }

  @Watch('experiences')
  onExperiencesChange(newValue: Array<LfProjectMetadata>) {
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
      const projectId = scene?.projectId;
      const slideIndex = scene.index;
      const hdmiIndex = scene?.type === 'hdmi' ? scene.index : null;

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

            this.updateSceneSelected(scene);
            lfAppState.sceneSelected = scene;
            lfAppState.projectSelectedName = scene.projectName;
            this.sceneSelected = scene;
            Promise.resolve();
          }
        })
        .then(() => {
          lfRemoteApiDevice.play(this.deviceSelected.serialNumber);
        })
        .catch(e => {
          this.log.error(e);
        });
    }
  }

  private updateSceneSelected(scene: LfScene = null) {
    this.log.debug('updateSceneSelected');
    let currentlyPlayingScene: LfScene;

    if (!this.experiences) {
      return;
    }

    if (this.currentSlideIndex >= 0) {
      this.currentSlideIndex = this.playbackState.slide;
    }

    const currentProjectIndex = getProjectIndex(lfAppState.playbackState.projectMetadata, lfAppState.playbackState.project);
    const currentProject = this.experiences[currentProjectIndex];

    if (!currentProject) {
      return;
    }

    if (scene) {
      currentlyPlayingScene = scene;
    } else if (this.experiences && this.currentSlideIndex >= 0) {
      currentlyPlayingScene = currentProject.slides[this.currentSlideIndex];
    }

    if (currentlyPlayingScene) {
      lfAppState.sceneSelected = this.sceneSelected = currentlyPlayingScene;
    }
  }

  // ==== RENDERING SECTION ======================================================================
  private renderExperiences() {
    this.log.debug('renderExperiences');

    if (this.experiences?.length) {
      return (
        <div class="lf-experiences--container">
          {this.experiences.map((experience: LfProjectMetadata) => {
            this.currentAnimationIndex++;
            return this.renderExperienceGroup(experience);
          })}
        </div>
      );
    } else {
      return (
        <div class="lf-home-page--error-container no-scenes">
          <h3 class="lf-home-page--error-msg-hero">You haven’t set up any scenes yet.</h3>
          <lf-button
            onClick={() => {
              // TODO - DO SOMETHING
            }}
            context="secondary"
          >
            Set up a scene
          </lf-button>
        </div>
      );
    }
  }

  private renderExperienceGroup(experience: LfProjectMetadata) {
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
    } else if (!this.registeredDevices || !this.registeredDevices.length) {
      return (
        <div class="lf-home-page--error-container no-devices">
          <h3 class="lf-home-page--error-msg-hero">You haven't added any devices.</h3>
          <lf-button
            onClick={() => {
              this.router.push('/register');
            }}
            context="secondary"
          >
            Add a device
          </lf-button>
        </div>
      );
    } else {
      return [
        this.renderExperiences(),
        this.renderExperienceGroup(this.defaultExperienceGroup),

        <div class={`new-scan--btn-wrapper animate-in ${layoutClass}`} style={{ '--animation-order': this.currentAnimationIndex++ } as any}>
          <lf-button context="secondary" expand="full">
            New Scan
          </lf-button>
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
