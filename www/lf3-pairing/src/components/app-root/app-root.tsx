import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
})
export class AppRoot {
  render() {
    return (
      <ion-app>
        <ion-router useHash={false}>
          <ion-route url="/" component="app-home" />
          <ion-route url="/ionic-component-test" component="ionic-component-test" />
        </ion-router>
        <ion-nav />
      </ion-app>
    );
  }
}
