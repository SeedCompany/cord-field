// jest-dom adds custom matchers for asserting on DOM nodes, e.g.
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/vitest';

// Installs a mock IntersectionObserver in a beforeEach/afterEach pair.
import 'react-intersection-observer/test-utils';

/**
 * jsdom has no IntersectionObserver, so two things try to supply one: the mock
 * imported above, and the `intersection-observer` polyfill that
 * `ahooks/useInViewport` pulls in.
 *
 * The polyfill stands down only when it sees a *complete* implementation —
 * `IntersectionObserver`, `IntersectionObserverEntry`, and `intersectionRatio`
 * on that entry's prototype. Given only the mock, it decides the environment is
 * broken and overwrites the global. When that happens part-way through a test
 * (the polyfill arrives with a lazily imported chunk, e.g. a file previewer),
 * the mock is gone by the time `resetIntersectionMocking` runs in `afterEach`,
 * and the whole file dies with
 * "global.IntersectionObserver.mockClear is not a function".
 *
 * Declaring the missing entry type makes the mock look complete, so the
 * polyfill leaves it alone and `useInViewport` drives the mock like every other
 * observer in the tests.
 */
if (!('IntersectionObserverEntry' in globalThis)) {
  // The properties must live on the prototype — that is where the polyfill
  // feature-detects them.
  class IntersectionObserverEntryStub {
    get intersectionRatio() {
      return 0;
    }
    get isIntersecting() {
      return false;
    }
  }
  Object.defineProperty(globalThis, 'IntersectionObserverEntry', {
    value: IntersectionObserverEntryStub,
    writable: true,
    configurable: true,
  });
}
