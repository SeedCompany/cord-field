import { useMutation } from '@apollo/client';
import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { Except } from 'type-fest';
import { addItemToList } from '~/api';
import {
  Id_InternshipProject_Fragment as InternshipProjectIdFragment,
  Id_TranslationProject_Fragment as TranslationProjectIdFragment,
} from '~/common/fragments';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../components/Dialog/DialogForm';
import { SubmitError } from '../../../../components/form';
import {
  LanguageField,
  LanguageLookupItem,
} from '../../../../components/form/Lookup';
import { callAll } from '../../../../util';
import { CreateLanguageEngagementDocument } from './CreateLanguageEngagement.graphql';
import { recalculateSensitivity } from './recalculateSensitivity';

const useStyles = makeStyles(({ palette, spacing }) => ({
  helperTextKey: {
    marginRight: spacing(1),
    color: palette.text.secondary,
  },
  helperTextValue: {
    marginRight: spacing(3),
    color: palette.text.secondary,
  },
}));

interface CreateLanguageEngagementFormValues {
  engagement: {
    languageId: LanguageLookupItem;
  };
}

type ProjectIdFragment =
  | TranslationProjectIdFragment
  | InternshipProjectIdFragment;

type CreateLanguageEngagementProps = Except<
  DialogFormProps<CreateLanguageEngagementFormValues>,
  'onSubmit'
> & {
  project: ProjectIdFragment;
  engagedIds?: string[]; //wish there were a cooler way for this.
};

export const CreateLanguageEngagement = ({
  project,
  engagedIds,
  ...props
}: CreateLanguageEngagementProps) => {
  const classes = useStyles();
  const [createEngagement] = useMutation(CreateLanguageEngagementDocument);
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
          outputToItem: (res) => res.createLanguageEngagement.engagement,
        }),
        addItemToList({
          listId: [languageRef, 'projects'],
          outputToItem: () => project,
        }),
        recalculateSensitivity(project)
      ),
    });
  };
  const sortByWhetherAnEngagedId = <T extends { id: string }>(a: T) => {
    if (engagedIds?.includes(a.id)) {
      return 1;
    } else {
      return -1;
    }
  };
  return (
    <DialogForm
      {...props}
      onSubmit={submit}
      title="Create Language Engagement"
      changesetAware
    >
      {({ values }) => {
        // need to check if the engagement is null or not because not returned from autocomplete yet.
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const currentLanguage = values.engagement
          ? values.engagement.languageId
          : null;
        return (
          <>
            <SubmitError />
            <LanguageField
              name="engagement.languageId"
              label="Language"
              required
              // wrap the options in a List with a subheader
              PaperComponent={({ children }) => {
                return (
                  <Paper>
                    <List>
                      <ListSubheader>
                        <ListItem divider dense>
                          <ListItemText secondary="NAME" />
                          <ListItemText secondary="ETH" />
                          <ListItemText secondary="ROD" />
                        </ListItem>
                      </ListSubheader>
                      {children}
                    </List>
                  </Paper>
                );
              }}
              sortOptionComparator={sortByWhetherAnEngagedId}
              getOptionDisabled={(lang) =>
                engagedIds?.includes(lang.id) ?? true
              }
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
                      {currentLanguage.ethnologue.code.value ?? '-'}
                    </Typography>
                    <Typography
                      variant="caption"
                      className={classes.helperTextKey}
                    >
                      ROD
                    </Typography>
                    <Typography
                      variant="caption"
                      className={classes.helperTextValue}
                    >
                      {currentLanguage.registryOfDialectsCode.value ?? '-'}
                    </Typography>
                  </>
                ) : (
                  ''
                )
              }
              renderOption={(option) => (
                <ListItem dense>
                  <ListItemText
                    primary={option.name.value ?? option.displayName.value}
                  />
                  <ListItemText primary={option.ethnologue.code.value ?? '-'} />
                  <ListItemText
                    primary={option.registryOfDialectsCode.value ?? '-'}
                  />
                </ListItem>
              )}
            />
          </>
        );
      }}
    </DialogForm>
  );
};
