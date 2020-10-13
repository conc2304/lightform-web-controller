interface WifiEntry {
    wifiName: string;
    locked: boolean;
    signalStrength: SignalStrength;
}
declare enum SignalStrength {
    Weak = "Weak",
    OK = "OK",
    Strong = "Strong"
}
declare enum LoadingProgress {
    Uninitialized = "Uninitialized",
    Loading = "Loading",
    Loaded = "Loaded"
}
export declare class LfList {
    wifiEntries: WifiEntry[];
    progress: LoadingProgress;
    componentWillLoad(): Promise<void>;
    private getWifiList;
    private listData;
    render(): any;
}
export {};
