import {
  Card,
  CardActionArea,
  CardContent,
  Fab,
  Grid,
  Icon,
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import { Many } from 'lodash';
import { relative } from 'path';
import React, { ReactNode } from 'react';
import { ProgressVarianceReasonLabels } from '~/api';
import { displayGroupOfVarianceReason, labelsFrom } from '~/common';
import { useDialog } from '~/components/Dialog';
import {
  EditableExplanationField,
  ExplanationForm,
} from '../ExplanationForm/ExplanationForm';
import { ExplanationOfVarianceFormFragment } from '../ExplanationForm/ExplanationForm.graphql';
import { ProgressSummaryFragment } from './ProgressReportDetail.graphql';

const useStyles = makeStyles(({ spacing }) => ({
  editButton: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: spacing(.5)
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
    height: '100%'
  },
  explanationText: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flextStart'
    // position: 'relative',
    // bottom: spacing(2)
  },
  explanationReason: {
    display: 'flex',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    marginRight: spacing(3),
    marginLeft: spacing(3)
  }
}));

interface ProgressExplanationCardProps {
  explanation: ExplanationOfVarianceFormFragment | null;
}

export const ProgressExplanationCard = ({
  explanation,
}: ProgressExplanationCardProps) => {
  const [editExplanationState, editExplanation] =
    useDialog<Many<EditableExplanationField>>();
    const classes = useStyles();
  return (
    <Card className={classes.root}>
        <CardActionArea onClick={() => editExplanation('varianceReasons')} className={classes.cardActions}>
          <div className={classes.varianceHeader}>
          
          <Typography variant="h3" color='textSecondary'>Variance Reasons & Explanation</Typography>
          <Tooltip title="Update variance explanation and reasons">
              <Icon
                onClick={() => editExplanation('varianceReasons')}
                className={classes.editButton}
              >
                <Edit fontSize='small'/>
              </Icon>
            </Tooltip>
            </div>
          <Typography
            variant="h4"
            className={classes.explanationReason}
            color={
              explanation?.varianceReasons.value?.length === 0
                ? 'textSecondary'
                : 'textPrimary'
            }
          >
            {explanation?.varianceReasons.value ? (
              <>{`${
                explanation.varianceReasons.value.length > 0
                  ? displayGroupOfVarianceReason(
                      explanation.varianceReasons.value
                    ) + ': ' + labelsFrom(ProgressVarianceReasonLabels)(explanation.varianceReasons.value)
                  : 'N/A'
              }`}</>
            ) : (
              <>N/A</>
            )}
            
          </Typography>

          <Typography variant='body2' className={classes.explanationText}>{explanation?.varianceExplanation.value ?? 'No explanation given'}</Typography>
        </CardActionArea>
        {explanation && (<ExplanationForm
              progressReport={explanation}
              {...editExplanationState}
            />)}
    </Card>
  );
};
