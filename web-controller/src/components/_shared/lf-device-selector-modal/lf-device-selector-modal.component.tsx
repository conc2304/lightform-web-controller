// ==== Library Imports =======================================================
import { Component, Element, h, Listen, State } from '@stencil/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import { LfDevice } from '../../../shared/interfaces/lf-web-controller.interface';
import lfAppState from '../../../store/lf-app-state.store';

@Component({
  tag: 'lf-device-selector-modal',
  styleUrl: 'lf-device-selector-modal.component.scss',
})
export class LfDeviceSelectorModal {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('LfDeviceSelectorModal').logger;

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() lfDeviceSelectorModalEl: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() deviceSelected: LfDevice = lfAppState.deviceSelected;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================

  // ==== EVENTS SECTION ========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - -
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');
  }

  // ==== LISTENERS SECTION =====================================================================
  @Listen('_layoutUpdated', { target: 'document' })
  onWindowResized(): void {
    this.log.debug('onWindowResized');
    if (lfAppState.mobileLayout) {
      this.dismissModal();
    }
  }

  // ==== LISTENERS SECTION =====================================================================
  @Listen('_deviceSelected', { target: 'document' })
  _onDeviceSelected() {
    this.log.info('_deviceSelected');
    this.deviceSelected = lfAppState.deviceSelected;
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ================================================
  // ==== LOCAL METHODS SECTION =================================================================
  private onDeviceSelected(device: LfDevice): void {
    this.log.info('onDeviceSelected');

    lfAppState.deviceSelected = device;
    this.dismissModal();
  }

  private dismissModal() {
    // dismiss the closest modal and optionally pass back data
    (this.lfDeviceSelectorModalEl.closest('ion-modal') as any).dismiss({
      'dismissed': true,
    });
  }

  // ==== RENDERING SECTION =====================================================================
  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - -
  render() {
    this.log.debug('render');

    return (
      <div class="lf-device-selector-modal">
        <h2 class="lf-modal-hero-text">Change the main device </h2>
        <span
          class="close-modal-button"
          onClick={() => {
            this.dismissModal();
          }}
        >
          <ion-icon size="large" name="close"></ion-icon>
        </span>

        <lf-list class="device-selector--list scroll-y">
          {lfAppState.registeredDevices.map((device: LfDevice) => {
            const isSelected = device === lfAppState.deviceSelected ? 'selected' : '';

            return (
              <lf-list-item
                class="device-selector--item"
                onClick={() => {
                  this.onDeviceSelected(device);
                }}
                active={device === this.deviceSelected}
              >
                <div slot="start" class={`device-selector--selected-icon ${isSelected}`}></div>
                <p class="device-selector--device-name">{device?.name || 'Lightform Device'}</p>
              </lf-list-item>
            );
          })}
        </lf-list>
      </div>
    );
  }
}
