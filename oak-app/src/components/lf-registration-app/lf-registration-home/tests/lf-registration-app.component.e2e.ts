import { newE2EPage } from '@stencil/core/testing';

describe('lf-registration-app', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<lf-registration-app></lf-registration-app>');

    const element = await page.find('lf-registration-app');
    expect(element).toHaveClass('hydrated');
  });
});
