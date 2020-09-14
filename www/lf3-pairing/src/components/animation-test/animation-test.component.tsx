import { Component, Element, h } from "@stencil/core";

@Component({
  tag: "animation-test",
  styleUrl: "animation-test.component.scss",
  shadow: false,
})
export class AnimationTest {
  @Element() el: HTMLElement;

  render() {
    <div class="animation-test">
      <slot/>
    </div>
  }
}
