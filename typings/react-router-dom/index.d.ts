import { History, Href, Location, LocationDescriptor } from 'history';
import {
  Component,
  ElementType,
  ReactElement,
  ReactNode,
  SyntheticEvent,
} from 'react';

///////////////////////////////// react-router /////////////////////////////////

export interface MemoryRouterProps {
  initialEntries?: LocationDescriptor[];
  initialIndex?: number;
  timeout?: number;
}

export class MemoryRouter extends Component<MemoryRouterProps, any> {}

export interface NavigateProps<S = unknown> extends NavigateOptions<S> {
  to: LocationDescriptor<S>;
}

export class Navigate<S = unknown> extends Component<NavigateProps<S>, any> {}

export class Outlet extends Component<{}, any> {}

export interface RedirectProps<S = unknown> {
  from?: string;
  to: LocationDescriptor<S>;
}

export class Redirect<S = unknown> extends Component<RedirectProps<S>, any> {}

export interface RouteProps {
  path: string;
  element?: ReactElement;
}

export class Route extends Component<RouteProps, any> {}

export interface RouterProps {
  history?: History;
  timeout?: number;
}

export class Router extends Component<RouterProps, any> {}

export interface RoutesProps {
  basename?: string;
  caseSensitive?: boolean;
}

export class Routes extends Component<RoutesProps, any> {}

export interface RouteConfigObject {
  path?: string;
  from?: string;
  redirectTo?: string;
  element?: ReactElement;
  children?: RouteConfigObject[];
}

export function createRoutesFromChildren(
  children: ReactNode
): RouteConfigObject[];

export interface BlockerParams {
  retry: () => void;
}

export function useBlocker(
  blocker: (args: BlockerParams) => void,
  when?: boolean
): void;

export function useHref<S = unknown>(to: LocationDescriptor<S>): Href;

export function useLocation<S = unknown>(): Location<S>;

export function useMatch<S = unknown>(to: LocationDescriptor<S>): boolean;

export interface NavigateOptions<S = unknown> {
  replace?: boolean;
  state?: S;
}

interface NavigateFn<S = unknown> {
  (delta: number): void;
  (to: LocationDescriptor<unknown>, options?: NavigateOptions<S>): void;
}
export function useNavigate<S = unknown>(): NavigateFn<S>;

export function useOutlet(): ReactElement;

export function useParams<
  Params extends { [K in keyof Params]?: string } = {}
>(): {
  [p in keyof Params]: keyof Params[p] extends undefined
    ? string | undefined
    : string;
};

export function useResolvedLocation(
  to: LocationDescriptor
): Omit<Location, 'state' | 'key'>;

export function useRoutes(
  routes: RouteConfigObject[],
  basename?: string,
  caseSensitive?: boolean
): ReactElement | null;

export function matchRoutes(
  routes: RouteConfigObject[],
  location: LocationDescriptor,
  basename?: string,
  caseSensitive?: boolean
): Location | null;

export function resolveLocation(
  to: LocationDescriptor,
  fromPathname?: string
): Omit<Location, 'state' | 'key'>;

export function generatePath(pathname: string, params?: object): string;

/////////////////////////////// react-router-dom ///////////////////////////////

export interface BrowserRouterProps {
  timeout?: number;
  window?: Window;
}

export class BrowserRouter extends Component<BrowserRouterProps, any> {}

interface HashRouterProps {
  timeout?: number;
  window?: Window;
}

export class HashRouter extends Component<HashRouterProps, any> {}

export interface LinkProps<P = JSX.IntrinsicElements['a'], S = unknown>
  extends P {
  as?: ElementType<P>;
  onClick?: (event: SyntheticEvent) => void;
  replace?: boolean;
  state?: object;
  target?: string;
  to: LocationDescriptor<S>;
}

export class Link<
  P = JSX.IntrinsicElements['a'],
  S = unknown
> extends Component<LinkProps<P, S>, any> {}

export interface NavLinkProps<P = JSX.IntrinsicElements['a'], S = unknown>
  extends LinkProps<P, S> {
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true';
  activeClassName?: string;
  activeStyle?: object;
  className?: string;
  style?: object;
}

export class NavLink<
  P = JSX.IntrinsicElements['a'],
  S = unknown
> extends Component<NavLinkProps<P, S>, any> {}

export interface PromptProps {
  message?: string;
  when?: boolean;
}

export class Prompt extends Component<PromptProps, any> {}

export function usePrompt(message: string, when?: boolean): void;

export function useSearchParams(): URLSearchParams;
