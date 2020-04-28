import { number, select, text } from '@storybook/addon-knobs';
import React from 'react';
import { ProjectStatus } from '../../api';
import { ProjectListItemCard } from './ProjectListItemCard';

export default { title: 'Components/ProjectListItemCard' };

const statusOptions: string[] & ProjectStatus[] = [
  'InDevelopment',
  'Pending',
  'Active',
  'Stopped',
  'Finished',
];

export const ProjectListItemCardStory = () => (
  <ProjectListItemCard
    projectImagePath={text('projectImagePath', '/images/favicon-32x32.png')}
    name={text('name', 'Labore People Group')}
    countryName={text('countryName', 'Mandoria')}
    region={text('region', 'Asia')}
    sensitivity={select('sensitivity', ['High', 'Medium', 'Low'], 'High')}
    status={select('status', statusOptions, 'Active')}
    numberOfLanguageEngagements={number('numberOfLanguageEngagements', 6)}
    esadDate={text('esadDate', '12/12/20')}
  />
);
