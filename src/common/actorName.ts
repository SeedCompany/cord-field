import type { SystemAgent, User } from '~/api/schema.graphql';

/**
 * The shape an `Actor` selection needs for {@link actorName} to name it.
 *
 * `Actor` declares only `id`, so the display name has to come from an inline
 * fragment on each implementation. Match this in the GQL document:
 * ```graphql
 * value {
 *   ... on User { id fullName }
 *   ... on SystemAgent { id name }
 * }
 * ```
 */
export type NameableActor =
  | ({ readonly __typename?: 'User' } & Pick<User, 'fullName'>)
  | ({ readonly __typename?: 'SystemAgent' } & Pick<SystemAgent, 'name'>);

/**
 * The display name of an `Actor`, whichever implementation it is.
 *
 * `undefined` if the actor is absent (unreadable/unset secured value) or is an
 * implementation we don't have a name selected for.
 */
export const actorName = (actor?: NameableActor | null) =>
  actor?.__typename === 'User'
    ? actor.fullName
    : actor?.__typename === 'SystemAgent'
    ? actor.name
    : undefined;
