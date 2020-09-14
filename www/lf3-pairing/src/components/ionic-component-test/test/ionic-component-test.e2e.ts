import { newE2EPage } from '@stencil/core/testing';

describe('ionic-component-test', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ionic-component-test></ionic-component-test>');

    const element = await page.find('ionic-component-test');
    expect(element).toHaveClass('hydrated');
  });
});
