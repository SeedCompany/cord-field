import { AccessTime, Close, Edit } from '@mui/icons-material';
import { Card, CardContent, Grid, IconButton, Typography } from '@mui/material';
import { some } from 'lodash';
import { useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import {
  ExplanationForm,
  ExplanationInfo,
} from '../ExplanationForm/ExplanationForm';
import { ExplanationOfVarianceFormFragment } from '../ExplanationForm/ExplanationForm.graphql';

const useStyles = makeStyles()(({ spacing }) => ({
  cardHeader: {
    opacity: 0.8,
  },
  cardHeaderText: {
    marginLeft: spacing(0.5),
  },
  editButton: {
    marginLeft: spacing(82),
    marginTop: spacing(-1),
  },
}));

interface ProgressExplanationCardProps {
  explanation: ExplanationOfVarianceFormFragment;
}

export const ProgressExplanationCard = ({
  explanation,
}: ProgressExplanationCardProps) => {
  const [isEditing, setIsEdit] = useState(some(explanation) ? false : true);

  function setMode(mode: boolean) {
    setIsEdit(mode);
  }

  const { classes } = useStyles();
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
