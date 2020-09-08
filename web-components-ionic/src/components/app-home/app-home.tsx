import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
})
export class AppHome {
  render() {
    return [
      <ion-content class="ion-padding">
        <lf-wifi-list></lf-wifi-list>
      </ion-content>,
    ];
  }
}
