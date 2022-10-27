import { DateTime } from 'luxon';
import { Prompt } from './types.fixture';

const obstaclePrompt = {
  id: 'obstacle',
  canDelete: false,
  createdAt: DateTime.fromISO('2020-01-01T00:00:00.000Z'),
  prompt: {
    canEdit: true,
    canRead: true,
    value: {
      value:
        'What are the biggest obstacles team members are facing in reaching their goals? How are they dealing with those obstacles? (Ex: translation difficulties, political unrest, suppression of faith)',
    },
  },
};

const termsPrompt = {
  id: 'terms',
  canDelete: false,
  createdAt: DateTime.fromISO('2020-01-01T00:00:00.000Z'),
  prompt: {
    canEdit: true,
    canRead: true,
    value: {
      value:
        'What terms or concepts were difficult to find the right word for in the local language? Please explain how you found a solution.',
    },
  },
};

const affectedPrompt = {
  id: 'affected',
  canDelete: false,
  createdAt: DateTime.fromISO('2020-01-01T00:00:00.000Z'),
  prompt: {
    canEdit: true,
    canRead: true,
    value: {
      value:
        'How has working on the translation affected team members or their families? Please give a specific example.',
    },
  },
};

const othersPrompt = {
  id: 'others',
  canDelete: false,
  createdAt: DateTime.fromISO('2020-01-01T00:00:00.000Z'),
  prompt: {
    canEdit: true,
    canRead: true,
    value: {
      value:
        'What have others done to help the team? How did this impact the team’s work? (Ex: People in the community cooking meals for the team, local governments offering the use of a community center, churches hosting literacy classes/checking sessions)',
    },
  },
};

export const prompts: Prompt[] = [
  obstaclePrompt,
  termsPrompt,
  affectedPrompt,
  othersPrompt,
];
