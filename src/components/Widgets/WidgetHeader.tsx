import { CloseFullscreen, OpenInFull } from '@mui/icons-material';
import {
  Box,
  CardHeader,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { ElementType, ReactNode } from 'react';
import { Link } from '../Routing';

const Spacer = () => <Box sx={{ display: 'flex', flexGrow: 1 }} />;

export interface WidgetHeaderProps {
  title: ReactNode;
  subTitle?: ReactNode;
  headerExtension?: ElementType;
  to?: string;
  expanded?: boolean;
}

export const WidgetHeader = ({
  title,
  subTitle,
  headerExtension,
  to,
  expanded,
}: WidgetHeaderProps) => (
  <CardHeader
    sx={{ p: 1, pl: 2 }}
    title={
      <Stack direction="row" justifyContent="end" alignItems="center">
        <Stack sx={{ flex: 1 }}>
          <Typography variant="h4">{title}</Typography>
          {subTitle && (
            <Typography variant="caption" sx={{ color: 'grey.500' }}>
              {subTitle}
            </Typography>
          )}
        </Stack>
        {headerExtension ? <Box component={headerExtension} /> : <Spacer />}
        {to && (
          <Tooltip title={expanded ? 'Collapse Widget' : 'Expand Widget'}>
            <IconButton color="primary" component={Link} to={to}>
              {expanded ? <CloseFullscreen /> : <OpenInFull />}
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    }
  />
);
