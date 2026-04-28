import { useMutation } from '@apollo/client';
import { Box, Paper, Tooltip, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useFormState } from 'react-final-form';
import { makeStyles } from 'tss-react/mui';
import { Except } from 'type-fest';
import { addItemToList } from '~/api';
import { callAll } from '~/common';
import { ProjectIdFragment } from '~/common/fragments';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../components/Dialog/DialogForm';
import { SubmitError } from '../../../../components/form';
import {
  LanguageField,
  LanguageLookupItem,
} from '../../../../components/form/Lookup';
import {
  CreateLanguageEngagementDocument,
  type CreateLanguageEngagementMutation,
} from './CreateLanguageEngagement.graphql';
import { invalidatePartnersEngagements } from './invalidatePartnersEngagements';
import { recalculateSensitivity } from './recalculateSensitivity';

interface CreateLanguageEngagementFormValues {
  // engagement may be undefined on initial render or after form.reset()
  engagement?: {
    // Optional because the field starts undefined before the user makes a selection.
    languageId?: LanguageLookupItem;
  };
}

type CreateLanguageEngagementProps = Except<
  DialogFormProps<CreateLanguageEngagementFormValues>,
  'onSubmit'
> & {
  project: ProjectIdFragment;
  /** IDs of languages that already have an engagement on this project. */
  engagedLanguageIds: readonly string[];
};

/**
 * Returns a comparator that sorts already-engaged languages to the bottom.
 * Exported for unit testing.
 */
export const createSortComparator =
  (engagedLanguageIds: readonly string[]) =>
  (a: LanguageLookupItem, b: LanguageLookupItem): number => {
    const aEngaged = engagedLanguageIds.includes(a.id);
    const bEngaged = engagedLanguageIds.includes(b.id);
    if (aEngaged === bEngaged) return 0;
    return aEngaged ? 1 : -1;
  };

/**
 * Returns a predicate that disables languages already engaged on the project.
 * Exported for unit testing.
 */
export const createGetOptionDisabled =
  (engagedLanguageIds: readonly string[]) =>
  (lang: LanguageLookupItem): boolean =>
    engagedLanguageIds.includes(lang.id);

const useStyles = makeStyles()(({ palette, spacing }) => ({
  columnHeader: {
    display: 'flex',
    padding: spacing(0.5, 2),
    borderBottom: `1px solid ${palette.divider}`,
  },
  columnHeaderName: {
    flex: 1,
    fontSize: '0.7rem',
    fontWeight: 600,
    color: palette.text.secondary,
    textTransform: 'uppercase',
  },
  columnHeaderCode: {
    flexShrink: 0,
    width: 52, // must match optionCode width for column alignment // ai design-alignment
    fontSize: '0.7rem', // compact size for column header labels // ai design-alignment
    fontWeight: 600,
    textAlign: 'right',
    color: palette.text.secondary,
    textTransform: 'uppercase',
  },
  optionRow: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    gap: spacing(1),
  },
  optionName: {
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  optionCode: {
    flexShrink: 0,
    width: 52, // must match columnHeaderCode width for column alignment // ai design-alignment
    textAlign: 'right',
    color: palette.text.secondary,
  },
  helperRow: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing(2),
  },
  helperKey: {
    fontWeight: 600,
  },
}));

/**
 * Inner form content — rendered inside DialogForm's Form context so that
 * useFormState can subscribe to live field values.
 */
interface FormContentProps {
  engagedLanguageIds: readonly string[];
  sortComparator: (a: LanguageLookupItem, b: LanguageLookupItem) => number;
}

const FormContent = ({
  engagedLanguageIds,
  sortComparator,
}: FormContentProps) => {
  const { classes } = useStyles();
  const { values } = useFormState<CreateLanguageEngagementFormValues>({
    subscription: { values: true },
  });
  const currentLanguage = values.engagement?.languageId ?? null;

  const renderOptionContent = (option: LanguageLookupItem) => {
    const row = (
      <span className={classes.optionRow}>
        <span className={classes.optionName}>
          {option.name.value ?? option.displayName.value}
        </span>
        <span className={classes.optionCode}>
          {option.ethnologue.code.value ?? '-'}
        </span>
        <span className={classes.optionCode}>
          {option.registryOfLanguageVarietiesCode.value ?? '-'}
        </span>
      </span>
    );

    if (engagedLanguageIds.includes(option.id)) {
      return (
        // Tooltip on a disabled Autocomplete option requires a non-disabled wrapper
        <Tooltip title="Already added to this project" placement="right">
          <span style={{ display: 'block', width: '100%' }}>{row}</span>
        </Tooltip>
      );
    }
    return row;
  };

  return (
    <>
      <SubmitError />
      <LanguageField
        name="engagement.languageId"
        label="Language"
        required
        PaperComponent={(paperProps) => {
          const { children, ...rest } = paperProps;
          return (
            <Paper {...rest}>
              <Box className={classes.columnHeader}>
                <Typography className={classes.columnHeaderName}>
                  Name
                </Typography>
                <Typography className={classes.columnHeaderCode}>
                  ETH
                </Typography>
                <Typography className={classes.columnHeaderCode}>
                  ROLV
                </Typography>
              </Box>
              {children}
            </Paper>
          );
        }}
        sortComparator={sortComparator}
        getOptionDisabled={createGetOptionDisabled(engagedLanguageIds)}
        renderOptionContent={renderOptionContent}
        helperText={
          <Box className={classes.helperRow}>
            <Typography variant="caption" className={classes.helperKey}>
              ETH
            </Typography>
            <Typography variant="caption">
              {currentLanguage?.ethnologue.code.value ?? '-'}
            </Typography>
            <Typography variant="caption" className={classes.helperKey}>
              ROLV
            </Typography>
            <Typography variant="caption">
              {currentLanguage?.registryOfLanguageVarietiesCode.value ?? '-'}
            </Typography>
          </Box>
        }
      />
    </>
  );
};

export const CreateLanguageEngagement = ({
  project,
  engagedLanguageIds,
  ...props
}: CreateLanguageEngagementProps) => {
  const [createEngagement] = useMutation(CreateLanguageEngagementDocument);

  // Push already-engaged languages to the bottom of the dropdown list
  const sortComparator = useMemo(
    () => createSortComparator(engagedLanguageIds),
    [engagedLanguageIds]
  );

  const submit = async ({ engagement }: CreateLanguageEngagementFormValues) => {
    // Guard: `required` validation prevents submit without a selection, but we
    // narrow the type here to avoid non-null assertions. // ai type-safety
    const language = engagement?.languageId;
    if (!language) return;
    const languageRef = {
      __typename: 'Language',
      id: engagement.languageId.id,
    } as const;

    await createEngagement({
      variables: {
        input: {
          engagement: {
            projectId: project.id,
            languageId: engagement.languageId.id,
          },
          changeset: project.changeset?.id,
        },
      },
      update: callAll(
        addItemToList({
          listId: [project, 'engagements'],
          outputToItem: (res: CreateLanguageEngagementMutation) =>
            res.createLanguageEngagement.engagement,
        }),
        addItemToList({
          listId: [languageRef, 'projects'],
          outputToItem: () => project,
        }),
        invalidatePartnersEngagements(),
        recalculateSensitivity(project)
      ),
    });
  };

  return (
    <DialogForm
      {...props}
      onSubmit={submit}
      title="Create Language Engagement"
      changesetAware
    >
      <FormContent
        engagedLanguageIds={engagedLanguageIds}
        sortComparator={sortComparator}
      />
    </DialogForm>
  );
};
