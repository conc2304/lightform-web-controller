import { r as registerInstance, h, j as Host } from './index-999ee693.js';
import { g as getIonMode } from './ionic-global-6b067d39.js';
import { c as createColorClasses } from './theme-1706d6ff.js';

const textCss = ":host(.ion-color){color:var(--ion-color-base)}";

const Text = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    const mode = getIonMode(this);
    return (h(Host, { class: createColorClasses(this.color, {
        [mode]: true,
      }) }, h("slot", null)));
  }
};
Text.style = textCss;

export { Text as ion_text };
