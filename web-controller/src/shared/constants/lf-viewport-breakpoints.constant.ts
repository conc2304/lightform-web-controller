// ==== Library Imports =======================================================
// none

// ==== App Imports ===========================================================
import { LfViewportSize } from '../enums/lf-viewport-query-sizes.enum';
import { LfViewportBreakpoint } from '../interfaces/lf-web-controller.interface';

export const LF_VIEWPORT_BREAKPOINTS: Array<LfViewportBreakpoint> = [
  { name: LfViewportSize.ExtraSmall, minWidth: '0', maxWidth: '319' },
  { name: LfViewportSize.Small, minWidth: '320', maxWidth: '511' },
  { name: LfViewportSize.Medium, minWidth: '512', maxWidth: '768' },
  { name: LfViewportSize.Large, minWidth: '769', maxWidth: '1199' },
  { name: LfViewportSize.ExtraLarge, minWidth: '1200', maxWidth: '9999' },
];

export const LF_MOBILE_QUERIES: Array<string> = [LfViewportSize.ExtraSmall, LfViewportSize.Small, LfViewportSize.Medium];
