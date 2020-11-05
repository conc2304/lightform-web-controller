import { newE2EPage } from '@stencil/core/testing';

describe('lf-wifi-password', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<lf-wifi-password></lf-wifi-password>');

    const element = await page.find('lf-wifi-password');
    expect(element).toHaveClass('hydrated');
  });
});
