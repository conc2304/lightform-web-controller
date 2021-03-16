// ==== Library Imports =======================================================
import { Component, Element, h, Host, Listen, Prop, State } from '@stencil/core';
import { LfProjectType } from '../../../shared/enums/lf-project-type.enum';
import { LfProjectMetadata } from '../../../shared/interfaces/lf-web-controller.interface';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfAppState, { updatePlaybackState } from '../../../store/lf-app-state.store';

@Component({
  tag: 'lf-project-group',
  styleUrl: 'lf-project-group.component.scss',
  scoped: true,
})
export class LfProjectGroup {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('LfProjectGroup').logger;

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() projectDownloadProgress = lfAppState.projectDownloadProgress;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() isMobileLayout: boolean = lfAppState.mobileLayout;
  @Prop() name: string;
  @Prop() description: string;
  @Prop() projectId: string;
  @Prop() projectType: LfProjectType;

  // ==== EVENTS SECTION ========================================================================
  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // ==== LISTENERS SECTION =====================================================================
  @Listen('_projectDownloadProgress', { target: 'document' })
  onProjectDownloadProgressUpdated(): void {
    // update playbackState when the downloadProgress has finished
    // download progress is finished when local state is not empty and app state has become empty
    const downloadsHaveCompleted = this.projectDownloadProgress && Object.keys(this.projectDownloadProgress).length && !Object.keys(lfAppState.projectDownloadProgress).length;
    if (downloadsHaveCompleted) {
      if (lfAppState.deviceSelected) updatePlaybackState(lfAppState.deviceSelected);
    }

    this.projectDownloadProgress = lfAppState.projectDownloadProgress;
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ================================================

  // ==== LOCAL METHODS SECTION =================================================================
  private getLayoutClass() {
    this.log.debug('getLayoutClass');

    return this.isMobileLayout ? 'lf-layout--mobile' : 'lf-layout--desktop';
  }

  private getEnvironmentDownloadProgress(): Array<number> {
    this.log.warn('getEnvironmentDownloadProgress');

    const projects = lfAppState.playbackState?.projectMetadata;
    const projectsInProgress = lfAppState.projectDownloadProgress;

    if (this.projectType !== LfProjectType.EnvironmentProject || !projects) return null;

    const percentArr: Array<number> = [];
    const environmentProjects = projects.filter(project => {
      return project.type === LfProjectType.EnvironmentProject;
    });

    for (const [projectId, progressPercent] of Object.entries(projectsInProgress)) {
      environmentProjects.forEach(project => {
        if (project.id === projectId) {
          percentArr.push(progressPercent);
        }
      });
    }

    return percentArr;
  }

  // ==== RENDERING SECTION =====================================================================

  private renderSkeletonCards(numCards: number = 3) {
    return new Array(numCards).fill(null).map(() => {
      return <lf-scene-card skeleton />;
    });
  }

  private renderContent() {
    this.log.debug('renderContent');

    const downloadString = 'Downloading full project';
    const finalizingString = 'Finalizing project videos ...';

    let downloadInProgress = false;
    let downloadingText: string;
    let percentComplete: number;

    if (this.projectType === LfProjectType.EnvironmentProject) {
      const environmentsProgress = this.getEnvironmentDownloadProgress();
      if (environmentsProgress.length) {
        downloadInProgress = true;
        percentComplete = environmentsProgress.reduce((a, b) => a + b) / environmentsProgress.length;
      }
    } else {
      downloadInProgress = this.projectDownloadProgress && this.projectDownloadProgress.hasOwnProperty(this.projectId);
      percentComplete = this.projectDownloadProgress[this.projectId] || null;
    }

    if (downloadInProgress) {
      downloadingText = downloadInProgress && percentComplete !== 100 ? `${downloadString} ${percentComplete}%` : finalizingString;
    } else {
      downloadingText = null;
    }

    return (
      <div class="lf-experience--group">
        <h3 class="lf-experience--title animate-in" style={{ '--animation-order': 0 } as any}>
          {this.name}
          {this.name ? <p class="sub-title">{this.description}</p> : ''}
          {downloadInProgress ? <p class="sub-title">{downloadingText}</p> : ''}
        </h3>
        <div class="lf-experience--scenes-container">
          <slot></slot>
        </div>
      </div>
    );
  }

  // - -  render Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - - - - - - - - -
  render() {
    this.log.debug('render');
    return <Host class={`${this.getLayoutClass()}`}>{this.renderContent()}</Host>;
  }
}
