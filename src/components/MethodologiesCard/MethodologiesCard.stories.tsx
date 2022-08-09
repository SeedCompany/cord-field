import { Box } from '@mui/material';
import { boolean, text } from '@storybook/addon-knobs';
import { SecuredMethodologies } from '../../api';
import { csv } from '../../util';
import { MethodologiesCard as Card } from './MethodologiesCard';

export default {
  title: 'Components',
};

export const MethodologiesCard = () => {
  const data: SecuredMethodologies = {
    canEdit: boolean('Can Edit', true),
    value: csv(
      text(
        'methodologies',
        ['OtherWritten', 'OtherOralTranslation', 'Film', 'BibleStorying'].join(
          ', '
        )
      )
    ),
    canRead: boolean('Can Read', true),
  };

  return (
    <Box display="flex" width={400}>
      <Card data={boolean('loading', false) ? undefined : data} />
    </Box>
  );
};
