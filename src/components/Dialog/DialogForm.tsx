import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';
import { FormApi } from 'final-form';
import React, { ReactNode } from 'react';
import { Form, FormProps, RenderableProps } from 'react-final-form';
import { Promisable } from 'type-fest';
import { ErrorHandlers, handleFormError } from '../../api';
import { sleep } from '../../util';
import { SubmitButton, SubmitButtonProps } from '../form';

export type DialogFormProps<T, R = void> = Omit<
  FormProps<T>,
  'onSubmit' | keyof RenderableProps<any>
> & {
  title?: ReactNode;

  leftAction?: ReactNode;

  submitLabel?: ReactNode;
  SubmitProps?: SubmitButtonProps;
  closeLabel?: ReactNode;
  CloseProps?: ButtonProps;

  /** Only call onSubmit if form is dirty, else just close dialog. */
  onlyDirtySubmit?: boolean;

  /**
   * A bit different than Final Form's onSubmit.
   * The function should throw errors instead of returning them,
   * and should return the result passed to onSuccess callback.
   */
  onSubmit: (values: T, form: FormApi<T>) => Promisable<R>;

  /**
   * After the form submits successfully it calls this with the result.
   */
  onSuccess?: (result: R) => void;

  /** Error handlers for errors thrown from onSubmit callback */
  errorHandlers?: ErrorHandlers;

  open: boolean;
  onClose?: (
    reason:
      | 'backdropClick'
      | 'escapeKeyDown'
      | 'cancel'
      | 'cleanSubmit'
      | 'success',
    form: FormApi<T>
  ) => void;
  onExited?: () => void;
  DialogProps?: Omit<DialogProps, 'open' | 'onClose' | 'onExited'>;
  children?: ReactNode;
};

const useStyles = makeStyles(() => ({
  spacer: {
    flex: 1,
  },
}));

/**
 * An opinionated component to handle dialog forms.
 */
export function DialogForm<T, R = void>({
  title,
  leftAction,
  submitLabel,
  SubmitProps,
  closeLabel,
  CloseProps,
  onlyDirtySubmit,
  open,
  onSuccess,
  errorHandlers,
  onClose,
  onExited,
  children,
  DialogProps = {},
  onSubmit,
  ...FormProps
}: DialogFormProps<T, R>) {
  const classes = useStyles();

  return (
    <Form<T>
      {...FormProps}
      onSubmit={async (data, form) => {
        if (onlyDirtySubmit && !form.getState().dirty) {
          onClose?.('cleanSubmit', form);
          return null;
        }
        try {
          const res = await onSubmit(data, form);
          onSuccess?.(res);
          onClose?.('success', form);
          return null;
        } catch (e) {
          return await handleFormError(e, errorHandlers);
        }
      }}
    >
      {({ handleSubmit, submitting, form }) => {
        // wait for UI to hide
        const reset = () => sleep(500).then(() => form.reset());
        return (
          <Dialog
            {...DialogProps}
            open={open}
            onClose={(e, reason) => {
              reset();
              onClose?.(reason, form);
            }}
            onExited={onExited}
            disableBackdropClick={
              DialogProps.disableBackdropClick ?? submitting
            }
            aria-labelledby={title ? 'dialog-form' : undefined}
          >
            <form onSubmit={handleSubmit}>
              {title ? (
                <DialogTitle id="dialog-form">{title}</DialogTitle>
              ) : null}
              <DialogContent>{children}</DialogContent>
              <DialogActions>
                {leftAction ? (
                  <>
                    {leftAction}
                    <div className={classes.spacer} />
                  </>
                ) : null}
                <Button
                  color="secondary"
                  {...CloseProps}
                  onClick={() => {
                    reset();
                    onClose?.('cancel', form);
                  }}
                >
                  {closeLabel || 'Cancel'}
                </Button>
                <SubmitButton
                  color="secondary"
                  size="medium"
                  fullWidth={false}
                  disableElevation
                  {...SubmitProps}
                >
                  {submitLabel}
                </SubmitButton>
              </DialogActions>
            </form>
          </Dialog>
        );
      }}
    </Form>
  );
}
