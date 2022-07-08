import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import React from 'react';
import { Form } from 'react-final-form';
import { ChildrenProp } from '~/common';
import { FieldSpy } from '../../FieldSpy';
import {
  InternshipProjectField,
  ProjectField,
  TranslationProjectField,
} from './ProjectFields';

export default { title: 'Components/Forms/Fields/Lookup/Project' };

const FF = ({ children }: ChildrenProp) => (
  <Form
    onSubmit={action('submit')}
    initialValues={{
      project: {
        id: 'projectid',
        name: {
          value: 'Waja',
        },
      },
      translationProject: {
        id: 'projectid2',
        name: {
          value: 'Esimbi 2',
        },
      },
      internshipProject: {
        id: 'projectid3',
        name: {
          value: 'Jino Gideon Intern 2',
        },
      },
    }}
  >
    {({ handleSubmit }) => <form onSubmit={handleSubmit}>{children}</form>}
  </Form>
);
// translation and internship projects together
export const Project = () => (
  <FF>
    <ProjectField
      name="project"
      label="Projects"
      multiple={boolean('Multiple', false)}
    />
    <FieldSpy name="project" />
  </FF>
);

export const TranslationProject = () => (
  <FF>
    <TranslationProjectField
      name="translationProject"
      label="Translation Project"
      multiple={boolean('Multiple', false)}
    />
    <FieldSpy name="translationProject" />
  </FF>
);

export const InternshipProject = () => (
  <FF>
    <InternshipProjectField
      name="internshipProject"
      label="Internship Project"
      multiple={boolean('Multiple', false)}
    />
    <FieldSpy name="internshipProject" />
  </FF>
);
