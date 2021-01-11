// @see WifiNetwork Schema https://www.notion.so/lightform/Web-based-device-pairing-823056d620e84ce78b0f5e4b8fa54465#038a31bc660f4f9da3ba13f129f76dc1
export interface WifiEntry {
  ssid: string;
  signal: number;
  uuid: string;
  security?: 'Wep' | 'Wpa' | 'Wpa2' | 'Unsecured';
  psk?: string;
}
