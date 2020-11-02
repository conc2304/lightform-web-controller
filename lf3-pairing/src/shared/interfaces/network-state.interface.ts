import { WifiEntry } from "./wifi-entry.interface"

export interface NetworkState {
  activeWifiSSID: string,
  availableWifiNetworks: Array<WifiEntry>,
  connectionMode: string,
  connectionType: string,
  hostname: string,
  knownWifiNetworks: Array<WifiEntry>,
}
