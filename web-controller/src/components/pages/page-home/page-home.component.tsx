// ==== Library Imports =======================================================
import { Component, Element, h, Listen, State } from '@stencil/core';

// ==== App Imports ===========================================================
import { LfDevice, LfDevicePlaybackState, LfProjectMetadata, LfScene } from '../../../shared/interfaces/lf-web-controller.interface';
import lfRemoteApiDevice, { SetContentParams } from '../../../shared/services/lf-remote-api/lf-remote-api-device.service';
import lfLoggerService from '../../../shared/services/lf-logger.service';
import lfAppState, { initializeData, initializeDeviceSelected, updateSceneSelected } from '../../../store/lf-app-state.store';
import { LF_EXPERIENCE_GROUP_DEFAULT } from '../../../shared/constants/lf-experience-group-defaults.constant';
import { resetAlignmentState } from '../../../store/lf-alignment-state.store';

@Component({
  tag: 'page-home',
  styleUrl: 'page-home.component.scss',
})
export class PageHome {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new lfLoggerService('PageHome').logger;
  private router: HTMLIonRouterElement;

  private titleAnimationIndex = 0;
  private sceneAnimationIndex = 1;
  private buttonAnimationIndex = 2;

  private readonly SceneSetupPath = '/scene-setup';
  private readonly DeviceRegistrationPath = '/register';
  private readonly defaultExperienceGroup = LF_EXPERIENCE_GROUP_DEFAULT;

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() loading = !lfAppState.appDataInitialized;
  @State() errorMsg: string = null;
  @State() playbackState: LfDevicePlaybackState = lfAppState.playbackState;
  @State() registeredDevices: Array<LfDevice> = lfAppState.registeredDevices;
  @State() experiences: Array<LfProjectMetadata> = lfAppState.experiences;
  @State() sceneSelected: LfScene = lfAppState.sceneSelected;
  @State() mobileLayout: boolean = lfAppState.mobileLayout;
  @State() deviceSelected: LfDevice = lfAppState.deviceSelected;
  @State() appDataInitialized: boolean = lfAppState.appDataInitialized;
  @State() deviceDataInitialized: boolean = lfAppState.deviceDataInitialized;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  // ==== EVENTS SECTION ========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - -
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');

    document.title = `Lightform | Home`;

    this.playbackState = lfAppState.playbackState;
    this.experiences = lfAppState.playbackState?.projectMetadata;
    if (!this.registeredDevices || !this.playbackState) {
      await initializeData().then(() => {
        if (!lfAppState.deviceSelected) {
          initializeDeviceSelected();
        }
      });
    }

    if (this.registeredDevices !== null || !this.experiences !== null) {
      this.loading = false;
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
    this.deviceSelected = lfAppState.deviceSelected;
  }

  @Listen('_playbackStateUpdated', { target: 'document' })
  async onPlaybackStateUpdated(): Promise<void> {
    this.log.debug('_playbackStateUpdated');

    this.playbackState = lfAppState.playbackState;
    this.experiences = lfAppState.playbackState.projectMetadata;
    this.registeredDevices = lfAppState.registeredDevices;

    if (!lfAppState.sceneSelected) {
      updateSceneSelected(null, lfAppState.playbackState.slide);
    }
    this.sceneSelected = lfAppState.sceneSelected;
  }

  @Listen('_registeredDevicesUpdated', { target: 'document' })
  onRegisteredDevicesUpdated() {
    this.log.info('_registeredDevicesUpdated');
    this.errorMsg = null;
    this.registeredDevices = lfAppState.registeredDevices;
  }

  @Listen('_layoutUpdated', { target: 'document' })
  onWindowResized(): void {
    this.log.debug('onWindowResized');
    this.mobileLayout = lfAppState.mobileLayout;
  }

  @Listen('_appDataInitialized', { target: 'document' })
  onAppDataInitialized(): void {
    this.appDataInitialized = lfAppState.appDataInitialized;
    this.loading = !(lfAppState.appDataInitialized && lfAppState.deviceDataInitialized);
  }

