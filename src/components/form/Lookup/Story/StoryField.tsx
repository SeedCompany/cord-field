import { CreateStory as CreateStoryInput } from '~/api/schema.graphql';
import { CreateStory } from '../../../../scenes/Engagement/LanguageEngagement/Product/Producibles/Story/CreateStory';
import { LookupField } from '../../index';
import {
  StoryLookupItemFragment as Story,
  StoryLookupDocument,
} from './StoryLookup.graphql';

export const StoryField = LookupField.createFor<Story, CreateStoryInput>({
  resource: 'Story',
  lookupDocument: StoryLookupDocument,
  label: 'Story',
  placeholder: 'Search for a story by name',
  CreateDialogForm: CreateStory,
  getInitialValues: (name) => ({ name }),
});
