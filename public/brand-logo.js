/**
 * Reusable BrandLogo Component
 * Implements the new branding design for C.L.E.A.R.
 * Usage: <brand-logo favicon-src="/favicon/favicon.svg" text="clear"></brand-logo>
 */
class BrandLogo extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['favicon-src', 'text'];
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const faviconSrc = this.getAttribute('favicon-src') || '/favicon/favicon.svg';
    const text = this.getAttribute('text') || 'clear';

    this.innerHTML = `
      <div class="brand-logo-content">
        <img src="${faviconSrc}" alt="CLEAR" class="brand-logo-icon" />
        <h1 class="brand-logo-text">${text}</h1>
      </div>
    `;
  }
}

// Register the custom element as <brand-logo>
if (!customElements.get('brand-logo')) {
  customElements.define('brand-logo', BrandLogo);
}
