import { FormApi } from 'final-form';
import {
  Form as FinalForm,
  FormProps as FinalFormProps,
} from 'react-final-form';
import { Promisable } from 'type-fest';
import { ErrorHandlers, handleFormError } from '../../api';
import {
  AutoSubmit,
  AutoSubmitOptions,
  AutoSubmitOptionsContext,
  defaultAutoSubmitOptions,
} from './AutoSubmit';
import { FieldGroup } from './FieldGroup';

export interface FormProps<
  FormValues = Record<string, any>,
  InitialFormValues = Partial<FormValues>,
  SubmitResult = void
> extends Omit<FinalFormProps<FormValues, InitialFormValues>, 'onSubmit'> {
  /**
   * Optionally call onSubmit even if the form is clean,
   * OR, when a string value, if `sendIfClean === data.submitAction`.
   * Else just close dialog.
   */
  sendIfClean?: boolean | string;

  /** A prefix for all form fields */
  fieldsPrefix?: string;

  /**
   * A bit different from Final Form's onSubmit.
   * The function should throw errors instead of returning them,
   * and should return the result passed to onSuccess callback.
   */
  onSubmit: (
    values: FormValues,
    form: FormApi<FormValues, InitialFormValues>
  ) => Promisable<SubmitResult>;

  /**
   * After the form submits successfully it calls this with the result.
   */
  onSuccess?: (
    result: SubmitResult,
    form: FormApi<FormValues, InitialFormValues>
  ) => void;

  /**
   * Called when the form is submitted but its values are clean.
   */
  onCleanSubmit?: (form: FormApi<FormValues, InitialFormValues>) => void;

  /** Error handlers for errors thrown from onSubmit callback */
  errorHandlers?: ErrorHandlers;

  autoSubmit?: AutoSubmitOptions | boolean;
}

export function Form<
  FormValues = Record<string, any>,
  InitialFormValues = Partial<FormValues>,
  SubmitResult = void
>({
  fieldsPrefix = '',
  sendIfClean,
  onSubmit,
  onSuccess,
  onCleanSubmit,
  errorHandlers,
  children,
  autoSubmit: autoSubmitProp,
  ...props
}: FormProps<FormValues, InitialFormValues, SubmitResult>) {
  const autoSubmitOptions = !autoSubmitProp
    ? undefined
    : autoSubmitProp === true
    ? defaultAutoSubmitOptions
    : autoSubmitProp;

  return (
    <FinalForm<FormValues, InitialFormValues>
      {...props}
      onSubmit={async (data, form) => {
        const submitAction = (data as any).submitAction;

        const submitCleanForm =
          sendIfClean === true || (sendIfClean && sendIfClean === submitAction);

        const shouldSubmit = submitCleanForm || form.getState().dirty;

        if (!shouldSubmit) {
          onCleanSubmit?.(form);
          return null;
        }
        try {
          const res = await onSubmit(data, form);
          onSuccess?.(res, form);
          return null;
        } catch (e) {
          return await handleFormError(e, form, errorHandlers);
        }
      }}
    >
      {(renderProps) => {
        let renderedForm =
          typeof children === 'function' ? children(renderProps) : children;
        renderedForm = autoSubmitOptions ? (
          <AutoSubmitOptionsContext.Provider value={autoSubmitOptions}>
            {renderedForm}
          </AutoSubmitOptionsContext.Provider>
        ) : (
          renderedForm
        );

        return (
          <FieldGroup replace prefix={fieldsPrefix}>
            {autoSubmitOptions && <AutoSubmit {...autoSubmitOptions} />}
            {renderedForm}
          </FieldGroup>
        );
      }}
    </FinalForm>
  );
}
