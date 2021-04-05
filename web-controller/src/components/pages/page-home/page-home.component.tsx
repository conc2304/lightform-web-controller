// ==== Library Imports =======================================================
import { Component, Element, h, Host, Listen, State } from '@stencil/core';
import { toastController } from '@ionic/core';

// ==== App Imports ===========================================================
import { LfDevice, LfDevicePlaybackState, LfProjectMetadata } from '../../../shared/interfaces/lf-web-controller.interface';
import lfLoggerService from '../../../shared/services/lf-logger.service';
import lfAppState, { initializeData, initializeDeviceSelected, updateSceneSelected } from '../../../store/lf-app-state.store';
import { LF_EXPERIENCE_GROUP_DEFAULT } from '../../../shared/constants/lf-experience-group-defaults.constant';
import { resetAlignmentState } from '../../../store/lf-alignment-state.store';
import { LfProjectType } from '../../../shared/enums/lf-project-type.enum';
import lfRemoteApiAuthService from '../../../shared/services/lf-remote-api/lf-remote-api-auth.service';

@Component({
  tag: 'page-home',
  styleUrl: 'page-home.component.scss',
  shadow: true,
})
export class PageHome {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new lfLoggerService('PageHome').logger;
  private router: HTMLIonRouterElement;

  private readonly SceneSetupPath = '/scene-setup';
  private readonly DeviceRegistrationPath = '/register';
  private readonly defaultExperienceGroup = LF_EXPERIENCE_GROUP_DEFAULT;

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() loading = !(lfAppState.appDataInitialized && lfAppState.deviceDataInitialized);
  @State() errorMsg: string = null;
  @State() playbackState: LfDevicePlaybackState = lfAppState.playbackState;
  @State() registeredDevices: Array<LfDevice> = lfAppState.registeredDevices;
  @State() projects: Array<LfProjectMetadata> = lfAppState.projects;
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
    this.projects = lfAppState.playbackState?.projectMetadata;
  }

  // - -  componentDidLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad() {
    this.log.debug('componentDidLoad');
    this.router = await document.querySelector('ion-router').componentOnReady();

    if (lfRemoteApiAuthService.isLoggedIn()) {
      if ((!this.registeredDevices || !this.playbackState) && !lfAppState.appInitializing) {
        await initializeData();
      }

      if (!lfAppState.deviceSelected && !lfAppState.appInitializing) {
        initializeDeviceSelected();
      }
    } else {
      this.router.push('/login');
    }

    this.loading = !(lfAppState.appDataInitialized && lfAppState.deviceDataInitialized);

    this.log.info('Install Prompt', window['deferredPrompt']);
    if (window['deferredPrompt'] !== null && typeof window['deferredPrompt'] !== 'undefined') {
      const toast = await toastController.create({
        message: 'Add Lightform to your Home Screen.',
        buttons: [
          { text: 'Add', role: 'add' },
          { text: 'Cancel', role: 'cancel' },
        ],
        duration: 0,
        position: 'top',
        color: 'primary',
      });

      await toast.present();

      const { role } = await toast.onWillDismiss();

      if (role === 'add') {
        window['deferredPrompt'].prompt();
        window['deferredPrompt'].userChoice.then(choiceResult => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }
          window['deferredPrompt'] = null;
        });
      }
    }
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
    this.projects = lfAppState.playbackState.projectMetadata;
    this.registeredDevices = lfAppState.registeredDevices;

    if (!lfAppState.sceneSelected) {
      updateSceneSelected(null, lfAppState.playbackState.slide);
    }
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
    this.deviceDataInitialized = lfAppState.deviceDataInitialized;
    this.loading = !(lfAppState.appDataInitialized && lfAppState.deviceDataInitialized);
  }

  // ==== PUBLIC METHODS API - @Method() SECTION =================================================

  // ==== LOCAL METHODS SECTION ==================================================================

  // ==== RENDERING SECTION ======================================================================
  private renderProjects() {
    this.log.debug('renderProjects');

    const projects = this.projects;

    // go through all of the projects in projectMetadata
    // if it is an env project then get the first of each category and display it as a title card

    if (this.projects?.length) {
      return (
        <div class="lf-projects--container">
          {/* -- OBJECTS PROJECTS -- */}
          {projects
            .filter(project => {
              return project.type === LfProjectType.ObjectsProject;
            })
            .map(project => {
              return (
                <lf-project-group project={project} isMobileLayout={this.mobileLayout}>
                  <lf-project-slides project={project} />
                </lf-project-group>
              );
            })}

          {/* -- ENVIRONMENTS PROJECTS -- */}
          {this.renderEnvironmentsProjects(projects)}

          {/* -- CREATOR PROJECTS -- */}
          {projects
            .filter(project => {
              return project.type === LfProjectType.CreatorProject;
            })
            .map(project => {
              return (
                <lf-project-group project={project} isMobileLayout={this.mobileLayout}>
                  <lf-project-slides project={project} />
                </lf-project-group>
              );
            })}
        </div>
      );
    } else if (this.deviceSelected?.name) {
      return (
        <lf-call-to-action message={`${this.deviceSelected.name} is ready for your first scene`} imgSrc="/assets/images/LF2_plus.png" imgAltText="Lf2+ Image">
          {this.renderNewSceneButton()}
        </lf-call-to-action>
      );
    }
  }

  private renderNewSceneButton() {
    return (
      <div class={`new-scan--btn-wrapper`}>
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

  private renderEnvironmentsProjects(projects: Array<LfProjectMetadata>) {
    const environmentProjects = projects.filter(project => {
      return project.type === LfProjectType.EnvironmentProject;
    });

    if (environmentProjects.length) {
      const project: LfProjectMetadata = {
        id: null,
        name: 'Environments',
        slides: null,
        type: LfProjectType.EnvironmentProject,
      };

      return (
        <div class="lf-environment-projects--container">
          <lf-project-group project={project}>
            <lf-environment-categories projects={environmentProjects} isMobileLayout={this.mobileLayout} />
          </lf-project-group>
        </div>
      );
    }
  }

  private renderContent() {
    this.log.debug('renderContent');

    const hdmiFlag = localStorage.getItem('lf_show_hdmi') !== null;

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
    } else if (!this.projects?.length && this.deviceSelected?.name) {
      return (
        <lf-call-to-action
          message={`Hooray! \n\n ${this.deviceSelected.name} is ready to set up your first scene with an Object or an Environment`}
          imgSrc="/assets/images/LF2_plus.png"
          imgAltText="Lf2+ Image"
        >
          {this.renderNewSceneButton()}
        </lf-call-to-action>
      );
    } else if (this.projects?.length) {
      return [
        this.renderProjects(),
        hdmiFlag ? (
          <lf-project-group project={this.defaultExperienceGroup} isMobileLayout={this.mobileLayout}>
            <lf-project-slides project={this.defaultExperienceGroup} />
          </lf-project-group>
        ) : (
          ''
        ),
        this.projects?.length ? this.renderNewSceneButton() : '',
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
        <Host class="scroll-y ion-padding">
          <div class={`lf-home--content-container ${layoutClass}`}>{this.renderContent()}</div>
        </Host>
      );
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
