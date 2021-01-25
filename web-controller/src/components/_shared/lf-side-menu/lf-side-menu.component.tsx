// ==== Library Imports =======================================================
import { Component, Element, h, Listen, State } from '@stencil/core';
import { modalController } from '@ionic/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import { LfDevice } from '../../../shared/interfaces/lf-web-controller.interface';
import state from '../../../store/lf-app-state.store';

@Component({
  tag: 'lf-side-menu',
  styleUrl: 'lf-side-menu.component.scss',
})
export class LfSideMenu {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('LfSideMenu').logger;

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() deviceInfo: LfDevice;
  @State() pathnameActive: string = '/';
  @State() activeProjectName = state.projectSelectedName || 'Lightform';
  @State() registeredDevices: Array<LfDevice> = state.registeredDevices;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  // ==== EVENTS SECTION ========================================================================
  // ==== COMPONENT LIFECYCLE EVENTS ============================================================

  // ==== LISTENERS SECTION =====================================================================
  @Listen('_registeredDevicesUpdated', { target: 'document' })
  onRegisteredDevicesUpdated() {
    this.log.info('_registeredDevicesUpdated');
    this.registeredDevices = state.registeredDevices;
  }

  @Listen('_projectSelectedUpdated', { target: 'document' })
  async onProjectSelectedUpdated(): Promise<void> {
    this.log.debug('_projectSelectedUpdated');
    this.activeProjectName = state.projectSelectedName || 'LIGHTFORM';
  }

  @Listen('_playbackStateUpdated', {
    target: 'document',
  })
  async onPlaybackStateUpdated(): Promise<void> {
    this.log.info('onPlaybackStateUpdated');

    if (!state.playbackState) {
      return;
    }


  }

  // ==== PUBLIC METHODS API - @Method() SECTION =================================================
  // ==== LOCAL METHODS SECTION ==================================================================
  private async openDeviceSelector(): Promise<void> {
    this.log.debug('openDeviceSelector');

    const modal = await modalController.create({
      component: 'lf-device-selector-modal',
      cssClass: 'lf-device-selector--modal',
    });
    await modal.present();
  }

  // ==== RENDERING SECTION ======================================================================
  private renderMenuHeader() {
    this.log.debug('renderMenuHeader');

    const deviceDisplayName = state?.deviceSelected?.name || 'No Device';

    return (
      <div class="menu-header--inner">
        <img slot="start" class="menu-header--logomark" src="/assets/images/logos/Logomark White.svg" alt="Lightform"></img>
        <h3 class="menu-header--device-title">{deviceDisplayName}</h3>
        {this.renderChangeDeviceButton()}
      </div>
    );
  }

  private renderChangeDeviceButton() {
    this.log.debug('renderChangeDeviceButton');

    if (this.registeredDevices?.length) {
      return (
        <div class="menu-header--link-button" onClick={() => this.openDeviceSelector()}>
          change
        </div>
      );
    }
  }

  private renderMenuNavigation() {
    this.log.debug('renderMenuNavigation');

    return (
      <div class="menu-nav--inner">
        <lf-navigation-buttons currentRoute={this.pathnameActive} />
      </div>
    );
  }

  private renderNowPlaying() {
    this.log.debug('renderNowPlaying');

    const imgSrc = state?.sceneSelected?.thumbnail || '/assets/icons/image-placeholder-white.svg';
    let imgClassName = !state?.sceneSelected?.thumbnail ? 'placeholder' : '';
    imgClassName = `${state.sceneSelected?.type} ${imgClassName}`;
    return (
      <div class="now-playing--inner">
        <div class="lf-now-playing--img-wrapper">
          <img src={imgSrc} class={`lf-now-playing--img ${imgClassName}`} />
        </div>
        <div class="lf-now-playing--text">
          <div class="lf-now-playing--hero truncate-text">NOW PLAYING ON {this.activeProjectName}</div>
          <div class="lf-now-playing--scene-title truncate-text">{state?.sceneSelected?.name || '...'}</div>
        </div>
      </div>
    );
  }

  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - -
  render() {
    this.log.debug('render');

    return (
      <div class="lf-side-menu">
        <div class="lf-side-menu--header-container">{this.renderMenuHeader()}</div>
        <div class="lf-side-menu--navigation-container">{this.renderMenuNavigation()}</div>
        <div class="lf-side-menu--now-playing-container">{this.renderNowPlaying()}</div>
      </div>
    );
  }
}
