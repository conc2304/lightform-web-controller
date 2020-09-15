import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss',
})
export class AppHome {
  render() {
    return [
      <ion-content>
        <div class="wifi-list--page-container">
          <div class="wifi-list--card">
            <div class="wifi-list--content">
              <div class="wifi-list--header-container">
                <div class="wifi-list--header-text">Internet Settings</div>
                <div class="wifi-list--header-divider"></div>
              </div>

              <div class="wifi-list--items-container scrollable-content">
                <lf-wifi-list></lf-wifi-list>
              </div>
            </div>
          </div>
        </div>
      </ion-content>,
    ];
  }
}
