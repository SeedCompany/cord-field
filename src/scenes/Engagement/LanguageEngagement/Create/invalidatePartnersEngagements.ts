import {
  ApolloCache,
  MutationUpdaterFunction,
  NormalizedCacheObject,
} from '@apollo/client';
import { GqlTypeMap, invalidateProps } from '~/api';

export const invalidatePartnersEngagements =
  <Res>(): MutationUpdaterFunction<
    Res,
    unknown,
    unknown,
    ApolloCache<NormalizedCacheObject>
  > =>
  (cache) => {
    Object.entries(cache.extract())
      .flatMap(([id, partner]) => (id.startsWith('Partner:') ? partner : []))
      .forEach((partner) => {
        invalidateProps(cache, partner as GqlTypeMap['Partner'], 'engagements');
      });
  };
