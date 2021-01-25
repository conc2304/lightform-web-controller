// @ts-ignore -- entire file via tsconfig.json
// ==== Library Imports =======================================================
import { Component, Element, Event, EventEmitter, h, Host, Listen, Prop, State } from '@stencil/core';

// ==== App Imports ===========================================================

@Component({
  tag: 'lf-template',
  styleUrls: ['lf-template.component.scss'],
  shadow: false,
})
export class LfTemplate {
  // ==== OWN PROPERTIES SECTION ===============================================================
  // Dependency Injections
  // none

  // ---- Private  -----------------------------------------------------------------------------
  private internalPrivateVar = null;

  private readonly readonlyProp = 'lf-item-focused';

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() componentState: string;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() propName: string;

  // ==== EVENTS SECTION ========================================================================
  @Event() eventEmittedName: EventEmitter;

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public componentWillLoad() {
    console.log('componentWillLoad');
  }

  // - -  componentDidLoad Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public componentDidLoad() {
    console.log('componentDidLoad');
  }

  // ==== LISTENERS SECTION =====================================================================

  @Listen('eventReceivedName')
  eventReceivedNameHandler(event: CustomEvent): void {
    console.log('eventReceivedNameHandler', event);
  }

  // ==== PUBLIC METHODS API - @Method() SECTION =================================================
  @Method()
  async publicMethod(): Promise<void> {
    return;
  }

  // ==== LOCAL METHODS SECTION ==================================================================
  private localMethod() {
    console.log('localMethod');
  }

  // ==== RENDERING SECTION =========================================================================
  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    return <Host></Host>;
  }
}
