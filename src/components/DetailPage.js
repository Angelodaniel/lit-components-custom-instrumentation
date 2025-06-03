import { html, css } from "lit";
import { InstrumentedLitElement } from "./InstrumentedLitElement.js";
import "./ChildComponent.js";

export class DetailPage extends InstrumentedLitElement {
  static properties = {
    route: { type: String },
  };
  static styles = css`
    :host { display: block; padding: 2rem; }
    .children { display: flex; gap: 1rem; }
  `;
  render() {
    return html`
      <h2>Detail Page</h2>
      <p>This is the detail page.</p>
      <div class="children">
        <child-component label="X" .route=${this.route}></child-component>
        <child-component label="Y" .route=${this.route}></child-component>
      </div>
      <button @click=${() => this.dispatchEvent(new CustomEvent('navigate', { detail: 'dashboard', bubbles: true, composed: true }))}>
        Back to Dashboard
      </button>
    `;
  }
}
customElements.define("detail-page", DetailPage); 