import { useMutation } from '@apollo/client';
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
import { CreateLanguageEngagementDocument } from './CreateLanguageEngagement.graphql';
import { invalidatePartnersEngagements } from './invalidatePartnersEngagements';
import { recalculateSensitivity } from './recalculateSensitivity';
import { Tooltip, Paper, List, ListSubheader, ListItem, ListItemText, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

interface CreateLanguageEngagementFormValues {
  engagement: {
    languageId: LanguageLookupItem;
  };
}

type CreateLanguageEngagementProps = Except<
  DialogFormProps<CreateLanguageEngagementFormValues>,
  'onSubmit'
> & {
  project: ProjectIdFragment;
};

const useStyles = makeStyles()(({ spacing }) => ({
  helperTextKey: {
    fontWeight: 600,
    marginRight: spacing(1),
  },
  helperTextValue: {
    marginRight: spacing(2),
  },
}));

export const CreateLanguageEngagement = ({
  project,
  ...props
}: CreateLanguageEngagementProps) => {
  const [createEngagement] = useMutation(CreateLanguageEngagementDocument);
  const { classes } = useStyles();
  // Get engaged language IDs for this project
  const engagedIds = (project.engagements?.items ?? [])
    .filter((e: any) => e.__typename === 'LanguageEngagement')
    .map((e: any) => e.language.value?.id)
    .filter(Boolean);

  // Sort so engaged languages are at the bottom
  const sortByWhetherAnEngagedId = (a: any, b: any) => {
    const aEngaged = engagedIds.includes(a.id);
    const bEngaged = engagedIds.includes(b.id);
    if (aEngaged === bEngaged) return 0;
    return aEngaged ? 1 : -1;
  };

  // Helper to get the currently selected language
  // (assumes LanguageField passes value as option)
  // You may need to adjust this if LanguageField uses a different value prop
  // For now, we use the value from props.values if available
  // @ts-ignore
  const currentLanguage = props.values?.engagement?.languageId;

  const submit = async ({ engagement }: CreateLanguageEngagementFormValues) => {
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
          outputToItem: (res: any) => res.createLanguageEngagement.engagement,
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
      <SubmitError />
      <LanguageField
        name="engagement.languageId"
        label="Language"
        required
        PaperComponent={({ children }) => (
          <Paper>
            <List>
              <ListSubheader>
                <ListItem divider dense>
                  <ListItemText secondary="NAME" />
                  <ListItemText secondary="ETH" />
                  <ListItemText secondary="ROLV" />
                </ListItem>
              </ListSubheader>
              {children}
            </List>
          </Paper>
        )}
        sortOptionComparator={sortByWhetherAnEngagedId}
        getOptionDisabled={(lang: any) => engagedIds?.includes(lang.id) ?? true}
        helperText={
          currentLanguage ? (
            <>
              <Typography
                variant="caption"
                className={classes.helperTextKey}
              >
                ETH
              </Typography>
              <Typography
                variant="caption"
                className={classes.helperTextValue}
              >
                {currentLanguage.ethnologue?.code?.value ?? '-'}
              </Typography>
              <Typography
                variant="caption"
                className={classes.helperTextKey}
              >
                ROLV
              </Typography>
              <Typography
                variant="caption"
                className={classes.helperTextValue}
              >
                {currentLanguage.registryOfDialectsCode?.value ?? '-'}
              </Typography>
            </>
          ) : (
            ''
          )
        }
        renderOption={(option: any) => (
          <ListItem dense>
            <ListItemText
              primary={option.name.value ?? option.displayName.value}
            />
            <ListItemText primary={option.ethnologue?.code?.value ?? '-'} />
            <ListItemText
              primary={option.registryOfDialectsCode?.value ?? '-'}
            />
          </ListItem>
        )}
      />
    </DialogForm>
  );
};
