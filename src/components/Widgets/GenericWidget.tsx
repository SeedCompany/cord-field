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
import { ElementType, forwardRef, ReactNode } from 'react';
import { ChildrenProp, extendSx } from '~/common';
import { ButtonLink } from '../Routing';

export const Spacer = () => <Box sx={{ display: 'flex', flexGrow: 1 }} />;

export interface WidgetSlots {
  title: ReactNode;
  subTitle?: string;
  headerExtension?: ElementType;
}

export interface GenericWidgetProps extends ChildrenProp, BoxProps {
  to?: string;
  cols?: number;
  rows?: number;
  colSpan?: number;
  rowSpan?: number;
  colsAuto?: boolean;
  rowsAuto?: boolean;
  slots?: WidgetSlots;
  CardProps?: CardProps;
}
const GenericWidgetComponent = forwardRef<HTMLDivElement, any>(
  (
    {
      to,
      cols,
      rows,
      colSpan,
      rowSpan,
      sx,
      CardProps = {},
      slots,
      ...props
    }: GenericWidgetProps,
    ref
  ) => {
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
                  <Typography variant="h4">{slots?.title}</Typography>
                  {slots?.subTitle && (
                    <Typography variant="caption" sx={{ color: 'grey.500' }}>
                      {slots.subTitle}
                    </Typography>
                  )}
                </Box>
                {slots?.headerExtension ? (
                  <Box component={slots.headerExtension} />
                ) : (
                  <Spacer />
                )}
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
            ref={ref}
          >
            {props.children}
          </CardContent>
        </Card>
      </Box>
    );
  }
);
GenericWidgetComponent.displayName = 'GenericWidget';

export const GenericWidget = GenericWidgetComponent;
