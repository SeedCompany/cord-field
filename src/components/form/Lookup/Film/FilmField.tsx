import { FilmLookupItem } from '.';
import { LookupField } from '../..';
import { CreateFilmInput } from '../../../../api';
import { CreateFilm } from '../../../../scenes/Engagement/LanguageEngagement/Product/Producibles/Film/CreateFilm';
import { useFilmLookupLazyQuery } from './FilmLookup.generated';

export const FilmField = LookupField.createFor<FilmLookupItem, CreateFilmInput>(
  {
    resource: 'Film',
    useLookup: useFilmLookupLazyQuery,
    getOptionLabel: (option) => option.name.value ?? '',
    CreateDialogForm: CreateFilm,
    freeSolo: true,
    getInitialValues: (value) => ({
      film: {
        name: value,
      },
    }),
  }
);
