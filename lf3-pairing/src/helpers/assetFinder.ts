const iconPath = 'assets/images/icons/';

export function GetLockIconPath(locked: boolean): string {
  const iconImageFile = locked ? 'Lock.svg' : 'Unlock.svg';
  const resolvedFilePath = `${iconPath}${iconImageFile}`;
  return resolvedFilePath;
}

export function GetNetworkIconPath(signalStrength: number): string {
  let icon = "img/network-1bar.svg";
  if (signalStrength >= 66) {
    icon = "img/network-3bars.svg";
  } else if (signalStrength >= 33) {
    icon = "img/network-2bars.svg";
  }
  const resolvedFilePath = `${iconPath}${icon}`;

  return resolvedFilePath;
}
