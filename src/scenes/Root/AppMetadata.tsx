import { Helmet } from 'react-helmet-async';

export const AppMetadata = () => (
  <Helmet titleTemplate="%s - CORD Field" defaultTitle="CORD Field">
    <html lang="en" />
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    {/* sofia-pro font */}
    <link href="https://use.typekit.net/qrd6jxb.css" rel="stylesheet" />

    {/* Search in browser bar */}
    {process.env.RAZZLE_OPEN_SEARCH === 'true' && (
      <link
        type="application/opensearchdescription+xml"
        rel="search"
        href="opensearch.xml"
      />
    )}

    {/* https://dev.to/masakudamatsu/favicon-nightmare-how-to-maintain-sanity-3al7 */}
    <link rel="icon" href="/favicon.ico" sizes="48x48" />
    <link
      rel="icon"
      href="/images/favicon.svg"
      sizes="any"
      type="image/svg+xml"
    />
    <link
      rel="apple-touch-icon"
      href="/images/apple-touch-icon.png"
      sizes="180x180"
    />
    <link rel="manifest" href="site.webmanifest" />
    <meta name="apple-mobile-web-app-title" content="CORD Field" />
    <meta name="application-name" content="CORD Field" />
    <meta name="theme-color" content="#1EA973" />
  </Helmet>
);
