import { r as registerInstance, f as createEvent, h } from './index-999ee693.js';
import { K as Key_enum } from './Key.enum-0deca141.js';
import { K as KeyboardCharMap, L as LfKeyboardBlurDirection } from './lf-keyboard-blur-direction.enum-b83d4bc4.js';

const lfWifiPasswordComponentCss = "html.ios{--ion-default-font:-apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Roboto\", sans-serif}html.md{--ion-default-font:\"Roboto\", \"Helvetica Neue\", sans-serif}html{--ion-font-family:var(--ion-default-font)}body{background:var(--ion-background-color)}body.backdrop-no-scroll{overflow:hidden}html.ios ion-modal.modal-card .ion-page>ion-header>ion-toolbar:first-of-type{padding-top:0px}html.ios ion-modal .ion-page{border-radius:inherit}.ion-color-primary{--ion-color-base:var(--ion-color-primary, #3880ff) !important;--ion-color-base-rgb:var(--ion-color-primary-rgb, 56, 128, 255) !important;--ion-color-contrast:var(--ion-color-primary-contrast, #fff) !important;--ion-color-contrast-rgb:var(--ion-color-primary-contrast-rgb, 255, 255, 255) !important;--ion-color-shade:var(--ion-color-primary-shade, #3171e0) !important;--ion-color-tint:var(--ion-color-primary-tint, #4c8dff) !important}.ion-color-secondary{--ion-color-base:var(--ion-color-secondary, #3dc2ff) !important;--ion-color-base-rgb:var(--ion-color-secondary-rgb, 61, 194, 255) !important;--ion-color-contrast:var(--ion-color-secondary-contrast, #fff) !important;--ion-color-contrast-rgb:var(--ion-color-secondary-contrast-rgb, 255, 255, 255) !important;--ion-color-shade:var(--ion-color-secondary-shade, #36abe0) !important;--ion-color-tint:var(--ion-color-secondary-tint, #50c8ff) !important}.ion-color-tertiary{--ion-color-base:var(--ion-color-tertiary, #5260ff) !important;--ion-color-base-rgb:var(--ion-color-tertiary-rgb, 82, 96, 255) !important;--ion-color-contrast:var(--ion-color-tertiary-contrast, #fff) !important;--ion-color-contrast-rgb:var(--ion-color-tertiary-contrast-rgb, 255, 255, 255) !important;--ion-color-shade:var(--ion-color-tertiary-shade, #4854e0) !important;--ion-color-tint:var(--ion-color-tertiary-tint, #6370ff) !important}.ion-color-success{--ion-color-base:var(--ion-color-success, #2dd36f) !important;--ion-color-base-rgb:var(--ion-color-success-rgb, 45, 211, 111) !important;--ion-color-contrast:var(--ion-color-success-contrast, #fff) !important;--ion-color-contrast-rgb:var(--ion-color-success-contrast-rgb, 255, 255, 255) !important;--ion-color-shade:var(--ion-color-success-shade, #28ba62) !important;--ion-color-tint:var(--ion-color-success-tint, #42d77d) !important}.ion-color-warning{--ion-color-base:var(--ion-color-warning, #ffc409) !important;--ion-color-base-rgb:var(--ion-color-warning-rgb, 255, 196, 9) !important;--ion-color-contrast:var(--ion-color-warning-contrast, #000) !important;--ion-color-contrast-rgb:var(--ion-color-warning-contrast-rgb, 0, 0, 0) !important;--ion-color-shade:var(--ion-color-warning-shade, #e0ac08) !important;--ion-color-tint:var(--ion-color-warning-tint, #ffca22) !important}.ion-color-danger{--ion-color-base:var(--ion-color-danger, #eb445a) !important;--ion-color-base-rgb:var(--ion-color-danger-rgb, 235, 68, 90) !important;--ion-color-contrast:var(--ion-color-danger-contrast, #fff) !important;--ion-color-contrast-rgb:var(--ion-color-danger-contrast-rgb, 255, 255, 255) !important;--ion-color-shade:var(--ion-color-danger-shade, #cf3c4f) !important;--ion-color-tint:var(--ion-color-danger-tint, #ed576b) !important}.ion-color-light{--ion-color-base:var(--ion-color-light, #f4f5f8) !important;--ion-color-base-rgb:var(--ion-color-light-rgb, 244, 245, 248) !important;--ion-color-contrast:var(--ion-color-light-contrast, #000) !important;--ion-color-contrast-rgb:var(--ion-color-light-contrast-rgb, 0, 0, 0) !important;--ion-color-shade:var(--ion-color-light-shade, #d7d8da) !important;--ion-color-tint:var(--ion-color-light-tint, #f5f6f9) !important}.ion-color-medium{--ion-color-base:var(--ion-color-medium, #92949c) !important;--ion-color-base-rgb:var(--ion-color-medium-rgb, 146, 148, 156) !important;--ion-color-contrast:var(--ion-color-medium-contrast, #fff) !important;--ion-color-contrast-rgb:var(--ion-color-medium-contrast-rgb, 255, 255, 255) !important;--ion-color-shade:var(--ion-color-medium-shade, #808289) !important;--ion-color-tint:var(--ion-color-medium-tint, #9d9fa6) !important}.ion-color-dark{--ion-color-base:var(--ion-color-dark, #222428) !important;--ion-color-base-rgb:var(--ion-color-dark-rgb, 34, 36, 40) !important;--ion-color-contrast:var(--ion-color-dark-contrast, #fff) !important;--ion-color-contrast-rgb:var(--ion-color-dark-contrast-rgb, 255, 255, 255) !important;--ion-color-shade:var(--ion-color-dark-shade, #1e2023) !important;--ion-color-tint:var(--ion-color-dark-tint, #383a3e) !important}.ion-page{left:0;right:0;top:0;bottom:0;display:flex;position:absolute;flex-direction:column;justify-content:space-between;contain:layout size style;overflow:hidden;z-index:0}.split-pane-visible>.ion-page.split-pane-main{position:relative}ion-route,ion-route-redirect,ion-router,ion-select-option,ion-nav-controller,ion-menu-controller,ion-action-sheet-controller,ion-alert-controller,ion-loading-controller,ion-modal-controller,ion-picker-controller,ion-popover-controller,ion-toast-controller,.ion-page-hidden,[hidden]{display:none !important}.ion-page-invisible{opacity:0}.can-go-back>ion-header ion-back-button{display:block}html.plt-ios.plt-hybrid,html.plt-ios.plt-pwa{--ion-statusbar-padding:20px}@supports (padding-top: 20px){html{--ion-safe-area-top:var(--ion-statusbar-padding)}}@supports (padding-top: constant(safe-area-inset-top)){html{--ion-safe-area-top:constant(safe-area-inset-top);--ion-safe-area-bottom:constant(safe-area-inset-bottom);--ion-safe-area-left:constant(safe-area-inset-left);--ion-safe-area-right:constant(safe-area-inset-right)}}@supports (padding-top: env(safe-area-inset-top)){html{--ion-safe-area-top:env(safe-area-inset-top);--ion-safe-area-bottom:env(safe-area-inset-bottom);--ion-safe-area-left:env(safe-area-inset-left);--ion-safe-area-right:env(safe-area-inset-right)}}ion-card.ion-color .ion-inherit-color,ion-card-header.ion-color .ion-inherit-color{color:inherit}.menu-content{transform:translate3d(0,  0,  0)}.menu-content-open{cursor:pointer;touch-action:manipulation;pointer-events:none}.ios .menu-content-reveal{box-shadow:-8px 0 42px rgba(0, 0, 0, 0.08)}[dir=rtl].ios .menu-content-reveal{box-shadow:8px 0 42px rgba(0, 0, 0, 0.08)}.md .menu-content-reveal{box-shadow:4px 0px 16px rgba(0, 0, 0, 0.18)}.md .menu-content-push{box-shadow:4px 0px 16px rgba(0, 0, 0, 0.18)}audio,canvas,progress,video{vertical-align:baseline}audio:not([controls]){display:none;height:0}b,strong{font-weight:bold}img{max-width:100%;border:0}svg:not(:root){overflow:hidden}figure{margin:1em 40px}hr{height:1px;border-width:0;box-sizing:content-box}pre{overflow:auto}code,kbd,pre,samp{font-family:monospace, monospace;font-size:1em}label,input,select,textarea{font-family:inherit;line-height:normal}textarea{overflow:auto;height:auto;font:inherit;color:inherit}textarea::placeholder{padding-left:2px}form,input,optgroup,select{margin:0;font:inherit;color:inherit}html input[type=button],input[type=reset],input[type=submit]{cursor:pointer;-webkit-appearance:button}a,a div,a span,a ion-icon,a ion-label,button,button div,button span,button ion-icon,button ion-label,.ion-tappable,[tappable],[tappable] div,[tappable] span,[tappable] ion-icon,[tappable] ion-label,input,textarea{touch-action:manipulation}a ion-label,button ion-label{pointer-events:none}button{border:0;border-radius:0;font-family:inherit;font-style:inherit;font-variant:inherit;line-height:1;text-transform:none;cursor:pointer;-webkit-appearance:button}[tappable]{cursor:pointer}a[disabled],button[disabled],html input[disabled]{cursor:default}button::-moz-focus-inner,input::-moz-focus-inner{padding:0;border:0}input[type=checkbox],input[type=radio]{padding:0;box-sizing:border-box}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{height:auto}input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration{-webkit-appearance:none}table{border-collapse:collapse;border-spacing:0}td,th{padding:0}*{box-sizing:border-box;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none}html{width:100%;height:100%;text-size-adjust:100%}html:not(.hydrated) body{display:none}html.plt-pwa{height:100vh}body{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;position:fixed;width:100%;max-width:100%;height:100%;max-height:100%;text-rendering:optimizeLegibility;overflow:hidden;touch-action:manipulation;-webkit-user-drag:none;-ms-content-zooming:none;word-wrap:break-word;overscroll-behavior-y:none;text-size-adjust:none}html{font-family:var(--ion-font-family)}a{background-color:transparent;color:var(--ion-color-primary, #3880ff)}h1,h2,h3,h4,h5,h6{margin-top:16px;margin-bottom:10px;font-weight:500;line-height:1.2}h1{margin-top:20px;font-size:26px}h2{margin-top:18px;font-size:24px}h3{font-size:22px}h4{font-size:20px}h5{font-size:18px}h6{font-size:16px}small{font-size:75%}sub,sup{position:relative;font-size:75%;line-height:0;vertical-align:baseline}sup{top:-0.5em}sub{bottom:-0.25em}.ion-no-padding{--padding-start:0;--padding-end:0;--padding-top:0;--padding-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0}.ion-padding{--padding-start:var(--ion-padding, 16px);--padding-end:var(--ion-padding, 16px);--padding-top:var(--ion-padding, 16px);--padding-bottom:var(--ion-padding, 16px);padding-left:var(--ion-padding, 16px);padding-right:var(--ion-padding, 16px);padding-top:var(--ion-padding, 16px);padding-bottom:var(--ion-padding, 16px)}@supports (margin-inline-start: 0) or (-webkit-margin-start: 0){.ion-padding{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--ion-padding, 16px);padding-inline-start:var(--ion-padding, 16px);-webkit-padding-end:var(--ion-padding, 16px);padding-inline-end:var(--ion-padding, 16px)}}.ion-padding-top{--padding-top:var(--ion-padding, 16px);padding-top:var(--ion-padding, 16px)}.ion-padding-start{--padding-start:var(--ion-padding, 16px);padding-left:var(--ion-padding, 16px)}@supports (margin-inline-start: 0) or (-webkit-margin-start: 0){.ion-padding-start{padding-left:unset;-webkit-padding-start:var(--ion-padding, 16px);padding-inline-start:var(--ion-padding, 16px)}}.ion-padding-end{--padding-end:var(--ion-padding, 16px);padding-right:var(--ion-padding, 16px)}@supports (margin-inline-start: 0) or (-webkit-margin-start: 0){.ion-padding-end{padding-right:unset;-webkit-padding-end:var(--ion-padding, 16px);padding-inline-end:var(--ion-padding, 16px)}}.ion-padding-bottom{--padding-bottom:var(--ion-padding, 16px);padding-bottom:var(--ion-padding, 16px)}.ion-padding-vertical{--padding-top:var(--ion-padding, 16px);--padding-bottom:var(--ion-padding, 16px);padding-top:var(--ion-padding, 16px);padding-bottom:var(--ion-padding, 16px)}.ion-padding-horizontal{--padding-start:var(--ion-padding, 16px);--padding-end:var(--ion-padding, 16px);padding-left:var(--ion-padding, 16px);padding-right:var(--ion-padding, 16px)}@supports (margin-inline-start: 0) or (-webkit-margin-start: 0){.ion-padding-horizontal{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--ion-padding, 16px);padding-inline-start:var(--ion-padding, 16px);-webkit-padding-end:var(--ion-padding, 16px);padding-inline-end:var(--ion-padding, 16px)}}.ion-no-margin{--margin-start:0;--margin-end:0;--margin-top:0;--margin-bottom:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}.ion-margin{--margin-start:var(--ion-margin, 16px);--margin-end:var(--ion-margin, 16px);--margin-top:var(--ion-margin, 16px);--margin-bottom:var(--ion-margin, 16px);margin-left:var(--ion-margin, 16px);margin-right:var(--ion-margin, 16px);margin-top:var(--ion-margin, 16px);margin-bottom:var(--ion-margin, 16px)}@supports (margin-inline-start: 0) or (-webkit-margin-start: 0){.ion-margin{margin-left:unset;margin-right:unset;-webkit-margin-start:var(--ion-margin, 16px);margin-inline-start:var(--ion-margin, 16px);-webkit-margin-end:var(--ion-margin, 16px);margin-inline-end:var(--ion-margin, 16px)}}.ion-margin-top{--margin-top:var(--ion-margin, 16px);margin-top:var(--ion-margin, 16px)}.ion-margin-start{--margin-start:var(--ion-margin, 16px);margin-left:var(--ion-margin, 16px)}@supports (margin-inline-start: 0) or (-webkit-margin-start: 0){.ion-margin-start{margin-left:unset;-webkit-margin-start:var(--ion-margin, 16px);margin-inline-start:var(--ion-margin, 16px)}}.ion-margin-end{--margin-end:var(--ion-margin, 16px);margin-right:var(--ion-margin, 16px)}@supports (margin-inline-start: 0) or (-webkit-margin-start: 0){.ion-margin-end{margin-right:unset;-webkit-margin-end:var(--ion-margin, 16px);margin-inline-end:var(--ion-margin, 16px)}}.ion-margin-bottom{--margin-bottom:var(--ion-margin, 16px);margin-bottom:var(--ion-margin, 16px)}.ion-margin-vertical{--margin-top:var(--ion-margin, 16px);--margin-bottom:var(--ion-margin, 16px);margin-top:var(--ion-margin, 16px);margin-bottom:var(--ion-margin, 16px)}.ion-margin-horizontal{--margin-start:var(--ion-margin, 16px);--margin-end:var(--ion-margin, 16px);margin-left:var(--ion-margin, 16px);margin-right:var(--ion-margin, 16px)}@supports (margin-inline-start: 0) or (-webkit-margin-start: 0){.ion-margin-horizontal{margin-left:unset;margin-right:unset;-webkit-margin-start:var(--ion-margin, 16px);margin-inline-start:var(--ion-margin, 16px);-webkit-margin-end:var(--ion-margin, 16px);margin-inline-end:var(--ion-margin, 16px)}}.ion-float-left{float:left !important}.ion-float-right{float:right !important}.ion-float-start{float:left !important}[dir=rtl] .ion-float-start,:host-context([dir=rtl]) .ion-float-start{float:right !important}.ion-float-end{float:right !important}[dir=rtl] .ion-float-end,:host-context([dir=rtl]) .ion-float-end{float:left !important}@media (min-width: 576px){.ion-float-sm-left{float:left !important}.ion-float-sm-right{float:right !important}.ion-float-sm-start{float:left !important}[dir=rtl] .ion-float-sm-start,:host-context([dir=rtl]) .ion-float-sm-start{float:right !important}.ion-float-sm-end{float:right !important}[dir=rtl] .ion-float-sm-end,:host-context([dir=rtl]) .ion-float-sm-end{float:left !important}}@media (min-width: 768px){.ion-float-md-left{float:left !important}.ion-float-md-right{float:right !important}.ion-float-md-start{float:left !important}[dir=rtl] .ion-float-md-start,:host-context([dir=rtl]) .ion-float-md-start{float:right !important}.ion-float-md-end{float:right !important}[dir=rtl] .ion-float-md-end,:host-context([dir=rtl]) .ion-float-md-end{float:left !important}}@media (min-width: 992px){.ion-float-lg-left{float:left !important}.ion-float-lg-right{float:right !important}.ion-float-lg-start{float:left !important}[dir=rtl] .ion-float-lg-start,:host-context([dir=rtl]) .ion-float-lg-start{float:right !important}.ion-float-lg-end{float:right !important}[dir=rtl] .ion-float-lg-end,:host-context([dir=rtl]) .ion-float-lg-end{float:left !important}}@media (min-width: 1200px){.ion-float-xl-left{float:left !important}.ion-float-xl-right{float:right !important}.ion-float-xl-start{float:left !important}[dir=rtl] .ion-float-xl-start,:host-context([dir=rtl]) .ion-float-xl-start{float:right !important}.ion-float-xl-end{float:right !important}[dir=rtl] .ion-float-xl-end,:host-context([dir=rtl]) .ion-float-xl-end{float:left !important}}.ion-text-center{text-align:center !important}.ion-text-justify{text-align:justify !important}.ion-text-start{text-align:start !important}.ion-text-end{text-align:end !important}.ion-text-left{text-align:left !important}.ion-text-right{text-align:right !important}.ion-text-nowrap{white-space:nowrap !important}.ion-text-wrap{white-space:normal !important}@media (min-width: 576px){.ion-text-sm-center{text-align:center !important}.ion-text-sm-justify{text-align:justify !important}.ion-text-sm-start{text-align:start !important}.ion-text-sm-end{text-align:end !important}.ion-text-sm-left{text-align:left !important}.ion-text-sm-right{text-align:right !important}.ion-text-sm-nowrap{white-space:nowrap !important}.ion-text-sm-wrap{white-space:normal !important}}@media (min-width: 768px){.ion-text-md-center{text-align:center !important}.ion-text-md-justify{text-align:justify !important}.ion-text-md-start{text-align:start !important}.ion-text-md-end{text-align:end !important}.ion-text-md-left{text-align:left !important}.ion-text-md-right{text-align:right !important}.ion-text-md-nowrap{white-space:nowrap !important}.ion-text-md-wrap{white-space:normal !important}}@media (min-width: 992px){.ion-text-lg-center{text-align:center !important}.ion-text-lg-justify{text-align:justify !important}.ion-text-lg-start{text-align:start !important}.ion-text-lg-end{text-align:end !important}.ion-text-lg-left{text-align:left !important}.ion-text-lg-right{text-align:right !important}.ion-text-lg-nowrap{white-space:nowrap !important}.ion-text-lg-wrap{white-space:normal !important}}@media (min-width: 1200px){.ion-text-xl-center{text-align:center !important}.ion-text-xl-justify{text-align:justify !important}.ion-text-xl-start{text-align:start !important}.ion-text-xl-end{text-align:end !important}.ion-text-xl-left{text-align:left !important}.ion-text-xl-right{text-align:right !important}.ion-text-xl-nowrap{white-space:nowrap !important}.ion-text-xl-wrap{white-space:normal !important}}.ion-text-uppercase{text-transform:uppercase !important}.ion-text-lowercase{text-transform:lowercase !important}.ion-text-capitalize{text-transform:capitalize !important}@media (min-width: 576px){.ion-text-sm-uppercase{text-transform:uppercase !important}.ion-text-sm-lowercase{text-transform:lowercase !important}.ion-text-sm-capitalize{text-transform:capitalize !important}}@media (min-width: 768px){.ion-text-md-uppercase{text-transform:uppercase !important}.ion-text-md-lowercase{text-transform:lowercase !important}.ion-text-md-capitalize{text-transform:capitalize !important}}@media (min-width: 992px){.ion-text-lg-uppercase{text-transform:uppercase !important}.ion-text-lg-lowercase{text-transform:lowercase !important}.ion-text-lg-capitalize{text-transform:capitalize !important}}@media (min-width: 1200px){.ion-text-xl-uppercase{text-transform:uppercase !important}.ion-text-xl-lowercase{text-transform:lowercase !important}.ion-text-xl-capitalize{text-transform:capitalize !important}}.ion-align-self-start{align-self:flex-start !important}.ion-align-self-end{align-self:flex-end !important}.ion-align-self-center{align-self:center !important}.ion-align-self-stretch{align-self:stretch !important}.ion-align-self-baseline{align-self:baseline !important}.ion-align-self-auto{align-self:auto !important}.ion-wrap{flex-wrap:wrap !important}.ion-nowrap{flex-wrap:nowrap !important}.ion-wrap-reverse{flex-wrap:wrap-reverse !important}.ion-justify-content-start{justify-content:flex-start !important}.ion-justify-content-center{justify-content:center !important}.ion-justify-content-end{justify-content:flex-end !important}.ion-justify-content-around{justify-content:space-around !important}.ion-justify-content-between{justify-content:space-between !important}.ion-justify-content-evenly{justify-content:space-evenly !important}.ion-align-items-start{align-items:flex-start !important}.ion-align-items-center{align-items:center !important}.ion-align-items-end{align-items:flex-end !important}.ion-align-items-stretch{align-items:stretch !important}.ion-align-items-baseline{align-items:baseline !important}:root{--ion-color-primary:#2c65ff;--ion-color-primary-rgb:44, 101, 255;--ion-color-primary-contrast:#ffffff;--ion-color-primary-contrast-rgb:255, 255, 255;--ion-color-primary-tint:#2352d0;--ion-color-primary-shade:#5885ff;--ion-color-secondary:#7c2cff;--ion-color-secondary-rgb:124, 44, 255;--ion-color-secondary-contrast:#ffffff;--ion-color-secondary-contrast-rgb:255, 255, 255;--ion-color-secondary-shade:#690efd;--ion-color-secondary-tint:#8941ff;--ion-color-success:#12a37b;--ion-color-success-rgb:18, 163, 123;--ion-color-success-contrast:#ffffff;--ion-color-success-contrast-rgb:255, 255, 255;--ion-color-success-shade:#108f6c;--ion-color-success-tint:#2aac88;--ion-color-warning:#f2c94c;--ion-color-warning-rgb:242, 201, 76;--ion-color-warning-contrast:#000000;--ion-color-warning-contrast-rgb:0, 0, 0;--ion-color-warning-shade:#dcb745;--ion-color-warning-tint:#f3ce5e;--ion-color-danger:#d43333;--ion-color-danger-rgb:212, 51, 51;--ion-color-danger-contrast:#ffffff;--ion-color-danger-contrast-rgb:255, 255, 255;--ion-color-danger-shade:#c23030;--ion-color-danger-tint:#ff0000;--ion-color-dark:#232326;--ion-color-dark-rgb:35, 35, 38;--ion-color-dark-contrast:#ffffff;--ion-color-dark-contrast-rgb:255, 255, 255;--ion-color-dark-shade:#1f1f21;--ion-color-dark-tint:#39393c;--ion-color-medium:#575c6d;--ion-color-medium-rgb:87, 92, 109;--ion-color-medium-contrast:#ffffff;--ion-color-medium-contrast-rgb:255, 255, 255;--ion-color-medium-shade:#4d5160;--ion-color-medium-tint:#686c7c;--ion-color-light:#ffffff;--ion-color-light-rgb:255, 255, 255;--ion-color-light-contrast:#000000;--ion-color-light-contrast-rgb:0, 0, 0;--ion-color-light-shade:#e0e0e0;--ion-color-light-tint:#ffffff;--ion-background-color:#000000;--ion-background-color-rgb:35, 35, 38;--ion-text-color:#babfd1;--ion-text-color-rgb:186, 191, 209;--ion-color-step-50:#2b2b2f;--ion-color-step-100:#323337;--ion-color-step-150:#3a3a40;--ion-color-step-200:#414248;--ion-color-step-250:#494a51;--ion-color-step-300:#505259;--ion-color-step-350:#585a62;--ion-color-step-400:#5f616a;--ion-color-step-450:#676973;--ion-color-step-500:#6f717c;--ion-color-step-550:#767984;--ion-color-step-600:#7e818d;--ion-color-step-650:#858895;--ion-color-step-700:#8d909e;--ion-color-step-750:#9498a6;--ion-color-step-800:#9ca0af;--ion-color-step-850:#a3a8b7;--ion-color-step-900:#abafc0;--ion-color-step-950:#b2b7c8}html,body{width:100vw;height:100vh;overflow-y:hidden;font-size:16px}@font-face{font-family:Atlas;src:url(\"/assets/fonts//AtlasGrotesk-Light-Web.eot\");src:url(\"/assets/fonts//AtlasGrotesk-Light-Web.eot?#iefix\") format(\"embedded-opentype\"), url(\"/assets/fonts//AtlasGrotesk-Light-Web.woff2\") format(\"woff2\"), url(\"/assets/fonts//AtlasGrotesk-Light-Web.woff\") format(\"woff\");font-weight:300;font-style:normal;font-stretch:normal}@font-face{font-family:Atlas;src:url(\"/assets/fonts/AtlasGrotesk-Regular-Web.eot\");src:url(\"/assets/fonts/AtlasGrotesk-Regular-Web.eot?#iefix\") format(\"embedded-opentype\"), url(\"/assets/fonts/AtlasGrotesk-Regular-Web.woff2\") format(\"woff2\"), url(\"/assets/fonts/AtlasGrotesk-Regular-Web.woff\") format(\"woff\");font-weight:400;font-style:normal;font-stretch:normal}.theme--dark{background-color:#232326;color:#BABFD1}.theme--light{background-color:#BABFD1;color:#232326}@keyframes popIn{0%{opacity:0;transform:scale(0.6) translateY(-1rem)}100%{opacity:1;transform:none}}:host{display:block}:root{--animation-order-prompt:0;--animation-order-input:1;--animation-order-checkbox:2;--animation-order-keyboard:3;--animation-speed:120ms;--animation-duration:0.3s}.wifi-password--container{width:95%;margin:0 auto}.wifi-password--container .wifi-password--input-container{margin-bottom:1rem}.wifi-password--container .wifi-password--prompt{display:block;width:100%;margin:2.6875rem auto 1.9375rem;font-family:Atlas, Helvetica, sans-serif;font-weight:300;font-style:normal;font-stretch:normal;color:#FFFFFF;font-size:2.25rem;line-height:2.6875rem;animation:popIn var(--animation-duration) calc(var(--animation-order-prompt) * var(--animation-speed)) both ease-in}.wifi-password--container .wifi-password--input{display:block;width:100%;margin:0 auto;height:5.625rem;background-color:#3C3E47;border:unset;appearance:none;padding-left:1.8125rem;padding-bottom:0.2rem;margin-bottom:1.5625rem;animation:popIn var(--animation-duration) calc(var(--animation-order-input) * var(--animation-speed)) both ease-in;font-family:Atlas, Helvetica, sans-serif;font-weight:300;font-style:normal;font-stretch:normal;color:#FFFFFF;font-size:2.25rem;line-height:3.6875rem;letter-spacing:3px}.wifi-password--container .wifi-password--input:focus{outline:none}.wifi-password--container .wifi-password--input.dirty[type=password]{letter-spacing:5px;font-family:Arial, Helvetica, sans-serif;font-size:5rem;line-height:10px;padding-bottom:0.1rem}.wifi-password--container .wifi-password--display-toggle-container{display:flex;justify-content:center;align-items:center;animation:popIn var(--animation-duration) calc(var(--animation-order-checkbox) * var(--animation-speed)) both ease-in;border:0.25rem solid transparent;transition-property:border;transition-duration:0.3s;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);border-radius:0.75rem;outline:none;padding:1rem}.wifi-password--container .wifi-password--display-toggle-container:focus,.wifi-password--container .wifi-password--display-toggle-container.lf-item-focused{border-color:#2C65FF;outline:none}.wifi-password--container input[type=checkbox].wifi-password--display-toggle{height:2.25rem;width:2.25rem;outline:none}.wifi-password--container input[type=checkbox].wifi-password--display-toggle:focus{outline:none}.wifi-password--container .wifi-password--display-toggle-label{font-size:2.25rem;margin-left:1.25rem}lf-keyboard{margin-top:1rem;animation:popIn var(--animation-duration) calc(var(--animation-order-keyboard) * var(--animation-speed)) both ease-in}lf-keyboard:focus{outline:none}";

