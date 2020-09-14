import { SignalStrength } from '../shared/enums/wifi-signal-strength.enum';
const iconPath = '/assets/images/icons/';

export function GetLockIconPath(locked: boolean): string {
  const iconImageFile = locked ? 'Lock.svg' : 'Unlock.svg';
  const resolvedFilePath = `${iconPath}${iconImageFile}`;
  return resolvedFilePath;
}

export function GetNetworkIconPath(signalStrength: SignalStrength): string {
  let wifiSignalFile: string;

  switch (signalStrength) {
    case SignalStrength.Strong:
      wifiSignalFile = 'network-3bars.svg';
      break;
    case SignalStrength.OK:
      wifiSignalFile = 'network-2bars.svg';
      break;
    case SignalStrength.Weak:
      wifiSignalFile = 'network-1bar.svg';
      break;
  }
  const resolvedFilePath = `${iconPath}${wifiSignalFile}`;

  return resolvedFilePath;
}
