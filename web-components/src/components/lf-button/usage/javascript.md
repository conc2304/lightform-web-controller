```html

<!-- Default  -->
<lf-button></lf-button>

<!-- Anchor -->
<lf-button href="#" rel="nofollow" target="_blank"></lf-button>

<!-- Sizes -->
<lf-button size="x-large">X Large</lf-button>
<lf-button size="large">Large</lf-button>
<lf-button size="regular">Default</lf-button>
<lf-button size="small">Small</lf-button>
<lf-button size="x-small">X Small</lf-button>

<!-- Contexts -->
<lf-button context="primary">Primary</lf-button>
<lf-button context="secondary">Secondary</lf-button>
<lf-button context="ui">UI</lf-button>

<!-- Disabled -->
<lf-button disabled>Disabled</lf-button>
<lf-button disabled={true}>Disabled</lf-button>

<!-- Type -->
<lf-button type="submit">Submit</lf-button>
<lf-button type="button">Default</lf-button>
<lf-button type="reset">Reset</lf-button>

<!-- Icons -->
<lf-button>
  <img slot="start" src="./path/to/icon.svg"/>
  Left Icon
</lf-button>

<lf-button>
  Right Icon
    <img slot="start" src="./path/to/icon.svg"/>
</lf-button>
```
