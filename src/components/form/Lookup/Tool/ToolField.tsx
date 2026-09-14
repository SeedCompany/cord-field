import { CreateTool } from '../../../Tool';
import { LookupField } from '../../index';
import { InitialToolOptionsDocument as InitialTools } from './InitialToolOptions.graphql.ts';
import { ToolLookupDocument } from './ToolLookup.graphql.ts';

export const ToolField = LookupField.createFor({
  resource: 'Tool',
  initial: [InitialTools, ({ tools }) => tools.items],
  lookupDocument: ToolLookupDocument,
  label: 'Tool',
  placeholder: 'Search for a tool by name',
  CreateDialogForm: CreateTool,
  getInitialValues: (val) => ({
    name: val,
  }),
});
