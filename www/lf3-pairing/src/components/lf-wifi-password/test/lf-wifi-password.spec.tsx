import { newSpecPage } from '@stencil/core/testing';
import { LfWifiPassword } from '../lf-wifi-password';

describe('lf-wifi-password', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LfWifiPassword],
      html: `<lf-wifi-password></lf-wifi-password>`,
    });
    expect(page.root).toEqualHtml(`
      <lf-wifi-password>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </lf-wifi-password>
    `);
  });
});
