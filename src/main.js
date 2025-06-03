import * as Sentry from "@sentry/browser";

// Initialize Sentry FIRST!
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN, // <-- Set your own DSN here before deploying
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
  debug: true, // Set to true for debugging
});

// Now import your components
import "./components/MyComponent.js";
import "./components/ChildComponent.js";
import "./components/DashboardPage.js";
import "./components/DetailPage.js";

// Render the root component immediately after DOMContentLoaded
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("app").innerHTML = "<my-component></my-component>";
});