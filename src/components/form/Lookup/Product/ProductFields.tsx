import {
  FilmLookupItem,
  LiteracyMaterialLookupItem,
  SongLookupItem,
  StoryLookupItem,
} from '.';
import { LookupField } from '../../index';
import {
  useFilmLookupLazyQuery,
  useLiteracyMaterialLookupLazyQuery,
  useSongLookupLazyQuery,
  useStoryLookupLazyQuery,
} from './ProductLookup.generated';

export const FilmField = LookupField.createFor<FilmLookupItem>({
  resource: 'Film',
  useLookup: useFilmLookupLazyQuery,
  getOptionLabel: (option) => option.name.value ?? '',
});

export const StoryField = LookupField.createFor<StoryLookupItem>({
  resource: 'Story',
  useLookup: useStoryLookupLazyQuery,
  getOptionLabel: (option) => option.name.value ?? '',
});

export const LiteracyMaterialField = LookupField.createFor<
  LiteracyMaterialLookupItem
>({
  resource: 'LiteracyMaterial',
  useLookup: useLiteracyMaterialLookupLazyQuery,
  getOptionLabel: (option) => option.name.value ?? '',
});

export const SongField = LookupField.createFor<SongLookupItem>({
  resource: 'Song',
  useLookup: useSongLookupLazyQuery,
  getOptionLabel: (option) => option.name.value ?? '',
});
