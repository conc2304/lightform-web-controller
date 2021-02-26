// ==== Library Imports =======================================================
import { Component, Element, h, Host, Prop } from '@stencil/core';
import { parse as parseDuration } from 'iso8601-duration';

// ==== App Imports ===========================================================
import { LfScene } from '../../../shared/interfaces/lf-web-controller.interface';
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfAppStateStore from '../../../store/lf-app-state.store';

@Component({
  tag: 'lf-scene-card',
  styleUrls: ['lf-scene-card.component.scss'],
  shadow: false,
  scoped: true,
})
export class LfSceneCard {
  // ==== OWN PROPERTIES SECTION ==================================================================
  // ---- Private  --------------------------------------------------------------------------------
  private log = new LfLoggerService('LfSceneCard').logger;

  // ---- Protected -------------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE =====================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION ===============================================================

  // ==== PUBLIC PROPERTY API - Prop() SECTION ====================================================
  @Prop() selected: boolean = false;
  @Prop() scene: LfScene;
  @Prop() isMobileLayout: boolean = lfAppStateStore.mobileLayout;

  // ==== EVENTS SECTION ==========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================
  // ==== LISTENERS SECTION =======================================================================
  // ==== PUBLIC METHODS API - @Method() SECTION ==================================================
  // ==== LOCAL METHODS SECTION ===================================================================

  private formattedDuration(isoDuration: string): string {
    this.log.debug('formattedDuration');

    if (!isoDuration) {
      return '';
    }

    const duration = parseDuration(isoDuration);
    const hours = duration.hours > 0 ? `${duration.hours}:` : '';
    const minutes = duration.hours > 0 ? padNumber(duration.minutes) : duration.minutes;
    const seconds = padNumber(Math.floor(duration.seconds));


    const formattedDuration = `${hours}${minutes}:${seconds}`;

    return formattedDuration;

    function padNumber(num: number) {
      return num.toString().padStart(2, '0');
    }
  }

  // ==== RENDERING SECTION =======================================================================
  private getClassName(): string {
    let className = 'lf-scene-card';
    if (this.selected) {
      className = `${className} lf-scene-card--selected`;
    }

    if (this.isMobileLayout) {
      className = `${className} lf-layout--mobile`;
    } else {
      className = `${className} lf-layout--desktop`;
    }

    return className;
  }

  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');

    const hdmiClassName = this.scene.name.toLowerCase().includes('hdmi') ? 'hdmi' : '';
    const placeholderImagePath = '/assets/icons/image-placeholder.svg';
    return (
      <Host class={this.getClassName()}>
        <div>
          <div class="lf-scene-card--content flex-parent">
            {/* LEFT */}
            <div class="lf-scene-card--img-wrapper flex-fixed">
              {this.scene.thumbnail ? (
                <img
                  class={`lf-scene-card--scene-img ${hdmiClassName}`}
                  src={this.scene.thumbnail}
                  onError={function () {
                    this.classList.add('placeholder');
                    this.src = placeholderImagePath;
                  }}
                />
              ) : (
                <img class="lf-scene-card--scene-img placeholder" src={placeholderImagePath} />
              )}
            </div>

            {/* Right */}
            <div class="lf-scene-card--info-container flex-expand">
              {/* TOP */}
              <div class="info-container--top-content">
                <div class="info-container--title">{this.scene.name}</div>
                <div class="info-container--description">{this.scene.description}</div>
              </div>
              {/* Bottom */}
              <div class="info-container--bottom-content">
                <div class="info-container--duration">{this.formattedDuration(this.scene.duration)}</div>
              </div>
            </div>
          </div>
          {/* end .lf-scene-card--content */}
        </div>
      </Host>
    );
  }
}
