import { CreateStoryInput } from '../../../../api';
import { CreateStory } from '../../../../scenes/Engagement/LanguageEngagement/Product/Producibles/Story/CreateStory';
import { LookupField } from '../../index';
import {
  StoryLookupItemFragment as Story,
  useStoryLookupLazyQuery,
} from './StoryLookup.generated';

export const StoryField = LookupField.createFor<Story, CreateStoryInput>({
  resource: 'Story',
  useLookup: useStoryLookupLazyQuery,
  CreateDialogForm: CreateStory,
  getInitialValues: (value) => ({
    story: {
      name: value,
    },
  }),
});
