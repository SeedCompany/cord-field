import { mapOf } from '@seedcompany/common';
import { ComponentType } from 'react';
import { Except } from 'type-fest';
import { Power } from '~/api/schema.graphql';
import { DialogFormProps } from '../../../components/Dialog/DialogForm';
import { CreateLanguage } from '../../Languages/Create';
import { CreateLocation } from '../../Locations/Create';
import { CreatePartner } from '../../Partners/Create';
import { CreateProject } from '../../Projects/Create';
import { CreateUser } from '../../Users/Create';

type Create = [
  dialog: ComponentType<Except<DialogFormProps<any, any>, 'onSubmit'>>,
  label?: string
];

export const creates = mapOf<Power, Create>([
  ['CreateProject', [CreateProject]],
  ['CreateLanguage', [CreateLanguage]],
  ['CreateUser', [CreateUser, 'Person']],
  ['CreatePartner', [CreatePartner]],
  ['CreateLocation', [CreateLocation]],
]);
