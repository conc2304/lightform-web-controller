import { newE2EPage } from '@stencil/core/testing';

describe('lf-registration-input', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<lf-registration-input></lf-registration-input>');

    const element = await page.find('lf-registration-input');
    expect(element).toHaveClass('hydrated');
  });
});