var InputType;
(function (InputType) {
  InputType["Password"] = "password";
  InputType["Text"] = "text";
})(InputType || (InputType = {}));
const LfWifiPassword = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.passwordSubmitted = createEvent(this, "passwordSubmitted", 7);
    this.LfFocusClass = "lf-item-focused";
    this.checkBoxElId = "show-password-toggle";
    this.inputIsDirty = false;
    this.inputType = InputType.Text;
    this.showPassword = true;
  }
  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - -
  componentWillLoad() {
    // console.group("componentWillLoad");
    try {
      this.setInputElClassNames();
    }
    catch (e) {
      // console.error(e);
    }
    finally {
      // console.groupEnd();
    }
  }
  // - -  componentDidLoad Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - -
  componentDidLoad() {
    // console.group("componentDidLoad");
    try {
      setTimeout(() => {
        this.checkboxEl.focus();
      }, 1000);
    }
    catch (e) {
      // console.error(e);
    }
    finally {
      // console.groupEnd();
    }
  }
  // ==== LISTENERS SECTION =====================================================================
  onVKeyboardPress(event) {
    // console.group("onVKeyboardPress");
    try {
      if (event.detail !== null) {
        const receivedInput = event.detail;
        const currentInputValue = this.inputTextEl.value;
        let updatedValue;
        if (receivedInput !== KeyboardCharMap.Delete) {
          updatedValue = `${currentInputValue}${receivedInput}`;
        }
        else {
          updatedValue = currentInputValue.slice(0, -1);
        }
        this.inputTextEl.value = updatedValue;
      }
      this.checkInputDirty();
    }
    catch (e) {
      // console.error(e);
    }
    finally {
      // console.groupEnd();
    }
  }
  onBlurKeyboardEvent() {
    // console.group("onBlurKeyboardEvent");
    try {
      this.lfKeyboardEl.blur();
      this.checkboxEl.focus();
      this.checkboxInFocus();
    }
    catch (e) {
      // console.error(e);
    }
    // console.groupEnd();
  }
  onKeyboardSubmit() {
    // console.group("onKeyboardSubmit");
    try {
      this.passwordSubmitted.emit(this.inputTextEl.value);
    }
    catch (e) {
      // console.error(e);
    }
    finally {
      // console.groupEnd();
    }
  }
  onKeydown(e) {
    // console.group("onKeydown--Password");
    try {
      this.keyHandler(e);
    }
    catch (e) {
      // console.error(e);
    }
    finally {
      // console.groupEnd();
    }
  }
  // ==== PUBLIC METHODS API - @Method() SECTION =================================================
  // @Method()
  // async publicMethod(): Promise<void> {return}
  // ==== LOCAL METHODS SECTION ==================================================================
  checkboxInFocus() {
    // console.group("checkboxInFocus");
    try {
      let className = this.toggleContainer.className;
      if (!className.includes(this.LfFocusClass)) {
        this.toggleContainer.className = `${className} ${this.LfFocusClass}`;
      }
    }
    catch (e) {
      // console.error(e);
    }
    finally {
      // console.groupEnd();
    }
  }
  checkboxInBlur() {
    // console.group("checkboxInBlur");
    try {
      let className = this.toggleContainer.className;
      if (className.includes(this.LfFocusClass)) {
        className = className.replace(this.LfFocusClass, "");
        this.toggleContainer.className = className;
      }
    }
    catch (e) {
      // console.error(e);
    }
    finally {
      // console.groupEnd();
    }
  }
  checkInputDirty() {
    // console.group("checkInputDirty");
    var _a, _b;
    try {
      this.inputIsDirty = ((_b = (_a = this.inputTextEl) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.length) > 0;
      this.setInputElClassNames();
    }
    catch (e) {
      // console.error(e);
    }
    finally {
      // console.groupEnd();
    }
  }
  setInputElClassNames() {
    // console.group("setInputElClassNames");
    try {
      const className = this.inputIsDirty ? `dirty` : `clean`;
      this.inputElemClassName = className;
    }
    catch (e) {
      // console.error(e);
    }
    finally {
      // console.groupEnd();
    }
  }
  togglePasswordDisplay() {
    // console.group("togglePasswordDisplay");
    try {
      this.showPassword = !this.showPassword;
      this.inputType = this.showPassword ? InputType.Text : InputType.Password;
    }
    catch (e) {
      // console.error(e);
    }
    finally {
      // console.groupEnd();
    }
  }
  keyHandler(e) {
    // console.group("KeyHandler");
    // console.log(e);
    try {
      const specialKeys = [Key_enum.Key.ArrowDown, Key_enum.Key.ArrowUp].map(key => {
        return key.toString();
      });
      if (specialKeys.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
      switch (e.key) {
        case Key_enum.Key.ArrowDown:
          if (document.activeElement.id === this.checkBoxElId) {
            this.toggleContainer.blur();
            this.lfKeyboardEl.focus();
          }
          break;
        case Key_enum.Key.ArrowUp:
          break;
        case Key_enum.Key.Enter:
          if (document.activeElement.id === this.checkBoxElId) {
            this.togglePasswordDisplay();
          }
          break;
      }
    }
    catch (e) {
      // console.error(e);
    }
    finally {
      // console.groupEnd();
    }
  }
  // ==== RENDERING SECTION =========================================================================
  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render() {
    return (h("div", { class: "wifi-password--container" }, h("div", { class: "wifi-password--input-container" }, h("p", { class: "wifi-password--prompt" }, "Please enter the password for ", h("strong", null, this.networkName)), h("div", { class: "wifi-password--input-wrapper" }, h("input", { onInput: () => this.checkInputDirty(), ref: el => (this.inputTextEl = el), class: `wifi-password--input ${this.inputElemClassName}`, type: this.inputType, placeholder: "Enter Wifi Password" })), h("div", { class: "wifi-password--display-toggle-container", ref: el => (this.toggleContainer = el) }, h("input", { tabindex: "0", checked: this.showPassword, onChange: () => {
        this.togglePasswordDisplay();
      }, onFocus: () => {
        this.checkboxInFocus();
      }, onBlur: () => {
        this.checkboxInBlur();
      }, ref: el => (this.checkboxEl = el), class: "wifi-password--display-toggle", type: "checkbox", id: this.checkBoxElId }), h("label", { htmlFor: this.checkBoxElId, class: "wifi-password--display-toggle-label" }, "show password"))), h("lf-keyboard", { ref: el => (this.lfKeyboardEl = el), tabindex: "0", id: "lf-keyboard-component", blurDirection: LfKeyboardBlurDirection.Top, wrapNavigation: true })));
  }
};
LfWifiPassword.style = lfWifiPasswordComponentCss;

export { LfWifiPassword as lf_wifi_password };
