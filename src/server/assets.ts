// Unprefixed, not `node:fs`: webpack 4 cannot resolve the `node:` scheme, and
// this file is in the Razzle server bundle until stage 4 deletes it.
import { readFileSync } from 'fs';
import { trailingSlash } from '~/common';

/**
 * The asset tags for one server-rendered page, as plain strings.
 *
 * This is deliberately a data seam rather than a library object: `indexHtml`
 * used to hold a `ChunkExtractor` and call its tag getters, which made the
 * HTML template depend on the bundler. Now it interpolates two strings and
 * knows nothing about how they were produced.
 */
export interface RenderedAssets {
  /** goes in `<head>` */
  links: string;
  /** goes at the end of `<body>` */
  scripts: string;
}

/**
 * Vite's client `manifest.json`: source module id -> chunk description.
 *
 * @see https://vite.dev/guide/backend-integration
 */
interface ClientManifest {
  [sourceId: string]: ClientManifestChunk | undefined;
}

interface ClientManifestChunk {
  file: string;
  name?: string;
  src?: string;
  isEntry?: boolean;
  isDynamicEntry?: boolean;
  /** Keys into the same manifest — static imports, which are transitive. */
  imports?: string[];
  dynamicImports?: string[];
  css?: string[];
  assets?: string[];
}

/**
 * Vite's `ssr-manifest.json`: source module id -> the public paths of the
 * assets that module ends up in. Written by `--ssrManifest`.
 */
interface SsrManifest {
  [sourceId: string]: string[] | undefined;
}

/**
 * The client entry, as keyed in the client manifest. Matches
 * `rollupOptions.input: { client: 'src/client.tsx' }`.
 */
const CLIENT_ENTRY = 'src/client.tsx';

/**
 * Where the two manifests live, passed in by the build rather than guessed,
 * mirroring what `process.env.LOADABLE_STATS_MANIFEST` did for webpack.
 *
 * These are *build-time* paths — they say where files sit inside the image,
 * not how the deployment is configured — so unlike `PUBLIC_URL` they are fine
 * to bake in. They are intentionally un-prefixed: a `VITE_` prefix would
 * expose them through `import.meta.env` to the browser bundle.
 *
 * `stage-03-issue-03` must define these two names.
 */
const CLIENT_MANIFEST_PATH = 'CLIENT_MANIFEST_PATH';
const SSR_MANIFEST_PATH = 'SSR_MANIFEST_PATH';

const isProduction = () => process.env.NODE_ENV === 'production';

/**
 * Manifests are immutable once built, so read each one once. Cached on the
 * resolved path, not globally, so a changed env var is picked up.
 */
const manifestCache = new Map<string, unknown>();

/** Paths already warned about, so a missing manifest logs once, not per request. */
const warned = new Set<string>();

const readManifest = <T>(envVar: string): T | undefined => {
  const path = process.env[envVar];
  if (!path) {
    warnOnce(envVar, `${envVar} is not set — no asset tags will be emitted`);
    return undefined;
  }
  const cached = manifestCache.get(path);
  if (cached !== undefined) {
    return cached as T;
  }
  try {
    const parsed = JSON.parse(readFileSync(path, 'utf-8')) as T;
    manifestCache.set(path, parsed);
    return parsed;
  } catch (e) {
    // Degrade to "no preload hints", never to incorrectness. The app does not
    // hydrate (see `client.tsx`), so missing hints cost first paint only.
    warnOnce(path, `could not read asset manifest at ${path}: ${String(e)}`);
    return undefined;
  }
};

const warnOnce = (key: string, message: string) => {
  if (warned.has(key)) {
    return;
  }
  warned.add(key);
  // eslint-disable-next-line no-console
  console.warn(`[assets] ${message}`);
};

const FONT_EXTENSIONS = ['.woff2', '.woff', '.ttf', '.otf', '.eot'];

const endsWithOneOf = (path: string, extensions: string[]) =>
  extensions.some((ext) => path.toLowerCase().endsWith(ext));

const attr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

/**
 * `PUBLIC_URL` is applied here, at render time — exactly what
 * `ChunkExtractor`'s `publicPath` option was doing. Manifest paths are
 * relative to the build; the runtime prefix is per-deployment, and one image
 * is deployed to several.
 */
const publicUrl = (path: string) =>
  trailingSlash(process.env.PUBLIC_URL) + path.replace(/^\/+/, '');

const stylesheet = (path: string) =>
  `<link rel="stylesheet" href="${attr(publicUrl(path))}">`;
const modulePreload = (path: string) =>
  `<link rel="modulepreload" href="${attr(publicUrl(path))}">`;
