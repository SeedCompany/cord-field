// Load chunks & assets from the PUBLIC_URL given at runtime, not build time.
// `process.env` is `window.env` in the browser bundle.
__webpack_public_path__ = process.env.PUBLIC_URL!;

export {};
