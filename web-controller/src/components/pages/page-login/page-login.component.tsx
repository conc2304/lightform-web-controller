// ==== Library Imports =======================================================
import { Component, Element, h, State } from '@stencil/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfRemoteApiAuth from '../../../shared/services/lf-remote-api/lf-remote-api-auth.service';
import lfAppState, { initializeData } from '../../../store/lf-app-state.store';

@Component({
  tag: 'page-login',
  styleUrl: 'page-login.component.scss',
})
export class PageLogin {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('PageLogin').logger;
  private email: string;
  private password: string;
  private router: HTMLIonRouterElement;

  // ---- Protected -----------------------------------------------------------------------------

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() pageLoginEl: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() errorMsg: string;
  @State() loading = false;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  // ==== EVENTS SECTION ========================================================================
  // ==== COMPONENT LIFECYCLE EVENTS ============================================================

  // - -  componentWillLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad() {
    this.log.warn('componentDidLoad');

    this.router = await document.querySelector('ion-router').componentOnReady();
  }

  // ==== LISTENERS SECTION =====================================================================

  // ==== PUBLIC METHODS API - @Method() SECTION ================================================

  // ==== LOCAL METHODS SECTION =================================================================
  private async handleSubmit() {
    this.log.info('handleSubmit');

    this.errorMsg = null;
    this.loading = true;

    lfRemoteApiAuth
      .authenticate(this.email, this.password)
      .then(async res => {
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
      .then(data => {
        // successful user data
        lfAppState.user = data;
        initializeData();
        this.router.push('/');
      })
      .catch(error => {
        this.errorMsg = typeof error === 'string' ? error : 'Unknown Login Error';
        this.log.error(error);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  private handleEmailChange(event: Event) {
    this.log.info('handleEmailChange');
    this.email = (event.target as HTMLTextAreaElement).value;
  }

  private handlePasswordChange(event: Event) {
    this.log.info('handleEmailChange');
    this.password = (event.target as HTMLTextAreaElement).value;
  }

  // ==== RENDERING SECTION =====================================================================
  private renderLoginContent() {
    this.log.debug('renderControlPageContent');

    return (
      <div class="lf-login-page--container">
        <img class="lf-wordmark-logo" src="/assets/images/logos/Wordmark White.svg" alt="Lightform" />
        <h1>Account Login</h1>
        <div class="lf-login--input-container">
          <lf-text-input label="Email" labelPosition="stacked-centered" expand="fill" size="50" value={this.email} onInput={(event: Event) => this.handleEmailChange(event)} />
          <lf-text-input
            label="Password"
            labelPosition="stacked-centered"
            expand="fill"
            size="50"
            value={this.password}
            type="password"
            onInput={(event: Event) => this.handlePasswordChange(event)}
          />
        </div>
        <div class="lf-login--progress-container">{this.renderProgressBar()}</div>
        <lf-button
          class="lf-login--submit"
          type="submit"
          value="Submit"
          onClick={() => {
            this.handleSubmit();
          }}
        >
          Log in
        </lf-button>
        <div class="lf-login--error-container">{this.renderErrorMsg()}</div>
      </div>
    );
  }

  private renderProgressBar() {
    this.log.debug('renderProgressBar');

    if (this.loading) {
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
    this.log.debug('render');
    return <div class="lf-login-page scroll-y ion-padding">{this.renderLoginContent()}</div>;
  }
}
