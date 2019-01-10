import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRouteSnapshot, CanActivateChild, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { SavePromptDialogComponent } from '@app/core/save-prompt-dialog/save-prompt-dialog.component';
import { MaybeObservable, maybeObservable } from '@app/core/util';
import { from, noop, Observable, of } from 'rxjs';
import { first, map, mapTo, mergeMap, tap } from 'rxjs/operators';

export interface IsDirty {
  isDirty?: MaybeObservable<boolean>;
  onSave?: () => Promise<void> | void;
  onDiscard?: () => Promise<void> | void;
}

/**
 * Checks if component is dirty and prompts user to save/discard or cancel navigation,
 *
 * @example A single component
 * Route config:
 *   {path: 'foo', component: FooComponent, canDeactivate: [DirtyGuard]}
 *
 * Component then needs to provide hooks for the guard:
 *   class FooComponent implements IsDirty {
 *     get isDirty {
 *       return true; // or promise or observable
 *     }
 *     async onSave() {
 *       // do save
 *     }
 *     async onDiscard() {
 *       // do discard
 *     }
 *   }
 *
 * @example Additionally there is a use case to allow navigation to sibling routes when dirty.
 * This gets more complicated, because when we are deactivating the component Angular hasn't yet
 * resolved the destination route.
 *
 * To configure, the parent route _also_ needs the `DirtyGuard` attached to both `canActivateChild` and `canDeactivate`.
 * Then configure whichever siblings need to allow navigation to them while
 * current component is dirty in their route configs:
 *   {path: '', component: Foo, data: {acceptDirty: true}}
 * Note: The guard assumes `acceptDirty` is false by default, so only the routes that need it true need to be marked.
 *
 * That's it! To explain further, when navigating to sibling route:
 *   - `canDeactivate` is called for current component.
 *   - Guard sees that the parent route has the `DirtyGuard` in `canActivateChild`. It allows deactivation regardless of dirty or not.
 *   - `canActivateChild` is called for parent route.
 *   - Guard determines if the destination route should accept dirty activation from the route data.
 *       a) If so, the guard allows activation regardless of dirty state.
 *       b) If not, the guard prompts the user to save/discard/stay.
 *
 * When navigating to a non-sibling/child route:
 *   - Again, `canDeactivate` is called for current component.
 *   - Again, the guard allows deactivation whether dirty or not, because of the parent route's `canActivateChild`.
 *   - Now, `canDeactivate` is called for the _parent_ component.
 *     `canActivateChild` is not called because the destination isn't a sibling route.
 *   - Guard checks if the original component is dirty
 *       a) If clean, allows navigation
 *       b) If dirty, the guard prompts the user to save/discard/stay.
 */
@Injectable({
  providedIn: 'root',
})
export class DirtyGuard<T extends IsDirty> implements CanDeactivate<T>, CanActivateChild {
  private clean = true;
  private checkPending = false;
  private save: NonNullable<IsDirty['onSave']> = noop;
  private discard: NonNullable<IsDirty['onDiscard']> = noop;

  constructor(private dialogs: MatDialog) {
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeObservable<boolean> {
    // We handle the check here. Next deactivation should function normally.
    this.checkPending = false;

    if (this.clean || childRoute.data.acceptDirty) {
      return true;
    }

    return this.promptForAction();
  }

  canDeactivate(
    component: T,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot,
  ): MaybeObservable<boolean> {
    let clean$;
    // If no pending check, the grab the current components dirty state and save/discard methods.
    if (!this.checkPending) {
      clean$ = maybeObservable(component.isDirty, of(false))
        .pipe(
          map(dirty => !dirty),
          first(),
          // If dirty, saving refs to save/discard functions.
          // Skip for clean, that way all hooks are optional & the component
          // can have this guard assigned without actually leveraging it.
          tap(clean => {
            if (clean) {
              return;
            }
            if (!component.onSave) {
              throw new Error(`${component.constructor.name} needs to have an onSave method`);
            }
            if (!component.onDiscard) {
              throw new Error(`${component.constructor.name} needs to have an onDiscard method`);
            }
            this.save = component.onSave.bind(component);
            this.discard = component.onDiscard.bind(component);
          }),
        );
      clean$.subscribe(clean => this.clean = clean);
    } else {
      // If there is a pending check, then this is the parent component and we should use the dirty
      // state and function refs previously configured.
      this.checkPending = false;
      clean$ = of(this.clean);
    }

    return clean$.pipe(
      mergeMap(clean => {
        // If clean or redirecting to login page to authorize allow route change & don't show prompt
        if (clean || nextState.url === '/login') {
          return of(true);
        }

        // If dirty & route is configured for dirty sibling navigation, then always return true here and mark check pending.
        // Next, either `canActivateChild` or `canDeactivate` will be called for parent route.
        if (this.willParentGuardActivateChild(currentRoute)) {
          this.checkPending = true;
          return of(true);
        }

        return this.promptForAction();
      }),
    );
  }

  private promptForAction(): Observable<boolean> {
    return SavePromptDialogComponent.open(this.dialogs)
      .afterClosed()
      .pipe(
        mergeMap(result => {
          if (result == null) {
            return of(false);
          }

          const maybeWait = result ? this.save() : this.discard();

          return from(Promise.resolve(maybeWait))
            .pipe(
              tap(() => this.clean = true), // state is clean now, don't re-prompt
              mapTo(true), // can navigate
            );
        }),
      );
  }

  private willParentGuardActivateChild(currentRoute: ActivatedRouteSnapshot) {
    if (!currentRoute.parent || !currentRoute.parent.routeConfig) {
      return false;
    }
    return (currentRoute.parent.routeConfig.canActivateChild || [])
      .some(guard => guard === this.constructor);
  }
}
