// ==== Library Imports =======================================================
import { Component, Element, h, Host, Prop, State } from '@stencil/core';
import { LfSceneType } from '../../../shared/interfaces/lf-web-controller.interface';
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfAppStateStore from '../../../store/lf-app-state.store';

// ==== App Imports ===========================================================
// none

@Component({
  tag: 'lf-now-playing-image',
  styleUrls: ['lf-now-playing-image.component.scss'],
  shadow: true,
})
export class LfNowPlayingImage {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('LfNowPlayingImage').logger;
  private nowPlayingImageElem: HTMLImageElement;

  private readonly placeholderClassName = 'placeholder';

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() placeHolder = false;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================

  @Prop() coverImageUrl: string;
  @Prop() sceneType: LfSceneType;

  // ==== EVENTS SECTION ========================================================================
  // ==== COMPONENT LIFECYCLE EVENTS ============================================================

  public componentWillUpdate() {
    this.log.info('componentWillUpdate');
    this.placeHolder = this.coverImageUrl !== null;

    if (this.nowPlayingImageElem && !this.placeHolder) {
      this.nowPlayingImageElem.classList.remove(this.placeholderClassName);
    }
  }

  // ==== LISTENERS SECTION =====================================================================
  // ==== PUBLIC METHODS API - @Method() SECTION ================================================
  // ==== LOCAL METHODS SECTION =================================================================

  // ==== RENDERING SECTION =====================================================================
  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');

    const placeholderImagePath = '/assets/icons/image-placeholder.svg';
    const imgSrc = this.coverImageUrl || placeholderImagePath;

    let imgClassName = !this.coverImageUrl ? this.placeholderClassName : '';
    imgClassName = `${this.sceneType || ''} ${imgClassName}`;

    return (
      <Host class="lf-now-playing--img-wrapper flex-fixed">
        <ion-router-link class="link-wrapper" href={`/control/devices/${lfAppStateStore.deviceSelected?.name.replace(' ', '-')}`}>
          <img
            class={`lf-now-playing--img ${imgClassName}`}
            src={imgSrc}
            ref={el => (this.nowPlayingImageElem = el as HTMLImageElement)}
            onError={function () {
              this.classList.add('placeholder');
              this.src = placeholderImagePath;
            }}
          />
        </ion-router-link>
      </Host>
    );
  }
}
