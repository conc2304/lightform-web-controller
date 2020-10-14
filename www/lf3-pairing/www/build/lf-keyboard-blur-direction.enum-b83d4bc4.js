var KeyboardCharMap;
(function (KeyboardCharMap) {
  KeyboardCharMap["Delete"] = "{bksp}";
  KeyboardCharMap["AlphaShift"] = "{shift}";
  KeyboardCharMap["Numeric"] = "{numeric}";
  KeyboardCharMap["NumericShift"] = "{numericShift}";
  KeyboardCharMap["Space"] = "{space}";
  KeyboardCharMap["Enter"] = "{enter}";
  KeyboardCharMap["Alpha"] = "{alpha}";
})(KeyboardCharMap || (KeyboardCharMap = {}));
var LayoutName;
(function (LayoutName) {
  LayoutName["Alpha"] = "alpha";
  LayoutName["AlphaShift"] = "shift";
  LayoutName["Numeric"] = "numeric";
  LayoutName["NumericShift"] = "numericShift";
})(LayoutName || (LayoutName = {}));

var LfKeyboardBlurDirection;
(function (LfKeyboardBlurDirection) {
  LfKeyboardBlurDirection[LfKeyboardBlurDirection["Top"] = 0] = "Top";
  LfKeyboardBlurDirection[LfKeyboardBlurDirection["Bottom"] = 1] = "Bottom";
  LfKeyboardBlurDirection[LfKeyboardBlurDirection["Both"] = 2] = "Both";
  LfKeyboardBlurDirection[LfKeyboardBlurDirection["Null"] = 3] = "Null";
})(LfKeyboardBlurDirection || (LfKeyboardBlurDirection = {}));

export { KeyboardCharMap as K, LfKeyboardBlurDirection as L, LayoutName as a };
