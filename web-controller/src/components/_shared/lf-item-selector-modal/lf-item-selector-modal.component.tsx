// ==== Library Imports =======================================================
import { Component, Element, h, Prop } from '@stencil/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';

@Component({
  tag: 'lf-item-selector-modal',
  styleUrl: 'lf-item-selector-modal.component.scss',
})
export class LfItemSelectorModal {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('LfItemSelectorModal').logger;

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() modalTitle: string = 'Select One';
  @Prop() listItems: Array<any>;
  @Prop() isSelectedConditionFn: Function;
  @Prop() selectedFn?: Function;
  @Prop() returnDisplayTextFn: Function;
  @Prop() dismissButton: boolean = true;

  // ==== EVENTS SECTION ========================================================================
  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // ==== LISTENERS SECTION =====================================================================
  // ==== PUBLIC METHODS API - @Method() SECTION ================================================
  // ==== LOCAL METHODS SECTION =================================================================

  private dismissModal(data) {
    // dismiss the closest modal and optionally pass back data
    (this.hostElement.closest('ion-modal') as any).dismiss({
      'dismissed': true,
      'result': data,
    });
  }

  // ==== RENDERING SECTION =====================================================================

  private renderCloseButton() {
    if (this.dismissButton) {
      return (
        <span
          class="close-modal-button"
          onClick={() => {
            this.dismissModal(null);
          }}
        >
          <ion-icon size="large" name="close"></ion-icon>
        </span>
      );
    }
  }

  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - -
  render() {
    this.log.debug('render');

    return (
      <div class="lf-item-selector-modal">
        <h2 class="lf-item-selector-modal--title">{this.modalTitle}</h2>

        {this.renderCloseButton()}

        <lf-list class="lf-item-selector--list scroll-y">
          {this.listItems.map((item: any) => {
            const displayText = this.returnDisplayTextFn(item);
            const isSelectedClass = this.isSelectedConditionFn && this.isSelectedConditionFn(item) ? 'selected' : '';

            if (!displayText) {
              return;
            }

            return (
              <lf-list-item
                class="lf-item-selector--item"
                onClick={() => {
                  if (this.selectedFn) {
                    this.selectedFn(item);
                  } else {
                    this.dismissModal(item);
                  }
                }}
              >
                <div slot="start" class={`lf-item-selector--selected-icon ${isSelectedClass}`}></div>
                <p class="lf-item-selector--item-name">{displayText}</p>
              </lf-list-item>
            );
          })}
        </lf-list>
      </div>
    );
  }
}
