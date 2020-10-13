import { b as bootstrapLazy } from './index-6745bcf5.js';
import { p as patchBrowser, g as globalScripts } from './app-globals-1968b69a.js';

patchBrowser().then(options => {
  globalScripts();
  return bootstrapLazy([["lf-list",[[1,"lf-list",{"color":[1],"striped":[4],"dark":[4],"light":[4],"dense":[4],"outlined":[4],"rounded":[4],"disabled":[4],"elevation":[8],"height":[8],"width":[8],"minHeight":[8,"min-height"],"maxHeight":[8,"max-height"],"minWidth":[8,"min-width"],"maxWidth":[8,"max-width"]}]]],["lf-wifi-list",[[1,"lf-wifi-list",{"wifiEntries":[32],"progress":[32]}]]],["lf-button",[[1,"lf-button",{"size":[1],"context":[1],"disabled":[4]}]]],["lf-list-item",[[1,"lf-list-item",{"color":[1],"button":[4],"active":[4],"dark":[4],"light":[4],"dense":[4],"disabled":[4],"href":[1],"rel":[1],"target":[1],"type":[1]}]]],["lf-subheader",[[1,"lf-subheader",{"inset":[4],"dark":[4],"light":[4]}]]],["design-sheet",[[1,"design-sheet"]]]], options);
});
