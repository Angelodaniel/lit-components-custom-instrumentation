import { html, css } from "lit";
import { InstrumentedLitElement } from "./InstrumentedLitElement.js";
import "./GrandchildComponent.js";

export class ChildComponent extends InstrumentedLitElement {
  static properties = {
    label: { type: String },
    route: { type: String },
  };
  static styles = css`
    :host { display: block; border: 1px dashed #aaa; padding: 0.5rem; margin: 0.5rem; }
  `;
  render() {
    return html`
      <p>I'm a child! Label: ${this.label}</p>
      <grandchild-component .parentLabel=${this.label} .route=${this.route}></grandchild-component>
    `;
  }
}
customElements.define("child-component", ChildComponent); 