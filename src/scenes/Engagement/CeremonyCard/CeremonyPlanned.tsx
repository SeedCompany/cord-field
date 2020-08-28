import {
  CircularProgress,
  FormControlLabel,
  makeStyles,
  Switch,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { FC } from 'react';
import {
  CeremonyCardFragment,
  useUpdateCeremonyMutation,
} from './CeremonyCard.generated';

const useStyles = makeStyles(() => ({
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
  switchHidden: {
    visibility: 'hidden',
    width: 0,
    padding: 0,
  },
}));

type CeremonyCardProps = Partial<CeremonyCardFragment> & {
  className?: string;
};

export const CeremonyPlanned: FC<CeremonyCardProps> = ({
  canRead: canReadCeremony,
  value: ceremony,
  className,
}) => {
  const { type, planned } = ceremony || {};
  const loading = canReadCeremony == null;
  const canRead = canReadCeremony && planned?.canRead;

  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();
  const [updateCeremony, updateState] = useUpdateCeremonyMutation({
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
        __typename: 'UpdateCeremonyOutput',
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
      className={loading ? classes.loadingWidth : undefined}
    >
      {loading ? <Skeleton width="100%" /> : type}
    </Typography>
  );
  if (canRead) {
    title = (
      <Tooltip
        title={`A ${type?.toLowerCase()} ${
          planned?.value ? 'IS' : 'is NOT'
        } planned`}
      >
        {title}
      </Tooltip>
    );
  }
  return (
    <div className={clsx(classes.root, className)}>
      {loading || !canRead ? (
        <>
          <Switch className={clsx(classes.switch, classes.switchHidden)} />
          {title}
        </>
      ) : (
        <>
          <FormControlLabel
            control={
              <Tooltip title={`Is a ${type?.toLowerCase()} planned?`}>
                <Switch
                  checked={Boolean(planned?.value)}
                  name="planned"
                  color="primary"
                  disabled={!planned?.canEdit}
                  onChange={(_, checked) => onChange(checked)}
                />
              </Tooltip>
            }
            label={title}
            className={classes.switch}
          />
          {updateState.loading ? <CircularProgress size={20} /> : null}
        </>
      )}
    </div>
  );
};
