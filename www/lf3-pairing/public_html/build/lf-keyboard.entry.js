import { r as registerInstance, i as createEvent, h } from './index-f06469e8.js';
import { c as createCommonjsModule, a as commonjsGlobal, g as getDefaultExportFromCjs, K as Key_enum } from './Key.enum-569ae29e.js';
import { a as LayoutName, K as KeyboardCharMap, L as LfKeyboardBlurDirection } from './lf-keyboard-blur-direction.enum-b83d4bc4.js';

var build = createCommonjsModule(function (module, exports) {
/*!
 * 
 *   simple-keyboard v2.32.9
 *   https://github.com/hodgef/simple-keyboard
 * 
 *   Copyright (c) Francisco Hodge (https://github.com/hodgef)
 * 
 *   This source code is licensed under the MIT license found in the
 *   LICENSE file in the root directory of this source tree.
 *   
 */
!function(t,e){"object"==='object'&&"object"==='object'?module.exports=e():"function"===typeof undefined&&undefined.amd?undefined("SimpleKeyboard",[],e):"object"==='object'?exports.SimpleKeyboard=e():t.SimpleKeyboard=e();}(commonjsGlobal,(function(){return function(t){var e={};function __webpack_require__(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,__webpack_require__),o.l=!0,o.exports}return __webpack_require__.m=t,__webpack_require__.c=e,__webpack_require__.d=function(t,e,n){__webpack_require__.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n});},__webpack_require__.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0});},__webpack_require__.t=function(t,e){if(1&e&&(t=__webpack_require__(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(__webpack_require__.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)__webpack_require__.d(n,o,function(e){return t[e]}.bind(null,o));return n},__webpack_require__.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return __webpack_require__.d(e,"a",e),e},__webpack_require__.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},__webpack_require__.p="/",__webpack_require__(__webpack_require__.s=0)}([function(t,e,n){t.exports=n(1);},function(t,e,n){"use strict";n.r(e);function _createForOfIteratorHelper(t,e){var n;if("undefined"===typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(n=function(t,e){if(!t)return;if("string"===typeof t)return _arrayLikeToArray(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(t,e)}(t))||e&&t&&"number"===typeof t.length){n&&(t=n);var o=0,F=function(){};return {s:F,n:function(){return o>=t.length?{done:!0}:{done:!1,value:t[o++]}},e:function(t){throw t},f:F}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,s=!0,a=!1;return {s:function(){n=t[Symbol.iterator]();},n:function(){var t=n.next();return s=t.done,t},e:function(t){a=!0,i=t;},f:function(){try{s||null==n.return||n.return();}finally{if(a)throw i}}}}function _arrayLikeToArray(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,o=new Array(e);n<e;n++)o[n]=t[n];return o}function _typeof(t){return (_typeof="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"===typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o);}}var o,i,s,a=function(){function Utilities(t){var e=t.getOptions,n=t.getCaretPosition,o=t.getCaretPositionEnd,i=t.dispatch;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,Utilities),this.getOptions=e,this.getCaretPosition=n,this.getCaretPositionEnd=o,this.dispatch=i,Utilities.bindMethods(Utilities,this);}var t,e,n;return t=Utilities,n=[{key:"bindMethods",value:function(t,e){var n,o=_createForOfIteratorHelper(Object.getOwnPropertyNames(t.prototype));try{for(o.s();!(n=o.n()).done;){var i=n.value;"constructor"===i||"bindMethods"===i||(e[i]=e[i].bind(e));}}catch(s){o.e(s);}finally{o.f();}}}],(e=[{key:"getButtonClass",value:function(t){var e=t.includes("{")&&t.includes("}")&&"{//}"!==t?"functionBtn":"standardBtn",n=t.replace("{","").replace("}",""),o="";return "standardBtn"!==e&&(o=" hg-button-".concat(n)),"hg-".concat(e).concat(o)}},{key:"getDefaultDiplay",value:function(){return {"{bksp}":"backspace","{backspace}":"backspace","{enter}":"< enter","{shift}":"shift","{shiftleft}":"shift","{shiftright}":"shift","{alt}":"alt","{s}":"shift","{tab}":"tab","{lock}":"caps","{capslock}":"caps","{accept}":"Submit","{space}":" ","{//}":" ","{esc}":"esc","{escape}":"esc","{f1}":"f1","{f2}":"f2","{f3}":"f3","{f4}":"f4","{f5}":"f5","{f6}":"f6","{f7}":"f7","{f8}":"f8","{f9}":"f9","{f10}":"f10","{f11}":"f11","{f12}":"f12","{numpaddivide}":"/","{numlock}":"lock","{arrowup}":"\u2191","{arrowleft}":"\u2190","{arrowdown}":"\u2193","{arrowright}":"\u2192","{prtscr}":"print","{scrolllock}":"scroll","{pause}":"pause","{insert}":"ins","{home}":"home","{pageup}":"up","{delete}":"del","{end}":"end","{pagedown}":"down","{numpadmultiply}":"*","{numpadsubtract}":"-","{numpadadd}":"+","{numpadenter}":"enter","{period}":".","{numpaddecimal}":".","{numpad0}":"0","{numpad1}":"1","{numpad2}":"2","{numpad3}":"3","{numpad4}":"4","{numpad5}":"5","{numpad6}":"6","{numpad7}":"7","{numpad8}":"8","{numpad9}":"9"}}},{key:"getButtonDisplayName",value:function(t,e,n){return (e=n?Object.assign({},this.getDefaultDiplay(),e):e||this.getDefaultDiplay())[t]||t}},{key:"getUpdatedInput",value:function(t,e,n){var o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:n,i=arguments.length>4&&void 0!==arguments[4]&&arguments[4],s=this.getOptions(),a=[n,o,i],r=e;return ("{bksp}"===t||"{backspace}"===t)&&r.length>0?r=this.removeAt.apply(this,[r].concat(a)):"{space}"===t?r=this.addStringAt.apply(this,[r," "].concat(a)):"{tab}"!==t||"boolean"===typeof s.tabCharOnTab&&!1===s.tabCharOnTab?"{enter}"!==t&&"{numpadenter}"!==t||!s.newLineOnEnter?t.includes("numpad")&&Number.isInteger(Number(t[t.length-2]))?r=this.addStringAt.apply(this,[r,t[t.length-2]].concat(a)):"{numpaddivide}"===t?r=this.addStringAt.apply(this,[r,"/"].concat(a)):"{numpadmultiply}"===t?r=this.addStringAt.apply(this,[r,"*"].concat(a)):"{numpadsubtract}"===t?r=this.addStringAt.apply(this,[r,"-"].concat(a)):"{numpadadd}"===t?r=this.addStringAt.apply(this,[r,"+"].concat(a)):"{numpaddecimal}"===t?r=this.addStringAt.apply(this,[r,"."].concat(a)):"{"===t||"}"===t?r=this.addStringAt.apply(this,[r,t].concat(a)):t.includes("{")||t.includes("}")||(r=this.addStringAt.apply(this,[r,t].concat(a))):r=this.addStringAt.apply(this,[r,"\n"].concat(a)):r=this.addStringAt.apply(this,[r,"\t"].concat(a)),r}},{key:"updateCaretPos",value:function(t,e){var n=this.updateCaretPosAction(t,e);this.dispatch((function(t){t.setCaretPosition(n);}));}},{key:"updateCaretPosAction",value:function(t,e){var n=this.getOptions(),o=this.getCaretPosition();return e?o>0&&(o-=t):o+=t,n.debug&&console.log("Caret at:",o,"(".concat(this.keyboardDOMClass,")")),o}},{key:"addStringAt",value:function(t,e){var n,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:t.length,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:t.length,s=arguments.length>4&&void 0!==arguments[4]&&arguments[4];return o||0===o?(n=[t.slice(0,o),e,t.slice(i)].join(""),this.isMaxLengthReached()||s&&this.updateCaretPos(e.length)):n=t+e,n}},{key:"removeAt",value:function(t){var e,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:t.length,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:t.length,i=arguments.length>3&&void 0!==arguments[3]&&arguments[3];if(0===n&&0===o)return t;if(n===o){var s=/([\uD800-\uDBFF][\uDC00-\uDFFF])/g;n&&n>=0?t.substring(n-2,n).match(s)?(e=t.substr(0,n-2)+t.substr(n),i&&this.updateCaretPos(2,!0)):(e=t.substr(0,n-1)+t.substr(n),i&&this.updateCaretPos(1,!0)):t.slice(-2).match(s)?(e=t.slice(0,-2),i&&this.updateCaretPos(2,!0)):(e=t.slice(0,-1),i&&this.updateCaretPos(1,!0));}else e=t.slice(0,n)+t.slice(o),i&&this.dispatch((function(t){t.setCaretPosition(n);}));return e}},{key:"handleMaxLength",value:function(t,e){var n=this.getOptions(),o=n.maxLength,i=t[n.inputName],s=e.length-1>=o;if(e.length<=i.length)return !1;if(Number.isInteger(o))return n.debug&&console.log("maxLength (num) reached:",s),s?(this.maxLengthReached=!0,!0):(this.maxLengthReached=!1,!1);if("object"===_typeof(o)){var a=i.length===o[n.inputName];return n.debug&&console.log("maxLength (obj) reached:",a),a?(this.maxLengthReached=!0,!0):(this.maxLengthReached=!1,!1)}}},{key:"isMaxLengthReached",value:function(){return Boolean(this.maxLengthReached)}},{key:"isTouchDevice",value:function(){return "ontouchstart"in window||navigator.maxTouchPoints}},{key:"pointerEventsSupported",value:function(){return window.PointerEvent}},{key:"camelCase",value:function(t){return !!t&&t.toLowerCase().trim().split(/[.\-_\s]/g).reduce((function(t,e){return e.length?t+e[0].toUpperCase()+e.slice(1):t}))}}])&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),Utilities}();s=function(){},(i="noop")in(o=a)?Object.defineProperty(o,i,{value:s,enumerable:!0,configurable:!0,writable:!0}):o[i]=s;var r=a;function PhysicalKeyboard_defineProperties(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o);}}var u=function(){function PhysicalKeyboard(t){var e=t.dispatch,n=t.getOptions;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,PhysicalKeyboard),this.dispatch=e,this.getOptions=n,r.bindMethods(PhysicalKeyboard,this);}var t,e,n;return t=PhysicalKeyboard,(e=[{key:"handleHighlightKeyDown",value:function(t){var e=this.getOptions(),n=this.getSimpleKeyboardLayoutKey(t);this.dispatch((function(t){var o=t.getButtonElement(n)||t.getButtonElement("{".concat(n,"}"));o&&(o.style.backgroundColor=e.physicalKeyboardHighlightBgColor||"#dadce4",o.style.color=e.physicalKeyboardHighlightTextColor||"black",e.physicalKeyboardHighlightPress&&(o.onpointerdown||o.onmousedown||o.ontouchstart||r.noop)());}));}},{key:"handleHighlightKeyUp",value:function(t){var e=this.getOptions(),n=this.getSimpleKeyboardLayoutKey(t);this.dispatch((function(t){var o=t.getButtonElement(n)||t.getButtonElement("{".concat(n,"}"));o&&o.removeAttribute&&(o.removeAttribute("style"),e.physicalKeyboardHighlightPress&&(o.onpointerup||o.onmouseup||o.ontouchend||r.noop)());}));}},{key:"getSimpleKeyboardLayoutKey",value:function(t){var e;return ((e=t.code.includes("Numpad")||t.code.includes("Shift")||t.code.includes("Space")||t.code.includes("Backspace")||t.code.includes("Control")||t.code.includes("Alt")||t.code.includes("Meta")?t.code:t.key)!==e.toUpperCase()||"F"===t.code[0]&&Number.isInteger(Number(t.code[1]))&&t.code.length<=3)&&(e=e.toLowerCase()),e}}])&&PhysicalKeyboard_defineProperties(t.prototype,e),n&&PhysicalKeyboard_defineProperties(t,n),PhysicalKeyboard}();function _toConsumableArray(t){return function(t){if(Array.isArray(t))return Keyboard_arrayLikeToArray(t)}(t)||function(t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"===typeof t)return Keyboard_arrayLikeToArray(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return Keyboard_arrayLikeToArray(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function Keyboard_arrayLikeToArray(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,o=new Array(e);n<e;n++)o[n]=t[n];return o}function Keyboard_classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function Keyboard_defineProperties(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o);}}function Keyboard_defineProperty(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var c=function(){function SimpleKeyboard(){var t=this;Keyboard_classCallCheck(this,SimpleKeyboard),Keyboard_defineProperty(this,"handleParams",(function(t){var e,n,o;if("string"===typeof t[0])e=t[0].split(".").join(""),n=document.querySelector(".".concat(e)),o=t[1];else if(t[0]instanceof HTMLDivElement){if(!t[0].className)throw console.warn("Any DOM element passed as parameter must have a class."),new Error("KEYBOARD_DOM_CLASS_ERROR");e=t[0].className.split(" ")[0],n=t[0],o=t[1];}else e="simple-keyboard",n=document.querySelector(".".concat(e)),o=t[0];return {keyboardDOMClass:e,keyboardDOM:n,options:o}})),Keyboard_defineProperty(this,"getOptions",(function(){return t.options})),Keyboard_defineProperty(this,"getCaretPosition",(function(){return t.caretPosition})),Keyboard_defineProperty(this,"getCaretPositionEnd",(function(){return t.caretPositionEnd})),Keyboard_defineProperty(this,"registerModule",(function(e,n){t.modules[e]||(t.modules[e]={}),n(t.modules[e]);})),Keyboard_defineProperty(this,"getKeyboardClassString",(function(){for(var e=arguments.length,n=new Array(e),o=0;o<e;o++)n[o]=arguments[o];var i=[t.keyboardDOMClass].concat(n).filter((function(t){return !!t}));return i.join(" ")}));for(var e=arguments.length,n=new Array(e),o=0;o<e;o++)n[o]=arguments[o];var i=this.handleParams(n),s=i.keyboardDOMClass,a=i.keyboardDOM,c=i.options,l=void 0===c?{}:c;if(this.utilities=new r({getOptions:this.getOptions,getCaretPosition:this.getCaretPosition,getCaretPositionEnd:this.getCaretPositionEnd,dispatch:this.dispatch}),this.caretPosition=null,this.caretPositionEnd=null,this.keyboardDOM=a,this.options=l,this.options.layoutName=this.options.layoutName||"default",this.options.theme=this.options.theme||"hg-theme-default",this.options.inputName=this.options.inputName||"default",this.options.preventMouseDownDefault=this.options.preventMouseDownDefault||!1,this.keyboardPluginClasses="",r.bindMethods(SimpleKeyboard,this),this.input={},this.input[this.options.inputName]="",this.keyboardDOMClass=s,this.buttonElements={},window.SimpleKeyboardInstances||(window.SimpleKeyboardInstances={}),this.currentInstanceName=this.utilities.camelCase(this.keyboardDOMClass),window.SimpleKeyboardInstances[this.currentInstanceName]=this,this.allKeyboardInstances=window.SimpleKeyboardInstances,this.keyboardInstanceNames=Object.keys(window.SimpleKeyboardInstances),this.isFirstKeyboardInstance=this.keyboardInstanceNames[0]===this.currentInstanceName,this.physicalKeyboard=new u({dispatch:this.dispatch,getOptions:this.getOptions}),!this.keyboardDOM)throw console.warn('".'.concat(s,'" was not found in the DOM.')),new Error("KEYBOARD_DOM_ERROR");this.render(),this.modules={},this.loadModules();}var t,e,n;return t=SimpleKeyboard,(e=[{key:"setCaretPosition",value:function(t,e){this.caretPosition=t,this.caretPositionEnd=e||t;}},{key:"handleButtonClicked",value:function(t){var e=this.options.debug;if("{//}"===t)return !1;"function"===typeof this.options.onKeyPress&&this.options.onKeyPress(t),this.input[this.options.inputName]||(this.input[this.options.inputName]="");var n=this.utilities.getUpdatedInput(t,this.input[this.options.inputName],this.caretPosition,this.caretPositionEnd);if(this.input[this.options.inputName]!==n&&(!this.options.inputPattern||this.options.inputPattern&&this.inputPatternIsValid(n))){if(this.options.maxLength&&this.utilities.handleMaxLength(this.input,n))return !1;this.input[this.options.inputName]=this.utilities.getUpdatedInput(t,this.input[this.options.inputName],this.caretPosition,this.caretPositionEnd,!0),e&&console.log("Input changed:",this.getAllInputs()),this.options.debug&&console.log("Caret at: ",this.getCaretPosition(),this.getCaretPositionEnd(),"(".concat(this.keyboardDOMClass,")")),this.options.syncInstanceInputs&&this.syncInstanceInputs(),"function"===typeof this.options.onChange&&this.options.onChange(this.getInput(this.options.inputName,!0)),"function"===typeof this.options.onChangeAll&&this.options.onChangeAll(this.getAllInputs());}e&&console.log("Key pressed:",t);}},{key:"handleButtonMouseDown",value:function(t,e){var n=this;this.options.preventMouseDownDefault&&e.preventDefault(),this.options.stopMouseDownPropagation&&e.stopPropagation(),e&&e.target.classList.add(this.activeButtonClass),this.holdInteractionTimeout&&clearTimeout(this.holdInteractionTimeout),this.holdTimeout&&clearTimeout(this.holdTimeout),this.isMouseHold=!0,this.options.disableButtonHold||(this.holdTimeout=setTimeout((function(){(n.isMouseHold&&(!t.includes("{")&&!t.includes("}")||"{delete}"===t||"{backspace}"===t||"{bksp}"===t||"{space}"===t||"{tab}"===t)||"{arrowright}"===t||"{arrowleft}"===t||"{arrowup}"===t||"{arrowdown}"===t)&&(n.options.debug&&console.log("Button held:",t),n.handleButtonHold(t,e)),clearTimeout(n.holdTimeout);}),500));}},{key:"handleButtonMouseUp",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;n&&(this.options.preventMouseUpDefault&&n.preventDefault(),this.options.stopMouseUpPropagation&&n.stopPropagation()),this.recurseButtons((function(e){e.classList.remove(t.activeButtonClass);})),this.isMouseHold=!1,this.holdInteractionTimeout&&clearTimeout(this.holdInteractionTimeout),e&&"function"===typeof this.options.onKeyReleased&&this.options.onKeyReleased(e);}},{key:"handleKeyboardContainerMouseDown",value:function(t){this.options.preventMouseDownDefault&&t.preventDefault();}},{key:"handleButtonHold",value:function(t){var e=this;this.holdInteractionTimeout&&clearTimeout(this.holdInteractionTimeout),this.holdInteractionTimeout=setTimeout((function(){e.isMouseHold?(e.handleButtonClicked(t),e.handleButtonHold(t)):clearTimeout(e.holdInteractionTimeout);}),100);}},{key:"syncInstanceInputs",value:function(){var t=this;this.dispatch((function(e){e.replaceInput(t.input),e.setCaretPosition(t.caretPosition,t.caretPositionEnd);}));}},{key:"clearInput",value:function(t){t=t||this.options.inputName,this.input[t]="",this.setCaretPosition(0),this.options.syncInstanceInputs&&this.syncInstanceInputs();}},{key:"getInput",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(t=t||this.options.inputName,this.options.syncInstanceInputs&&!e&&this.syncInstanceInputs(),this.options.rtl){var n=this.input[t].replace("\u202b","").replace("\u202c","");return "\u202b"+n+"\u202c"}return this.input[t]}},{key:"getAllInputs",value:function(){var t=this,e={};return Object.keys(this.input).forEach((function(n){e[n]=t.getInput(n,!0);})),e}},{key:"setInput",value:function(t,e){e=e||this.options.inputName,this.input[e]=t,this.options.syncInstanceInputs&&this.syncInstanceInputs();}},{key:"replaceInput",value:function(t){this.input=t;}},{key:"setOptions",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=this.changedOptions(t);this.options=Object.assign(this.options,t),e.length&&(this.options.debug&&console.log("changedOptions",e),this.onSetOptions(t),this.render());}},{key:"changedOptions",value:function(t){var e=this;return Object.keys(t).filter((function(n){return JSON.stringify(t[n])!==JSON.stringify(e.options[n])}))}},{key:"onSetOptions",value:function(t){t.inputName&&(this.options.debug&&console.log("inputName changed. caretPosition reset."),this.setCaretPosition(null));}},{key:"clear",value:function(){this.keyboardDOM.innerHTML="",this.keyboardDOM.className=this.keyboardDOMClass,this.buttonElements={};}},{key:"dispatch",value:function(t){if(!window.SimpleKeyboardInstances)throw console.warn("SimpleKeyboardInstances is not defined. Dispatch cannot be called."),new Error("INSTANCES_VAR_ERROR");return Object.keys(window.SimpleKeyboardInstances).forEach((function(e){t(window.SimpleKeyboardInstances[e],e);}))}},{key:"addButtonTheme",value:function(t,e){var n=this;if(!e||!t)return !1;t.split(" ").forEach((function(o){e.split(" ").forEach((function(e){n.options.buttonTheme||(n.options.buttonTheme=[]);var i=!1;n.options.buttonTheme.map((function(t){if(t.class.split(" ").includes(e)){i=!0;var n=t.buttons.split(" ");n.includes(o)||(i=!0,n.push(o),t.buttons=n.join(" "));}return t})),i||n.options.buttonTheme.push({class:e,buttons:t});}));})),this.render();}},{key:"removeButtonTheme",value:function(t,e){var n=this;if(!t&&!e)return this.options.buttonTheme=[],this.render(),!1;t&&Array.isArray(this.options.buttonTheme)&&this.options.buttonTheme.length&&(t.split(" ").forEach((function(t){n.options.buttonTheme.map((function(o,i){if(e&&e.includes(o.class)||!e){var s=o.buttons.split(" ").filter((function(e){return e!==t}));s.length?o.buttons=s.join(" "):(n.options.buttonTheme.splice(i,1),o=null);}return o}));})),this.render());}},{key:"getButtonElement",value:function(t){var e,n=this.buttonElements[t];return n&&(e=n.length>1?n:n[0]),e}},{key:"inputPatternIsValid",value:function(t){var e,n=this.options.inputPattern;if((e=n instanceof RegExp?n:n[this.options.inputName])&&t){var o=e.test(t);return this.options.debug&&console.log('inputPattern ("'.concat(e,'"): ').concat(o?"passed":"did not pass!")),o}return !0}},{key:"setEventListeners",value:function(){!this.isFirstKeyboardInstance&&this.allKeyboardInstances||(this.options.debug&&console.log("Caret handling started (".concat(this.keyboardDOMClass,")")),document.addEventListener("keyup",this.handleKeyUp),document.addEventListener("keydown",this.handleKeyDown),document.addEventListener("mouseup",this.handleMouseUp),document.addEventListener("touchend",this.handleTouchEnd));}},{key:"handleKeyUp",value:function(t){this.caretEventHandler(t),this.options.physicalKeyboardHighlight&&this.physicalKeyboard.handleHighlightKeyUp(t);}},{key:"handleKeyDown",value:function(t){this.options.physicalKeyboardHighlight&&this.physicalKeyboard.handleHighlightKeyDown(t);}},{key:"handleMouseUp",value:function(t){this.caretEventHandler(t);}},{key:"handleTouchEnd",value:function(t){this.caretEventHandler(t);}},{key:"caretEventHandler",value:function(t){var e;t.target.tagName&&(e=t.target.tagName.toLowerCase()),this.dispatch((function(n){var o=t.target===n.keyboardDOM||t.target&&n.keyboardDOM.contains(t.target);n.isMouseHold&&(n.isMouseHold=!1),"textarea"!==e&&"input"!==e||n.options.disableCaretPositioning?!n.options.disableCaretPositioning&&o||n.setCaretPosition(null):(n.setCaretPosition(t.target.selectionStart,t.target.selectionEnd),n.options.debug&&console.log("Caret at: ",n.getCaretPosition(),n.getCaretPositionEnd(),t&&t.target.tagName.toLowerCase(),"(".concat(n.keyboardDOMClass,")")));}));}},{key:"recurseButtons",value:function(t){var e=this;if(!t)return !1;Object.keys(this.buttonElements).forEach((function(n){return e.buttonElements[n].forEach(t)}));}},{key:"destroy",value:function(){this.options.debug&&console.log("Destroying simple-keyboard instance: ".concat(this.currentInstanceName)),document.removeEventListener("keyup",this.handleKeyUp),document.removeEventListener("keydown",this.handleKeyDown),document.removeEventListener("mouseup",this.handleMouseUp),document.removeEventListener("touchend",this.handleTouchEnd),document.onpointerup=null,document.ontouchend=null,document.ontouchcancel=null,document.onmouseup=null;var deleteButton=function(t){t.onpointerdown=null,t.onpointerup=null,t.onpointercancel=null,t.ontouchstart=null,t.ontouchend=null,t.ontouchcancel=null,t.onclick=null,t.onmousedown=null,t.onmouseup=null,t.remove(),t=null;};this.recurseButtons(deleteButton),this.recurseButtons=null,deleteButton=null,this.keyboardDOM.onpointerdown=null,this.keyboardDOM.ontouchstart=null,this.keyboardDOM.onmousedown=null,this.clear(),window.SimpleKeyboardInstances[this.currentInstanceName]=null,delete window.SimpleKeyboardInstances[this.currentInstanceName],this.initialized=!1;}},{key:"getButtonThemeClasses",value:function(t){var e=this.options.buttonTheme,n=[];return Array.isArray(e)&&e.forEach((function(e){if(e.class&&"string"===typeof e.class&&e.buttons&&"string"===typeof e.buttons){var o=e.class.split(" ");e.buttons.split(" ").includes(t)&&(n=[].concat(_toConsumableArray(n),_toConsumableArray(o)));}else console.warn('Incorrect "buttonTheme". Please check the documentation.',e);})),n}},{key:"setDOMButtonAttributes",value:function(t,e){var n=this.options.buttonAttributes;Array.isArray(n)&&n.forEach((function(n){n.attribute&&"string"===typeof n.attribute&&n.value&&"string"===typeof n.value&&n.buttons&&"string"===typeof n.buttons?n.buttons.split(" ").includes(t)&&e(n.attribute,n.value):console.warn('Incorrect "buttonAttributes". Please check the documentation.',n);}));}},{key:"onTouchDeviceDetected",value:function(){this.processAutoTouchEvents(),this.disableContextualWindow();}},{key:"disableContextualWindow",value:function(){window.oncontextmenu=function(t){if(t.target.classList.contains("hg-button"))return t.preventDefault(),t.stopPropagation(),!1};}},{key:"processAutoTouchEvents",value:function(){this.options.autoUseTouchEvents&&(this.options.useTouchEvents=!0,this.options.debug&&console.log("autoUseTouchEvents: Touch device detected, useTouchEvents enabled."));}},{key:"onInit",value:function(){this.options.debug&&console.log("".concat(this.keyboardDOMClass," Initialized")),this.setEventListeners(),"function"===typeof this.options.onInit&&this.options.onInit();}},{key:"beforeFirstRender",value:function(){this.utilities.isTouchDevice()&&this.onTouchDeviceDetected(),"function"===typeof this.options.beforeFirstRender&&this.options.beforeFirstRender(),this.isFirstKeyboardInstance&&this.utilities.pointerEventsSupported()&&!this.options.useTouchEvents&&!this.options.useMouseEvents&&this.options.debug&&console.log("Using PointerEvents as it is supported by this browser"),this.options.useTouchEvents&&this.options.debug&&console.log("useTouchEvents has been enabled. Only touch events will be used.");}},{key:"beforeRender",value:function(){"function"===typeof this.options.beforeRender&&this.options.beforeRender();}},{key:"onRender",value:function(){"function"===typeof this.options.onRender&&this.options.onRender();}},{key:"onModulesLoaded",value:function(){"function"===typeof this.options.onModulesLoaded&&this.options.onModulesLoaded(this);}},{key:"loadModules",value:function(){var t=this;Array.isArray(this.options.modules)&&(this.options.modules.forEach((function(e){var n=new e;if(n.constructor.name&&"Function"!==n.constructor.name){var o="module-".concat(t.utilities.camelCase(n.constructor.name));t.keyboardPluginClasses=t.keyboardPluginClasses+" ".concat(o);}n.init(t);})),this.keyboardPluginClasses=this.keyboardPluginClasses+" modules-loaded",this.render(),this.onModulesLoaded());}},{key:"getModuleProp",value:function(t,e){return !!this.modules[t]&&this.modules[t][e]}},{key:"getModulesList",value:function(){return Object.keys(this.modules)}},{key:"parseRowDOMContainers",value:function(t,e,n,o){var i=this,s=Array.from(t.children),a=0;return s.length&&n.forEach((function(n,r){var u=o[r];if(!u||!(u>n))return !1;var c=n-a,l=u-a,h=document.createElement("div");h.className+="hg-button-container";var d="".concat(i.options.layoutName,"-r").concat(e,"c").concat(r);h.setAttribute("data-skUID",d);var p=s.splice(c,l-c+1);a=l-c,p.forEach((function(t){return h.appendChild(t)})),s.splice(c,0,h),t.innerHTML="",s.forEach((function(e){return t.appendChild(e)})),i.options.debug&&console.log("rowDOMContainer",p,c,l,a+1);})),t}},{key:"render",value:function(){var t=this;this.clear(),this.initialized||this.beforeFirstRender(),this.beforeRender();var e="hg-layout-".concat(this.options.layoutName),n=this.options.layout||{default:["` 1 2 3 4 5 6 7 8 9 0 - = {bksp}","{tab} q w e r t y u i o p [ ] \\","{lock} a s d f g h j k l ; ' {enter}","{shift} z x c v b n m , . / {shift}",".com @ {space}"],shift:["~ ! @ # $ % ^ & * ( ) _ + {bksp}","{tab} Q W E R T Y U I O P { } |",'{lock} A S D F G H J K L : " {enter}',"{shift} Z X C V B N M < > ? {shift}",".com @ {space}"]},o=this.options.useTouchEvents||!1,i=o?"hg-touch-events":"",s=this.options.useMouseEvents||!1,a=this.options.disableRowButtonContainers;this.keyboardDOM.className=this.getKeyboardClassString(this.options.theme,e,this.keyboardPluginClasses,i),n[this.options.layoutName].forEach((function(e,n){var i=e.split(" "),r=document.createElement("div");r.className+="hg-row";var u=[],c=[];i.forEach((function(e,i){var l,h=!a&&"string"===typeof e&&e.length>1&&0===e.indexOf("["),d=!a&&"string"===typeof e&&e.length>1&&e.indexOf("]")===e.length-1;h&&(u.push(i),e=e.replace(/\[/g,"")),d&&(c.push(i),e=e.replace(/\]/g,""));var p=t.utilities.getButtonClass(e),f=t.utilities.getButtonDisplayName(e,t.options.display,t.options.mergeDisplay),y=t.options.useButtonTag?"button":"div",b=document.createElement(y);b.className+="hg-button ".concat(p),(l=b.classList).add.apply(l,_toConsumableArray(t.getButtonThemeClasses(e))),t.setDOMButtonAttributes(e,(function(t,e){b.setAttribute(t,e);})),t.activeButtonClass="hg-activeButton",!t.utilities.pointerEventsSupported()||o||s?o?(b.ontouchstart=function(n){t.handleButtonClicked(e),t.handleButtonMouseDown(e,n);},b.ontouchend=function(n){t.handleButtonMouseUp(e,n);},b.ontouchcancel=function(n){t.handleButtonMouseUp(e,n);}):(b.onclick=function(){t.isMouseHold=!1,t.handleButtonClicked(e);},b.onmousedown=function(n){t.handleButtonMouseDown(e,n);},b.onmouseup=function(n){t.handleButtonMouseUp(e,n);}):(b.onpointerdown=function(n){t.handleButtonClicked(e),t.handleButtonMouseDown(e,n);},b.onpointerup=function(n){t.handleButtonMouseUp(e,n);},b.onpointercancel=function(n){t.handleButtonMouseUp(e,n);}),b.setAttribute("data-skBtn",e);var m="".concat(t.options.layoutName,"-r").concat(n,"b").concat(i);b.setAttribute("data-skBtnUID",m);var g=document.createElement("span");g.innerHTML=f,b.appendChild(g),t.buttonElements[e]||(t.buttonElements[e]=[]),t.buttonElements[e].push(b),r.appendChild(b);})),r=t.parseRowDOMContainers(r,n,u,c),t.keyboardDOM.appendChild(r);})),this.onRender(),this.initialized||(this.initialized=!0,!this.utilities.pointerEventsSupported()||o||s?o?(document.ontouchend=function(){return t.handleButtonMouseUp()},document.ontouchcancel=function(){return t.handleButtonMouseUp()},this.keyboardDOM.ontouchstart=function(e){return t.handleKeyboardContainerMouseDown(e)}):o||(document.onmouseup=function(){return t.handleButtonMouseUp()},this.keyboardDOM.onmousedown=function(e){return t.handleKeyboardContainerMouseDown(e)}):(document.onpointerup=function(){return t.handleButtonMouseUp()},this.keyboardDOM.onpointerdown=function(e){return t.handleKeyboardContainerMouseDown(e)}),this.onInit());}}])&&Keyboard_defineProperties(t.prototype,e),n&&Keyboard_defineProperties(t,n),SimpleKeyboard}();e.default=c;}])}));

});

const Keyboard = /*@__PURE__*/getDefaultExportFromCjs(build);

var build$1 = createCommonjsModule(function (module, exports) {
/*!
 * 
 *   simple-keyboard-key-navigation v2.3.42
 *   https://github.com/hodgef/simple-keyboard-key-navigation
 * 
 *   Copyright (c) Francisco Hodge (https://github.com/hodgef)
 * 
 *   This source code is licensed under the MIT license found in the
 *   LICENSE file in the root directory of this source tree.
 * 
 */
!function(t,e){"object"=='object'&&"object"=='object'?module.exports=e():"function"==typeof undefined&&undefined.amd?undefined([],e):"object"=='object'?exports.SimpleKeyboardKeyNavigation=e():t.SimpleKeyboardKeyNavigation=e();}(window,(function(){return function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r});},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0});},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=4)}([function(t,e,n){"use strict";var r=n(2),o=n.n(r),i=n(3),a=n.n(i)()(o.a);a.push([t.i,".simple-keyboard .hg-button.hg-standardBtn.hg-keyMarker,\n.simple-keyboard .hg-button.hg-functionBtn.hg-keyMarker {\n  box-shadow: 0 0 0 2px #88b8ff;\n  border-radius: 5px;\n}\n","",{version:3,sources:["webpack://src/index.css"],names:[],mappings:"AAAA;;EAEE,6BAA6B;EAC7B,kBAAkB;AACpB",sourcesContent:[".simple-keyboard .hg-button.hg-standardBtn.hg-keyMarker,\n.simple-keyboard .hg-button.hg-functionBtn.hg-keyMarker {\n  box-shadow: 0 0 0 2px #88b8ff;\n  border-radius: 5px;\n}\n"],sourceRoot:""}]),e.a=a;},function(t,e,n){"use strict";var r,o=function(){return void 0===r&&(r=Boolean(window&&document&&document.all&&!window.atob)),r},i=function(){var t={};return function(e){if(void 0===t[e]){var n=document.querySelector(e);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head;}catch(t){n=null;}t[e]=n;}return t[e]}}(),a=[];function u(t){for(var e=-1,n=0;n<a.length;n++)if(a[n].identifier===t){e=n;break}return e}function c(t,e){for(var n={},r=[],o=0;o<t.length;o++){var i=t[o],c=e.base?i[0]+e.base:i[0],s=n[c]||0,f="".concat(c," ").concat(s);n[c]=s+1;var l=u(f),d={css:i[1],media:i[2],sourceMap:i[3]};-1!==l?(a[l].references++,a[l].updater(d)):a.push({identifier:f,updater:y(d,e),references:1}),r.push(f);}return r}function s(t){var e=document.createElement("style"),r=t.attributes||{};if(void 0===r.nonce){var o=n.nc;o&&(r.nonce=o);}if(Object.keys(r).forEach((function(t){e.setAttribute(t,r[t]);})),"function"==typeof t.insert)t.insert(e);else {var a=i(t.insert||"head");if(!a)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");a.appendChild(e);}return e}var f,l=(f=[],function(t,e){return f[t]=e,f.filter(Boolean).join("\n")});function d(t,e,n,r){var o=n?"":r.media?"@media ".concat(r.media," {").concat(r.css,"}"):r.css;if(t.styleSheet)t.styleSheet.cssText=l(e,o);else {var i=document.createTextNode(o),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(i,a[e]):t.appendChild(i);}}function p(t,e,n){var r=n.css,o=n.media,i=n.sourceMap;if(o?t.setAttribute("media",o):t.removeAttribute("media"),i&&"undefined"!=typeof btoa&&(r+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),t.styleSheet)t.styleSheet.cssText=r;else {for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(r));}}var m=null,b=0;function y(t,e){var n,r,o;if(e.singleton){var i=b++;n=m||(m=s(e)),r=d.bind(null,n,i,!1),o=d.bind(null,n,i,!0);}else n=s(e),r=p.bind(null,n,e),o=function(){!function(t){if(null===t.parentNode)return !1;t.parentNode.removeChild(t);}(n);};return r(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;r(t=e);}else o();}}t.exports=function(t,e){(e=e||{}).singleton||"boolean"==typeof e.singleton||(e.singleton=o());var n=c(t=t||[],e);return function(t){if(t=t||[],"[object Array]"===Object.prototype.toString.call(t)){for(var r=0;r<n.length;r++){var o=u(n[r]);a[o].references--;}for(var i=c(t,e),s=0;s<n.length;s++){var f=u(n[s]);0===a[f].references&&(a[f].updater(),a.splice(f,1));}n=i;}}};},function(t,e,n){"use strict";function r(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(t)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=t[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t;}finally{try{r||null==u.return||u.return();}finally{if(o)throw i}}return n}(t,e)||function(t,e){if(!t)return;if("string"==typeof t)return o(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return o(t,e)}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}t.exports=function(t){var e=r(t,4),n=e[1],o=e[3];if("function"==typeof btoa){var i=btoa(unescape(encodeURIComponent(JSON.stringify(o)))),a="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(i),u="/*# ".concat(a," */"),c=o.sources.map((function(t){return "/*# sourceURL=".concat(o.sourceRoot||"").concat(t," */")}));return [n].concat(c).concat([u]).join("\n")}return [n].join("\n")};},function(t,e,n){"use strict";t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var n=t(e);return e[2]?"@media ".concat(e[2]," {").concat(n,"}"):n})).join("")},e.i=function(t,n,r){"string"==typeof t&&(t=[[null,t,""]]);var o={};if(r)for(var i=0;i<this.length;i++){var a=this[i][0];null!=a&&(o[a]=!0);}for(var u=0;u<t.length;u++){var c=[].concat(t[u]);r&&o[c[0]]||(n&&(c[2]?c[2]="".concat(n," and ").concat(c[2]):c[2]=n),e.push(c));}},e};},function(t,e,n){"use strict";n.r(e);var r=n(1),o=n.n(r),i=n(0),a={insert:"head",singleton:!1};o()(i.a,a),i.a.locals;function u(t){return function(t){if(Array.isArray(t))return c(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||function(t,e){if(t){if("string"==typeof t)return c(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return "Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?c(t,e):void 0}}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function c(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}e.default=function t(){(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")})(this,t),function(t,e,n){e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n;}(this,"init",(function(t){t.registerModule("keyNavigation",(function(e){e.initMarkerPos=[0,0],e.lastMarkerPos=e.initMarkerPos,e.initVars=function(n){e.markerPosition={row:0,button:0},e.layoutName=n||"",e.step=t.options.keyNavigationStep||1;},e.initMarker=function(){var t=e.getButtonAt.apply(e,u(e.lastMarkerPos))?e.lastMarkerPos:e.initMarkerPos;e.setMarker.apply(e,u(t));},e.getButtonAt=function(n,r){var o=e.layoutName;return t.keyboardDOM.querySelector('.hg-button[data-skbtnuid="'.concat(o,"-r").concat(n,"b").concat(r,'"]'))},e.setMarker=function(n,r){var o=e.getButtonAt(n,r);return o?(e.markedBtn&&e.markedBtn.classList.remove("hg-keyMarker"),o.classList.add("hg-keyMarker"),e.markedBtn=o,e.lastMarkerPos=[n,r],e.markerPosition={row:n,button:r},!0):(t.options.debug&&console.log("SimpleKeyboardKeyNavigation: Button default-r".concat(n,"b").concat(r," doesnt exist!")),!1)},e.up=function(){var t=e.markerPosition.row-e.step,n=e.markerPosition.button;if(!e.getButtonAt(t,n))for(var r=n;0<=r;r--)if(e.getButtonAt(t,r)){n=r;break}e.setMarker(t,n);},e.down=function(){var t=e.markerPosition.row+e.step,n=e.markerPosition.button;if(!e.getButtonAt(t,n))for(var r=n;0<=r;r--)if(e.getButtonAt(t,r)){n=r;break}e.setMarker(t,n);},e.right=function(){var t=e.markerPosition.row,n=e.markerPosition.button+e.step;e.setMarker(t,n);},e.left=function(){var t=e.markerPosition.row,n=e.markerPosition.button-e.step;e.setMarker(t,n);},e.press=function(){e.markedBtn&&(e.markedBtn.onpointerdown?(e.markedBtn.onpointerdown(),e.markedBtn.onpointerup()):e.markedBtn.onclick?e.markedBtn.onclick():e.markedBtn.ontouchdown&&(e.markedBtn.ontouchdown(),e.markedBtn.ontouchup()));},e.init=function(){e.initVars(t.options.layoutName),e.initMarker();},e.fn={},e.fn.onRender=t.onRender,t.onRender=function(){t.options.layoutName!==e.layoutName&&t.options.enableKeyNavigation&&(t.options.debug&&console.log("SimpleKeyboardKeyNavigation: Refreshed"),e.init()),e.fn.onRender();},t.options.enableKeyNavigation&&e.init();}));}));};}])}));

});

