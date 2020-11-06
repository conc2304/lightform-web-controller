// ==== Library Imports =======================================================
import { Component, h, Element, Host, Prop } from '@stencil/core';

// ==== App Imports ===========================================================

@Component({
  tag: 'lf-card',
  styleUrl: 'lf-card.component.scss',
  shadow: true,
})
export class LfCard {
  // ==== OWN PROPERTIES SECTION =======================================================================
  // Dependency Injections

  // Getters/Setters

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() el: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================


  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() cardTitle!: string;

  // ==== EVENTS SECTION ========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentDidLoad Implementation - - - - - - - - - - - - - - - - - - - - -
  public componentWillRender(): void {
    console.log('componentWillRender');
  }
  // ==== LISTENERS SECTION =====================================================================

  // ==== PUBLIC METHODS API - @Method() SECTION ========================================================
  // @Method()
  // async publicMethod(): Promise<void> {return}

  // ==== LOCAL METHODS SECTION =========================================================================

  // ==== RENDERING SECTION =========================================================================

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    return (
      <Host class="lf-card">
        <div class="lf-card--container">

          <div class="lf-card--header">
            <div class="lf-card--title">{this.cardTitle}</div>
            <div class="lf-card--divider"></div>
          </div>

          <div class="lf-card--body">
            <slot></slot>
          </div>

        </div>
      </Host>
    );
  }
}
