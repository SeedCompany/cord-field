import { OpenInFull } from '@mui/icons-material';
import { Box, CardHeader, Stack, Typography } from '@mui/material';
import { ElementType, ReactNode } from 'react';
import { ButtonLink } from '../Routing';

const Spacer = () => <Box sx={{ display: 'flex', flexGrow: 1 }} />;

export interface WidgetHeaderProps {
  title: ReactNode;
  subTitle?: string;
  headerExtension?: ElementType;
  to?: string;
}

export const WidgetHeader = ({
  title,
  subTitle,
  headerExtension,
  to,
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
            <ButtonLink
              to={to}
              sx={{
                height: 34,
                minWidth: 34,
                p: 0,
                backgroundColor: 'background.paper',
              }}
              variant="text"
              size="small"
            >
              <OpenInFull />
            </ButtonLink>
          )}
        </Stack>
      }
    />
  );
};
