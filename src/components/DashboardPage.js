import { html, css } from "lit";
import { InstrumentedLitElement } from "./InstrumentedLitElement.js";
import "./ChildComponent.js";

export class DashboardPage extends InstrumentedLitElement {
  static properties = {
    route: { type: String },
  };
  static styles = css`
    :host { display: block; padding: 2rem; }
    .children { display: flex; gap: 1rem; }
  `;
  render() {
    return html`
      <h2>Dashboard</h2>
      <p>This is the dashboard page.</p>
      <div class="children">
        <child-component label="A" .route=${this.route}></child-component>
        <child-component label="B" .route=${this.route}></child-component>
        <child-component label="C" .route=${this.route}></child-component>
      </div>
      <button @click=${() => this.dispatchEvent(new CustomEvent('navigate', { detail: 'detail', bubbles: true, composed: true }))}>
        Go to Detail Page
      </button>
    `;
  }
}
customElements.define("dashboard-page", DashboardPage); 