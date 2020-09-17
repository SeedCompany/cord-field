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
import {
  Form,
  FormProps,
  FormRenderProps,
  RenderableProps,
} from 'react-final-form';
import { Except, Promisable } from 'type-fest';
import { ErrorHandlers, handleFormError } from '../../api';
import {
  blurOnSubmit,
  FieldGroup,
  focusFirstFieldRegistered,
  focusFirstFieldWithSubmitError,
  SubmitButton,
  SubmitButtonProps,
} from '../form';

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

  /**
   * Optionally call onSubmit even if form is clean,
   * OR, when a string value, if `sendIfClean === data.submitAction`.
   * Else just close dialog.
   */
  sendIfClean?: boolean | string;

  /** A prefix for all form fields */
  fieldsPrefix?: string;

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
  children?:
    | ReactNode
    | ((props: Except<FormRenderProps<T>, 'handleSubmit'>) => ReactNode);
};

const useStyles = makeStyles(() => ({
  spacer: {
    flex: 1,
  },
}));

const defaultDecorators = [
  focusFirstFieldRegistered,
  focusFirstFieldWithSubmitError,
  blurOnSubmit,
];

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
  sendIfClean,
  open,
  onSuccess,
  errorHandlers,
  onClose,
  onExited,
  fieldsPrefix = '',
  children,
  DialogProps = {},
  onSubmit,
  ...FormProps
}: DialogFormProps<T, R>) {
  const classes = useStyles();

  return (
    <Form<T>
      decorators={defaultDecorators}
      {...FormProps}
      onSubmit={async (data, form) => {
        const submitAction = (data as any).submitAction;
        if (
          (!sendIfClean && !form.getState().dirty) ||
          (typeof sendIfClean === 'string' && sendIfClean !== submitAction)
        ) {
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
      {({ handleSubmit, submitting, form, ...rest }) => {
        const renderedForm = (
          <Dialog
            fullWidth
            maxWidth="xs"
            {...DialogProps}
            open={open}
            onClose={(e, reason) => {
              onClose?.(reason, form);
            }}
            onExited={() => {
              onExited?.();
              form.reset();
            }}
            disableBackdropClick={
              DialogProps.disableBackdropClick ?? submitting
            }
            aria-labelledby={title ? 'dialog-form' : undefined}
          >
            <form onSubmit={handleSubmit}>
              {title ? (
                <DialogTitle id="dialog-form">{title}</DialogTitle>
              ) : null}
              <DialogContent>
                {typeof children === 'function'
                  ? children({ form, submitting, ...rest })
                  : children}
              </DialogContent>
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

        return (
          <FieldGroup replace prefix={fieldsPrefix}>
            {renderedForm}
          </FieldGroup>
        );
      }}
    </Form>
  );
}
DialogForm.defaultDecorators = defaultDecorators;
