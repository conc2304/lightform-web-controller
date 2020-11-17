# lf-text-input



<!-- Auto Generated Below -->


## Usage

### Javascript

```html
<!-- Default -->
<lf-text-input></lf-text-input>

<!-- Placeholder -->
<lf-text-input placeholder="Placeholder Text"></lf-text-input>

<!-- Label -->
<lf-text-input label="Width"></lf-text-input>
<lf-text-input label="Width" placeholder="Enter width in pixels"></lf-text-input>

<!-- Disabled -->
<lf-text-input disabled></lf-text-input>
<lf-text-input disabled="true"></lf-text-input>

<!-- Required -->
<lf-text-input required></lf-text-input>
<lf-text-input required="true"></lf-text-input>

<!-- Label Position -->
<lf-text-input label="Default Label Position" label-position="fixed"></lf-text-input>
<lf-text-input label="Stacked Label Position" label-position="stacked"></lf-text-input>

<!-- Clear Input -->
<lf-text-input clear-input="true" placeholder="The clear button appears when input has a value"></lf-text-input>
<lf-text-input clear-input="true" clear-icon-color="red" placeholder="Clear Button is red"></lf-text-input>

<!-- Default Value -->
<lf-text-input value="My input value"></lf-text-input>

<!-- Input Types -->
<lf-text-input type="text" label="Default Type"></lf-text-input>
<lf-text-input type="textarea"></lf-text-input>
<lf-text-input type="email"></lf-text-input>
<lf-text-input type="password"></lf-text-input>
<lf-text-input type="tel"></lf-text-input>
<lf-text-input type="datetime-local"></lf-text-input>
```



## Properties

| Property          | Attribute           | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Type                                                                                                                                                   | Default        |
| ----------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| `autocapitalize`  | `autocapitalize`    | Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `string`                                                                                                                                               | `"off"`        |
| `autofocus`       | `autofocus`         | This Boolean attribute lets you specify that a form control should have input focus when the page loads.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `boolean`                                                                                                                                              | `false`        |
| `clearIconColor`  | `clear-icon-color`  | The color of the icon used to clear input when there is a value.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `string`                                                                                                                                               | `"#FFF"`       |
| `clearInput`      | `clear-input`       | If `true`, a clear icon will appear in the input when there is a value. Clicking it clears the input.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `boolean`                                                                                                                                              | `false`        |
| `clearOnEdit`     | `clear-on-edit`     | If `true`, the value will be cleared after focus upon edit. Defaults to `true` when `type` is `"password"`, `false` for all other types.                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `boolean`                                                                                                                                              | `undefined`    |
| `debounce`        | `debounce`          | Set the amount of time, in milliseconds, to wait to trigger the `lfChange` event after each keystroke.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `number`                                                                                                                                               | `0`            |
| `disabled`        | `disabled`          | If `true`, the user cannot interact with the input.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `boolean`                                                                                                                                              | `false`        |
| `expand`          | `expand`            | Determines wether the input container should fill the rest of the container or remain at its initial width/                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | `"block" \| "fill"`                                                                                                                                    | `"block"`      |
| `fireFocusEvents` | `fire-focus-events` | This is required for a WebKit bug which requires us to blur and focus an input to properly focus the input in an item with delegatesFocus. It will no longer be needed with iOS 14.                                                                                                                                                                                                                                                                                                                                                                                                              | `boolean`                                                                                                                                              | `true`         |
| `invalid`         | `invalid`           |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `boolean`                                                                                                                                              | `false`        |
| `label`           | `label`             | The text describing the input field.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `string`                                                                                                                                               | `undefined`    |
| `labelPosition`   | `label-position`    | The position determines where and how the label behaves inside an item. Defaults to fixed if label is set.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | `"fixed" \| "stacked"`                                                                                                                                 | `undefined`    |
| `max`             | `max`               | The maximum value, which must not be less than its minimum (min attribute) value.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `string`                                                                                                                                               | `undefined`    |
| `maxlength`       | `maxlength`         | If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the maximum number of characters that the user can enter.                                                                                                                                                                                                                                                                                                                                                                                                                 | `number`                                                                                                                                               | `undefined`    |
| `min`             | `min`               | The minimum value, which must not be greater than its maximum (max attribute) value.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `string`                                                                                                                                               | `undefined`    |
| `minlength`       | `minlength`         | If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the minimum number of characters that the user can enter.                                                                                                                                                                                                                                                                                                                                                                                                                 | `number`                                                                                                                                               | `undefined`    |
| `multiple`        | `multiple`          | If `true`, the user can enter more than one value. This attribute applies when the type attribute is set to `"email"` or `"file"`, otherwise it is ignored.                                                                                                                                                                                                                                                                                                                                                                                                                                      | `boolean`                                                                                                                                              | `undefined`    |
| `name`            | `name`              | The name of the control, which is submitted with the form data.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `string`                                                                                                                                               | `this.inputId` |
| `pattern`         | `pattern`           | A regular expression that the value is checked against. The pattern must match the entire value, not just some subset. Use the title attribute to describe the pattern to help the user. This attribute applies when the value of the type attribute is `"text"`, `"search"`, `"tel"`, `"url"`, `"email"`, `"date"`, or `"password"`, otherwise it is ignored. When the type attribute is `"date"`, `pattern` will only be used in browsers that do not support the `"date"` input type natively. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date for more information. | `string`                                                                                                                                               | `undefined`    |
| `placeholder`     | `placeholder`       | Instructional text that shows before the input has a value.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | `string`                                                                                                                                               | `undefined`    |
| `readonly`        | `readonly`          | If `true`, the user cannot modify the value.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `boolean`                                                                                                                                              | `false`        |
| `required`        | `required`          | If `true`, the user must fill in a value before submitting a form.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `boolean`                                                                                                                                              | `false`        |
| `size`            | `size`              | The initial size of the control. This value is in pixels unless the value of the type attribute is `"text"` or `"password"`, in which case it is an integer number of characters. This attribute applies only when the `type` attribute is set to `"text"`, `"search"`, `"tel"`, `"url"`, `"email"`, or `"password"`, otherwise it is ignored.                                                                                                                                                                                                                                                   | `number`                                                                                                                                               | `undefined`    |
| `step`            | `step`              | Works with the min and max attributes to limit the increments at which a value can be set. Possible values are: `"any"` or a positive floating point number.                                                                                                                                                                                                                                                                                                                                                                                                                                     | `string`                                                                                                                                               | `undefined`    |
| `type`            | `type`              | The type of control to display. The default type is text.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `"date" \| "datetime-local" \| "email" \| "month" \| "number" \| "password" \| "search" \| "tel" \| "text" \| "textarea" \| "time" \| "url" \| "week"` | `"text"`       |
| `value`           | `value`             | The value of the input.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `number \| string`                                                                                                                                     | `""`           |


