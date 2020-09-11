# design-sheet



<!-- Auto Generated Below -->


## Dependencies

### Depends on

- [lf-button](../lf-button)
- [lf-wifi-list-2](../lf-wifi-list-2)
- [lf-wifi-list](../lf-wifi-list)

### Graph
```mermaid
graph TD;
  design-sheet --> lf-button
  design-sheet --> lf-wifi-list-2
  design-sheet --> lf-wifi-list
  lf-wifi-list-2 --> lf-wifi-list-item
  lf-wifi-list --> lf-list
  lf-wifi-list --> lf-subheader
  lf-wifi-list --> lf-list-item
  style design-sheet fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
