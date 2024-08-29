import { OpenInFull } from '@mui/icons-material';
import {
  Box,
  BoxProps,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from '@mui/material';
import { ChildrenProp, extendSx } from '~/common';
import { ButtonLink } from '../Routing';

export const Spacer = () => <Box sx={{ display: 'flex', flexGrow: 1 }} />;

export interface DashboardWidgetProps extends ChildrenProp, BoxProps {
  title: string;
  to?: string;
  cols?: number;
  rows?: number;
  colSpan?: number;
  rowSpan?: number;
  colsAuto?: boolean;
  rowsAuto?: boolean;
}
export const DashboardWidget = ({
  title,
  to,
  cols,
  rows,
  colSpan,
  rowSpan,
  sx,
  ...props
}: DashboardWidgetProps) => {
  return (
    <Box
      {...props}
      sx={[
        {
          display: 'grid',
          flexGrow: 1,
          gridColumn: colSpan ? `span ${colSpan}` : cols,
          gridRow: rowSpan ? `span ${rowSpan}` : rows,
        },
        ...extendSx(sx),
      ]}
    >
      <Card
        elevation={0}
        variant="outlined"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 1,
          p: 2,
          pt: 0,
        }}
      >
        <CardHeader
          sx={{ px: 0 }}
          title={
            <Stack
              direction="row"
              borderBottom={1}
              justifyContent="end"
              paddingBottom={1}
            >
              <Typography variant="h4">{title}</Typography>
              <Spacer />
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
        <CardContent
          sx={{
            p: 0,
            overflowX: 'auto',
            overflowY: 'auto',
            height: 1,
            display: 'flex',
          }}
        >
          {props.children}
        </CardContent>
      </Card>
    </Box>
  );
};