const keyNavigation = /*@__PURE__*/getDefaultExportFromCjs(build$1);

const lfKeyboardComponentCss = "body{margin:0px;padding:0px;font-family:'Atlas Grotesk Web', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'}html{width:100vw;height:100vh;overflow-y:hidden;scroll-behavior:smooth;font-size:17px}@media (max-width: 900px){html{font-size:15px}}@media (max-width: 400px){html{font-size:13px}}@font-face{font-family:'Atlas Grotesk Web';src:url('assets/fonts/AtlasGrotesk-Regular-Web.eot');src:url('assets/fonts/AtlasGrotesk-Regular-Web.eot?#iefix') format('embedded-opentype'),  \n       url('assets/fonts/AtlasGrotesk-Regular-Web.woff2') format('woff2'), \n       url('assets/fonts/AtlasGrotesk-Regular-Web.woff') format('woff');font-weight:400;font-style:normal;font-stretch:normal}@font-face{font-family:'Atlas Grotesk Web';src:url('assets/fonts/AtlasGrotesk-Light-Web.eot');src:url('assets/fonts/AtlasGrotesk-Light-Web.eot?#iefix') format('embedded-opentype'),\n       url('assets/fonts/AtlasGrotesk-Light-Web.woff2') format('woff2'),\n       url('assets/fonts/AtlasGrotesk-Light-Web.woff') format('woff');font-weight:300;font-style:normal;font-stretch:normal}:host{outline:none}.keyboard--wrapper,.simple-keyboard{box-sizing:border-box;flex:1 0 0;height:100%}.simple-keyboard{display:flex;flex-direction:column}@media (max-width: 900px){.keyboard--wrapper,.simple-keyboard{height:initial}.hg-button{min-height:4rem}}.lf-keyboard--theme,.hg-theme-default{background-color:transparent;font-family:Atlas, Helvetica, sans-serif;font-weight:400;font-style:normal;font-stretch:normal;color:#FFFFFF;font-size:1.6875rem;line-height:2rem;outline:none;animation:popIn 0.3s calc(4 * 120ms) both ease-in}.lf-keyboard--theme:focus,.lf-keyboard--theme:active,.lf-keyboard--theme:hover,.hg-theme-default:focus,.hg-theme-default:active,.hg-theme-default:hover{outline:none}.lf-keyboard--theme .hg-row,.hg-theme-default .hg-row{display:flex;justify-content:space-between;align-content:center;flex-grow:3;margin-bottom:0.325rem}.lf-keyboard--theme .hg-row:first-of-type,.hg-theme-default .hg-row:first-of-type{flex-grow:1}.lf-keyboard--theme .hg-row .hg-button:not(:last-child),.hg-theme-default .hg-row .hg-button:not(:last-child){margin-right:5px}.lf-keyboard--theme .hg-row>div:last-child,.hg-theme-default .hg-row>div:last-child{margin-right:0}.lf-keyboard--theme.hg-layout-numeric .hg-row,.lf-keyboard--theme.hg-layout-numericShift .hg-row,.hg-theme-default.hg-layout-numeric .hg-row,.hg-theme-default.hg-layout-numericShift .hg-row{flex-grow:2}.lf-keyboard--theme .hg-button,.hg-theme-default .hg-button{box-sizing:border-box;flex:1 0 0;border-radius:0.3125rem;border:0.25rem solid transparent;background-color:#646464;box-shadow:0px 1px 0px rgba(0, 0, 0, 0.3);outline:none;cursor:pointer;display:flex;flex-grow:1;align-items:center;justify-content:center;padding:0.325rem}.lf-keyboard--theme .hg-button:focus,.lf-keyboard--theme .hg-button:active,.lf-keyboard--theme .hg-button:hover,.hg-theme-default .hg-button:focus,.hg-theme-default .hg-button:active,.hg-theme-default .hg-button:hover{outline:none}.lf-keyboard--theme .hg-button.hg-activeButton,.hg-theme-default .hg-button.hg-activeButton{background-color:#3C3E47}.lf-keyboard--theme .hg-button:focus,.lf-keyboard--theme .hg-button:hover,.hg-theme-default .hg-button:focus,.hg-theme-default .hg-button:hover{outline:none;border-color:#2C65FF}.lf-keyboard--theme .hg-button.hg-button-space,.hg-theme-default .hg-button.hg-button-space{flex-grow:8}.lf-keyboard--theme .hg-button.hg-button-enter,.hg-theme-default .hg-button.hg-button-enter{display:flex;flex-grow:3;justify-content:flex-end}.lf-keyboard--theme .hg-button.hg-button-enter span,.hg-theme-default .hg-button.hg-button-enter span{align-self:flex-end;justify-self:flex-end;padding:0 0.2rem 0.2rem 0}.lf-keyboard--theme .hg-button.hg-button-numeric,.lf-keyboard--theme .hg-button.hg-button-alpha,.hg-theme-default .hg-button.hg-button-numeric,.hg-theme-default .hg-button.hg-button-alpha{display:flex;flex-grow:2;justify-content:flex-start}.lf-keyboard--theme .hg-button.hg-button-numeric span,.lf-keyboard--theme .hg-button.hg-button-alpha span,.hg-theme-default .hg-button.hg-button-numeric span,.hg-theme-default .hg-button.hg-button-alpha span{align-self:flex-end;justify-self:flex-start;padding:0 0 0.2rem 0.2rem}.lf-keyboard--theme .hg-button.hg-button-bksp,.hg-theme-default .hg-button.hg-button-bksp{font-size:1.25rem}.lf-keyboard--theme .hg-button.lf-keyboard-key--green,.hg-theme-default .hg-button.lf-keyboard-key--green{background-color:#12A37B}.lf-keyboard--theme .hg-button.lf-keyboard-key--green:active,.lf-keyboard--theme .hg-button.lf-keyboard-key--green .active,.hg-theme-default .hg-button.lf-keyboard-key--green:active,.hg-theme-default .hg-button.lf-keyboard-key--green .active{background-color:#15C595}.lf-keyboard--theme .hg-button.lf-keyboard-key--green.clean,.hg-theme-default .hg-button.lf-keyboard-key--green.clean{background-color:#D43333}.lf-keyboard--theme .hg-button.lf-keyboard-key--dark,.hg-theme-default .hg-button.lf-keyboard-key--dark{background-color:#3f3f3f}.lf-keyboard--theme .hg-button.lf-keyboard-key--dark:active,.lf-keyboard--theme .hg-button.lf-keyboard-key--dark .active,.hg-theme-default .hg-button.lf-keyboard-key--dark:active,.hg-theme-default .hg-button.lf-keyboard-key--dark .active{opacity:0.8}.lf-keyboard--theme .hg-button.hg-keyMarker,.hg-theme-default .hg-button.hg-keyMarker{box-shadow:unset !important;border-color:#2C65FF}";

