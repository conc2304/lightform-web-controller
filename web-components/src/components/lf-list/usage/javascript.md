```html
<!-- Default -->
<lf-list></lf-list>

<!-- Disabled -->
<lf-list disabled></lf-list>

<!-- List Items -->
<lf-list>
  <lf-list-item>Item 1</lf-list-item>
  <lf-list-item>Item 2</lf-list-item>
  <lf-list-item>Item 3</lf-list-item>
</lf-list>

<!-- List with Subheader -->
<lf-list>
  <lf-subheader>Subheader Text</lf-subheader>
  <lf-list-item>Item 1</lf-list-item>
  <lf-list-item>Item 2</lf-list-item>
  <lf-list-item>Item 3</lf-list-item>
</lf-list>
```

### List Styles

```scss
lf-list {
  --height: initial;
  --min-height: 3rem;
  --max-height: initial;

  --width: initial;
  --min-width: 3rem;
  --max-width: initial;

  --background: initial;

  --border-radius: 0;
  --border-width: 0;
  --border-style: solid;
  --border-color: transparent;
}

lf-list.my-class {
    --border-color: red;
}
```
