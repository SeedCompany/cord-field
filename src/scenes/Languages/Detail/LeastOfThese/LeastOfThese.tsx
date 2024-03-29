import { Grid } from '@mui/material';
import { BooleanProperty } from '../../../../components/BooleanProperty';
import { PaperTooltip } from '../../../../components/PaperTooltip';
import { LeastOfTheseFragment } from './LeastOfThese.graphql';

interface LeastOfTheseProps {
  language?: LeastOfTheseFragment;
}

export const LeastOfThese = ({ language }: LeastOfTheseProps) => {
  const reason = language?.leastOfTheseReason.value;
  return (
    <BooleanProperty
      label="Least of These"
      redacted="You do not have permission to view whether the language is a least of these partnership"
      data={language?.leastOfThese}
      wrap={(node) => (
        <Grid item>
          {!reason ? (
            node
          ) : (
            <PaperTooltip title={reason} placement="bottom-start">
              {node}
            </PaperTooltip>
          )}
        </Grid>
      )}
    />
  );
};
