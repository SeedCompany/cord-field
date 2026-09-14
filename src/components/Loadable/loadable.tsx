import {
  ComponentType,
  createElement,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ChunkCollectorContext } from './ChunkCollector';

/**
 * A replacement for `@loadable/component`, which is webpack-only.
 *
 * Two facts shape this:
 * - The app renders with `createRoot`, never `hydrateRoot`, so preloading is a
 *   first-paint optimization and not a correctness requirement.
 * - There is one `<Suspense>` boundary in the codebase, so this renders its
 *   `fallback` option directly instead of suspending like `React.lazy` does.
 */

type Loader<M> = () => Promise<M>;

type Status = 'idle' | 'loading' | 'loaded' | 'failed';

interface Holder<M> {
  readonly id: string;
  readonly loader: Loader<M>;
  status: Status;
  module?: M;
  error?: unknown;
  promise?: Promise<M>;
}

/**
 * The registry is module level, and so shared by every call site in the
 * process — that is what makes two call sites pointing at the same module
 * (see `Engagements.tsx`, which imports `'../ProgressReports'` twice with
 * different `resolveComponent`s) share one holder, and so one import.
 */
const registry = new Map<string, Holder<any>>();

/** Imports started but not yet settled. Drained by {@link whenLoadablesSettle}. */
const pending = new Set<Promise<unknown>>();

let anonymousCount = 0;

const isServer = () => typeof window === 'undefined';

const holderFor = <M,>(id: string, loader: Loader<M>): Holder<M> => {
  const existing = registry.get(id) as Holder<M> | undefined;
  if (existing) {
    return existing;
  }
  const holder: Holder<M> = { id, loader, status: 'idle' };
  registry.set(id, holder);
  return holder;
};

const runLoad = async <M,>(holder: Holder<M>): Promise<M> => {
  holder.status = 'loading';
  try {
    const module = await holder.loader();
    holder.module = module;
    holder.status = 'loaded';
    return module;
  } catch (e) {
    holder.error = e;
    holder.status = 'failed';
    // Drop the memoized promise so a later render can retry.
    holder.promise = undefined;
    throw e;
  }
};

const loadHolder = <M,>(holder: Holder<M>): Promise<M> => {
  if (holder.promise) {
    return holder.promise;
  }
  const promise = runLoad(holder);
  holder.promise = promise;
  pending.add(promise);
  const done = () => {
    pending.delete(promise);
  };
  // Attaching handlers here also means a rejection is never unhandled, even
  // when the caller (e.g. `preload`) ignores the result.
  promise.then(done, done);
  return promise;
};

/** Whether any import fired by a loadable is still in flight. */
export const hasPendingLoadables = () => pending.size > 0;

/**
 * Wait for every fired import to settle, for the server to await before it
 * renders.
 *
 * This loops rather than awaiting once: resolving a module *evaluates* it,
 * which runs its own `loadable()` calls, which fire more imports. Evaluating
 * `Root.tsx` starts 15 imports; one of them is `'../Projects'`, whose
 * evaluation registers and fires 9 more. The graph drains transitively, so the
 * set has to be re-read after each wait.
 */
export const whenLoadablesSettle = async (maxPasses = 20) => {
  let passes = 0;
  while (pending.size > 0) {
    if (passes >= maxPasses) {
      // eslint-disable-next-line no-console
      console.warn(
        `Loadables did not settle after ${maxPasses} passes; rendering anyway`
      );
      return;
    }
    passes++;
    await Promise.allSettled([...pending]);
  }
};

/**
 * Load a registered loadable by id, for `loadableReady`.
 * Returns undefined when nothing has registered that id yet.
 */
export const loadLoadableById = (id: string): Promise<unknown> | undefined => {
  const holder = registry.get(id);
  return holder ? loadHolder(holder) : undefined;
};

interface CommonOptions {
  /** Rendered while the module is loading. No Suspense boundary needed. */
  fallback?: ReactNode;
  /** When false, the module is neither imported nor rendered on the server. */
  ssr?: boolean;
  /**
   * The module's root-relative source path, injected at each call site by the
   * `loadableId` Babel plugin. Holders are deduped by it, and the server sends
   * these ids to the client verbatim.
   */
  loadableId?: string;
}

export interface LoadableOptions<M, P> extends CommonOptions {
  /** Pick the component out of the module, since the repo bans default exports. */
  resolveComponent?: (module: M, props: P) => ComponentType<P>;
}

export type LoadableComponent<P> = ComponentType<P> & LoadableExtras;

