import {
  Card,
  CardContent,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { AccessTime, Close, Edit } from '@material-ui/icons';
import { some } from 'lodash';
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
  varianceHeader: {
    display: 'flex',
    flexDirection: 'row',
  },
  editButton: {
    marginLeft: spacing(82),
    marginTop: spacing(-1),
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
  const [isEditing, setIsEdit] = React.useState(
    some(explanation) ? false : true
  );

  function setMode(mode: boolean) {
    setIsEdit(mode);
  }

  const classes = useStyles();
  return (
    <Card>
      <CardContent>
        <Grid container item sm={12} className={classes.cardHeader}>
          <AccessTime />
          <Typography className={classes.cardHeaderText} variant="h4">
            Progress Status
          </Typography>
          <IconButton
            className={classes.editButton}
            onClick={() => {
              setIsEdit(!isEditing);
            }}
          >
            {!isEditing ? (
              <Edit fontSize="inherit" />
            ) : (
              <Close fontSize="inherit" />
            )}
          </IconButton>
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
