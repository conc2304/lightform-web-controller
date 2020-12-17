import { PageHome } from '../page-home.component';
import { newSpecPage } from '@stencil/core/testing';

describe('page-home', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [PageHome],
      html: '<page-home></page-home>',
    });
    expect(root.querySelector('ion-title').textContent).toEqual('Home');
  });
});
