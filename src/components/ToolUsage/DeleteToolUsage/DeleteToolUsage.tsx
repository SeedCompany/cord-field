import { useMutation } from '@apollo/client';
import { Close } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { IconButton, IconButtonProps } from '../../IconButton';
import { ToolUsageFormFragment } from '../ToolUsageForm/ToolUsageForm.graphql';
import { DeleteToolUsageDocument } from './DeleteToolUsage.graphql';

interface DeleteToolUsageProps extends IconButtonProps {
  toolUsage: ToolUsageFormFragment;
}

export const DeleteToolUsage = ({
  toolUsage,
  ...rest
}: DeleteToolUsageProps) => {
  const [deleteToolUsage] = useMutation(DeleteToolUsageDocument, {
    variables: {
      id: toolUsage.id,
    },
  });

  return (
    <Tooltip title="Delete Tool Usage">
      <IconButton
        color="error"
        {...rest}
        onClick={() => void deleteToolUsage()}
      >
        <Close />
      </IconButton>
    </Tooltip>
  );
};
