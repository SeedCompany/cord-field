import { Box, Stack } from '@mui/material';
import { ChildrenProp, extendSx, StyleProps } from '~/common';
import { ResponsiveDivider } from '../../ResponsiveDivider';

export const ReportInfoContainer = ({
  spaceEvenlyAt,
  horizontalAt,
  children,
  ...rest
}: { spaceEvenlyAt: number; horizontalAt: number } & StyleProps &
  ChildrenProp) => (
  <Box {...rest} sx={[{ containerType: 'inline-size' }, ...extendSx(rest.sx)]}>
    <Stack
      divider={
        <ResponsiveDivider
          vertical={`@container (min-width: ${horizontalAt}px)`}
          className="divider"
        />
      }
      sx={[
        {
          gap: 2,
          textAlign: 'center',
          justifyContent: 'space-evenly',
          [`@container (min-width: ${horizontalAt}px)`]: {
            flexDirection: 'row',
          },
          '& > div:not(.divider)': {
            [`@container (min-width: ${spaceEvenlyAt}px)`]: {
              flex: 1,
            },
          },
        },
        ...extendSx(rest.sx),
      ]}
    >
      {children}
    </Stack>
  </Box>
);
