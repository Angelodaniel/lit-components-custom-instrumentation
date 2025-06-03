import { html, css } from "lit";
import { InstrumentedLitElement } from "./InstrumentedLitElement.js";

export class GrandchildComponent extends InstrumentedLitElement {
  static properties = {
    parentLabel: { type: String },
    route: { type: String },
  };
  static styles = css`
    :host { display: block; border: 1px dotted #bbb; padding: 0.25rem; margin: 0.25rem; }
  `;
  render() {
    return html`<span>I'm a grandchild! Parent label: ${this.parentLabel}, Route: ${this.route}</span>`;
  }
}
customElements.define("grandchild-component", GrandchildComponent); 