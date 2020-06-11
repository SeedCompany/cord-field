import React from 'react';
import { useParams } from 'react-router-dom';
import { ContentContainer as Content } from '../../../components/ContentContainer';

export const ProjectBudget = () => {
  const { projectId } = useParams();
  console.log('projectId', projectId);
  return (
    <Content>
      <h1>Project Budget</h1>
    </Content>
  );
};
