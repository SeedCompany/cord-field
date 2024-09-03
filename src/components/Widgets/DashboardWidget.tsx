import { OpenInFull } from '@mui/icons-material';
import {
  Box,
  BoxProps,
  Card,
  CardContent,
  CardHeader,
  CardProps,
  Stack,
  Typography,
} from '@mui/material';
import { ChildrenProp, extendSx } from '~/common';
import { Form, SelectField } from '../form';
import { ButtonLink } from '../Routing';

export const Spacer = () => <Box sx={{ display: 'flex', flexGrow: 1 }} />;

export interface DashboardWidgetProps extends ChildrenProp, BoxProps {
  title: string;
  subTitle?: string;
  to?: string;
  cols?: number;
  rows?: number;
  colSpan?: number;
  rowSpan?: number;
  colsAuto?: boolean;
  rowsAuto?: boolean;
  CardProps?: CardProps;
}
export const DashboardWidget = ({
  title,
  subTitle,
  to,
  cols,
  rows,
  colSpan,
  rowSpan,
  sx,
  CardProps = {},
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
        {...CardProps}
        sx={[
          {
            display: 'flex',
            flexDirection: 'column',
            height: 1,
            p: 2,
          },
          ...extendSx(CardProps.sx),
        ]}
      >
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
              <Spacer />
              <Box
                justifyContent="flex-end"
                marginRight={2}
                sx={{ height: 50 }}
              >
                <Form onSubmit={() => null}>
                  <SelectField
                    label="Days"
                    name="days"
                    options={['30', '60', '90']}
                    defaultValue="30"
                    variant="outlined"
                    size="small"
                  />
                </Form>
              </Box>
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
            '&:last-child': {
              paddingBottom: 0,
            },
            p: 0,
            overflowX: 'auto',
            overflowY: 'auto',
            height: 1,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {props.children}
        </CardContent>
      </Card>
    </Box>
  );
};
