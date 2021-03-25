// ==== Library Imports =======================================================
import { Component, Element, h, Host, Listen, Prop, State } from '@stencil/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfAppState, { getProjectDownloadProgress, updatePlaybackState } from '../../../store/lf-app-state.store';
import { LfProjectType } from '../../../shared/enums/lf-project-type.enum';
import { LfProjectMetadata } from '../../../shared/interfaces/lf-web-controller.interface';

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
  @Prop() project: LfProjectMetadata;

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

  // ==== RENDERING SECTION =====================================================================

  private renderContent() {
    this.log.debug('renderContent');

    const downloadString = 'Downloading full project';
    const finalizingString = 'Finalizing project videos ...';

    let downloadInProgress = false;
    let downloadingText: string;
    let percentComplete: number;

    if (this.project.type === LfProjectType.EnvironmentProject) {
      const environmentsProgress = getProjectDownloadProgress([LfProjectType.EnvironmentProject]);
      if (environmentsProgress.length) {
        downloadInProgress = true;
        percentComplete = environmentsProgress.reduce((a, b) => a + b) / environmentsProgress.length;
      }
    } else {
      downloadInProgress = this.projectDownloadProgress && this.projectDownloadProgress.hasOwnProperty(this.project?.id);
      percentComplete = this.projectDownloadProgress[this.project.id] || null;
    }

    if (downloadInProgress) {
      downloadingText = downloadInProgress && percentComplete !== 100 ? `${downloadString} ${percentComplete || 0}%` : finalizingString;
    } else {
      downloadingText = null;
    }

    return (
      <div class="lf-project--group">
        <div class="lf-project--title-container">
          <div class="lf-project--title-hero">
            <h3 class="lf-project--title">{this.project?.name}</h3>
            {this.project?.type === LfProjectType.ObjectsProject ? this.renderAlignmentButton() : ''}
          </div>
          {this.project.description ? <p class="sub-title">{this.project.description}</p> : ''}
          {downloadInProgress ? <p class="sub-title">{downloadingText}</p> : ''}
        </div>
        <div class="lf-project--scenes-container">
          <slot></slot>
        </div>
      </div>
    );
  }

  private renderAlignmentButton() {
    this.log.debug('renderAlignmentButton');

    if (!this.project.id) return;

    return (
      <div class="lf-alignment-button--wrapper">
        <ion-router-link href={`/scene-setup-align/object/${this.project.name}/update`}>
          <img class="lf-alignment-button--image" src="/assets/icons/alignment-corners-icon.svg" />
          <p class="tooltip-text">Manually align {this.project.name}</p>
        </ion-router-link>
      </div>
    );
  }

  // - -  render Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');
    return <Host class={`${this.getLayoutClass()}`}>{this.renderContent()}</Host>;
  }
}
