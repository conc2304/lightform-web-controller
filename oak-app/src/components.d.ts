/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { LfKeyboardBlurDirection } from "./components/_common/lf-keyboard/lf-keyboard-blur-direction.enum";
export namespace Components {
    interface AppRoot {
    }
    interface LfAppHome {
        "animatedBackground": boolean;
        "device": { name: string; serial: string; };
    }
    interface LfCard {
        "cardTitle": string;
    }
    interface LfFirmwareApp {
    }
    interface LfKeyboard {
        "blurDirection"?: LfKeyboardBlurDirection;
        "initialMarkerPosition": { row: number; column: number };
        "keyNavigationEnabled"?: boolean;
        "wrapNavigation": boolean;
    }
    interface LfPairingApp {
    }
    interface LfRegistrationApp {
    }
    interface LfRegistrationInput {
    }
    interface LfRegistrationRegistering {
        "registrationCode": any;
    }
    interface LfWifiConnecting {
    }
    interface LfWifiList {
    }
    interface LfWifiListItem {
        "focusElem"?: boolean;
        "index"?: number;
        "networkName": string;
        "passwordProtected": string;
        "signalStrength": number;
    }
    interface LfWifiPassword {
        "initialFocus": 'passwordToggle' | 'keyboard';
        "networkName": string;
    }
}
declare global {
    interface HTMLAppRootElement extends Components.AppRoot, HTMLStencilElement {
    }
    var HTMLAppRootElement: {
        prototype: HTMLAppRootElement;
        new (): HTMLAppRootElement;
    };
    interface HTMLLfAppHomeElement extends Components.LfAppHome, HTMLStencilElement {
    }
    var HTMLLfAppHomeElement: {
        prototype: HTMLLfAppHomeElement;
        new (): HTMLLfAppHomeElement;
    };
    interface HTMLLfCardElement extends Components.LfCard, HTMLStencilElement {
    }
    var HTMLLfCardElement: {
        prototype: HTMLLfCardElement;
        new (): HTMLLfCardElement;
    };
    interface HTMLLfFirmwareAppElement extends Components.LfFirmwareApp, HTMLStencilElement {
    }
    var HTMLLfFirmwareAppElement: {
        prototype: HTMLLfFirmwareAppElement;
        new (): HTMLLfFirmwareAppElement;
    };
    interface HTMLLfKeyboardElement extends Components.LfKeyboard, HTMLStencilElement {
    }
    var HTMLLfKeyboardElement: {
        prototype: HTMLLfKeyboardElement;
        new (): HTMLLfKeyboardElement;
    };
    interface HTMLLfPairingAppElement extends Components.LfPairingApp, HTMLStencilElement {
    }
    var HTMLLfPairingAppElement: {
        prototype: HTMLLfPairingAppElement;
        new (): HTMLLfPairingAppElement;
    };
    interface HTMLLfRegistrationAppElement extends Components.LfRegistrationApp, HTMLStencilElement {
    }
    var HTMLLfRegistrationAppElement: {
        prototype: HTMLLfRegistrationAppElement;
        new (): HTMLLfRegistrationAppElement;
    };
    interface HTMLLfRegistrationInputElement extends Components.LfRegistrationInput, HTMLStencilElement {
    }
    var HTMLLfRegistrationInputElement: {
        prototype: HTMLLfRegistrationInputElement;
        new (): HTMLLfRegistrationInputElement;
    };
    interface HTMLLfRegistrationRegisteringElement extends Components.LfRegistrationRegistering, HTMLStencilElement {
    }
    var HTMLLfRegistrationRegisteringElement: {
        prototype: HTMLLfRegistrationRegisteringElement;
        new (): HTMLLfRegistrationRegisteringElement;
    };
    interface HTMLLfWifiConnectingElement extends Components.LfWifiConnecting, HTMLStencilElement {
    }
    var HTMLLfWifiConnectingElement: {
        prototype: HTMLLfWifiConnectingElement;
        new (): HTMLLfWifiConnectingElement;
    };
    interface HTMLLfWifiListElement extends Components.LfWifiList, HTMLStencilElement {
    }
    var HTMLLfWifiListElement: {
        prototype: HTMLLfWifiListElement;
        new (): HTMLLfWifiListElement;
    };
    interface HTMLLfWifiListItemElement extends Components.LfWifiListItem, HTMLStencilElement {
    }
    var HTMLLfWifiListItemElement: {
        prototype: HTMLLfWifiListItemElement;
        new (): HTMLLfWifiListItemElement;
    };
    interface HTMLLfWifiPasswordElement extends Components.LfWifiPassword, HTMLStencilElement {
    }
    var HTMLLfWifiPasswordElement: {
        prototype: HTMLLfWifiPasswordElement;
        new (): HTMLLfWifiPasswordElement;
    };
    interface HTMLElementTagNameMap {
        "app-root": HTMLAppRootElement;
        "lf-app-home": HTMLLfAppHomeElement;
        "lf-card": HTMLLfCardElement;
        "lf-firmware-app": HTMLLfFirmwareAppElement;
        "lf-keyboard": HTMLLfKeyboardElement;
        "lf-pairing-app": HTMLLfPairingAppElement;
        "lf-registration-app": HTMLLfRegistrationAppElement;
        "lf-registration-input": HTMLLfRegistrationInputElement;
        "lf-registration-registering": HTMLLfRegistrationRegisteringElement;
        "lf-wifi-connecting": HTMLLfWifiConnectingElement;
        "lf-wifi-list": HTMLLfWifiListElement;
        "lf-wifi-list-item": HTMLLfWifiListItemElement;
        "lf-wifi-password": HTMLLfWifiPasswordElement;
    }
}
declare namespace LocalJSX {
    interface AppRoot {
    }
    interface LfAppHome {
        "animatedBackground"?: boolean;
        "device"?: { name: string; serial: string; };
        "onAppRouteChanged"?: (event: CustomEvent<any>) => void;
    }
    interface LfCard {
        "cardTitle": string;
    }
    interface LfFirmwareApp {
    }
    interface LfKeyboard {
        "blurDirection"?: LfKeyboardBlurDirection;
        "initialMarkerPosition"?: { row: number; column: number };
        "keyNavigationEnabled"?: boolean;
        "onBlurLfKeyboard"?: (event: CustomEvent<any>) => void;
        "onSubmitButtonPressed"?: (event: CustomEvent<any>) => void;
        "onVirtualKeyboardKeyPressed"?: (event: CustomEvent<any>) => void;
        "wrapNavigation"?: boolean;
    }
    interface LfPairingApp {
    }
    interface LfRegistrationApp {
    }
    interface LfRegistrationInput {
        "onRegistrationCodeCompleted"?: (event: CustomEvent<any>) => void;
    }
    interface LfRegistrationRegistering {
        "onAppRouteChanged"?: (event: CustomEvent<any>) => void;
        "onRestartPairingProcess"?: (event: CustomEvent<any>) => void;
        "onRestartPasswordProcess"?: (event: CustomEvent<any>) => void;
        "registrationCode"?: any;
    }
    interface LfWifiConnecting {
        "onAppRouteChanged"?: (event: CustomEvent<any>) => void;
        "onRestartPairingProcess"?: (event: CustomEvent<any>) => void;
        "onRestartPasswordProcess"?: (event: CustomEvent<any>) => void;
    }
    interface LfWifiList {
        "onNetworkSelected"?: (event: CustomEvent<any>) => void;
    }
    interface LfWifiListItem {
        "focusElem"?: boolean;
        "index"?: number;
        "networkName": string;
        "passwordProtected": string;
        "signalStrength": number;
    }
    interface LfWifiPassword {
        "initialFocus"?: 'passwordToggle' | 'keyboard';
        "networkName"?: string;
        "onPasswordSubmitted"?: (event: CustomEvent<any>) => void;
    }
    interface IntrinsicElements {
        "app-root": AppRoot;
        "lf-app-home": LfAppHome;
        "lf-card": LfCard;
        "lf-firmware-app": LfFirmwareApp;
        "lf-keyboard": LfKeyboard;
        "lf-pairing-app": LfPairingApp;
        "lf-registration-app": LfRegistrationApp;
        "lf-registration-input": LfRegistrationInput;
        "lf-registration-registering": LfRegistrationRegistering;
        "lf-wifi-connecting": LfWifiConnecting;
        "lf-wifi-list": LfWifiList;
        "lf-wifi-list-item": LfWifiListItem;
        "lf-wifi-password": LfWifiPassword;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "app-root": LocalJSX.AppRoot & JSXBase.HTMLAttributes<HTMLAppRootElement>;
            "lf-app-home": LocalJSX.LfAppHome & JSXBase.HTMLAttributes<HTMLLfAppHomeElement>;
            "lf-card": LocalJSX.LfCard & JSXBase.HTMLAttributes<HTMLLfCardElement>;
            "lf-firmware-app": LocalJSX.LfFirmwareApp & JSXBase.HTMLAttributes<HTMLLfFirmwareAppElement>;
            "lf-keyboard": LocalJSX.LfKeyboard & JSXBase.HTMLAttributes<HTMLLfKeyboardElement>;
            "lf-pairing-app": LocalJSX.LfPairingApp & JSXBase.HTMLAttributes<HTMLLfPairingAppElement>;
            "lf-registration-app": LocalJSX.LfRegistrationApp & JSXBase.HTMLAttributes<HTMLLfRegistrationAppElement>;
            "lf-registration-input": LocalJSX.LfRegistrationInput & JSXBase.HTMLAttributes<HTMLLfRegistrationInputElement>;
            "lf-registration-registering": LocalJSX.LfRegistrationRegistering & JSXBase.HTMLAttributes<HTMLLfRegistrationRegisteringElement>;
            "lf-wifi-connecting": LocalJSX.LfWifiConnecting & JSXBase.HTMLAttributes<HTMLLfWifiConnectingElement>;
            "lf-wifi-list": LocalJSX.LfWifiList & JSXBase.HTMLAttributes<HTMLLfWifiListElement>;
            "lf-wifi-list-item": LocalJSX.LfWifiListItem & JSXBase.HTMLAttributes<HTMLLfWifiListItemElement>;
            "lf-wifi-password": LocalJSX.LfWifiPassword & JSXBase.HTMLAttributes<HTMLLfWifiPasswordElement>;
        }
    }
}
