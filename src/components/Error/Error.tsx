import { ApolloError } from '@apollo/client';
import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { isPlainObject } from 'lodash';
import React, { ElementType, isValidElement, ReactNode } from 'react';
import { getErrorInfo } from '~/api';
import { ButtonLink, StatusCode, useNavigate } from '../Routing';
import { ErrorRenderers, renderError } from './error-handling';

const useStyles = makeStyles(({ spacing }) => ({
  page: {
    overflow: 'auto',
    padding: spacing(4, 0, 0, 4),
  },
  header: {
    marginBottom: spacing(4),
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
  children: ReactNode | ErrorRenderers;
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
  const classes = useStyles();
  const navigate = useNavigate();

  if (!(show ?? error)) {
    return null;
  }

  const node =
    isPlainObject(children) && !isValidElement(children)
      ? renderError(error, children as ErrorRenderers)
      : children;
  const rendered =
    typeof node !== 'string' ? (
      node
    ) : (
      <Typography variant="h2">{node}</Typography>
    );

  const statusCode =
    error && getErrorInfo(error).codes.includes('NotFound') ? 404 : 500;

  return (
    <Component className={clsx(page && classes.page)}>
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
