import { LookupField } from '../..';
import { CreateFilmInput } from '../../../../api';
import { CreateFilm } from '../../../../scenes/Engagement/LanguageEngagement/Product/Producibles/Film/CreateFilm';
import {
  FilmLookupItemFragment as Film,
  useFilmLookupLazyQuery,
} from './FilmLookup.generated';

export const FilmField = LookupField.createFor<Film, CreateFilmInput>({
  resource: 'Film',
  useLookup: useFilmLookupLazyQuery,
  label: 'Film',
  placeholder: 'Search for a film by name',
  CreateDialogForm: CreateFilm,
  getInitialValues: (value) => ({
    film: {
      name: value,
    },
  }),
});
