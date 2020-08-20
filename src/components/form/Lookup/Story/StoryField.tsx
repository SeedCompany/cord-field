import { StoryLookupItem } from '.';
import { CreateStoryInput } from '../../../../api';
import { CreateStory } from '../../../../scenes/Engagement/LanguageEngagement/Product/Producibles/Story/CreateStory';
import { LookupField } from '../../index';
import { useStoryLookupLazyQuery } from './StoryLookup.generated';

export const StoryField = LookupField.createFor<
  StoryLookupItem,
  CreateStoryInput
>({
  resource: 'Story',
  useLookup: useStoryLookupLazyQuery,
  getOptionLabel: (option) => option.name.value ?? '',
  CreateDialogForm: CreateStory,
  freeSolo: true,
  getInitialValues: (value) => ({
    story: {
      name: value,
    },
  }),
});
