// ==== Library Imports =======================================================
import { Component, Element, Method, Prop } from '@stencil/core';

// ==== App Imports ===========================================================
import state from '../../../store/lf-app-state.store';
import { LfViewportBreakpoint } from '../../../shared/interfaces/lf-web-controller.interface';
import { LfViewportSize } from '../../../shared/enums/lf-viewport-query-sizes.enum';
import LfLoggerService from '../../../shared/services/lf-logger.service';
import { LF_MOBILE_QUERIES } from '../../../shared/constants/lf-viewport-breakpoints.constant';


@Component({
  tag: 'lf-viewport-size-publisher',
})
export class LfViewportSizePublisher {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('LfViewportSizePublisher').logger;
  private sizesList: Array<LfViewportBreakpoint>;

  // ---- Protected -----------------------------------------------------------------------------
  protected static mobileSizes: Array<string> = LF_MOBILE_QUERIES;

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() viewportPublisherEl: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() sizes: Array<LfViewportBreakpoint> = [];

  // ==== EVENTS SECTION ============================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public componentWillLoad() {
    this.log.debug('componentWillLoad');
    if (!this.sizes || this.sizes.length < 1) {
      // Default sizes, if none are provided as a Prop
      this.sizesList = [
        { name: LfViewportSize.ExtraSmall, minWidth: '0', maxWidth: '319' },
        { name: LfViewportSize.Small, minWidth: '320', maxWidth: '511' },
        { name: LfViewportSize.Medium, minWidth: '512', maxWidth: '991' },
        { name: LfViewportSize.Large, minWidth: '992', maxWidth: '1199' },
        { name: LfViewportSize.ExtraLarge, minWidth: '1200', maxWidth: '9999' },
      ];
    } else {
      this.sizesList = [...this.sizes];
    }
  }

  // - -  componentDidLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public componentDidLoad() {
    this.log.debug('componentDidLoad');

    // Add listeners for all sizes provided
    for (let i = 0; i < this.sizesList.length; i++) {
      window
        .matchMedia(`(min-width: ${this.sizesList[i].minWidth}px) and (max-width: ${this.sizesList[i].maxWidth}px)`)
        .addEventListener('change', this.handleMatchMediaChange.bind(this));
    }
  }

  // - -  disconnectedCallback Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public disconnectedCallback() {
    this.log.debug('disconnectedCallback');

    // Remove listeners for all sizes provided
    for (let i = 0; i < this.sizesList.length; i++) {
      window
        .matchMedia(`(min-width: ${this.sizesList[i].minWidth}px) and (max-width: ${this.sizesList[i].maxWidth}px)`)
        .removeEventListener('change', this.handleMatchMediaChange.bind(this));
    }
  }

  // ==== LISTENERS SECTION =====================================================================

  // ==== PUBLIC METHODS API - @Method() SECTION =================================================
  @Method()
  async getCurrentSize(): Promise<LfViewportSize> {
    this.log.debug('getCurrentSize');
    // Iterate over all given sizes and see which one matches
    for (let i = 0; i < this.sizesList.length; i++) {
      if (
        window.matchMedia(`(min-width: ${this.sizesList[i].minWidth}px) 
          and (max-width: ${this.sizesList[i].maxWidth}px)`).matches
      ) {
        return this.sizesList[i].name as LfViewportSize;
      }
    }
  }

  // ==== LOCAL METHODS SECTION ==================================================================
  private handleMatchMediaChange(q: MediaQueryListEvent) {
    this.log.info('handleMatchMediaChange');

    if (q.matches) {
      // Find the name of the matching size and emit an event
      for (let i = 0; i < this.sizesList.length; i++) {
        if (q.media.indexOf(`min-width: ${this.sizesList[i].minWidth}px`) > -1) {

          const isMobile = LfViewportSizePublisher.mobileSizes.includes(this.sizesList[i].name);
          this.log.info("Mobile = ", isMobile);
          state.mobileLayout = isMobile;
        }
      }
    }
  }

  // ==== RENDERING SECTION ======================================================================
  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render() {
    this.log.debug('render');
    return [];
  }
}
