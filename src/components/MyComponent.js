import { html, css } from "lit";
import { InstrumentedLitElement } from "./InstrumentedLitElement.js";
import * as Sentry from "@sentry/browser";
import "./DashboardPage.js";
import "./DetailPage.js";

let currentTransaction = null;
function startSentryTransaction(name) {
  // End previous transaction if still open
  if (currentTransaction && typeof currentTransaction.end === "function") {
    currentTransaction.end();
  }
  Sentry.startSpan(
    {
      name,
      op: "navigation",
      forceTransaction: true,
      attributes: { route: name },
    },
    (span) => {
      currentTransaction = span;
      // Sentry v9.x: set active span using window.__SENTRY__.hub
      if (window.__SENTRY__ && window.__SENTRY__.hub) {
        window.__SENTRY__.hub.configureScope(scope => {
          scope.setSpan(span);
        });
      }
    }
  );
}

export class MyComponent extends InstrumentedLitElement {
  static styles = css`
    :host { display: block; border: 1px solid #ccc; padding: 1rem; margin: 1rem; }
  `;

  constructor() {
    super();
    this.page = "dashboard";
    this._onNavigate = this._onNavigate.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('navigate', this._onNavigate);
    // Start initial transaction
    startSentryTransaction(this.page);
  }

  disconnectedCallback() {
    this.removeEventListener('navigate', this._onNavigate);
    super.disconnectedCallback();
  }

  _onNavigate(e) {
    const newPage = e.detail;
    startSentryTransaction(newPage);
    this.page = newPage;
    this.requestUpdate();
  }

  render() {
    return html`
      <div>
        <h1>My Lit SPA</h1>
        ${this.page === 'dashboard' ? html`<dashboard-page .route=${this.page}></dashboard-page>` : html`<detail-page .route=${this.page}></detail-page>`}
      </div>
    `;
  }
}
customElements.define("my-component", MyComponent); 