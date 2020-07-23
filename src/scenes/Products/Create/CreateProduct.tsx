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
  makeStyles,
  Typography,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { ToggleButton } from '@material-ui/lab';
import { isEmpty } from 'lodash';
import React, { FC, useState } from 'react';
import { Form, FormSpy } from 'react-final-form';
import { useParams } from 'react-router';
import { ScriptureRangeInput } from '../../../api';
import { Breadcrumb } from '../../../components/Breadcrumb';
import {
  NumberField,
  SubmitButton,
  TextField,
  ToggleButtonOption,
  ToggleButtonsField,
} from '../../../components/form';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
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
  productSection: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

export const CreateProduct: FC = () => {
  const classes = useStyles();

  const { projectId, engagementId } = useParams();

  const [openedSection, setOpenedSection] = useState<string>('produces');
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [scriptureReferences, setScriptureReferences] = useState<
    ScriptureRangeInput[]
  >([]);
  const [formValues, setFormvalues] = useState({});
  console.log('formValues: ', formValues);

  const { data } = useGetProjectBreadcrumbQuery({
    variables: {
      input: projectId,
    },
  });

  const project = data?.project;

  const selectVerse = (
    { books: [book], startChapter, startVerse, endChapter, endVerse }: any,
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
    setScriptureReferences([...scriptureReferences, scriptureRange]);
    //unselect the book from form state
    form.mutators.clear(
      'books',
      'startChapter',
      'startVerse',
      'endChapter',
      'endVerse'
    );
  };

  const [createProduct] = useCreateProductMutation();

  const onSubmit = async ({ productType, ...inputs }: any) => {
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

  const handleChange = (panel: string) => (
    event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setOpenedSection(isExpanded ? panel : '');
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
              <FormSpy
                subscription={{ values: true }}
                onChange={({ values }) => {
                  setSelectedBook(values.books?.[0] || '');
                  !isEmpty(values) && setFormvalues(values);
                }}
              />
              <Accordion
                expanded={openedSection === 'produces'}
                onChange={handleChange('produces')}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Choose Product</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.productSection}>
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
                  <TextField
                    name="produces"
                    disabled={values.productType?.[0] === 'scripture'}
                  />
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={openedSection === 'scriptureReferences'}
                onChange={handleChange('scriptureReferences')}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Scripture Ranges</Typography>
                  {scriptureReferences.map((scriptureRange) => (
                    <ToggleButton selected>
                      {`${scriptureRange.start.book} ${scriptureRange.start.chapter}:${scriptureRange.start.verse} -  ${scriptureRange.end.chapter}:${scriptureRange.end.verse}`}
                    </ToggleButton>
                  ))}
                </AccordionSummary>
                <AccordionDetails>
                  <ToggleButtonsField name="books" pickOne>
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

              <Accordion
                expanded={openedSection === 'mediums'}
                onChange={handleChange('mediums')}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Choose Medium</Typography>
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

              <Accordion
                expanded={openedSection === 'purposes'}
                onChange={handleChange('purposes')}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Choose Purposes</Typography>
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

              <Accordion
                expanded={openedSection === 'methodology'}
                onChange={handleChange('methodology')}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Choose Methodology</Typography>
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

              <SubmitButton fullWidth={false} color="primary" size="medium">
                Submit
              </SubmitButton>
              <Dialog open={Boolean(selectedBook)}>
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
                        'books',
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
