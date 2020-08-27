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
  getOptionLabel: (option) => option.name.value ?? '',
  CreateDialogForm: CreateFilm,
  getInitialValues: (value) => ({
    film: {
      name: value,
    },
  }),
});
