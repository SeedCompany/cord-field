import React from 'react';
import { Helmet } from 'react-helmet-async';

const { PUBLIC_URL = '' } = process.env;

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
        href={`${PUBLIC_URL}/opensearch.xml`}
      />
    )}

    {/* Polyfill for IntersectionObserver, ResizeObserver, AbortController */}
    <script
      crossOrigin="anonymous"
      src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserverEntry%2CIntersectionObserver%2CResizeObserver%2CAbortController"
    />
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href={`${PUBLIC_URL}/images/apple-touch-icon.png`}
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href={`${PUBLIC_URL}/images/favicon-32x32.png`}
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href={`${PUBLIC_URL}/images/favicon-16x16.png`}
    />
    <link rel="manifest" href={`${PUBLIC_URL}/site.webmanifest`} />
    <link
      rel="mask-icon"
      href={`${PUBLIC_URL}/images/safari-pinned-tab.svg`}
      color="#64b145"
    />
    <link rel="shortcut icon" href={`${PUBLIC_URL}/images/favicon.ico`} />
    <meta name="apple-mobile-web-app-title" content="CORD Field" />
    <meta name="application-name" content="CORD Field" />
    <meta name="msapplication-TileColor" content="#64b145" />
    <meta
      name="msapplication-config"
      content={`${PUBLIC_URL}/browserconfig.xml`}
    />
    <meta name="theme-color" content="#ffffff" />
  </Helmet>
);