const fontPreload = (path: string) =>
  `<link rel="preload" as="font" crossorigin href="${attr(publicUrl(path))}">`;
const moduleScript = (path: string) =>
  `<script type="module" crossorigin src="${attr(publicUrl(path))}"></script>`;

/**
 * The tags for one asset path, chosen by extension. Anything that is not JS,
 * CSS or a font gets no tag: images and the like are referenced by the code
 * that needs them, and guessing at `as=` is how you get console warnings.
 */
const linkFor = (path: string): string | undefined => {
  if (path.endsWith('.css')) {
    return stylesheet(path);
  }
  if (endsWithOneOf(path, FONT_EXTENSIONS)) {
    return fontPreload(path);
  }
  if (endsWithOneOf(path, ['.js', '.mjs'])) {
    return modulePreload(path);
  }
  return undefined;
};

/** Collects the entry chunk's transitive static imports, breadth-first. */
const transitiveImports = (manifest: ClientManifest, entryKey: string) => {
  const seen = new Set<string>([entryKey]);
  const queue = [entryKey];
  const found: string[] = [];
  while (queue.length > 0) {
    const chunk = manifest[queue.shift()!];
    for (const imported of chunk?.imports ?? []) {
      if (seen.has(imported)) {
        continue;
      }
      seen.add(imported);
      found.push(imported);
      queue.push(imported);
    }
  }
  return found;
};

const findEntry = (manifest: ClientManifest) => {
  const byName = manifest[CLIENT_ENTRY];
  if (byName?.isEntry) {
    return { key: CLIENT_ENTRY, chunk: byName };
  }
  // Key format has moved between Vite majors; fall back to the one entry.
  const entries = Object.entries(manifest).filter(
    ([, chunk]) => chunk?.isEntry
  );
  return entries.length === 1 && entries[0]
    ? { key: entries[0][0], chunk: entries[0][1]! }
    : undefined;
};

const renderDevAssets = (): RenderedAssets => ({
  links: '',
  // Vite serves and transforms both of these; there is nothing to preload
  // because there are no built chunks yet. Dev FOUC on CSS-importing routes
  // is expected.
  //
  // `stage-03-issue-02` also runs the page through `vite.transformIndexHtml`,
  // which injects `/@vite/client` itself; if that lands, drop the first tag
  // here rather than shipping it twice.
  scripts: [
    '<script type="module" src="/@vite/client"></script>',
    `<script type="module" src="/${CLIENT_ENTRY}"></script>`,
  ].join('\n  '),
});

const renderProdAssets = (moduleIds: readonly string[]): RenderedAssets => {
  const client = readManifest<ClientManifest>(CLIENT_MANIFEST_PATH);
  const links: string[] = [];
  const scripts: string[] = [];

  const entry = client && findEntry(client);
  if (client && !entry) {
    warnOnce(
      'no-entry',
      `no entry chunk for "${CLIENT_ENTRY}" in the client manifest — the page will load no JS`
    );
  }
  if (entry) {
    // Entry CSS first, so it wins the cascade over route CSS.
    for (const css of entry.chunk.css ?? []) {
      links.push(stylesheet(css));
    }
    for (const key of transitiveImports(client, entry.key)) {
      const chunk = client[key];
      if (!chunk) {
        continue;
      }
      links.push(modulePreload(chunk.file));
      for (const css of chunk.css ?? []) {
        links.push(stylesheet(css));
      }
    }
    scripts.push(moduleScript(entry.chunk.file));
  }

  // Preload hints for the lazy chunks this render actually used, so the
  // browser fetches them in parallel with the entry rather than after it.
  if (moduleIds.length > 0) {
    const ssr = readManifest<SsrManifest>(SSR_MANIFEST_PATH);
    for (const id of moduleIds) {
      // Not every id is a manifest key: `RichTextField` hand-writes
      // `react-editor-js`, and an id can simply be absent. Skip, don't guess.
      for (const asset of ssr?.[id] ?? []) {
        const tag = linkFor(asset);
        if (tag) {
          links.push(tag);
        }
      }
    }
  }

  return {
    links: dedupe(links).join('\n  '),
    scripts: dedupe(scripts).join('\n  '),
  };
};

const dedupe = (tags: string[]) => [...new Set(tags)];

/**
 * The stylesheet, preload and script tags for a server-rendered page.
 *
 * @param moduleIds The loadable ids rendered during this request, from
 * `ChunkCollector.chunkIds`. Source paths (`src/scenes/Partners/index.ts`),
 * not chunk URLs.
 */
export const renderAssets = (moduleIds: readonly string[]): RenderedAssets =>
  isProduction() ? renderProdAssets(moduleIds) : renderDevAssets();
