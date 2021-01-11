// ==== Library Imports =======================================================
import { Component, h, Prop, Element } from '@stencil/core';
import LfLoggerService from '../../../shared/services/lf-logger.service';

// ==== App Imports ===========================================================

@Component({
  tag: 'lf-wifi-list-item',
  styleUrl: 'lf-wifi-list-item.component.scss',
  shadow: true,
})
export class LfWifiListItem {
  // ==== OWN PROPERTIES SECTION =======================================================
  // ---- Private --------------------------------------------------------------------
  private log = new LfLoggerService('LfWifiListItem').logger;

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ==========================================================
  @Element() element: HTMLElement;

  // ==== State() VARIABLES SECTION ====================================================

  // ==== PUBLIC PROPERTY API - Prop() SECTION =========================================
  @Prop() passwordProtected!: string;
  @Prop() networkName!: string;
  @Prop() signalStrength!: number;
  @Prop() focusElem?: boolean = false;
  @Prop() index?: number;

  // ==== EVENTS SECTION ===============================================================

  // ==== COMPONENT LIFECYCLE EVENTS ===================================================
  // - -  componentDidRender Implementation - Do Not Rename  - - - - - - - - - - - - - -
  public componentDidRender() {
    this.log.debug('componentDidRender');
    if (this.focusElem) {
      // allow time fo the object to be in DOM
      setTimeout(() => {
        this.element.focus();
      }, 500);
    }
  }

  // ==== LISTENERS SECTION ==============================================================
  // @Listen("eventName")
  // onEventNameReceived(event: CustomEvent): void { /** do stuff */}

  // ==== PUBLIC METHODS API - @Method() SECTION =========================================
  // @Method()
  // async publicMethod(): Promise<void> { /** do stuff */}

  // ==== LOCAL METHODS SECTION ==========================================================
  private getNetworkIconPath(signalStrength: number): string {
    this.log.debug('getNetworkIconPath');

    let wifiSignalFile = 'network-1bar.svg';
    if (signalStrength >= 66) {
      wifiSignalFile = 'network-3bars.svg';
    } else if (signalStrength >= 33) {
      wifiSignalFile = 'network-2bars.svg';
    }

    const fileName = typeof wifiSignalFile !== 'undefined' ? `${wifiSignalFile}` : '';

    return fileName;
  }

  private networkIsSecure(security: string): boolean {
    this.log.debug('networkIsUnsecured');
    return !(security == undefined || security.toUpperCase() == 'UNSECURED');
  }

  // ==== RENDERING SECTION ===============================================
  private renderLockIcon(security: string): HTMLElement {
    this.log.debug('renderLockIcon');
    if (this.networkIsSecure(security)) {
      const iconImageFile = 'Lock.svg';
      const resolvedFilePath = `assets/images/icons/${iconImageFile}`;
      return <img class="list-item--icon" alt="protected network" src={resolvedFilePath}></img>;
    } else {
      // don't show an unlock icon, just a blank div for UI
      return <div class="list-item--icon img--empty"></div>;
    }
  }

  private renderNetworkStrengthIcon(signalStrength: number) {
    this.log.debug('renderNetworkStrengthIcon');
    return <img class="list-item--icon" src={`assets/images/icons/${this.getNetworkIconPath(signalStrength)}`} alt={`${signalStrength} Signal Strength}`}></img>;
  }

  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    this.log.debug('render');

    return (
      <div class="wifi-list-item">
        <div class="list-item--inner-wrapper">
          <div class="list-item--network-name">{this.networkName}</div>
          <div class="list-item--icons-container">
            <div class="list-item--icon-wrapper">{this.renderNetworkStrengthIcon(this.signalStrength)}</div>
            <div class="list-item--icon--wrapper">{this.renderLockIcon(this.passwordProtected)}</div>
          </div>
        </div>
      </div>
    );
  }
}
