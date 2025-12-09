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
import { mergeWith } from 'lodash';
import { ReactNode, useCallback, useMemo, useRef } from 'react';
import { FormRenderProps, RenderableProps } from 'react-final-form';
import { Except } from 'type-fest';
import { inChangesetVar } from '~/api';
import { callAll } from '~/common';
import { ChangesetModificationWarning } from '../Changeset/ChangesetModificationWarning';
import {
  blurOnSubmit,
  focusFirstFieldRegistered,
  focusFirstFieldWithSubmitError,
  Form,
  FormProps,
  SubmitButton,
  SubmitButtonProps,
} from '../form';
import { AllowFormCloseContext } from '../form/AllowClose';

export type DialogFormProps<T, R = void> = Omit<
  FormProps<T, Partial<T>, R>,
  keyof RenderableProps<any>
> & {
  title?: ReactNode;

  leftAction?: ReactNode;

  submitLabel?: ReactNode | false;
  SubmitProps?: SubmitButtonProps;
  closeLabel?: ReactNode | false;
  CloseProps?: ButtonProps;

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
  open,
  onClose,
  children,
  DialogProps,
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
      (a, b) =>
        typeof a === 'function' && typeof b === 'function' ? callAll(a, b) : b
    );
  }, [DialogProps?.TransitionProps, TransitionProps]);

  const fieldsPreventingClose = useRef(new Set());
  const allowDialogClose = useCallback((key: string, allowed: boolean) => {
    fieldsPreventingClose.current[allowed ? 'delete' : 'add'](key);
  }, []);

  return (
    <Form<T, Partial<T>, R>
      decorators={defaultDecorators}
      {...FormProps}
      onCleanSubmit={(form) => {
        onClose?.('cleanSubmit', form);
        FormProps.onCleanSubmit?.(form);
      }}
      onSuccess={(res, form) => {
        onClose?.('success', form);
        FormProps.onSuccess?.(res, form);
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
                  <Box sx={{ flex: 1 }} />
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
          <AllowFormCloseContext.Provider value={allowDialogClose}>
            {renderedForm}
          </AllowFormCloseContext.Provider>
        );
      }}
    </Form>
  );
}
DialogForm.defaultDecorators = defaultDecorators;
