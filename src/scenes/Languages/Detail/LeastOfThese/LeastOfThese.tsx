import { Grid } from '@material-ui/core';
import React from 'react';
import { BooleanProperty } from '../../../../components/BooleanProperty';
import { PaperTooltip } from '../../../../components/PaperTooltip';
import { LeastOfTheseFragment } from './LeastOfThese.generated';

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
            <PaperTooltip title={reason} interactive placement="bottom-start">
              {node}
            </PaperTooltip>
          )}
        </Grid>
      )}
    />
  );
};
