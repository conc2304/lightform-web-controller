```html
<!-- Default List Item -->
<lf-list-item>Item Content</lf-list-item>

<!-- List Item as Button -->
<lf-list-item button onclick="buttonClick()"> Button Content </lf-list-item>

<!-- List Item as Anchor -->
<lf-list-item href="https://www.lightform.com" rel="nofollow" target="_self">
  Anchor Item
</lf-list-item>

<!-- Disabled -->
<lf-list-item disabled></lf-list-item>

<!-- Active -->
<lf-list-item active></lf-list-item>

<!-- Icons -->
<lf-list-item>
  <img slot="start" src="/path/to/sweet/img.gif" />
  <div>Icon Left</div>
</lf-list-item>

<lf-list-item>
  <div>Icon Right</div>
  <img slot="end" src="/path/to/sweet/img.gif" />
</lf-list-item>
```

### List Items

```html
<lf-list>
  <lf-list-item> Item </lf-list-item>
  <lf-list-item>
    This is a bunch of text that should cause the text to wrap down around to
    the next line
  </lf-list-item>
</lf-list>
```

### Buttons in Items

```html
<lf-item>
  <lf-button slot="start"> Start </lf-button>
  <lf-label>Button Start/End</lf-label>
  <lf-button slot="end"> End </lf-button>
</lf-item>

<lf-item>
  <lf-button slot="start">
    Start Icon
    <img src="/path/to/img.gif" slot="end" />
  </lf-button>
  <lf-label>Buttons with Icons</lf-label>
  <lf-button slot="end">
    <img src="/path/to/img.gif" slot="end" />
    End Icon
  </lf-button>
</lf-item>
```

### Item Inputs

```html
<lf-item>
  <lf-label position="floating">Floating Input</lf-label>
  <lf-input></lf-input>
</lf-item>

<lf-item>
  <lf-label>Checkbox</lf-label>
  <lf-checkbox slot="start"></lf-checkbox>
</lf-item>
```

### List Item Styles

```scss
lf-list-item {
  --background: #{$color-brand-lf-gray-dark};
  --background-active: #{$color-brand-lf-blue-light};
  --background-active-opacity: 1;
  --background-focus: #{$color-brand-lf-gray-dark};
  --background-focus-opacity: 1;
  --background-hover: #{$color-brand-lf-gray-dark};
  --background-hover-opacity: 1;

  --border-radius: 4px;
  --border-width: 2px;
  --border-style: solid;
  --border-color: #FFFFFF;
}
```
