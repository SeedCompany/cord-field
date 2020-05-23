import { Group, GroupWork } from '@material-ui/icons';
import React from 'react';
import { MemberListSummary } from '../MemberListSummary';
import { members } from '../MemberListSummary/MemberListSummary.stories';
import { CardGroup as CG } from './CardGroup';

export default { title: 'Components' };

export const CardGroup = () => (
  <CG>
    <MemberListSummary
      members={members}
      to="/"
      icon={Group}
      title="Team Members"
    />
    <MemberListSummary
      members={[...members, ...members]}
      to="/"
      icon={GroupWork}
      title="Partners"
    />
  </CG>
);
