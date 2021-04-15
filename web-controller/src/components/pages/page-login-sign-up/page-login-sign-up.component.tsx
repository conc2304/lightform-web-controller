// ==== Library Imports =======================================================
import { Component, Element, h, Host, State } from '@stencil/core';
import { alertController } from '@ionic/core';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfRemoteApiAuth from '../../../shared/services/lf-remote-api/lf-remote-api-auth.service';

@Component({
  tag: 'page-login-sign-up',
  styleUrl: 'page-login-sign-up.component.scss',
})
export class PageLogin {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('PageLoginSignUp').logger;

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================
  @State() password: string;
  @State() passwordConfirm: string;
  @State() email: string;
  @State() firstName: string;
  @State() lastName: string;
  @State() errorMsg: string;
  @State() submitting = false;

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  // ==== EVENTS SECTION ========================================================================
  // ==== COMPONENT LIFECYCLE EVENTS ============================================================
  // - -  componentWillLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad() {
    this.log.debug('componentDidLoad');
    document.title = 'Lightform | Sign Up';
  }

  // ==== LISTENERS SECTION =====================================================================

  // ==== PUBLIC METHODS API - @Method() SECTION ================================================

  // ==== LOCAL METHODS SECTION =================================================================
  private async handleSubmit(e: Event) {
    this.log.debug('handleSubmit');

    this.submitting = true;
    e.preventDefault();
    this.errorMsg = null;
    this.submitting = true;

    var response = await lfRemoteApiAuth.createUser(this.firstName, this.lastName, this.email, this.password);
    this.submitting = false;

    if (!response.response.ok) {
      this.errorMsg = response.body.fields[0].message;
    } else {
      this.password = null;
      this.email = null;
      this.firstName = null;
      this.lastName = null;
      this.errorMsg = null;

      const message = `Identity is important. We want to make sure it is really you. After you verify your account, you can continue registering devices.`;
      const alert = await alertController.create({
        cssClass: `lf-alert-modal`,
        header: 'Please check your inbox for a verification email.',
        message: `<p class="lf-alert-modal--message">${message}</p>`,
        backdropDismiss: true,
      });

      await alert.present();
    }
  }

  private handleEmailChange(event: Event) {
    this.log.debug('handleEmailChange');
    this.email = (event.target as HTMLTextAreaElement).value;
  }

  private handleFirstNameChange(event: Event) {
    this.log.debug('handleEmailChange');
    this.firstName = (event.target as HTMLTextAreaElement).value;
  }

  private handleLastNameChange(event: Event) {
    this.log.debug('handleEmailChange');
    this.lastName = (event.target as HTMLTextAreaElement).value;
  }

  private handlePasswordChange(event: Event) {
    this.log.debug('handleEmailChange');
    this.password = (event.target as HTMLTextAreaElement).value;
  }

  private handlePasswordConfirmChange(event: Event) {
    this.log.debug('handleEmailChange');
    this.passwordConfirm = (event.target as HTMLTextAreaElement).value;
  }

  private passwordNotSame(): boolean {
    const passwordInputsDirty = this.passwordConfirm?.length > 0 && this.password?.length > 0;
    const passwordMatch = this.password === this.passwordConfirm;
    return passwordInputsDirty && !passwordMatch;
  }

  private emailIsValid(): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(this.email);
  }

  private formIsInvalid(): boolean {
    return (
      !this.email ||
      !this.emailIsValid() ||
      !this.password ||
      !this.passwordConfirm ||
      this.password !== this.passwordConfirm ||
      !this.firstName ||
      !this.lastName
    );
  }

  // ==== RENDERING SECTION =====================================================================
  private renderLoginContent() {
    this.log.debug('renderControlPageContent');

    return (
      <form class="lf-login-page--container" onSubmit={(e) => this.handleSubmit(e)}>
        <img class="lf-wordmark-logo" src="/assets/images/logos/Wordmark White.svg" alt="Lightform" />
        <h1>Create your lightform account</h1>
        <small class="text-muted">
          By creating an account, you agree to Lightform's <br />
          <span>
            <a
              class="alert-link"
              target="_blank"
              href="https://lightform.com/wp-content/uploads/2018/07/Lightform-Terms-of-Service.pdf"
            >
              Terms &amp; Conditions
            </a>
            and
            <a
              class="alert-link"
              target="_blank"
              href="https://lightform.com/wp-content/uploads/2018/07/Lightform-Privacy-Policy.pdf"
            >
              Privacy Policy
            </a>
          </span>
        </small>
        <div class="lf-login--input-container">
          <lf-text-input
            label="First Name"
            labelPosition="stacked-centered"
            expand="fill"
            size="50"
            value={this.firstName}
            onInput={(event: Event) => this.handleFirstNameChange(event)}
          />
          <lf-text-input
            label="Last Name"
            labelPosition="stacked-centered"
            expand="fill"
            size="50"
            value={this.lastName}
            onInput={(event: Event) => this.handleLastNameChange(event)}
          />
          <lf-text-input
            label="Email"
            labelPosition="stacked-centered"
            expand="fill"
            size="50"
            value={this.email}
            invalid={this.email?.length && !this.emailIsValid()}
            onInput={(event: Event) => this.handleEmailChange(event)}
          />

          {this.email?.length && !this.emailIsValid() && <p class="input-error">please enter a valid email</p>}
          <lf-text-input
            label="Password"
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
        </div>

        {this.passwordNotSame() && <p class="input-error">Passwords should match</p>}

        <div class="lf-login--progress-container">{this.renderProgressBar()}</div>
        <lf-button
          class="lf-login--submit"
          type="submit"
          value="Submit"
          disabled={this.formIsInvalid() || this.submitting}
          onClick={(e) => {
            this.handleSubmit(e);
          }}
        >
          Create Account
        </lf-button>
        <button
          disabled={this.formIsInvalid() || this.submitting}
          type="submit"
          value="Submit"
          style={{ display: 'none' }}
        ></button>
        <div class="lf-login--error-container">{this.renderErrorMsg()}</div>
        <ion-router-link href="/login">
          <ion-button fill="clear" color="primary">
            Log in
          </ion-button>
        </ion-router-link>
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
      return (
        <Host class="lf-login-page scroll-y ion-padding">
          <div class="back-button-wrapper">
            <ion-buttons>
              <ion-back-button default-href="/login" text="Back" icon="chevron-back-outline"></ion-back-button>
            </ion-buttons>
          </div>
          {this.renderLoginContent()}
        </Host>
      );
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
