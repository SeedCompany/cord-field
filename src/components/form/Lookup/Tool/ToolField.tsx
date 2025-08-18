import { CreateTool } from '../../../Tool';
import { LookupField } from '../../index';
import { ToolLookupDocument } from './ToolLookup.graphql';

export const ToolField = LookupField.createFor({
  resource: 'Tool',
  lookupDocument: ToolLookupDocument,
  label: 'Tool',
  placeholder: 'Search for a tool by name',
  CreateDialogForm: CreateTool,
  getInitialValues: (val) => ({
    tool: {
      name: val,
    },
  }),
});
