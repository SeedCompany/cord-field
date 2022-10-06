import { useMutation } from '@apollo/client';
import {
  Box,
  CircularProgress,
  FormControlLabel,
  Skeleton,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import {
  CeremonyCardFragment,
  UpdateCeremonyDocument,
} from './CeremonyCard.graphql';

type CeremonyCardProps = Partial<CeremonyCardFragment> & {
  className?: string;
  flipped?: boolean;
};

export const CeremonyPlanned = ({
  canRead: canReadCeremony,
  value: ceremony,
  className,
  flipped,
}: CeremonyCardProps) => {
  const { type, planned } = ceremony || {};
  const loading = canReadCeremony == null;
  const canRead = canReadCeremony && planned?.canRead;

  const { enqueueSnackbar } = useSnackbar();
  const [updateCeremony, updateState] = useMutation(UpdateCeremonyDocument, {
    onError: () => {
      enqueueSnackbar(`Failed to update ${type?.toLowerCase()}`, {
        key: `ceremony-planned-update-${ceremony?.id}`,
        preventDuplicate: true,
        variant: 'error',
        autoHideDuration: 3000,
      });
    },
    optimisticResponse: ({ input }) => ({
      __typename: 'Mutation',
      updateCeremony: {
        __typename: 'UpdateCeremonyOutput' as const,
        ceremony: {
          ...ceremony!,
          planned: {
            ...ceremony!.planned,
            value: input.ceremony.planned!,
          },
        },
      },
    }),
  });

  const onChange = (planned: boolean) => {
    if (!ceremony?.id || updateState.loading) {
      return;
    }
    void updateCeremony({
      variables: {
        input: {
          ceremony: {
            id: ceremony.id,
            planned,
          },
        },
      },
    });
  };

  let title = (
    <Typography
      variant="h4"
      sx={
        loading
          ? {
              width: '40%',
            }
          : undefined
      }
    >
      {loading ? <Skeleton width="100%" /> : type}
    </Typography>
  );
  if (canRead) {
    title = (
      <Tooltip
        title={`A ${type?.toLowerCase()} ${
          planned.value ? 'IS' : 'is NOT'
        } planned`}
      >
        {title}
      </Tooltip>
    );
  }
  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {loading || !canRead ? (
        <>
          <Switch
            sx={[
              {
                paddingLeft: 2,
              },
              {
                visibility: 'hidden',
                width: 0,
                padding: 0,
              },
            ]}
          />
          {title}
        </>
      ) : (
        <>
          <FormControlLabel
            control={
              <Tooltip title={`Is a ${type?.toLowerCase()} planned?`}>
                <Switch
                  checked={Boolean(planned.value)}
                  name="planned"
                  color="primary"
                  disabled={!planned.canEdit}
                  onChange={(_, checked) => onChange(checked)}
                />
              </Tooltip>
            }
            label={title}
            sx={[
              {
                paddingLeft: 2,
              },
              flipped
                ? {
                    flexDirection: 'row-reverse',
                    marginLeft: 0,
                    paddingLeft: 0,
                  }
                : null,
            ]}
          />
          {updateState.loading ? <CircularProgress size={20} /> : null}
        </>
      )}
    </Box>
  );
};
