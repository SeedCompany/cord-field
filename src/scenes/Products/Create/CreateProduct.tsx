import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Breadcrumbs,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { ToggleButton } from '@material-ui/lab';
import React, { FC, useReducer } from 'react';
import { Form } from 'react-final-form';
import { useParams } from 'react-router';
import { ScriptureRangeInput } from '../../../api';
import { Breadcrumb } from '../../../components/Breadcrumb';
import {
  NumberField,
  TextField,
  ToggleButtonOption,
  ToggleButtonsField,
} from '../../../components/form';
import { PencilCircledIcon } from '../../../components/Icons';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import {
  AccordionState,
  accordionStateReducer,
  addScriptureRange,
  expandSection,
  initialAccordionState,
} from './AccordionState';
import { books } from './books';
import {
  useCreateProductMutation,
  useGetProjectBreadcrumbQuery,
} from './CreateProduct.generated';

// const wipeFieldMutator = ([name]: string, state: any, { changeValue }: any) => {
//   changeValue(state, name, () => undefined);
// };

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

  const selectVerse = (
    {
      scriptureReferences: [book],
      startChapter,
      startVerse,
      endChapter,
      endVerse,
    }: any,
    form: any
  ) => {
    // add a book and verse to the list
    const scriptureRange: ScriptureRangeInput = {
      start: {
        book,
        chapter: startChapter,
        verse: startVerse,
      },
      end: {
        book,
        chapter: endChapter,
        verse: endVerse,
      },
    };
    dispatch(addScriptureRange(scriptureRange));
    //unselect the book from form state
    form.mutators.clear(
      'scriptureReferences',
      'startChapter',
      'startVerse',
      'endChapter',
      'endVerse'
    );
  };

  const [createProduct] = useCreateProductMutation();

  const onSubmit = async ({ productType, ...inputs }: any) => {
    const { scriptureReferences } = accordionState;
    console.log('formInputValues: ', inputs);
    const input = {
      ...inputs,
      engagementId,
      scriptureReferences,
      methodology: inputs.methodology?.[0],
    };
    //TODO: need to catch this error
    await createProduct({
      variables: {
        input: {
          product: input,
        },
      },
    });
  };

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
        onSubmit={onSubmit}
        mutators={{
          clear: (fieldNames, state, { changeValue }) => {
            fieldNames.forEach((name: string) =>
              changeValue(state, name, () => undefined)
            );
          },
        }}
      >
        {({ handleSubmit, values, form, ...rest }) => {
          console.log('rest: ', rest);
          return (
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
                  <ToggleButtonsField name="productType" pickOne>
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
              {accordionState.show.produces && (
                <Accordion expanded={accordionState.expand.produces}>
                  <AccordionSummary>
                    <Typography>Find Derivative Product</Typography>
                    {!accordionState.expand.produces && (
                      <IconButton
                        color="primary"
                        onClick={() => dispatch(expandSection('produces'))}
                      >
                        <PencilCircledIcon />
                      </IconButton>
                    )}
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField name="produces" />
                  </AccordionDetails>
                </Accordion>
              )}
              {accordionState.show.scriptureReferences && (
                <Accordion expanded={accordionState.expand.scriptureReferences}>
                  <AccordionSummary>
                    <Typography>Scripture Ranges</Typography>
                    {accordionState.selectedScriptureRanges.map(
                      (scriptureRange: ScriptureRangeInput) => (
                        <ToggleButton selected>
                          {`${scriptureRange.start.book} ${scriptureRange.start.chapter}:${scriptureRange.start.verse} -  ${scriptureRange.end.chapter}:${scriptureRange.end.verse}`}
                        </ToggleButton>
                      )
                    )}
                    {!accordionState.expand.scriptureReferences && (
                      <IconButton
                        color="primary"
                        onClick={() =>
                          dispatch(expandSection('scriptureReferences'))
                        }
                      >
                        <PencilCircledIcon />
                      </IconButton>
                    )}
                  </AccordionSummary>
                  <AccordionDetails>
                    <ToggleButtonsField name="scriptureReferences" pickOne>
                      {books.map((option) => (
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
              {accordionState.show.mediums && (
                <Accordion expanded={accordionState.expand.mediums}>
                  <AccordionSummary>
                    <Typography>Choose Medium</Typography>
                    {!accordionState.expand.mediums && (
                      <IconButton
                        color="primary"
                        onClick={() => dispatch(expandSection('mediums'))}
                      >
                        <PencilCircledIcon />
                      </IconButton>
                    )}
                  </AccordionSummary>
                  <AccordionDetails>
                    <ToggleButtonsField name="mediums">
                      {[
                        'Print',
                        'Web',
                        'EBook',
                        'App',
                        'Audio',
                        'OralTranslation',
                        'Video',
                        'Other',
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
              {accordionState.show.purposes && (
                <Accordion expanded={accordionState.expand.purposes}>
                  <AccordionSummary>
                    <Typography>Choose Purposes</Typography>
                    {!accordionState.expand.purposes && (
                      <IconButton
                        color="primary"
                        onClick={() => dispatch(expandSection('purposes'))}
                      >
                        <PencilCircledIcon />
                      </IconButton>
                    )}
                  </AccordionSummary>
                  <AccordionDetails>
                    <ToggleButtonsField name="purposes">
                      {[
                        'EvangelismChurchPlanting',
                        'ChurchLife',
                        'ChurchMaturity',
                        'SocialIssues',
                        'Discipleship',
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
              {accordionState.show.methodology && (
                <Accordion expanded={accordionState.expand.methodology}>
                  <AccordionSummary>
                    <Typography>Choose Methodology</Typography>
                    {!accordionState.expand.methodology && (
                      <IconButton
                        color="primary"
                        onClick={() => dispatch(expandSection('methodology'))}
                      >
                        <PencilCircledIcon />
                      </IconButton>
                    )}
                  </AccordionSummary>
                  <AccordionDetails>
                    <ToggleButtonsField name="methodology" pickOne>
                      {[
                        'Paratext',
                        'OtherWritten',
                        'Render',
                        'OtherOralTranslation',
                        'BibleStories',
                        'BibleStorying',
                        'OneStory',
                        'OtherOralStories',
                        'Film',
                        'SignLanguage',
                        'OtherVisual',
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
              <Dialog open={Boolean(accordionState.selectedBook)}>
                <DialogTitle>Choose Verse</DialogTitle>
                <DialogContent>
                  <Typography>Start</Typography>
                  <NumberField
                    name="startChapter"
                    placeholder="start chapter"
                    required
                  ></NumberField>
                  <NumberField
                    name="startVerse"
                    placeholder="start verse"
                    required
                  ></NumberField>

                  <Typography>End</Typography>
                  <NumberField
                    name="endChapter"
                    placeholder="end chapter"
                    required
                  ></NumberField>
                  <NumberField
                    name="endVerse"
                    placeholder="end verse"
                    required
                  ></NumberField>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() =>
                      form.mutators.clear(
                        'scriptureReferences',
                        'startChapter',
                        'startVerse',
                        'endChapter',
                        'endVerse'
                      )
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    onClick={() => selectVerse(values, form)}
                  >
                    Select
                  </Button>
                </DialogActions>
              </Dialog>
            </form>
          );
        }}
      </Form>
    </main>
  );
};
