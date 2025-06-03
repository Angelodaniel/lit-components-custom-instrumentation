# lit-components-custom-instrumentation

**Advanced Sentry instrumentation for Lit-based SPAs, with per-component render tracing and robust SPA navigation support.**

## Features

- **Per-component render spans:** Every Lit component render is traced as a Sentry span, including async/conditional children.
- **SPA navigation transactions:** Each navigation (route change) is tracked as a Sentry transaction.
- **Route context:** All spans include the current route for easy filtering and debugging.
- **No private data:** Sentry DSN is read from an environment variable, never hardcoded.

## Setup

1. **Clone the repo:**
   ```sh
   git clone https://github.com/Angelodaniel/lit-components-custom-instrumentation.git
   cd lit-components-custom-instrumentation
   ```

2. **Set your Sentry DSN:**
   - Create a `.env` file in the project root:
     ```
     VITE_SENTRY_DSN=<your-dsn-here>
     ```
   - **Never commit your DSN to the repo.**

3. **Install dependencies and run:**
   ```sh
   npm install
   npm run dev
   ```

4. **Open the app:**  
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

- **Sentry is initialized before any components are loaded.**
- **SPA navigation** (route changes) triggers a new Sentry transaction using `Sentry.startSpan({ forceTransaction: true, op: 'navigation' })`.
- **Each Lit component** (including children and grandchildren) extends `InstrumentedLitElement`, which:
  - Starts a custom span for each render.
  - Waits for all async/conditional children to finish rendering before ending the span.
  - Includes the current route in the span attributes.

## Gotchas & Best Practices

- **DSN Security:**  
  Always use an environment variable for your DSN. Never commit your real DSN to a public repo.

- **Sentry v9.x API:**  
  - Use `Sentry.startSpan` with `forceTransaction: true` for navigation transactions.
  - Use the `window.__SENTRY__.hub` workaround to set the active span in the browser.

- **SPA Navigation:**  
  By default, all navigation transactions are grouped under the same trace. If you want each navigation to start a new trace, you must generate and provide a new `traceId` (see Sentry docs).

- **Lit async/conditional children:**  
  The `InstrumentedLitElement` uses both a `MutationObserver` and recursive `updateComplete` checks to ensure spans only end when the entire subtree is rendered.

- **Performance:**  
  Instrumentation adds a small overhead. For production, set `debug: false` in Sentry config.

## References

- [Sentry JS Tracing Docs](https://docs.sentry.io/platforms/javascript/tracing/instrumentation/#span-starting-options)
- [Lit documentation](https://lit.dev/)
- [Lit feature request that makes this easier](https://github.com/lit/lit/issues/3538)
<img width="1198" alt="Screenshot 2025-06-03 at 11 48 07" src="https://github.com/user-attachments/assets/30e69b1b-2062-431d-b458-040c2e51c359" />


