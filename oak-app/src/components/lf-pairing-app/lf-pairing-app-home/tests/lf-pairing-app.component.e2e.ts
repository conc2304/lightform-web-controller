import { newE2EPage } from '@stencil/core/testing';

describe('lf-pairing-app', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<lf-pairing-app></lf-pairing-app>');

    const element = await page.find('lf-pairing-app');
    expect(element).toHaveClass('hydrated');
  });
});
