import { newE2EPage } from '@stencil/core/testing';

describe('lf-wifi-connecting', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<lf-wifi-connecting></lf-wifi-connecting>');

    const element = await page.find('lf-wifi-connecting');
    expect(element).toHaveClass('hydrated');
  });
});
