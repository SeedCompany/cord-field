import { useMutation } from '@apollo/client';
import {
  CircularProgress,
  FormControlLabel,
  Skeleton,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { makeStyles } from 'tss-react/mui';
import {
  CeremonyCardFragment,
  UpdateCeremonyDocument,
} from './CeremonyCard.graphql';

const useStyles = makeStyles()(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  loadingWidth: {
    width: '40%',
  },
  switch: {
    paddingLeft: 2,
  },
  flipped: {
    flexDirection: 'row-reverse',
    marginLeft: 0,
    paddingLeft: 0,
  },
  switchHidden: {
    visibility: 'hidden',
    width: 0,
    padding: 0,
  },
}));

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

  const { classes, cx } = useStyles();

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
        __typename: 'CeremonyUpdated' as const,
        ceremony: {
          ...ceremony!,
          planned: {
            ...ceremony!.planned,
            value: input.planned!,
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
          id: ceremony.id,
          planned,
        },
      },
    });
  };

  let title = (
    <Typography
      variant="h4"
      className={loading ? classes.loadingWidth : undefined}
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
    <div className={cx(classes.root, className)}>
      {loading || !canRead ? (
        <>
          <Switch className={cx(classes.switch, classes.switchHidden)} />
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
            className={cx(classes.switch, flipped ? classes.flipped : null)}
          />
          {updateState.loading ? <CircularProgress size={20} /> : null}
        </>
      )}
    </div>
  );
};