## Events

| Event      | Description                             | Type                         |
| ---------- | --------------------------------------- | ---------------------------- |
| `lfBlur`   | Emitted when the input loses focus.     | `CustomEvent<FocusEvent>`    |
| `lfChange` | Emitted when the value has changed.     | `CustomEvent<any>`           |
| `lfFocus`  | Emitted when the input has focus.       | `CustomEvent<FocusEvent>`    |
| `lfInput`  | Emitted when a keyboard input occurred. | `CustomEvent<KeyboardEvent>` |
| `lfStyle`  | Emitted when the styles change.         | `CustomEvent<any>`           |


## Methods

### `getInputElement() => Promise<HTMLInputElement>`

Returns the native `<input>` element used under the hood.

#### Returns

Type: `Promise<HTMLInputElement>`



### `setFocus() => Promise<void>`

Sets focus on the native `input` in `lf-text-input`. Use this method instead of the global
`input.focus()`.

#### Returns

Type: `Promise<void>`




## CSS Custom Properties

| Name                         | Description                                  |
| ---------------------------- | -------------------------------------------- |
| `--background`               | Background of the input                      |
| `--border-color`             | Color of the input border                    |
| `--border-color-focus`       | Color of the border when the input has focus |
| `--border-color-input-dirty` | Color of the border when the input has value |
| `--border-radius`            | Radius of the input border                   |
| `--border-width`             | Width of the input border                    |
| `--color`                    | Color of the input text                      |
| `--label-color`              | Color of the Label                           |
| `--label-padding-bottom`     | The Label's bottom padding                   |
| `--label-padding-left`       | The Label's left padding                     |
| `--label-padding-right`      | The Label's right padding                    |
| `--label-padding-top`        | The Label's top padding                      |
| `--padding-bottom`           | Bottom padding of the input                  |
| `--padding-right`            | Right padding                                |
| `--padding-start`            | Left padding                                 |
| `--padding-top`              | Top padding of the input                     |
| `--placeholder-color`        | Color of the input placeholder text          |
| `--placeholder-opacity`      | Opacity of the input placeholder text        |


## Dependencies

### Used by

 - [design-sheet](../design-sheet)

### Graph
```mermaid
graph TD;
  design-sheet --> lf-text-input
  style lf-text-input fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
