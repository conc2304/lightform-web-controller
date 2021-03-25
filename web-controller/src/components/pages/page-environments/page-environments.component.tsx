// ==== Library Imports =======================================================
import { Component, Element, h, Listen, Prop, State } from '@stencil/core';

// ==== App Imports ===========================================================
import state, { initializeData, initializeDeviceSelected } from '../../../store/lf-app-state.store';
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfAppState from '../../../store/lf-app-state.store';
import { LfProjectType } from '../../../shared/enums/lf-project-type.enum';
import { LfProjectMetadata, LfScene } from '../../../shared/interfaces/lf-web-controller.interface';
import { resetAlignmentState } from '../../../store/lf-alignment-state.store';

@Component({
  tag: 'page-environments',
  styleUrl: 'page-environments.component.scss',
})
export class PageEnvironment {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('PageEnvironment').logger;
  private router: HTMLIonRouterElement;

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() isMobileLayout: boolean;
  @State() sceneSelected: LfScene = lfAppState.sceneSelected;
  @State() projects: Array<LfProjectMetadata>;
  @State() environmentProjects: Array<LfProjectMetadata>;
  @State() categoryProject: LfProjectMetadata;
  @State() appDataInitialized: boolean = lfAppState.appDataInitialized;
  @State() deviceDataInitialized: boolean = lfAppState.deviceDataInitialized;
  @State() loading = !(lfAppState.appDataInitialized && lfAppState.deviceDataInitialized);

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

    this.initializeProjectData();

    if (this.projects !== null) {
      this.loading = false;
    }

    document.title = `Environments | ${this.category || 'Categories'} `;
  }

  // - -  componentDidLoad Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad() {
    this.log.debug('componentDidUpdate');

    this.router = await document.querySelector('ion-router').componentOnReady();
  }

  // ==== LISTENERS SECTION =====================================================================
  @Listen('_appDataInitialized', { target: 'document' })
  onAppDataInitialized(): void {
    this.appDataInitialized = lfAppState.appDataInitialized;
    this.loading = !(lfAppState.appDataInitialized && lfAppState.deviceDataInitialized);
  }

  @Listen('_deviceDataInitialized', { target: 'document' })
  onDeviceDataInitialized(): void {
    this.log.debug('_deviceDataInitialized');
    this.loading = !(lfAppState.appDataInitialized && lfAppState.deviceDataInitialized);
  }

  @Listen('_playbackStateUpdated', { target: 'document' })
  async onPlaybackStateUpdated(): Promise<void> {
    this.log.debug('_playbackStateUpdated');

    this.initializeProjectData();
  }

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

  private initializeProjectData() {
    this.log.debug('initializeProjectData');

    this.projects = lfAppState.playbackState?.projectMetadata || [];
    this.environmentProjects = this.projects.filter(project => {
      return project.type === LfProjectType.EnvironmentProject;
    });

    this.categoryProject = this.projects.find(project => {
      return project.name === this.category && project.type === LfProjectType.EnvironmentProject;
    });
  }

  // ==== RENDERING SECTION =====================================================================
  private renderContent() {
    this.log.debug('renderContent');

    if (this.loading) {
      return <lf-loading-message />;
    } else if (this.category && this.categoryProject?.slides?.length) {
      return <lf-project-slides project={this.categoryProject} />;
    } else if (this.environmentProjects?.length) {
      return [<h1>Choose Your Mood</h1>, <lf-environment-categories projects={this.environmentProjects} isMobileLayout={this.isMobileLayout} />];
    } else {
      return (
        <lf-call-to-action imgSrc="/assets/images/LF2_plus.png" message="Get started by creating your Environment Scene" imgAltText={null}>
          <lf-button
            class="error-action-btn"
            onClick={() => {
              resetAlignmentState();
              this.router.push('/scene-setup');
            }}
            context="primary"
          >
            New Scene
          </lf-button>
        </lf-call-to-action>
      );
    }
  }

  // - -  render Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    try {
      this.log.debug('render');
      const project: LfProjectMetadata = {
        id: null,
        name: null,
        slides: null,
        type: null,
      };

      return [
        <div class={`lf-environments--page scroll-y ion-padding ${this.getLayoutClass()}`}>
          <div class="lf-environment-projects--container">
            <lf-project-group project={project}>{this.renderContent()}</lf-project-group>
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
