// ==== Library Imports =======================================================
import { Component, Element, h, Host, State } from '@stencil/core';
import { toastController } from '@ionic/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfRemoteApiAuth from '../../../shared/services/lf-remote-api/lf-remote-api-auth.service';
import lfAppState, { initializeData, initializeDeviceSelected } from '../../../store/lf-app-state.store';

@Component({
  tag: 'page-login',
  styleUrl: 'page-login.component.scss',
})
export class PageLogin {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('PageLogin').logger;
  private router: HTMLIonRouterElement;
  private toast: HTMLIonToastElement = null;

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() password: string;
  @State() email: string;
  @State() errorMsg: string;
  @State() submitting = false;
  @State() message: string;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  // ==== EVENTS SECTION ========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad() {
    this.log.debug('componentDidLoad');
    document.title = 'Lightform | Login';
    this.router = await document.querySelector('ion-router').componentOnReady();

    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');

    if (message) {
      this.toast = await toastController.create({
        header: null,
        message: message,
        position: 'top',
        color: 'primary',
        buttons: [
          {
            text: 'close',
            role: 'cancel',
          },
        ],
      });
      this.toast.present();
    }
  }

  // ==== LISTENERS SECTION =====================================================================
  // ==== PUBLIC METHODS API - @Method() SECTION ================================================

  // ==== LOCAL METHODS SECTION =================================================================
  private async handleSubmit(e: Event) {
    this.log.debug('handleSubmit');

    e.preventDefault();
    this.errorMsg = null;
    this.submitting = true;

    if (this.toast?.dismiss) {
      this.toast.dismiss();
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    lfRemoteApiAuth
      .authenticate(this.email, this.password)
      .then(async (res) => {
        const response = res.response;
        const json = res.body;

        if (!response.ok) {
          let errorMsg = 'Incorrect email or password';
          if (json.error == 'email_unverified') {
          }
          if (json.error == 'rate_limited') {
            errorMsg = 'Too many login attempts have been made for this user, try again in a minute.';
          }

          return Promise.reject(errorMsg);
        } else {
          //successful login
          localStorage.setItem('accessToken', json.access_token);
          localStorage.setItem('refreshToken', json.refresh_token);

          return Promise.resolve(true);
        }
      })
      .then(async () => {
        const res = await lfRemoteApiAuth.getCurrentUser();
        const response = res.response;
        const body = res.body;
        return response.ok ? Promise.resolve(body) : Promise.reject('Unable to retrieve user');
      })
      .then(async (data) => {
        // successful user data
        lfAppState.user = data;
        await initializeData();
        initializeDeviceSelected();
        this.password = '';
        this.email = '';
        this.router.push('/');
      })
      .catch((error) => {
        this.errorMsg = typeof error === 'string' ? error : 'Unknown Login Error';
        this.log.error(error);
      })
      .finally(() => {
        this.submitting = false;
      });
  }

  private handleEmailChange(event: Event) {
    this.log.debug('handleEmailChange');
    this.email = (event.target as HTMLTextAreaElement).value;
  }

  private handlePasswordChange(event: Event) {
    this.log.debug('handleEmailChange');
    this.password = (event.target as HTMLTextAreaElement).value;
  }

  // ==== RENDERING SECTION =====================================================================
  private renderLoginContent() {
    this.log.debug('renderControlPageContent');

    return (
      <form class="lf-login-page--container" onSubmit={(e) => this.handleSubmit(e)}>
        <img class="lf-wordmark-logo" src="/assets/images/logos/Wordmark White.svg" alt="Lightform" />
        <h1>Account Login</h1>
        <div class="lf-login--input-container">
          <lf-text-input
            label="Email"
            labelPosition="stacked-centered"
            expand="fill"
            size="50"
            value={this.email}
            onInput={(event: Event) => this.handleEmailChange(event)}
          />
          <lf-text-input
            label="Password"
            labelPosition="stacked-centered"
            expand="fill"
            size="50"
            value={this.password}
            type="password"
            clearOnEdit={false}
            onInput={(event: Event) => this.handlePasswordChange(event)}
          />
        </div>
        <div class="lf-login--progress-container">{this.renderProgressBar()}</div>
        <lf-button
          class="lf-login--submit"
          type="submit"
          value="Submit"
          disabled={!this.email || !this.password || this.submitting}
          onClick={(e) => {
            this.handleSubmit(e);
          }}
        >
          Log in
        </lf-button>
        <button
          disabled={!this.email || !this.password || this.submitting}
          type="submit"
          value="Submit"
          style={{ display: 'none' }}
        ></button>
        <div class="lf-login--error-container">{this.renderErrorMsg()}</div>
        <div class="login-alt-actions">
          <ion-router-link href="/forgot-password">
            <ion-button fill="clear" color="primary">
              Forgot Password?
            </ion-button>
          </ion-router-link>
          <ion-router-link href="/sign-up">
            <ion-button fill="clear" color="primary">
              Sign Up
            </ion-button>
          </ion-router-link>
        </div>
      </form>
    );
  }

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

  private renderErrorMsg() {
    this.log.debug('renderErrorMsg');

    if (this.errorMsg) {
      return (
        <div class="error-msg--wrapper">
          <div class="lf-login--error-msg">{this.errorMsg}</div>
          <ion-icon
            class="close-button"
            onClick={() => {
              this.errorMsg = null;
              this.email = '';
              this.password = '';
            }}
            name="close"
            color="danger"
          />
        </div>
      );
    }
  }

  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    try {
      this.log.debug('render');
      return <Host class="lf-login-page scroll-y ion-padding">{this.renderLoginContent()}</Host>;
    } catch (error) {
      this.log ? this.log.error(error) : console.error(error);

      if (error?.message && error?.code) {
        return <lf-error-message errorCode={error?.code} errorMessage={error?.message} hasResetButton={true} />;
      } else {
        return <lf-error-message hasResetButton={true} />;
      }
    }
  }
}
