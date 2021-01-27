// ==== Library Imports =======================================================
import { Component, Element, h, Prop } from '@stencil/core';

// ==== App Imports ===========================================================
import { ProcessStatus } from '../../../shared/enums/lf-process-status.enum';
import LfLoggerService from '../../../shared/services/lf-logger.service';


@Component({
  tag: 'lf-process-status-diagram',
  styleUrls: ['lf-process-status-diagram.component.scss'],
})
export class LfProcessStatusDiagram {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('LfProcessStatusDiagram').logger;

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() status: ProcessStatus = ProcessStatus.Pending;
  @Prop() processSenderName: string;
  @Prop() processSenderImg: string;
  @Prop() processReceiverName: string;
  @Prop() processReceiverImg: string;

  // ==== EVENTS SECTION ========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - -
  public componentWillLoad() {
    this.log.debug('componentWillLoad');
  }

  // ==== LISTENERS SECTION =====================================================================
  // ==== PUBLIC METHODS API - @Method() SECTION ================================================
  // ==== LOCAL METHODS SECTION =================================================================

  // ==== RENDERING SECTION =====================================================================
  private renderProcessStatusIcon() {
    this.log.debug('renderConnectingStatus');
    switch (this.status) {
      case ProcessStatus.Pending:
        return <vaadin-progress-bar indeterminate value={0}></vaadin-progress-bar>;
      case ProcessStatus.Successful:
        return (
          <img
            src="./assets/images/icons/check-mark--rounded-green.svg"
            class="process-status-diagram--status-icon success-icon animation--pop-in"
            style={{ '--animation-order': 1 } as any}
          ></img>
        );
      case ProcessStatus.Failed:
        return <img src="./assets/images/icons/x--flat-red.svg" class="process-status-diagram--status-icon failed-icon animation--pop-in" style={{ '--animation-order': 1 } as any}></img>;
    }
  }

  // - -  render Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render(): HTMLAllCollection {
    return (
      <div class="process-status-diagram--container">
        <div class="process-status-diagram--status-container animation--pop-in center-and-shrink" style={{ '--animation-order': 1 } as any}>
          <div class="process-status-diagram--points">
            <div class="process-status-diagram--img-frame">
              <img src={this.processSenderImg} class="process-status-diagram--img"></img>
            </div>
            <p>{this.processSenderName}</p>
          </div>

          <div class="process-status-diagram--status-wrapper">{this.renderProcessStatusIcon()}</div>

          <div class="process-status-diagram--points">
            <div class="process-status-diagram--img-frame">
              <img src={this.processReceiverImg} class="process-status-diagram--img"></img>
            </div>
            <p>{this.processReceiverName}</p>
          </div>
        </div>
      </div>
    );
  }
}