  @Listen('_deviceDataInitialized', { target: 'document' })
  onDeviceDataInitialized(): void {
    this.log.warn('_deviceDataInitialized');
    this.deviceDataInitialized = lfAppState.deviceDataInitialized;
    this.loading = !(lfAppState.appDataInitialized && lfAppState.deviceDataInitialized);
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
            updateSceneSelected(scene, slideIndex);
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

  // ==== RENDERING SECTION ======================================================================
  private renderExperiences() {
    this.log.debug('renderExperiences');

    if (this.experiences?.length) {
      return (
        <div class="lf-experiences--container">
          {this.experiences.map((experience: LfProjectMetadata) => {
            return this.renderExperienceGroup(experience);
          })}
        </div>
      );
    } else if (this.deviceSelected?.name) {
      return (
        <lf-call-to-action message={`${this.deviceSelected.name} is ready for your first scene`} imgSrc="/assets/images/LF2_plus.png" imgAltText="Lf2+ Image">
          <lf-button
            onClick={() => {
              this.router.push(this.SceneSetupPath);
            }}
          >
            New Scene
          </lf-button>
        </lf-call-to-action>
      );
    }
  }

  private renderExperienceGroup(experience: LfProjectMetadata) {
    this.log.debug('renderExperienceGroup');

    return (
      <div class="lf-experience--group">
        <h3 class="lf-experience--title animate-in" style={{ '--animation-order': this.titleAnimationIndex } as any}>
          {experience.name}
          {experience.description ? <p class="project-desc">{experience.description}</p> : ''}
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
                isMobileLayout={this.mobileLayout}
                selected={this.sceneSelected === scene}
                style={{ '--animation-order': this.sceneAnimationIndex } as any}
              />
            );
          })}
        </div>
      </div>
    );
  }

  private renderNewSceneButton() {
    return (
      <div class={`new-scan--btn-wrapper animate-in`} style={{ '--animation-order': this.buttonAnimationIndex } as any}>
        <lf-button
          context="primary"
          expand="full"
          onClick={() => {
            resetAlignmentState();
            this.router.push(this.SceneSetupPath);
          }}
        >
          New Scene
        </lf-button>
      </div>
    );
  }

  private renderContent() {
    this.log.debug('renderContent');

    const hdmiFlag = localStorage.getItem('lf_show_hdmi') !== null;

    this.log.debug(this.loading);
    this.log.debug(this.experiences?.length && this.deviceSelected);

    if (this.loading) {
      return <lf-loading-message />;
    } else if (this.errorMsg) {
      return <lf-error-message errorMessage={this.errorMsg}></lf-error-message>;
    } else if (this.deviceSelected?._embedded.info.offlineSince) {
      return <lf-device-offline deviceName={this.deviceSelected.name} offlineSince={this.deviceSelected?._embedded.info.offlineSince} />;
    } else if (!this.registeredDevices?.length && this.appDataInitialized !== null) {
      return (
        <lf-call-to-action imgSrc="/assets/images/LF2_plus_ghost.png" message="Get started by registering your LF2+" imgAltText="Register Devices">
          <lf-button
            class="error-action-btn"
            onClick={() => {
              this.router.push(this.DeviceRegistrationPath);
            }}
            context="primary"
          >
            Register Your LF2+
          </lf-button>
        </lf-call-to-action>
      );
    } else if (!this.experiences?.length && this.deviceSelected?.name) {
      return (
        <lf-call-to-action message={`${this.deviceSelected.name} is ready for your first scene`} imgSrc="/assets/images/LF2_plus.png" imgAltText="Lf2+ Image">
          <lf-button
            onClick={() => {
              this.router.push(this.SceneSetupPath);
            }}
          >
            New Scene
          </lf-button>
        </lf-call-to-action>
      );
    } else if (this.experiences?.length) {
      return [
        this.renderExperiences(),
        this.experiences?.length && hdmiFlag ? this.renderExperienceGroup(this.defaultExperienceGroup) : '',
        this.experiences?.length ? this.renderNewSceneButton() : '',
      ];
    } else {
      return <lf-error-message errorMessage="Error Unknown" hasResetButton></lf-error-message>;
    }
  }

  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');
    const layoutClass = this.mobileLayout ? 'lf-layout--mobile' : 'lf-layout--desktop';

    try {
      return (
        <div class="scroll-y ion-padding">
          <div class={`lf-home--content-container ${layoutClass}`}>{this.renderContent()}</div>
        </div>
      );
    } catch (error) {
      this.log ? this.log.error(error) : console.error(error);
      if (error?.message && error?.code) {
        return <lf-error-message errorCode={error?.name} errorMessage={error?.message} hasResetButton={true} />;
      } else {
        return <lf-error-message hasResetButton={true} />;
      }
    }
  }
}
