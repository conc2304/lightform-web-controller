// ==== Library Imports =======================================================
import { Component, Element, h, Host, Listen, Prop, State } from '@stencil/core';

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
  @Element() pageAccountEl: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() projectDownloadProgress = lfAppState.projectDownloadProgress;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() isMobileLayout: boolean = lfAppState.mobileLayout;
  @Prop() title: string;
  @Prop() description: string;
  @Prop() projectId: string;

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

  private renderSkeletonCards(numCards: number = 3) {
    return new Array(numCards).fill(null).map(() => {
      return <lf-scene-card skeleton />;
    });
  }

  private renderContent() {
    this.log.debug('renderContent');

    const downloadInProgress = this.projectDownloadProgress && this.projectDownloadProgress.hasOwnProperty(this.projectId);
    const downloadingText =
      downloadInProgress && this.projectDownloadProgress[this.projectId] !== 100
        ? `Downloading full project ${this.projectDownloadProgress[this.projectId]}%`
        : 'Finalizing project videos ...';

    return (
      <div class="lf-experience--group">
        <h3 class="lf-experience--title animate-in" style={{ '--animation-order': 0 } as any}>
          {this.title}
          {this.title ? <p class="sub-title">{this.description}</p> : ''}
          {downloadInProgress ? <p class="sub-title">{downloadingText}</p> : ''}

        </h3>
        <div class="lf-experience--scenes-container">
          <slot></slot>
          {downloadInProgress ? this.renderSkeletonCards(3) : ''}
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
