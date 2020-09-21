// @ts-nocheck  -- REMOVE ON IMPLEMENTATION

// ==== Library Imports =======================================================
import { Component, Element, h, Listen, Prop, State, Method, Host } from "@stencil/core";

// ==== App Imports ===========================================================
import { LfAppState } from "../src/shared/services/lf-app-state.service";

@Component({
  tag: "lf-component",
  styleUrls: ["lf-component.component.scss"],
  shadow: false,
})
export class LfComponent {
  // ==== OWN PROPERTIES SECTION =======================================================================
  // Dependency Injections
  private lfAppState = LfAppState;

  // Getters/Setters
  public get componentVar(): HTMLElement { return this._componentVar; }
  public set componentVar(newValue: HTMLElement) { this._componentVar = newValue; }

  // Getter/Setter backing variables and defaults
  private _componentVar: HTMLElement;

  // ---- Protected -----------------------------------------------------------------------------
  protected protectedVar;

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() el: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() stateProp: string = "string";

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() propName: string = "string";

  // ==== EVENTS SECTION ========================================================================
  // @Event() eventName: EventEmitter;

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public componentWillLoad() {
    console.group("componentWillLoad");
    try {
      // do stuff on load
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  // - -  componentDidRender Implementation - - - - - - - - - - - - - - - - - - - - - - - - - -
  public componentDidRender() {
    console.group("componentDidRender");
    try {
      // do stuff on render complete
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  // ==== LISTENERS SECTION =====================================================================
  @Listen("onEventNAme")
  onEventName(event: CustomEvent): void {
    console.group("onEventNAme");
    try {
      // event handler logic
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ========================================================
  @Method()
  async publicMethod(): Promise<void> {
    return;
  }

  // ==== LOCAL METHODS SECTION =========================================================================
  private privateMethod(): void {
    console.group("privateMethod");
    try {
      // method logic
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
  }

  // ==== RENDERING SECTION =========================================================================
  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public render(): HTMLAllCollection {
    return <Host></Host>;
  }
}
