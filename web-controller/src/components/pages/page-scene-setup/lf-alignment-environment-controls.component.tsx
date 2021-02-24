// ==== Library Imports =======================================================
import { Component, Element, Event, EventEmitter, h, Prop, State } from '@stencil/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import { LfEnvironmentAlignmentMode } from './lf-environment-alignment-mode.enum';

@Component({
  tag: 'lf-alignment-environment-controls',
  styleUrls: ['lf-alignment-environment-controls.component.scss'],
})
export class LfAlignmentDPad {
  // ==== OWN PROPERTIES SECTION ==================================================================
  // ---- Private  --------------------------------------------------------------------------------
  private log = new LfLoggerService('LfAlignmentEnvironmentControls').logger;

  // ==== HOST HTML REFERENCE =====================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION ===============================================================
  @State() mode: LfEnvironmentAlignmentMode = LfEnvironmentAlignmentMode.Mask;
  @State() featheringAmount = 1;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ====================================================
  @Prop() buttonSize = 'regular';

  // ==== EVENTS SECTION ==========================================================================
  @Event() saveAlignment: EventEmitter<void>;
  @Event() modeChanged: EventEmitter<LfEnvironmentAlignmentMode>;

  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================

  // ==== LISTENERS SECTION =======================================================================
  // ==== LOCAL METHODS SECTION ===================================================================
  private onFeatheringChange(event: CustomEvent) {
    this.log.debug('onFeatheringChange');

    // const device = lfAppState.deviceSelected;
    const sliderAmount = event.detail.value;
    const featheringAmount = Math.round((sliderAmount + Number.EPSILON) * 100) / 100;
  }

  private onPerspectiveChange(event: CustomEvent) {
    this.log.debug('onPerspectiveChange');
  }

  private onCancel() {
    this.mode = LfEnvironmentAlignmentMode.Mask;
    this.modeChanged.emit(this.mode);

    // reset perspective or feathering
  }

  private onDone() {
    this.mode = LfEnvironmentAlignmentMode.Mask;
    this.modeChanged.emit(this.mode);
  }

  private onSave() {
    this.saveAlignment.emit();
    this.mode = LfEnvironmentAlignmentMode.Mask;
    this.modeChanged.emit(LfEnvironmentAlignmentMode.Mask);
  }

  // ==== RENDERING SECTION =======================================================================
  private renderEnvironmentControls() {
    if (this.mode === LfEnvironmentAlignmentMode.Mask) {
      return [
        <div class="lf-align-env-mode-selector">
          <div class="lf-align-env--btn-wrapper">
            <p class="lf-align-env--btn-label">feathering</p>
            <lf-button
              onClick={() => {
                this.mode = LfEnvironmentAlignmentMode.Feathering;
                this.modeChanged.emit(this.mode);
              }}
              shape="round"
            >
              <div class="alignment-mode-icon feathering"></div>
            </lf-button>
          </div>
          <div class="lf-align-env--btn-wrapper">
            <p class="lf-align-env--btn-label">perspective</p>
            <lf-button
              onClick={() => {
                this.mode = LfEnvironmentAlignmentMode.Perspective;
                this.modeChanged.emit(this.mode);
              }}
              shape="round"
            >
              <div class="alignment-mode-icon perspective"></div>
            </lf-button>
          </div>
        </div>,
      ];
    } else if (this.mode === LfEnvironmentAlignmentMode.Feathering) {
      return (
        <div class="lf-align-env--feather-container">
          <ion-range
            min={0}
            max={1}
            step={0.1}
            value={this.featheringAmount}
            onIonChange={event => {
              this.onFeatheringChange(event);
            }}
          />
          {/* <ion-range min={1000} max={2000} step={100} snaps={true} color="secondary"></ion-range> */}
        </div>
      );
    } else if (this.mode === LfEnvironmentAlignmentMode.Perspective) {
      return <lf-alignment-d-pad />;
    }
  }

  private renderActionButtons() {
    this.log.debug('renderActionButtons');

    if (this.mode === LfEnvironmentAlignmentMode.Mask) {
      return (
        <div class="action-btn-container mask-mode">
          <lf-button
            context="primary"
            size={this.buttonSize}
            onClick={() => {
              this.onSave();
            }}
          >
            Save
          </lf-button>
        </div>
      );
    } else {
      return (
        <div class="action-btn-container">
          <lf-button
            context="destructive"
            size={this.buttonSize}
            onClick={() => {
              this.onCancel();
            }}
          >
            Cancel
          </lf-button>
          <lf-button
            context="primary"
            size={this.buttonSize}
            onClick={() => {
              this.onDone();
            }}
          >
            Done
          </lf-button>
        </div>
      );
    }
  }

  private renderControllerUI() {
    return (
      <div class="lf-alignment-environment-controls--inner-wrapper">
        <div class="controller-interface">{this.renderEnvironmentControls()}</div>
        <div class="controller-action-buttons">{this.renderActionButtons()}</div>
      </div>
    );
  }

  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');

    return <div class="lf-alignment-environment-controls--container">{this.renderControllerUI()}</div>;
  }
}
