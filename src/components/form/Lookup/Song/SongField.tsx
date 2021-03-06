import { CreateSongInput } from '../../../../api';
import { CreateSong } from '../../../../scenes/Engagement/LanguageEngagement/Product/Producibles/Song/CreateSong';
import { LookupField } from '../../index';
import {
  SongLookupItemFragment as Song,
  SongLookupDocument,
} from './SongLookup.generated';

export const SongField = LookupField.createFor<Song, CreateSongInput>({
  resource: 'Song',
  lookupDocument: SongLookupDocument,
  label: 'Song',
  placeholder: 'Search for a song by name',
  CreateDialogForm: CreateSong,
  getInitialValues: (value) => ({
    song: {
      name: value,
    },
  }),
});
