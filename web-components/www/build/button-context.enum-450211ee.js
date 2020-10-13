var ButtonSize;
(function (ButtonSize) {
    ButtonSize["XLarge"] = "x-large";
    ButtonSize["Large"] = "large";
    ButtonSize["Regular"] = "regular";
    ButtonSize["Small"] = "small";
    ButtonSize["XSmall"] = "x-small";
})(ButtonSize || (ButtonSize = {}));

var ButtonContext;
(function (ButtonContext) {
    ButtonContext["Primary"] = "primary";
    ButtonContext["Secondary"] = "secondary";
    ButtonContext["UI"] = "ui";
})(ButtonContext || (ButtonContext = {}));

export { ButtonSize as B, ButtonContext as a };
