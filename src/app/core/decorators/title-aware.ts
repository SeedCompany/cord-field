import { ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { maybeArray, MaybeObservable, maybeObservable } from '@app/core/util';
import { BehaviorSubject, combineLatest, Observable, Unsubscribable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

type Title = MaybeObservable<string | string[]>;

export interface TitleProp {
  title: Title;
}

// From @angular/core/src/util/decorators
const PROP_METADATA = '__prop__metadata__';

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
 * Note: All parent components need to be decorated in order for their children to be able to define their titles.
 */
export function TitleAware(title?: Title): ClassDecorator {
  return function TitleAwareDecorator(target) {
    const orig = Object.getOwnPropertyDescriptor(target.prototype, 'title');
    if (orig && title) {
      throw new Error(
        `${target.name} has both a title property/getter and a title passed to @TitleAware(). One or the other should be picked.`,
      );
    }

    const childTitles = new BehaviorSubject<string[]>([]);

    // Define title property which is this component's title and all children titles merged together
    Object.defineProperty(target.prototype, 'title', {
      get: function (this: any) {
        const result: Title = orig ? orig.get!.apply(this) : title;
        const title$ = observeTitle(result);

        return combineLatest(childTitles, title$)
          .pipe(map(([list, titles]) => list.concat(titles)));
      },
    });

    // Add RouterOutlet as a view child
    // See PropDecorator function in @angular/core/src/util/decorators
    const metaProps = target.hasOwnProperty(PROP_METADATA)
      ? (target as any)[PROP_METADATA]
      : Object.defineProperty(target, PROP_METADATA, {value: {}})[PROP_METADATA];
    metaProps.__routerOutlet = new ViewChild(RouterOutlet);

    // Listen to router outlet for child component and apply child titles to our subject here
    let activateSub: Unsubscribable;
    let deactivateSub: Unsubscribable;
    let childTitleSub: Unsubscribable;
    const origAfterViewInit = target.prototype.ngAfterViewInit;
    target.prototype.ngAfterViewInit = function () {
      const outlet: RouterOutlet | undefined = this.__routerOutlet;
      if (outlet) {
        let activate$: Observable<Partial<TitleProp>> = outlet.activateEvents;
        if (outlet.isActivated) {
          activate$ = activate$.pipe(startWith(outlet.component));
        }
        activateSub = activate$
          .subscribe((component: Partial<TitleProp>) => {
            if (childTitleSub) { // Just in case?
              childTitleSub.unsubscribe();
            }
            childTitleSub = observeComponentTitle(component)
              .subscribe(titles => childTitles.next(titles));
          });
        deactivateSub = outlet.deactivateEvents
          .subscribe(() => {
            childTitles.next([]);
            if (childTitleSub) {
              childTitleSub.unsubscribe();
            }
          });
      }

      if (origAfterViewInit) {
        origAfterViewInit.apply(this);
      }
    };

    const origDestroy = target.prototype.ngOnDestroy;
    target.prototype.ngOnDestroy = function () {
      if (activateSub) {
        activateSub.unsubscribe();
      }
      if (deactivateSub) {
        deactivateSub.unsubscribe();
      }
      if (childTitleSub) {
        childTitleSub.unsubscribe();
      }
      if (origDestroy) {
        origDestroy.apply(this);
      }
    };
  };
}

export const observeComponentTitle = (component: Partial<TitleProp>): Observable<string[]> => observeTitle(component.title);

const observeTitle = (title?: Title): Observable<string[]> =>
  maybeObservable(title)
    .pipe(map(maybeArray));
