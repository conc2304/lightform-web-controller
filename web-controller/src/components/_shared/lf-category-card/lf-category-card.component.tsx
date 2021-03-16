// ==== Library Imports =======================================================
import { Component, Element, h, Host, Prop } from '@stencil/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';

@Component({
  tag: 'lf-category-card',
  styleUrl: 'lf-category-card.component.scss',
  shadow: true,
})
export class LfCategoryCard {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('LfCategoryCard').logger;

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() isMobileLayout: boolean;
  @Prop() name: string;
  @Prop() url: string;
  @Prop() thumbnailUrl: string;

  // ==== EVENTS SECTION ========================================================================
  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // ==== LISTENERS SECTION =====================================================================
  // ==== PUBLIC METHODS API - @Method() SECTION ================================================

  // ==== LOCAL METHODS SECTION =================================================================
  private getLayoutClass() {
    this.log.debug('getLayoutClass');

    return this.isMobileLayout ? 'lf-layout--mobile' : 'lf-layout--desktop';
  }

  // ==== RENDERING SECTION =====================================================================

  private renderContent() {
    this.log.debug('renderContent');

    return (
      <ion-router-link href={this.url || '/'} class="lf-env-category--card-container">
        <div class="lf-env-category--aspect-wrapper">
          <div class="lf-env-category--content-wrapper">
            <h3 class="lf-env-category--title">{this.name || 'N/A'}</h3>
            <div class="gradient-foreground"></div>
            <img class="image-background" src={this.thumbnailUrl || ''} />
          </div>
        </div>
      </ion-router-link>
    );
  }

  // - -  render Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - - - - - - - - -
  render() {
    try {
      this.log.debug('render');
      return <Host class={`lf-category-card ${this.getLayoutClass()}`}>{this.renderContent()}</Host>;
    } catch (error) {
      this.log ? this.log.error(error) : console.error(error);
      return '';
    }
  }
}
