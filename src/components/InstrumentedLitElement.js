import { LitElement } from "lit";
import * as Sentry from "@sentry/browser";

async function subtreeUpdateComplete(element) {
  if (element.updateComplete) {
    await element.updateComplete;
  }
  if (element.shadowRoot) {
    const litChildren = Array.from(element.shadowRoot.querySelectorAll('*'))
      .filter(el => el.updateComplete);
    await Promise.all(litChildren.map(subtreeUpdateComplete));
  }
}

export class InstrumentedLitElement extends LitElement {
  constructor() {
    super();
    this._observer = null;
    this._idleTimeout = null;
    this._idleInterval = 100; // ms
  }

  connectedCallback() {
    super.connectedCallback();
    const componentName = this.localName || this.tagName.toLowerCase();
    const route = this.route || (this.parentNode && this.parentNode.route);
    Sentry.startSpan({
      name: componentName,
      op: "lit.render",
      attributes: {
        component: componentName,
        ...(route ? { route } : {}),
      },
    }, (span) => {
      this._observer = new MutationObserver(() => {
        clearTimeout(this._idleTimeout);
        this._idleTimeout = setTimeout(async () => {
          this._observer.disconnect();
          const spanId = span && (span.spanId || span.span_id || 'unknown');
          await subtreeUpdateComplete(this);
          console.log(`[Sentry] Ending custom span for <${componentName}> (span id: ${spanId}) after subtreeUpdateComplete`);
          span && span.end && span.end();
        }, this._idleInterval);
      });
      if (this.shadowRoot) {
        this._observer.observe(this.shadowRoot, { childList: true, subtree: true });
        this._observer.takeRecords();
        this._idleTimeout = setTimeout(async () => {
          this._observer.disconnect();
          const spanId = span && (span.spanId || span.span_id || 'unknown');
          await subtreeUpdateComplete(this);
          console.log(`[Sentry] Ending custom span for <${componentName}> (span id: ${spanId}) (initial) after subtreeUpdateComplete`);
          span && span.end && span.end();
        }, this._idleInterval);
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._observer) {
      this._observer.disconnect();
    }
    if (this._idleTimeout) {
      clearTimeout(this._idleTimeout);
    }
  }
} 