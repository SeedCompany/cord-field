import { render, screen } from '@testing-library/react';
import { ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChunkCollector } from './ChunkCollector';
import { hasPendingLoadables, loadable, whenLoadablesSettle } from './loadable';
import { loadableReady } from './loadableReady';

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

/**
 * Run `fn` with no `window`, which is how `loadable` detects the server.
 * Restored immediately rather than in an `afterEach`, so nothing else in the
 * file (or in `setupTests`) ever sees a windowless global.
 */
const asServer = async <T,>(fn: () => T | Promise<T>): Promise<T> => {
  vi.stubGlobal('window', undefined);
  try {
    return await fn();
  } finally {
    vi.unstubAllGlobals();
  }
};

// The registry and its pending set are module level, so a leftover in-flight
// import from a previous test would make `hasPendingLoadables` meaningless.
beforeEach(async () => {
  await whenLoadablesSettle();
});

describe('loadable on the client', () => {
  it('renders the fallback until the module resolves, then the component', async () => {
    const module = deferred<{ Greeting: ComponentType }>();
    const Greeting = loadable(() => module.promise, {
      loadableId: 'test/greeting',
      fallback: <span>loading…</span>,
      resolveComponent: (m) => m.Greeting,
    });

    render(<Greeting />);
    expect(screen.getByText('loading…')).toBeInTheDocument();

    module.resolve({ Greeting: () => <span>hello</span> });
    expect(await screen.findByText('hello')).toBeInTheDocument();
    // No Suspense boundary was needed to get here.
  });

  it('uses resolveComponent to pick a named export, and passes props through', async () => {
    const Named = loadable(
      () =>
        Promise.resolve({
          Named: ({ name }: { name: string }) => <span>Hi {name}</span>,
        }),
      {
        loadableId: 'test/named',
        resolveComponent: (m) => m.Named,
      }
    );

    await Named.load();
    render(<Named name="Alice" />);
    expect(screen.getByText('Hi Alice')).toBeInTheDocument();
  });

  it('dedupes holders by id: two call sites, one import, two components', async () => {
    const loader = vi.fn(() =>
      Promise.resolve({
        A: () => <span>from A</span>,
        B: () => <span>from B</span>,
      })
    );
    // Same module, two resolveComponents — as Engagements.tsx does with
    // '../ProgressReports'.
    const A = loadable(loader, {
      loadableId: 'test/shared-module',
      resolveComponent: (m) => m.A,
    });
    const B = loadable(loader, {
      loadableId: 'test/shared-module',
      resolveComponent: (m) => m.B,
    });

    await A.load();
    // B shares A's holder, so it is already loaded without being asked.
    await B.load();
    expect(loader).toHaveBeenCalledTimes(1);
    expect(B.loadableId).toBe(A.loadableId);

    render(
      <>
        <A />
        <B />
      </>
    );
    expect(screen.getByText('from A')).toBeInTheDocument();
    expect(screen.getByText('from B')).toBeInTheDocument();
  });

  it('preload starts the import without rendering', async () => {
    const loader = vi.fn(() => Promise.resolve({ Thing: () => null }));
    const Thing = loadable(loader, {
      loadableId: 'test/preload',
      resolveComponent: (m) => m.Thing,
    });

    expect(loader).not.toHaveBeenCalled();
    Thing.preload();
    expect(loader).toHaveBeenCalledTimes(1);
    Thing.preload();
    expect(loader).toHaveBeenCalledTimes(1);
    await whenLoadablesSettle();
  });
});

describe('loadable.lib', () => {
  it('yields the whole module to a children function', async () => {
    const module = deferred<{ shout: (text: string) => string }>();
    const Lib = loadable.lib(() => module.promise, {
      loadableId: 'test/lib',
      fallback: <span>waiting</span>,
    });

    render(<Lib>{({ shout }) => <span>{shout('hi')}</span>}</Lib>);
    expect(screen.getByText('waiting')).toBeInTheDocument();

    module.resolve({ shout: (text) => text.toUpperCase() });
    expect(await screen.findByText('HI')).toBeInTheDocument();
  });

  it('honours ssr: false on the client by loading normally', async () => {
    const Lib = loadable.lib(() => Promise.resolve({ answer: 42 }), {
      loadableId: 'test/lib-no-ssr',
      ssr: false,
    });

    await Lib.load();
    render(<Lib>{({ answer }) => <span>{answer}</span>}</Lib>);
    expect(screen.getByText('42')).toBeInTheDocument();
  });
});

describe('loadable on the server', () => {
  it('fires the import at definition time and renders it once settled', async () => {
    await asServer(async () => {
      const loader = vi.fn(() =>
        Promise.resolve({ Thing: () => <span>real</span> })
      );
      const Thing = loadable(loader, {
        loadableId: 'test/server-eager',
        fallback: <span>fallback</span>,
        resolveComponent: (m) => m.Thing,
      });

      // Definition time, not render time.
      expect(loader).toHaveBeenCalledTimes(1);
      expect(hasPendingLoadables()).toBe(true);

      await whenLoadablesSettle();
      expect(hasPendingLoadables()).toBe(false);
      expect(renderToStaticMarkup(<Thing />)).toBe('<span>real</span>');
    });
  });

  it('with ssr: false, never imports and renders the fallback', async () => {
    const loader = vi.fn(() =>
      Promise.resolve({ Thing: () => <span>real</span> })
    );

    const markup = await asServer(() => {
      const Thing = loadable(loader, {
        loadableId: 'test/server-no-ssr',
        ssr: false,
        fallback: <span>client only</span>,
        resolveComponent: (m) => m.Thing,
      });
      return renderToStaticMarkup(<Thing />);
    });

    expect(markup).toBe('<span>client only</span>');
    expect(loader).not.toHaveBeenCalled();
  });
});

