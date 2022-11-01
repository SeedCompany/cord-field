import {
  Check,
  IndeterminateCheckBox,
  NotInterested,
} from '@mui/icons-material';
import { Box, Skeleton, Typography } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { Redacted } from '../../../../components/Redacted';
import { Link } from '../../../../components/Routing';
import { FirstScriptureFragment } from './FirstScripture.graphql';

const root = {
  display: 'flex',
  alignItems: 'center',
};

const iconStyle = (theme: Theme) => {
  return {
    marginRight: theme.spacing(1),
  };
};

export const FirstScripture = ({ data }: { data?: FirstScriptureFragment }) => {
  if (!data) {
    return (
      <Box sx={root}>
        <Skeleton variant="circular" width={24} height={24} sx={iconStyle} />
        <Skeleton width={300} />
      </Box>
    );
  }

  if (!data.firstScripture.canRead) {
    return (
      <Box sx={root}>
        <IndeterminateCheckBox sx={iconStyle} />
        <Redacted
          info="You cannot view whether this language has first Scripture"
          width={300}
        />
      </Box>
    );
  }

  const scripture = data.firstScripture.value;

  if (!scripture?.hasFirst) {
    return (
      <Box sx={root}>
        <NotInterested sx={iconStyle} />
        <Typography>No Scripture yet</Typography>
      </Box>
    );
  }

  if (scripture.__typename === 'ExternalFirstScripture') {
    return (
      <Box sx={root}>
        <Check color="primary" sx={iconStyle} />
        <Typography>
          First Scripture was completed outside of Seed Company
        </Typography>
      </Box>
    );
  }

  if (scripture.__typename !== 'InternalFirstScripture') {
    return null; // Shouldn't ever happen, unless other types are added
  }

  const project = scripture.engagement.project;
  return (
    <Box sx={root}>
      <Check color="primary" sx={iconStyle} />
      <Typography
        sx={{
          display: 'flex',
        }}
      >
        First Scripture:&nbsp;&nbsp;
        <Link
          to={`/engagements/${scripture.engagement.id}`}
          underline={project.name.canRead ? undefined : 'none'}
        >
          {project.name.canRead ? (
            project.name.value
          ) : (
            <Redacted info="You cannot view the project's name" width={200} />
          )}
        </Link>
      </Typography>
    </Box>
  );
};
