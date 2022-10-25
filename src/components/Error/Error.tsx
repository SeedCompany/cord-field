import { ApolloError } from '@apollo/client';
import { Box, Button, Grid, Typography } from '@mui/material';
import { isPlainObject } from 'lodash';
import { ElementType, isValidElement, ReactNode } from 'react';
import { getErrorInfo } from '~/api';
import { ButtonLink, StatusCode, useNavigate } from '../Routing';
import { ErrorRenderers, renderError } from './error-handling';

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
  disableButtons,
  page,
  component: Component = 'div',
}: ErrorProps) => {
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
    <Box
      component={Component}
      sx={[!!page && { overflow: 'auto', pt: 4, pl: 4 }]}
    >
      <>
        {/* Default status code to be helpful for the most common ones. The
      children can still override this by rendering <StatusCode /> themselves */}
        <StatusCode code={statusCode} />
        <Typography gutterBottom>Oops, Sorry.</Typography>
        {rendered}
        {!disableButtons && (
          <Grid
            container
            spacing={3}
            sx={{
              marginTop: 3,
            }}
          >
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
      </>
    </Box>
  );
};
