import { ApolloCache, MutationUpdaterFunction } from '@apollo/client';
import { highestSensitivity, IdFragment } from '~/common';
import { TranslationProjectSensitivityFragmentDoc } from './CreateLanguageEngagement.graphql';

export const recalculateSensitivity =
  <Res>(
    projectRef: IdFragment
  ): MutationUpdaterFunction<Res, unknown, unknown, ApolloCache<unknown>> =>
  (cache) => {
    if (projectRef.__typename === 'InternshipProject') {
      return;
    }

    const proj = cache.readFragment({
      id: cache.identify(projectRef),
      fragment: TranslationProjectSensitivityFragmentDoc,
    });
    cache.modify({
      id: cache.identify(projectRef),
      fields: {
        sensitivity: (_, { DELETE }) => {
          if (!proj) {
            // If necessary data to recalculate doesn't exist in the cache, then
            // just invalidate it so when it's requested it's fresh from the API
            return DELETE;
          }
          // Otherwise follow same logic API does
          const sensitivities = proj.engagements.items.flatMap((e) =>
            e.__typename !== 'LanguageEngagement'
              ? []
              : e.language.value?.sensitivity ?? []
          );
          return highestSensitivity(sensitivities, 'High');
        },
      },
    });
  };
