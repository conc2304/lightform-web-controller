import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss',
})
export class AppHome {
  render() {
    return [
      <ion-content >
        <lf-wifi-list></lf-wifi-list>
      </ion-content>,
    ];
  }
}
