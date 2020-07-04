import {
  Button,
  Card,
  CardContent,
  Chip,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { CalendarToday } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import { FC } from 'react';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { UpdateLanguageInput } from '../../../api';
import { useDialog } from '../../../components/Dialog';
import { DisplaySimpleProperty } from '../../../components/DisplaySimpleProperty';
import {
  useDateFormatter,
  useNumberFormatter,
} from '../../../components/Formatters';
import { Sensitivity } from '../../../components/Sensitivity';
import { EditLanguage } from '../Edit';
import { useLanguageQuery } from './Language.generated';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    flex: 1,
    overflowY: 'scroll',
    padding: spacing(4),
    '& > *': {
      marginBottom: spacing(3),
    },
  },
  container: {
    display: 'flex',
  },
  edit: {
    marginRight: spacing(1),
  },
  card: {
    height: '210px',
    display: 'flex',
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  leftContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  rightContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
}));

export const LanguageOverview: FC = () => {
  const classes = useStyles();
  const { languageId } = useParams() as { languageId: string };
  const dateTimeFormatter = useDateFormatter();
  const numberFormatter = useNumberFormatter();

  const { data, error } = useLanguageQuery({
    variables: {
      input: languageId,
    },
  });

  const name = data?.language.name?.value ?? data?.language.displayName.value;
  const createdAt = dateTimeFormatter(data?.language.createdAt);
  const ethnologuePopulation = data?.language?.ethnologuePopulation?.value;
  const organizationPopulation = data?.language?.organizationPopulation?.value;

  const [updateLanguageState, updateLanguage] = useDialog();
  const languageFormValues: UpdateLanguageInput = {
    language: {
      id: data?.language.id ?? '',
      name: data?.language.name.value ?? null,
      displayName: data?.language.displayName.value ?? null,
      beginFiscalYear: data?.language.beginFiscalYear?.value ?? null,
      ethnologueName: data?.language.ethnologueName?.value ?? null,
      ethnologuePopulation: data?.language.ethnologuePopulation?.value ?? null,
      organizationPopulation:
        data?.language.organizationPopulation?.value ?? null,
      rodNumber: data?.language.rodNumber?.value
        ? data?.language.rodNumber?.value.toString()
        : null,
    },
  };

  return (
    <div className={classes.root}>
      <EditLanguage
        language={data?.language}
        initialValues={languageFormValues}
        {...updateLanguageState}
      />
      {error ? (
        <Typography variant="h4">Error fetching Language</Typography>
      ) : (
        <>
          <div className={classes.container}>
            <Button
              className={classes.edit}
              size="small"
              variant="contained"
              color="primary"
              onClick={updateLanguage}
              disabled={!data?.language}
            >
              Edit
            </Button>
            <Chip
              variant="outlined"
              icon={<CalendarToday />}
              label={`Created: ${createdAt}`}
            />
          </div>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <div className={classes.leftContent}>
                <Typography variant="h4">
                  {!data?.language ? (
                    <Skeleton width="50%" variant="text" />
                  ) : (
                    name
                  )}
                </Typography>
                <DisplaySimpleProperty
                  label="Ethnologue"
                  value={data?.language?.ethnologueName?.value}
                  loading={!data?.language}
                  loadingWidth="25%"
                />
                <DisplaySimpleProperty
                  LabelProps={{ color: 'textSecondary' }}
                  label="ROD"
                  value={data?.language?.rodNumber?.value}
                  loading={!data?.language}
                  loadingWidth="25%"
                />
                {/* TODO Hard coded sensitivity for now  */}
                <Sensitivity value="High" />
                <DisplaySimpleProperty
                  label="Ethnologue Population"
                  value={numberFormatter(ethnologuePopulation)}
                  loading={!data?.language}
                  loadingWidth="25%"
                />
                <DisplaySimpleProperty
                  label="Organization Population"
                  value={numberFormatter(organizationPopulation)}
                  loading={!data?.language}
                  loadingWidth="25%"
                />
              </div>
              <div className={classes.rightContent}>
                <DisplaySimpleProperty
                  label="Fiscal Year"
                  value={data?.language.beginFiscalYear?.value}
                  loading={!data?.language}
                  ValueProps={{ color: 'primary' }}
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
