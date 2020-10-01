import { Component, Prop, h, Element } from "@stencil/core";

@Component({
  tag: "lf-list-item",
  styleUrls: ["lf-list-item.component.scss", "lf-list-common.component.scss"],
  shadow: true,
})
export class ListItem {
  @Element() listItemEl: HTMLElement;
  @Prop() outlined: boolean = false;
  @Prop() dark: boolean = false;
  @Prop() light: boolean = false;
  @Prop() dense: boolean = false;
  @Prop() disabled: boolean = false;

  public listItem: any;

  private getListItemClassName(): string {
    let className: string = "lf-list-item";

    if (this.disabled) {
      className = `${className} lf-list-item--disabled`;
    }

    if (this.outlined) {
      className = `${className} lf-list-item--outlined`;
    }

    if (this.dense) {
      className = `${className} lf-list-item--dense`;
    }

    if (this.dark) {
      className = `${className} theme--dark`;
    }

    if (this.light) {
      className = `${className} theme--light`;
    }

    return className;
  }

  render() {
    return (
      <div
        class={this.getListItemClassName()}
        role="listitem"
        tabindex="0"
        ref={listItem => {
          this.listItem = listItem;
        }}
      >
        <slot name="lf-list-item--icon-prepend" />
        <slot name="lf-list-item--content" />
        <slot name="lf-list-item--icon-append" />
      </div>
    );
  }
}
