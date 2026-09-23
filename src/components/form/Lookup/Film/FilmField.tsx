import { CreateFilm as CreateFilmInput } from '~/api/schema.graphql.ts';
import { LookupField } from '../..';
import { CreateFilm } from '../../../../scenes/Engagement/LanguageEngagement/Product/Producibles/Film/CreateFilm';
import {
  FilmLookupItemFragment as Film,
  FilmLookupDocument,
} from './FilmLookup.graphql.ts';

export const FilmField = LookupField.createFor<Film, CreateFilmInput>({
  resource: 'Film',
  lookupDocument: FilmLookupDocument,
  label: 'Film',
  placeholder: 'Search for a film by name',
  CreateDialogForm: CreateFilm,
  getInitialValues: (name) => ({ name }),
});
