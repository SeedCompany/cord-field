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
  subTitle?: string;
  headerExtension?: ElementType;
  to?: string;
  expand?: boolean;
}

export const WidgetHeader = ({
  title,
  subTitle,
  headerExtension,
  to,
  expand,
}: WidgetHeaderProps) => {
  return (
    <CardHeader
      sx={{ px: 2 }}
      title={
        <Stack direction="row" justifyContent="end" alignItems="center">
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <Typography variant="h4">{title}</Typography>
            {subTitle && (
              <Typography variant="caption" sx={{ color: 'grey.500' }}>
                {subTitle}
              </Typography>
            )}
          </Box>
          {headerExtension ? <Box component={headerExtension} /> : <Spacer />}
          {to && (
            <Tooltip title={expand ? 'Minimize Widget' : 'Expand Widget'}>
              <IconButton color="primary" component={Link} to={to}>
                {expand ? <CloseFullscreen /> : <OpenInFull />}
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      }
    />
  );
};
