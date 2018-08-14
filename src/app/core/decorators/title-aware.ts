import { BehaviorSubject, combineLatest, EMPTY, Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';

type Title = string | string[] | Observable<string> | Observable<string[]>;

export interface TitleProp {
  title: Title;
}

/**
 * Component decorator to handle the current page title. The title is handled in pieces so each component on defines it's title.
 * These pieces are joined together in the AppComponent.
 *
 * ## Static title example
 * ```
 * @TitleAware('My List')
 * class ListComponent {}
 * ```
 *
 * ## Dynamic title example
 * ```
 * @TitleAware()
 * class DetailsComponent {
 *   get title(): Observable<string> {
 *     return observeMyObject().map(obj => obj.name);
 *   }
 * }
 * ```
 *
 * ## Component with router outlet (children)
 * TypeScript code is same as above. The decorator is required, but the title getter/property is optional.
 * It may make sense to be a transparent pass-through, like a header component,
 * or it may make sense to add a piece to the title, like for an object details component that has sub-routes.
 *
 * The router outlet events need to be passed along as well:
 * ```
 * <router-outlet
 *   (activate)="onRouterActivate($event)"
 *   (deactivate)="onRouterDeactivate($event)"
 * ></router-outlet>
 * ```
 *
 * Note: It is important that all components with router outlets do this in order for their children to be able to define their titles.
 */
export function TitleAware(title?: Title): ClassDecorator {
  return function TitleAwareDecorator(target) {
    function getTitle$(this: any) {
      if (!this.title$) {
        this.title$ = new BehaviorSubject<string[]>([]);
      }

      return this.title$;
    }

    const orig = Object.getOwnPropertyDescriptor(target.prototype, 'title');
    if (orig && title) {
      throw new Error(
        `${target.name} has both a title property/getter and a title passed to @TitleAware(). One or the other should be picked.`
      );
    }

    Object.defineProperty(target.prototype, 'title', {
      get: function (this: any) {
        const result = orig ? orig.get!.apply(this) : title;
        const title$ = (result instanceof Observable ? result : observableOf(result))
          .pipe(map(t => Array.isArray(t) ? t : [t]));

        return combineLatest(getTitle$.call(this) as Observable<string[]>, title$)
          .pipe(map(([list, titles]) => list.concat(titles)));
      }
    });

    target.prototype.onRouterActivate = function (component: Partial<TitleProp>) {
      this.titleSub = observeComponentTitle(component)
        .subscribe(titles => getTitle$.apply(this).next(titles));
    };

    target.prototype.onRouterDeactivate = function () {
      getTitle$.apply(this).next(''); // Remove piece when deactivating.
      if (this.titleSub) {
        this.titleSub.unsubscribe();
      }
    };

    const origDestroy = target.prototype.ngOnDestroy;
    target.prototype.ngOnDestroy = function () {
      this.onRouterDeactivate();
      if (origDestroy) {
        origDestroy.apply(this);
      }
    };
  };
}

export function observeComponentTitle(component: Partial<TitleProp>): Observable<string[]> {
  let title$: Observable<string | string[]> = EMPTY;
  if (component.title) {
    title$ = component.title instanceof Observable ? component.title : observableOf(component.title);
  }

  return title$.pipe(map(title => Array.isArray(title) ? title : [title]));
}
