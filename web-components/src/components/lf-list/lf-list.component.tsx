import { Component, Prop, h } from "@stencil/core";

@Component({
  tag: "lf-list",
  styleUrls: ["lf-list.component.scss", "lf-list-common.component.scss", "../_common/styles.scss"],
  shadow: true,
})
export class LfList {
  @Prop() color: string = null;
  @Prop() zebra: boolean = false;
  @Prop() dark: boolean = false;
  @Prop() light: boolean = false;
  @Prop() dense: boolean = false;
  @Prop() outlined: boolean = false;
  @Prop() disabled: boolean = false;
  @Prop() elevation: number | string = null;
  @Prop() height: number | string = null;
  @Prop() width: number | string = null;
  @Prop() minHeight: number | string = null;
  @Prop() maxHeight: number | string = null;
  @Prop() minWidth: number | string = null;
  @Prop() maxWidth: number | string = null;

  private getListClassName(): string {
    let className: string = "lf-list";

    if (this.disabled) {
      className = `${className} lf-list--disabled`;
    }

    if (this.dense) {
      className = `${className} lf-list--dense`;
    }

    if (this.outlined) {
      className = `${className} lf-list--outlined`;
    }

    if (this.zebra) {
      className = `${className} lf-list--zebra`;
    }

    if (this.dark) {
      className = `${className} theme--dark`;
    }

    if (this.light) {
      className = `${className} theme--light`;
    }

    if (this.color) {
      className = `${className} theme--color`
    }

    return className;
  }

  private getListStyles() {
    const styles = {
      backgroundColor: `${this.color}`,
      height: `${this.height}`,
      width: `${this.width}`,
      minHeight: `${this.minHeight}`,
      maxHeight: `${this.maxHeight}`,
      minWidth: `${this.minWidth}`,
      maxWidth: `${this.maxWidth}`,
    };

    return styles;
  }

  render() {
    return (
      <div role="list" class={this.getListClassName()} style={this.getListStyles()}>
        <slot />
      </div>
    );
  }
}
