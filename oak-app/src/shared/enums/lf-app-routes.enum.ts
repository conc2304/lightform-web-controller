// implementation of making a enum's value an object

export class LfAppRoute {
  static readonly HOME = new LfAppRoute('/', 'lf-app-home');
  static readonly PAIRING = new LfAppRoute('/pairing', 'lf-pairing-app');
  static readonly FIRMWARE = new LfAppRoute('/firmware', 'lf-firmware-app');

  // private to disallow creating other instances of this type
  private constructor(public readonly urlPath: string, public readonly component: string) {
  }
}

