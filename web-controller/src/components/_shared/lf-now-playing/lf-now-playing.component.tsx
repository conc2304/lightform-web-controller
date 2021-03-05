// ==== Library Imports =======================================================
import { Component, Element, h, Host, Listen, State } from '@stencil/core';
import { LfScene } from '../../../shared/interfaces/lf-web-controller.interface';
import LfLoggerService from '../../../shared/services/lf-logger.service';

// ==== App Imports ===========================================================
import state from '../../../store/lf-app-state.store';

@Component({
  tag: 'lf-now-playing',
  styleUrls: ['lf-now-playing.component.scss'],
  shadow: false,
  scoped: true,
})
export class LfNowPlayingMobile {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('LfNowPlaying').logger;
  private nowPlayingImageElem: HTMLImageElement;

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() activeProjectName: string = state.projectSelectedName;
  @State() sceneSelected: LfScene = state.sceneSelected;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  // ==== EVENTS SECTION ========================================================================
  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // ==== LISTENERS SECTION =====================================================================

  @Listen('_projectSelectedUpdated', { target: 'document' })
  async onProjectSelectedUpdated(): Promise<void> {
    this.log.debug('_projectSelectedUpdated');
    this.activeProjectName = state.projectSelectedName || 'OBJECT';
  }

  @Listen('_sceneSelectedUpdated', {
    target: 'document',
  })
  async onSceneSelectedUpdated(): Promise<void> {
    this.log.info('onSceneSelectedUpdated');
    this.sceneSelected = state.sceneSelected;
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ================================================
  // ==== LOCAL METHODS SECTION =================================================================

  // ==== RENDERING SECTION =====================================================================
  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');

    const placeholderImagePath = '/assets/icons/image-placeholder.svg';
    const imgSrc = this.sceneSelected?.thumbnail || '/assets/icons/image-placeholder.svg';
    const playerClassName = !this.sceneSelected || !this.activeProjectName ? 'hidden' : '';

    let imgClassName = !this.sceneSelected?.thumbnail ? 'placeholder' : '';
    imgClassName = `${this.sceneSelected?.type || ''} ${imgClassName}`;

    if (!imgClassName.includes('placeholder') && this.nowPlayingImageElem) {
      // the on error classname does not seem to be reset
      this.nowPlayingImageElem.classList.remove('placeholder');
    }

    return (
      <Host>
        <div class={`lf-now-playing--container ${playerClassName}`}>
          <div class="lf-now-playing--content flex-parent">
            <div class="lf-now-playing--img-wrapper flex-fixed">
              <img
                class={`lf-now-playing--img ${imgClassName}`}
                src={imgSrc}
                ref={el => (this.nowPlayingImageElem = el as HTMLImageElement)}
                onError={function () {
                  this.classList.add('placeholder');
                  this.src = placeholderImagePath;
                }}
              ></img>
            </div>
            <div class="lf-now-playing--text flex-expand">
              <div class="truncate-wrapper">
                <div class="lf-now-playing--hero truncate">NOW PLAYING ON {this.activeProjectName}</div>
                <div class="lf-now-playing--scene-title truncate">{this.sceneSelected?.name || '...'}</div>
              </div>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
