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

    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="images/apple-touch-icon.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="images/favicon-32x32.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="images/favicon-16x16.png"
    />
    <link rel="manifest" href="site.webmanifest" />
    <link rel="mask-icon" href="images/safari-pinned-tab.svg" color="#64b145" />
    <link rel="shortcut icon" href="images/favicon.ico" />
    <meta name="apple-mobile-web-app-title" content="CORD Field" />
    <meta name="application-name" content="CORD Field" />
    <meta name="msapplication-TileColor" content="#64b145" />
    <meta name="msapplication-config" content="browserconfig.xml" />
    <meta name="theme-color" content="#ffffff" />
  </Helmet>
);
