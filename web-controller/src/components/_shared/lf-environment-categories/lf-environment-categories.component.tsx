// ==== Library Imports =======================================================
import { Component, Element, h, Host, Prop } from '@stencil/core';
import { LfProjectType } from '../../../shared/enums/lf-project-type.enum';
import { LfEnvironmentCategoriesObject, LfProjectMetadata } from '../../../shared/interfaces/lf-web-controller.interface';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfAppState from '../../../store/lf-app-state.store';

@Component({
  tag: 'lf-environment-categories',
  styleUrl: 'lf-environment-categories.component.scss',
  shadow: true,
})
export class LfEnvironmentCategories {
  // ==== OWN PROPERTIES SECTION ================================================================
  // ---- Private  ------------------------------------------------------------------------------
  private log = new LfLoggerService('LfEnvironmentCategories').logger;

  // ==== HOST HTML REFERENCE ===================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION =============================================================

  // ==== PUBLIC PROPERTY API - Prop() SECTION ==================================================
  @Prop() projects: Array<LfProjectMetadata>;
  @Prop() isMobileLayout = lfAppState.mobileLayout;

  // ==== EVENTS SECTION ========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ============================================================

  // ==== LISTENERS SECTION =====================================================================

  // ==== PUBLIC METHODS API - @Method() SECTION ================================================

  // ==== LOCAL METHODS SECTION =================================================================
  private getLayoutClass() {
    this.log.debug('getLayoutClass');

    return this.isMobileLayout ? 'lf-layout--mobile' : 'lf-layout--desktop';
  }

  // ==== RENDERING SECTION =====================================================================

  private renderContent() {
    const categories: Array<string> = [];
    const categoriesObjects: Array<LfEnvironmentCategoriesObject> = [];


    if (!this.projects) return 'No Environment Projects Found';

    const envProjects = this.projects.filter(project => {
      return project.type === LfProjectType.EnvironmentProject;
    });

    const regex = /\d+-/;
    envProjects.forEach(project => {

      project.slides.some(slide => {
        if (!categories.includes(slide.projectName)) {
          categories.push(slide.category);
          categoriesObjects.push({
            title: slide.projectName.replace(regex, ''),
            url: `/environments/${slide.projectName}`,
            imgUrl: slide.thumbnail,
          });
          return true;
        }
      });
    });

    return categoriesObjects.map(categoryCardObj => {
      return <lf-category-card isMobileLayout={this.isMobileLayout} name={categoryCardObj.title} url={categoryCardObj.url} thumbnailUrl={categoryCardObj.imgUrl} />;
    });
  }

  // - -  render Implementation - Do Not Rename - - - - - - - - - - - - - - - - - - - - - - - - - -
  render() {
    try {
      this.log.debug('render');
      return <Host class={`lf-environment-categories ${this.getLayoutClass()}`}>{this.renderContent()}</Host>;
    } catch (error) {
      this.log ? this.log.error(error) : console.error(error);

      return '';
    }
  }
}