const LfKeyboard = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.virtualKeyboardKeyPressed = createEvent(this, "virtualKeyboardKeyPressed", 7);
    this.submitButtonPressed = createEvent(this, "submitButtonPressed", 7);
    this.blurLfKeyboard = createEvent(this, "blurLfKeyboard", 7);
    this.KeyboardLayoutConfig = {
      [LayoutName.Alpha]: [
        `1 2 3 4 5 6 7 8 9 0`,
        `q w e r t y u i o p`,
        `a s d f g h j k l`,
        `${KeyboardCharMap.AlphaShift} z x c v b n m ${KeyboardCharMap.Delete}`,
        `${KeyboardCharMap.Numeric} ${KeyboardCharMap.Space} ${KeyboardCharMap.Enter}`,
      ],
      [LayoutName.AlphaShift]: [
        `1 2 3 4 5 6 7 8 9 0`,
        `Q W E R T Y U I O P`,
        `A S D F G H J K L`,
        `${KeyboardCharMap.AlphaShift} Z X C V B N M ${KeyboardCharMap.Delete}`,
        `${KeyboardCharMap.Numeric} ${KeyboardCharMap.Space} ${KeyboardCharMap.Enter}`,
      ],
      [LayoutName.Numeric]: [
        `1 2 3 4 5 6 7 8 9 0`,
        `- / : ; ( ) $ & @ "`,
        `${KeyboardCharMap.NumericShift} . , ? ! ' ${KeyboardCharMap.Delete}`,
        `${KeyboardCharMap.Alpha} ${KeyboardCharMap.Space} ${KeyboardCharMap.Enter}`,
      ],
      [LayoutName.NumericShift]: [
        `[ ] { } # % ^ * + =`,
        `_ \\ | ~ < > € £ ¥ •`,
        `${KeyboardCharMap.NumericShift} . , ? ! ' ${KeyboardCharMap.Delete}`,
        `${KeyboardCharMap.Alpha} ${KeyboardCharMap.Space} ${KeyboardCharMap.Enter}`,
      ],
    };
    this.KeyboardDisplayMap = {
      [`${KeyboardCharMap.Alpha}`]: "ABC",
      [`${KeyboardCharMap.AlphaShift}`]: "⇧",
      [`${KeyboardCharMap.Numeric}`]: "123",
      [`${KeyboardCharMap.NumericShift}`]: "#+=",
      [`${KeyboardCharMap.Enter}`]: "OK",
      [`${KeyboardCharMap.Delete}`]: "delete",
      [`${KeyboardCharMap.Space}`]: " ",
    };
    this.ButtonTheme = [
      {
        class: "lf-keyboard-key--short",
        buttons: "1 2 3 4 5 6 7 8 9 0",
      },
      {
        class: "lf-keyboard-key--dark",
        buttons: `${KeyboardCharMap.Numeric} ${KeyboardCharMap.Delete} ${KeyboardCharMap.NumericShift} ${KeyboardCharMap.Alpha} ${KeyboardCharMap.AlphaShift}`,
      },
      {
        class: "lf-keyboard-key--green",
        buttons: `${KeyboardCharMap.Enter}`,
      },
    ];
    this.MarkerClassName = "hg-keyMarker";
    // ---- Protected -----------------------------------------------------------------------------
    // none
    // ==== HOST HTML REFERENCE ===================================================================
    // @Element() el: HTMLElement;
    // ==== State() VARIABLES SECTION =============================================================
    this.inputDirty = false;
    // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
    this.keyNavigationEnabled = false;
    this.blurDirection = LfKeyboardBlurDirection.Null;
    this.wrapNavigation = false;
  }
  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentDidLoad Implementation - - - - - - - - - - - - - - - - - - - - -
  componentDidLoad() {
    console.group("componentDidLoad");
    try {
      this.initKeyboard();
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
  // ==== LISTENERS SECTION =====================================================================
  onKeydown(e) {
    console.group("onKeydown--Keyboard");
    try {
      const activeElement = document.activeElement.tagName;
      if (activeElement === "LF-KEYBOARD") {
        this.handleKeyNavigation(e.key);
      }
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
  // ==== PUBLIC METHODS API - @Method() SECTION ========================================================
  // @Method()
  // async publicMethod(): Promise<void> {return}
  // ==== LOCAL METHODS SECTION =========================================================================
  initKeyboard() {
    console.group("initKeyboard");
    try {
      this.keyboard = new Keyboard({
        onKeyPress: button => this.onKeyboardPressHandler(button),
        layout: this.KeyboardLayoutConfig,
        layoutName: LayoutName.Alpha,
        display: this.KeyboardDisplayMap,
        theme: "lf-keyboard--theme",
        buttonTheme: this.ButtonTheme,
        useMouseEvents: true,
        enableKeyNavigation: true,
        modules: [keyNavigation],
      });
      // setting row to -1 to offset last marker position
      this.keyboard["modules"]["keyNavigation"].markerPosition = {
        row: -1,
        button: 0,
      };
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
  onKeyboardPressHandler(buttonValue) {
    console.group("onKeyboardPressHandler");
    try {
      const layoutUpdateBtnsTyped = [KeyboardCharMap.Alpha, KeyboardCharMap.AlphaShift, KeyboardCharMap.Numeric, KeyboardCharMap.NumericShift];
      const navigationKeys = [Key_enum.Key.ArrowUp, Key_enum.Key.ArrowDown, Key_enum.Key.ArrowLeft, Key_enum.Key.ArrowRight];
      const funcBtnsTyped = [KeyboardCharMap.Delete, KeyboardCharMap.Enter, ...layoutUpdateBtnsTyped];
      const currentLayout = this.keyboard.options.layoutName;
      const layoutBtnsArr = layoutUpdateBtnsTyped.map(buttonName => {
        return buttonName.toString();
      });
      const funcBtnsArr = funcBtnsTyped.map(buttonName => {
        return buttonName.toString();
      });
      const navigationKeysToString = navigationKeys.map(key => {
        return key.toString();
      });
      if (navigationKeysToString.includes(buttonValue)) {
        this.handleKeyNavigation(buttonValue);
      }
      else if (layoutBtnsArr.includes(buttonValue)) {
        this.updateKeyboardLayout(buttonValue);
      }
      else if (buttonValue === KeyboardCharMap.Enter) {
        const keyboardInputValue = this.keyboard.getInput();
        this.submitButtonPressed.emit(keyboardInputValue);
      }
      else {
        if (buttonValue === KeyboardCharMap.Space) {
          buttonValue = " ";
        }
        this.virtualKeyboardKeyPressed.emit(buttonValue);
      }
      // switch out of caps after the first keypress that isn't a function button
      if (currentLayout === LayoutName.AlphaShift && !funcBtnsArr.includes(buttonValue)) {
        this.keyboard.setOptions({
          layoutName: LayoutName.Alpha,
        });
      }
      this.updateMarkerPosition(buttonValue);
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
  handleKeyNavigation(eventKey) {
    console.group("handleKeyNavigation", eventKey);
    try {
      const navModule = this.keyboard["modules"]["keyNavigation"];
      const rowPos = navModule.lastMarkerPos[0];
      const btnPos = navModule.lastMarkerPos[1];
      const keyboardLayoutName = this.keyboard.options.layoutName;
      const rowCharsArr = this.KeyboardLayoutConfig[keyboardLayoutName][rowPos].split(" ");
      if (eventKey === Key_enum.Key.ArrowUp) {
        // TODO - better handling of going up from space bar and enter key
        // exiting keyboard - blur keyboard and update last marker position
        const topRow = !navModule.getButtonAt(rowPos - navModule.step, btnPos);
        if (topRow &&
          (this.blurDirection === LfKeyboardBlurDirection.Top || this.blurDirection === LfKeyboardBlurDirection.Both)) {
          navModule.markedBtn.classList.remove(this.MarkerClassName);
          navModule.markerPosition = {
            row: -1,
            button: btnPos,
          };
          this.blurLfKeyboard.emit();
        }
        else {
          navModule.up();
        }
      }
      else if (eventKey === Key_enum.Key.ArrowDown) {
        const btnInLastRow = !navModule.getButtonAt(rowPos - navModule.step, btnPos);
        const triggerKbBlur = btnInLastRow &&
          (this.blurDirection === LfKeyboardBlurDirection.Bottom ||
            this.blurDirection === LfKeyboardBlurDirection.Both);
        if (triggerKbBlur) {
          navModule.markedBtn.classList.remove(this.MarkerClassName);
          navModule.markerPosition = {
            row: rowPos + 1,
            button: btnPos,
          };
          this.blurLfKeyboard.emit();
        }
        navModule.down();
      }
      else if (eventKey === Key_enum.Key.ArrowLeft) {
        const btnInFirstRow = !navModule.getButtonAt(rowPos, btnPos - navModule.step);
        if (btnInFirstRow && this.wrapNavigation) {
          const lastBtnIndex = rowCharsArr.length - 1;
          navModule.setMarker(rowPos, lastBtnIndex);
        }
        else {
          navModule.left();
        }
      }
      else if (eventKey === Key_enum.Key.ArrowRight) {
        const btnIsRowLast = !navModule.getButtonAt(rowPos, btnPos + navModule.step);
        if (btnIsRowLast && this.wrapNavigation) {
          navModule.setMarker(rowPos, 0);
        }
        else {
          navModule.right();
        }
      }
      else {
        navModule.press();
      }
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
  updateMarkerPosition(buttonValue) {
    console.group("updateMarkerPosition");
    try {
      const layoutName = this.keyboard.options.layoutName;
      const layout = this.keyboard.options.layout[layoutName];
      for (const rowIndex in layout) {
        const row = layout[rowIndex];
        if (row.includes(buttonValue)) {
          const rowArr = row.split(" ");
          const buttonIndex = rowArr.indexOf(buttonValue);
          this.keyboard["modules"]["keyNavigation"].setMarker(Number(rowIndex), Number(buttonIndex));
          break;
        }
      }
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
  updateKeyboardLayout(button) {
    console.group("updateKeyboardLayout");
    try {
      const currentLayout = this.keyboard.options.layoutName;
      let updatedLayoutName = null;
      if (button === KeyboardCharMap.AlphaShift) {
        updatedLayoutName = currentLayout === LayoutName.AlphaShift ? LayoutName.Alpha : LayoutName.AlphaShift;
      }
      else if (button === KeyboardCharMap.Alpha) {
        updatedLayoutName = LayoutName.Alpha;
      }
      else if (button === KeyboardCharMap.Numeric) {
        updatedLayoutName = LayoutName.Numeric;
      }
      else if (button === KeyboardCharMap.NumericShift) {
        updatedLayoutName = currentLayout === LayoutName.NumericShift ? LayoutName.Numeric : LayoutName.NumericShift;
      }
      if (updatedLayoutName) {
        this.keyboard.setOptions({
          layoutName: updatedLayoutName,
        });
      }
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
  // ==== RENDERING SECTION =========================================================================
  // - -  render Implementation - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render() {
    console.group("render");
    try {
      return (h("div", { class: "keyboard--wrapper" }, h("div", { class: "simple-keyboard" })));
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
};
LfKeyboard.style = lfKeyboardComponentCss;

export { LfKeyboard as lf_keyboard };
