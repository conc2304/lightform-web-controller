import { SignalStrength } from "../enums/wifi-signal-strength.enum";

export interface WifiEntry {
    wifiName: string;
    passwordProtected: boolean;
    signalStrength: SignalStrength;
}