describe('whenLoadablesSettle', () => {
  it('loops, because resolving a module registers and fires more imports', async () => {
    const nested = deferred<{ Nested: ComponentType }>();
    const nestedLoader = vi.fn(() => nested.promise);

    await asServer(async () => {
      const Outer = loadable(
        async () => {
          // Evaluating this module declares its own loadable, the way
          // resolving '../Projects' evaluates Projects.tsx and registers its 9.
          const Nested = loadable(nestedLoader, {
            loadableId: 'test/settle-nested',
            resolveComponent: (m) => m.Nested,
          });
          return { Outer: () => <Nested /> };
        },
        {
          loadableId: 'test/settle-outer',
          resolveComponent: (m) => m.Outer,
        }
      );

      // One await — what a non-looping implementation would do — is not enough:
      // the outer module has resolved, but doing so started the nested import.
      await Outer.load();
      expect(nestedLoader).toHaveBeenCalledTimes(1);
      expect(hasPendingLoadables()).toBe(true);

      nested.resolve({ Nested: () => <span>nested</span> });
      await whenLoadablesSettle();
      expect(hasPendingLoadables()).toBe(false);
      expect(renderToStaticMarkup(<Outer />)).toBe('<span>nested</span>');
    });
  });

  it('gives up with a warning rather than looping forever', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    // A module whose evaluation registers another one, without end — the
    // pathological version of the transitive graph above.
    let spawning = true;
    let depth = 0;
    const spawn = () => {
      const next = ++depth;
      const Spawner = loadable.lib(
        async () => {
          // The spawn happens after a macrotask, so the child import is still
          // in flight when the parent's `allSettled` resolves — which is the
          // only shape that can keep the loop going forever.
          await new Promise((resolve) => setTimeout(resolve, 0));
          if (spawning) {
            spawn();
          }
          return {};
        },
        { loadableId: `test/spawn-${next}` }
      );
      Spawner.preload();
    };
    spawn();

    await whenLoadablesSettle(2);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('did not settle')
    );
    expect(hasPendingLoadables()).toBe(true);
    expect(depth).toBeGreaterThan(1);

    // Let the chain end so the registry is clean for the next test.
    spawning = false;
    await whenLoadablesSettle();
    expect(hasPendingLoadables()).toBe(false);
    warn.mockRestore();
  });
});

describe('ChunkCollector', () => {
  it('accumulates ids across render passes rather than resetting', async () => {
    await asServer(async () => {
      const One = loadable(
        () => Promise.resolve({ C: () => <span>one</span> }),
        { loadableId: 'test/collect-one', resolveComponent: (m) => m.C }
      );
      const Two = loadable(
        () => Promise.resolve({ C: () => <span>two</span> }),
        { loadableId: 'test/collect-two', resolveComponent: (m) => m.C }
      );
      const ClientOnly = loadable(
        () => Promise.resolve({ C: () => <span>client</span> }),
        {
          loadableId: 'test/collect-client-only',
          ssr: false,
          resolveComponent: (m) => m.C,
        }
      );
      await whenLoadablesSettle();

      const collector = new ChunkCollector();
      // Apollo's getMarkupFromTree renders repeatedly, and a later pass can
      // render fewer loadables than an earlier one.
      renderToStaticMarkup(
        collector.wrap(
          <>
            <One />
            <Two />
            <ClientOnly />
          </>
        )
      );
      renderToStaticMarkup(collector.wrap(<One />));

      expect(collector.chunkIds).toEqual([
        'test/collect-one',
        'test/collect-two',
      ]);
    });
  });
});

describe('loadableReady', () => {
  it('loops until ids registered by a parent module are found', async () => {
    const nestedLoader = vi.fn(() =>
      Promise.resolve({ Nested: () => <span>nested</span> })
    );
    const parentLoader = vi.fn(async () => {
      loadable(nestedLoader, {
        loadableId: 'test/ready-nested',
        resolveComponent: (m) => m.Nested,
      });
      return { Parent: () => <span>parent</span> };
    });
    loadable(parentLoader, {
      loadableId: 'test/ready-parent',
      resolveComponent: (m) => m.Parent,
    });

    // The nested id is not in the registry yet; only loading the parent puts
    // it there. A single-pass implementation would silently skip it.
    window.__LOADABLE_IDS__ = [
      'test/ready-parent',
      'test/ready-nested',
      'test/ready-never-registered',
    ];
    await loadableReady();

    expect(parentLoader).toHaveBeenCalledTimes(1);
    expect(nestedLoader).toHaveBeenCalledTimes(1);
    delete window.__LOADABLE_IDS__;
  });

  it('does nothing when the server sent no ids', async () => {
    delete window.__LOADABLE_IDS__;
    await expect(loadableReady()).resolves.toBeUndefined();
  });
});
