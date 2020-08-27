import { Component, Prop, h } from "@stencil/core";

@Component({
  tag: "lf-subheader",
  styleUrls: ["lf-subheader.component.scss"],
  shadow: true,
})
export class LfSubheader {
  @Prop() inset: boolean = false;
  @Prop() dark: boolean = false;
  @Prop() light: boolean = false;

  private getClassName(): string {
    let className: string = "lf-subheader";

    if (this.inset) {
      className = `${className} lf-subheader--inset`;
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
      <div class={this.getClassName()}>
        <slot />
      </div>
    )
  }
}
