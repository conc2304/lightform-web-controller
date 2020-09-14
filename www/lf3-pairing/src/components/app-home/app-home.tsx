import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
})
export class AppHome {
  render() {
    return [
      <ion-content class="ion-padding">
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button defaultHref="/" />
            </ion-buttons>
            <ion-title>Lightform UI R&amp;D - Ionic Web Components</ion-title>
          </ion-toolbar>

          <ion-toolbar>
            <ion-title>Routes</ion-title>
            <ion-router-link href="/ionic-component-test"> Ionic Component Sticker Sheet</ion-router-link>
          </ion-toolbar>
        </ion-header>
        <lf-wifi-list></lf-wifi-list>
      </ion-content>,
    ];
  }
}
