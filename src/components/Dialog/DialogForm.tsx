import { useReactiveVar } from '@apollo/client';
import {
  Box,
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from '@mui/material';
import {
  TransitionHandlerProps,
  TransitionProps,
} from '@mui/material/transitions';
import { FormApi } from 'final-form';
import { isFunction, mergeWith } from 'lodash';
import { ReactNode, useCallback, useMemo, useRef } from 'react';
import {
  Form,
  FormProps,
  FormRenderProps,
  RenderableProps,
} from 'react-final-form';
import { Except, Promisable } from 'type-fest';
import { ErrorHandlers, handleFormError, inChangesetVar } from '~/api';
import { callAll } from '~/common';
import { ChangesetModificationWarning } from '../Changeset/ChangesetModificationWarning';
import { AllowFormCloseContext } from '../form/AllowClose';
import {
  blurOnSubmit,
  focusFirstFieldRegistered,
  focusFirstFieldWithSubmitError,
} from '../form/decorators';
import { FieldGroup } from '../form/FieldGroup';
import { SubmitButton, SubmitButtonProps } from '../form/SubmitButton';

export type DialogFormProps<T, R = void> = Omit<
  FormProps<T>,
  'onSubmit' | keyof RenderableProps<any>
> & {
  title?: ReactNode;

  leftAction?: ReactNode;

  submitLabel?: ReactNode | false;
  SubmitProps?: SubmitButtonProps;
  closeLabel?: ReactNode | false;
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

  /**
   * Is this form changeset aware?
   * If it's not and there is a current changeset, we'll show a warning.
   * If it is and there is a current changeset, we'll confirm this is applying there.
   */
  changesetAware?: boolean;
  disableChangesetWarning?: boolean;

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
  DialogProps?: Omit<DialogProps, 'open' | 'onClose'>;
  children?:
    | ReactNode
    | ((props: Except<FormRenderProps<T>, 'handleSubmit'>) => ReactNode);
} & Pick<DialogProps, 'TransitionProps'>;

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
  fieldsPrefix = '',
  children,
  DialogProps,
  onSubmit,
  changesetAware,
  disableChangesetWarning,
  TransitionProps,
  ...FormProps
}: DialogFormProps<T, R>) {
  const inChangeset = useReactiveVar(inChangesetVar);
  const formRef = useRef<FormApi<T> | undefined>();

  const mergedTransitionProps: TransitionProps = useMemo(() => {
    const ourTransitionProps: TransitionHandlerProps = {
      onExited: () => formRef.current?.reset(),
    };
    return mergeWith(
      DialogProps?.TransitionProps,
      TransitionProps,
      ourTransitionProps,
      (a, b) => (isFunction(a) && isFunction(b) ? callAll(a, b) : b)
    );
  }, [DialogProps?.TransitionProps, TransitionProps]);

  const fieldsPreventingClose = useRef(new Set());
  const allowDialogClose = useCallback((key: string, allowed: boolean) => {
    fieldsPreventingClose.current[allowed ? 'delete' : 'add'](key);
  }, []);

  return (
    <Form<T>
      decorators={defaultDecorators}
      {...FormProps}
      onSubmit={async (data, form) => {
        const submitAction = (data as any).submitAction;

        const submitCleanForm =
          sendIfClean === true || (sendIfClean && sendIfClean === submitAction);

        const shouldSubmit = submitCleanForm || form.getState().dirty;

        if (!shouldSubmit) {
          onClose?.('cleanSubmit', form);
          return null;
        }
        try {
          const res = await onSubmit(data, form);
          onSuccess?.(res);
          onClose?.('success', form);
          return null;
        } catch (e) {
          return await handleFormError(e, form, errorHandlers);
        }
      }}
    >
      {({ handleSubmit, submitting, form, ...rest }) => {
        formRef.current = form;
        const renderedForm = (
          <Dialog
            fullWidth
            maxWidth="xs"
            {...DialogProps}
            open={open}
            onClose={(e, reason) => {
              if (submitting || fieldsPreventingClose.current.size > 0) {
                return;
              }
              onClose?.(reason, form);
            }}
            aria-labelledby={title ? 'dialog-form' : undefined}
            PaperProps={{
              ...DialogProps?.PaperProps,
              // @ts-expect-error MUI types don't model this correctly.
              component: 'form',
            }}
            onSubmit={handleSubmit}
            TransitionProps={mergedTransitionProps}
          >
            {title ? <DialogTitle id="dialog-form">{title}</DialogTitle> : null}
            <DialogContent>
              <>
                {inChangeset && !disableChangesetWarning ? (
                  <ChangesetModificationWarning
                    variant={changesetAware ? 'modifying' : 'ignoring'}
                  />
                ) : null}
                {typeof children === 'function'
                  ? children({ form, submitting, ...rest })
                  : children}
              </>
            </DialogContent>
            <DialogActions>
              {leftAction ? (
                <>
                  {leftAction}
                  <Box
                    sx={{
                      flex: 1,
                    }}
                  />
                </>
              ) : null}
              {closeLabel !== false && (
                <Button
                  color="secondary"
                  {...CloseProps}
                  onClick={() => {
                    onClose?.('cancel', form);
                  }}
                  disabled={submitting}
                >
                  {closeLabel || 'Cancel'}
                </Button>
              )}
              {submitLabel !== false && (
                <SubmitButton
                  color="secondary"
                  size="medium"
                  fullWidth={false}
                  disableElevation
                  {...SubmitProps}
                >
                  {submitLabel}
                </SubmitButton>
              )}
            </DialogActions>
          </Dialog>
        );

        return (
          <FieldGroup replace prefix={fieldsPrefix}>
            <AllowFormCloseContext.Provider value={allowDialogClose}>
              {renderedForm}
            </AllowFormCloseContext.Provider>
          </FieldGroup>
        );
      }}
    </Form>
  );
}
DialogForm.defaultDecorators = defaultDecorators;
