import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Icon,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { AccessTime } from '@material-ui/icons';
import React from 'react';
import {
  ExplanationForm,
  ExplanationInfo,
} from '../ExplanationForm/ExplanationForm';
import { ExplanationOfVarianceFormFragment } from '../ExplanationForm/ExplanationForm.graphql';

const useStyles = makeStyles(({ spacing }) => ({
  cardHeader: {
    opacity: 0.8,
  },
  cardHeaderText: {
    marginLeft: spacing(0.5),
  },
  editButton: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: spacing(0.5),
  },
  varianceHeader: {
    display: 'flex',
    flexDirection: 'row',
  },
  root: {
    // flex: 1,
    // display: 'flex',
    // flexDirection: 'column',
    // justifyContent: 'space-evenly',
    // width: '100%',
    // height: '100%'
  },
  cardActions: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    width: '100%',
    height: '100%',
  },
  explanationText: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flextStart',
    // position: 'relative',
    // bottom: spacing(2)
  },
  explanationReason: {
    display: 'flex',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    marginRight: spacing(3),
    marginLeft: spacing(3),
  },
}));

interface ProgressExplanationCardProps {
  explanation: ExplanationOfVarianceFormFragment;
}

export const ProgressExplanationCard = ({
  explanation,
}: ProgressExplanationCardProps) => {
  let isEditing = true;

  function setMode(mode: boolean) {
    isEditing = mode;
  }

  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container item sm={12} className={classes.cardHeader}>
          <AccessTime />
          <Typography className={classes.cardHeaderText} variant="h4">
            Progress Status
          </Typography>
        </Grid>
        {isEditing ? (
          <ExplanationForm progressReport={explanation} setState={setMode} />
        ) : (
          <ExplanationInfo progressReport={explanation} setState={setMode} />
        )}
      </CardContent>
    </Card>
  );
};
