// ==== Library Imports =======================================================
import { Component, Element, h, Host, Prop, State } from '@stencil/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfRemoteApiAuthService from '../../../shared/services/lf-remote-api/lf-remote-api-auth.service';

@Component({
  tag: 'page-login-forgot-password',
  styleUrl: 'page-login-forgot-password.component.scss',
})
export class PageLogin {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('PageLoginForgotPassword').logger;
  private router: HTMLIonRouterElement;

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() password: string;
  @State() email: string;
  @State() errorMsg: string;
  @State() submitting = false;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================

  // ==== EVENTS SECTION ========================================================================
  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad() {
    this.log.debug('componentDidLoad');
    document.title = 'Lightform | Password Reset';
    this.router = await document.querySelector('ion-router').componentOnReady();

  }

  // ==== LISTENERS SECTION =====================================================================

  // ==== PUBLIC METHODS API - @Method() SECTION ================================================

  // ==== LOCAL METHODS SECTION =================================================================
  private async handleSubmit(e: Event) {
    this.log.debug('handleSubmit');

    e.preventDefault();
    this.errorMsg = null;
    this.submitting = true;

    lfRemoteApiAuthService
      .requestReset(this.email)
      .then(async res => {
        console.log('then: ', res);
        const message = `Please check ${this.email} for a password reset email (don't forget to look in your spam folder, just in case).`;
        // this.router.push(`/login/reset?message=${message}`);
        window.location.href=`login?message=${message}`
      })
      .catch(e => {
        this.log.warn(e);
        this.errorMsg = e || 'please enter a valid email address';
      })
      .finally(() => {
        this.submitting = false;
      });
  }

  private handleEmailChange(event: Event) {
    this.log.debug('handleEmailChange');
    this.email = (event.target as HTMLTextAreaElement).value;
  }

  // ==== RENDERING SECTION =====================================================================
  private renderLoginContent() {
    this.log.debug('renderControlPageContent');

    return (
      <form class="lf-login-page--container" onSubmit={e => this.handleSubmit(e)}>
        <img class="lf-wordmark-logo" src="/assets/images/logos/Wordmark White.svg" alt="Lightform" />
        <h1>Request Password Reset</h1>
        <div class="lf-login--input-container">
          <lf-text-input label="Email" labelPosition="stacked-centered" expand="fill" size="50" value={this.email} onInput={(event: Event) => this.handleEmailChange(event)} />
        </div>
        <div class="lf-login--progress-container">{this.renderProgressBar()}</div>
        <lf-button
          class="lf-login--submit"
          type="submit"
          value="Submit"
          disabled={!this.email || !this.email?.includes('@') || this.submitting}
          onClick={e => {
            this.handleSubmit(e);
          }}
        >
          Submit
        </lf-button>
        <button disabled={!this.email || !this.email?.includes('@') || this.submitting} type="submit" value="Submit" style={{ 'display': 'none' }}></button>
        <div class="lf-login--error-container">{this.renderErrorMsg()}</div>
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
