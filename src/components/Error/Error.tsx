import { ApolloError } from '@apollo/client';
import { Button, Grid, Typography } from '@mui/material';
import { usePrevious } from 'ahooks';
import { isPlainObject } from 'lodash';
import { ElementType, isValidElement, ReactNode, useEffect } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { useLocation } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';
import { getErrorInfo } from '~/api';
import { ButtonLink, StatusCode, useNavigate } from '../Routing';
import { ErrorRenderers, renderError } from './error-handling';

const useStyles = makeStyles()(({ spacing }) => ({
  page: {
    overflow: 'auto',
    padding: spacing(4, 0, 0, 4),
  },
  buttons: {
    marginTop: spacing(3),
  },
}));

export interface ErrorProps {
  /**
   * The error body to display.
   * Strings can be given as a shortcut and converted to appropriate typography.
   *
   * An object can also be given to specify react nodes or render functions for
   * each error code.
   */
  children?: ReactNode | ErrorRenderers;
  /**
   * The error. This is used to determine if component should show
   * and it's given to the children error rendering functions
   */
  error?: ApolloError;
  /** Force rendering on/off instead of being based on error existence */
  show?: boolean;
  /** Style as a complete page (more spacing) */
  page?: boolean;
  /** Turn off back & home buttons */
  disableButtons?: boolean;
  component?: ElementType;
}

/**
 * Display errors.
 *
 * @example
 * <Error error={error}>
 *   {{
 *     NotFound: (e) => <div>Couldn't find it. {e.message}</div>,
 *     Default: 'Something went wrong',
 *   }}
 * </Error>
 */
export const Error = ({
  error,
  children,
  show,
  page,
  disableButtons,
  component: Component = 'div',
}: ErrorProps) => {
  const { classes, cx } = useStyles();
  const navigate = useNavigate();

  useResetErrorOnLocationChange();

  if (!(show ?? error)) {
    return null;
  }

  const node =
    isPlainObject(children) && !isValidElement(children)
      ? renderError(error, children as ErrorRenderers)
      : children ?? 'Something went wrong';

  const rendered =
    typeof node !== 'string' ? (
      node
    ) : (
      <Typography variant="h2">{node}</Typography>
    );

  const statusCode =
    error && getErrorInfo(error).codes.includes('NotFound') ? 404 : 500;

  return (
    <Component className={cx(page && classes.page)}>
      {/* Default status code to be helpful for the most common ones. The
      children can still override this by rendering <StatusCode /> themselves */}
      <StatusCode code={statusCode} />
      <Typography gutterBottom>Oops, Sorry.</Typography>
      {rendered}
      {!disableButtons && (
        <Grid container spacing={3} className={classes.buttons}>
          <Grid item>
            <Button
              onClick={() => navigate(-1)}
              variant="contained"
              color="secondary"
            >
              Back
            </Button>
          </Grid>
          <Grid item>
            <ButtonLink to="/" variant="contained" color="secondary">
              Home
            </ButtonLink>
          </Grid>
        </Grid>
      )}
    </Component>
  );
};

export const useResetErrorOnLocationChange = () => {
  const { resetBoundary } = useErrorBoundary();
  const location = useLocation();
  const prevLocation = usePrevious(location);

  useEffect(() => {
    if (prevLocation && location !== prevLocation) {
      resetBoundary();
    }
  }, [resetBoundary, location, prevLocation]);
};
