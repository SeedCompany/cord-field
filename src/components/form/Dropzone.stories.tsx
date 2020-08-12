import { boolean } from '@storybook/addon-knobs';
import React from 'react';
import { DropzoneField as DF } from './Dropzone';

export default { title: 'Components/Forms/Fields' };

export const Dropzone = () => (
  <DF name="files" multiple={boolean('multiple', true)} />
);
