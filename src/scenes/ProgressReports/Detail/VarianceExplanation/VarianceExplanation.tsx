import { Typography } from '@mui/material';
import { startCase } from 'lodash';
import { RichTextView } from '~/components/RichText';
import { VarianceExplanationFragment } from './VarianceExplanation.graphql';

export interface VarianceExplanationProps {
  data: VarianceExplanationFragment;
}

export const VarianceExplanation = ({ data }: VarianceExplanationProps) => (
  <>
    {data.scheduleStatus && (
      <Typography variant="h4" gutterBottom>
        {startCase(data.scheduleStatus)}
      </Typography>
    )}

    <Typography>{data.reasons.value[0]}</Typography>

    {data.comments.value && (
      <>
        <Typography variant="h4" mt={2} gutterBottom>
          Comments
        </Typography>
        <RichTextView data={data.comments.value} />
      </>
    )}
  </>
);
