import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Breadcrumbs,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React, { FC, useReducer } from 'react';
import { Form } from 'react-final-form';
import { useParams } from 'react-router';
import { Breadcrumb } from '../../../components/Breadcrumb';
import {
  ToggleButtonOption,
  ToggleButtonsField,
} from '../../../components/form';
import { PencilCircledIcon } from '../../../components/Icons';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import {
  AccordionState,
  accordionStateReducer,
  expandSection,
  initialAccordionState,
} from './AccordionState';
import { useGetProjectBreadcrumbQuery } from './CreateProduct.generated';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    overflowY: 'scroll',
    padding: spacing(4),
    maxWidth: breakpoints.values.md,
  },
}));

export const CreateProduct: FC = () => {
  const classes = useStyles();

  const { projectId, engagementId } = useParams();

  const { data } = useGetProjectBreadcrumbQuery({
    variables: {
      input: projectId,
    },
  });

  const project = data?.project;
  const [accordionState, dispatch] = useReducer(
    accordionStateReducer,
    initialAccordionState
  );
  console.log('accordionState: ', accordionState);

  return (
    <main className={classes.root}>
      <Breadcrumbs>
        <ProjectBreadcrumb data={project} />
        <Breadcrumb to={`/projects/${projectId}/engagements`}>
          engagement
        </Breadcrumb>
        <Breadcrumb to={`/projects/${projectId}/engagements/${engagementId}`}>
          {engagementId}
        </Breadcrumb>
      </Breadcrumbs>
      <Typography variant="h2">Create Product</Typography>
      <Form
        onSubmit={(...stuff) => console.log('submit clicked, stuff: ', stuff)}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <AccordionState dispatch={dispatch} />
            <Accordion expanded={accordionState.expand.product}>
              <AccordionSummary>
                <Typography>Choose Product</Typography>
                {!accordionState.expand.product && (
                  <IconButton
                    color="primary"
                    onClick={() => dispatch(expandSection('product'))}
                  >
                    <PencilCircledIcon />
                  </IconButton>
                )}
              </AccordionSummary>
              <AccordionDetails>
                <ToggleButtonsField name="product" pickOne>
                  {[
                    'scripture',
                    'story',
                    'film',
                    'song',
                    'literacyMaterial',
                  ].map((option) => (
                    <ToggleButtonOption
                      key={option}
                      label={option}
                      value={option}
                    />
                  ))}
                </ToggleButtonsField>
              </AccordionDetails>
            </Accordion>
            {accordionState.show.medium && (
              <Accordion expanded={accordionState.expand.medium}>
                <AccordionSummary>
                  <Typography>Choose Medium</Typography>
                  {!accordionState.expand.medium && (
                    <IconButton
                      color="primary"
                      onClick={() => dispatch(expandSection('medium'))}
                    >
                      <PencilCircledIcon />
                    </IconButton>
                  )}
                </AccordionSummary>
                <AccordionDetails>
                  <ToggleButtonsField name="medium">
                    {[
                      'print',
                      'web',
                      'video',
                      'app',
                      'ebook',
                      'audioRecording',
                      'oralTranslation',
                      'other',
                    ].map((option) => (
                      <ToggleButtonOption
                        key={option}
                        label={option}
                        value={option}
                      />
                    ))}
                  </ToggleButtonsField>
                </AccordionDetails>
              </Accordion>
            )}
            <button type="submit">submit</button>
          </form>
        )}
      </Form>
    </main>
  );
};
