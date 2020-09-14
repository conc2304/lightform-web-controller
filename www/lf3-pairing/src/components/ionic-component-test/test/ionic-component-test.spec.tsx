import { newSpecPage } from '@stencil/core/testing';
import { IonicComponentTest } from '../ionic-component-test';

describe('ionic-component-test', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IonicComponentTest],
      html: `<ionic-component-test></ionic-component-test>`,
    });
    expect(page.root).toEqualHtml(`
      <ionic-component-test>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ionic-component-test>
    `);
  });
});
