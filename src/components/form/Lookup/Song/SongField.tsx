import { SongLookupItem } from '.';
import { CreateSongInput } from '../../../../api';
import { CreateSong } from '../../../../scenes/Engagement/LanguageEngagement/Product/Producibles/Song/CreateSong';
import { LookupField } from '../../index';
import { useSongLookupLazyQuery } from './SongLookup.generated';

export const SongField = LookupField.createFor<SongLookupItem, CreateSongInput>(
  {
    resource: 'Song',
    useLookup: useSongLookupLazyQuery,
    getOptionLabel: (option) => option.name.value ?? '',
    CreateDialogForm: CreateSong,
    freeSolo: true,
    getInitialValues: (value) => ({
      song: {
        name: value,
      },
    }),
  }
);
