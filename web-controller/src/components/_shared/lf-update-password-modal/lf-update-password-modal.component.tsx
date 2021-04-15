// ==== Library Imports =======================================================
import { Component, Element, h, Listen, State } from '@stencil/core';
import { toastController } from '@ionic/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfRemoteApiAuthService from '../../../shared/services/lf-remote-api/lf-remote-api-auth.service';
import lfAppState from '../../../store/lf-app-state.store';

@Component({
  tag: 'lf-update-password-modal',
  styleUrl: 'lf-update-password-modal.component.scss',
})
export class LfUpdatePasswordModal {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('LfUpdatePasswordModal').logger;

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() lfDeviceSelectorModalEl: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() submitting = false;
  @State() password: string;
  @State() passwordConfirm: string;
  @State() errorMsg: string;
  @State() mobileLayout = lfAppState.mobileLayout;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  // ==== EVENTS SECTION ========================================================================
  // ==== COMPONENT LIFECYCLE EVENTS ============================================================

  // ==== LISTENERS SECTION =====================================================================
  @Listen('_layoutUpdated', { target: 'document' })
  onWindowResized(): void {
    this.log.debug('onWindowResized');
    this.mobileLayout = lfAppState.mobileLayout;
  }

  // ==== LISTENERS SECTION =====================================================================
  // ==== PUBLIC METHODS API - @Method() SECTION ================================================
  // ==== LOCAL METHODS SECTION =================================================================

  private async handleSubmit(e: Event) {
    this.log.debug('handleSubmit');

    this.submitting = true;
    this.errorMsg = null;

    e.preventDefault();

    var response = await lfRemoteApiAuthService.updatePassword(this.password);
    this.submitting = false;

    if (!response.response.ok) {
      this.errorMsg = response.body.fields[0].message;
    } else {
      this.password = null;
      this.passwordConfirm = null;
      this.dismissModal(true);
      this.displaySuccessNotification();
    }
  }

  private passwordNotSame(): boolean {
    const passwordInputsDirty = this.passwordConfirm?.length > 0 && this.password?.length > 0;
    const passwordMatch = this.password === this.passwordConfirm;
    return passwordInputsDirty && !passwordMatch;
  }

  private dismissModal(success = false) {
    // dismiss the closest modal and optionally pass back data
    (this.lfDeviceSelectorModalEl.closest('ion-modal') as any).dismiss({
      dismissed: true,
      success,
    });
  }

  private async displaySuccessNotification() {
    const toast = await toastController.create({
      message: `<p class="center"><strong>Your password has been updated</strong></p>`,
      position: 'top',
      color: 'success',
      duration: 1200,
    });

    await toast.present();
  }

  private handlePasswordChange(event: Event) {
    this.log.debug('handleEmailChange');
    this.password = (event.target as HTMLTextAreaElement).value;
  }

  private handlePasswordConfirmChange(event: Event) {
    this.log.debug('handleEmailChange');
    this.passwordConfirm = (event.target as HTMLTextAreaElement).value;
  }

  private formInvalid(): boolean {
    return !this.password || !this.passwordConfirm || this.passwordNotSame();
  }

  // ==== RENDERING SECTION =====================================================================
  private renderProgressBar() {
    this.log.debug('renderProgressBar');

    if (this.submitting) {
      return (
        <div class="progress-wrapper">
          <ion-progress-bar color="primary" type="indeterminate" />
        </div>
      );
    }
  }

  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - -
  render() {
    this.log.debug('render');
    const layoutClassName = this.mobileLayout ? 'lf-layout--mobile' : 'lf-layout--desktop';

    return (
      <div class={`lf-update-password-modal--content ${layoutClassName}`}>
        <h2 class="lf-modal-hero-text">Change Password</h2>
        <span
          class="close-modal-button"
          onClick={() => {
            this.dismissModal();
          }}
        >
          <ion-icon size="large" name="close"></ion-icon>
        </span>

        <form class="lf-update-password--form" onSubmit={(e) => this.handleSubmit(e)}>
          <div>
            <lf-text-input
              label="New Password"
              labelPosition="stacked-centered"
              expand="fill"
              size="50"
              value={this.password}
              type="password"
              clearOnEdit={false}
              onInput={(event: Event) => this.handlePasswordChange(event)}
              invalid={this.passwordNotSame()}
            />
            <lf-text-input
              label="Confirm Password"
              labelPosition="stacked-centered"
              expand="fill"
              size="50"
              value={this.passwordConfirm}
              type="password"
              clearOnEdit={false}
              onInput={(event: Event) => this.handlePasswordConfirmChange(event)}
              invalid={this.passwordNotSame()}
            />
            {this.passwordNotSame() && <p class="input-error">Passwords must match</p>}
          </div>

          <div class="progress-container">{this.renderProgressBar()}</div>

          {this.errorMsg && <p>{this.errorMsg}</p>}
          <div class="form-buttons--container">
            <lf-button
              context="secondary"
              value="Close"
              onClick={() => {
                this.dismissModal();
              }}
            >
              Close
            </lf-button>
            <lf-button
              class="lf-login--submit"
              type="submit"
              value="Submit"
              disabled={this.formInvalid() || this.submitting}
              onClick={(e) => {
                this.handleSubmit(e);
              }}
            >
              Update
            </lf-button>
          </div>
          <button
            disabled={this.formInvalid() || this.submitting}
            type="submit"
            value="Submit"
            style={{ display: 'none' }}
          ></button>
        </form>
      </div>
    );
  }
}