export type LoadableLibComponent<M> = ComponentType<{
  children: (module: M) => ReactNode;
}> &
  LoadableExtras;

interface LoadableExtras {
  /** Start the import, ignoring the result. */
  preload: () => void;
  /** Start the import and resolve with the module. */
  load: () => Promise<unknown>;
  /** The id this call site is registered under. */
  loadableId: string;
}

const defaultResolve = (module: any): ComponentType<any> =>
  module.default ?? module;

/**
 * Hold the module in state, starting the import if needed.
 * `skip` is for `ssr: false` on the server, where we must not import at all.
 */
const useLoadedModule = <M,>(holder: Holder<M>, skip: boolean) => {
  const [state, setState] = useState<{ module?: M; error?: unknown }>(() =>
    holder.status === 'loaded' ? { module: holder.module } : {}
  );

  useEffect(() => {
    if (skip || state.module !== undefined || state.error !== undefined) {
      return;
    }
    let active = true;
    loadHolder(holder).then(
      (module) => {
        if (active) {
          setState({ module });
        }
      },
      (error: unknown) => {
        if (active) {
          setState({ error });
        }
      }
    );
    return () => {
      active = false;
    };
  }, [holder, skip, state]);

  if (state.error !== undefined) {
    // Rethrown for the nearest ErrorBoundary. It is whatever the import
    // rejected with, which need not be an Error.
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw state.error;
  }
  return state.module;
};

const register = <M,>(loader: Loader<M>, options: CommonOptions) => {
  const ssr = options.ssr !== false;
  if (
    options.loadableId === undefined &&
    process.env.NODE_ENV !== 'production'
  ) {
    // The fallback id below is per-process and order-dependent, so it will not
    // match between the client and the SSR build. Be loud: a mis-wired
    // `loadableId` Babel plugin is otherwise a silent first-paint regression.
    // eslint-disable-next-line no-console
    console.warn(
      'loadable() call site has no `loadableId` — is the loadableId Babel plugin wired up?'
    );
  }
  const id = options.loadableId ?? `anonymous-loadable-${++anonymousCount}`;
  const holder = holderFor(id, loader);

  // On the server, fire the import at *definition* time. Render is
  // synchronous, so there is no later chance to wait for it; the server awaits
  // `whenLoadablesSettle()` before rendering instead.
  if (ssr && isServer()) {
    void loadHolder(holder);
  }

  const extras: LoadableExtras = {
    preload: () => {
      void loadHolder(holder);
    },
    load: () => loadHolder(holder),
    loadableId: id,
  };

  /** Whether this render must not touch the module at all. */
  const useSkip = () => {
    const server = isServer();
    const collector = useContext(ChunkCollectorContext);
    if (server && ssr && collector) {
      // During render, because the server never runs effects.
      collector.add(id);
    }
    return server && !ssr;
  };

  return { holder, extras, useSkip };
};

const renderFallback = (fallback: ReactNode): ReactElement => <>{fallback}</>;

const loadableComponent = <P extends object, M>(
  loader: Loader<M>,
  options: LoadableOptions<M, P> = {}
): LoadableComponent<P> => {
  const { holder, extras, useSkip } = register(loader, options);
  const resolveComponent = options.resolveComponent ?? defaultResolve;

  const Loadable = (props: P) => {
    const module = useLoadedModule(holder, useSkip());
    return module === undefined
      ? renderFallback(options.fallback)
      : createElement(resolveComponent(module, props), props);
  };

  return Object.assign(Loadable as ComponentType<P>, extras);
};

/**
 * Like {@link loadableComponent}, but yields the whole module to a children
 * function rather than rendering a component out of it — matching
 * `@loadable/component`'s `loadable.lib`, which `RichTextField` uses twice.
 */
const loadableLib = <M,>(
  loader: Loader<M>,
  options: CommonOptions = {}
): LoadableLibComponent<M> => {
  const { holder, extras, useSkip } = register(loader, options);

  const LoadableLib = ({
    children,
  }: {
    children: (module: M) => ReactNode;
  }) => {
    const module = useLoadedModule(holder, useSkip());
    return module === undefined
      ? renderFallback(options.fallback)
      : renderFallback(children(module));
  };

  return Object.assign(LoadableLib, extras);
};

/**
 * `lib` is attached with `Object.assign` rather than declared as a namespace,
 * which keeps the callable half a plain generic function — and so keeps type
 * inference identical at the existing call sites.
 */
export const loadable = Object.assign(loadableComponent, {
  lib: loadableLib,
});
