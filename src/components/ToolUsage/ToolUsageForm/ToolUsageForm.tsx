import { CalendarDateOrISO } from '~/common';
import { DialogForm, DialogFormProps } from '../../Dialog/DialogForm';
import { DateField, SecuredField, SubmitError } from '../../form';
import { ToolField, ToolLookupItem } from '../../form/Lookup';
import { ToolUsageFormFragment } from './ToolUsageForm.graphql';

// For creating new tool usage
export interface CreateToolUsageFormValues {
  toolUsage: {
    startDate?: CalendarDateOrISO | null;
    toolLookupItem: ToolLookupItem;
  };
}

// For editing existing tool usage
export interface EditToolUsageFormValues {
  toolUsage: {
    id: string;
    startDate?: CalendarDateOrISO | null;
  };
}

// Union type for form values
export type ToolUsageFormValues =
  | CreateToolUsageFormValues
  | EditToolUsageFormValues;

export type ToolUsageFormProps<
  T extends ToolUsageFormValues,
  R = void
> = DialogFormProps<T, R> & {
  toolUsage?: ToolUsageFormFragment;
  dateFieldKey?: number; // For resetting DateField after successful submission
  getOptionDisabled?: (tool: ToolLookupItem) => boolean; // For disabling already used tools
};

export const ToolUsageForm = <T extends ToolUsageFormValues, R = void>({
  toolUsage,
  dateFieldKey,
  getOptionDisabled,
  children,
  ...rest
}: ToolUsageFormProps<T, R>) => {
  const isEditing = !!toolUsage;

  return (
    <DialogForm {...rest} fieldsPrefix="toolUsage">
      {(formProps) => (
        <>
          {typeof children === 'function' ? children(formProps) : children}
          <SubmitError />

          {!isEditing && (
            <ToolField
              name="toolLookupItem"
              label="Tool"
              required
              getOptionDisabled={getOptionDisabled}
            />
          )}

          {isEditing ? (
            <SecuredField obj={toolUsage} name="startDate">
              {(props) => (
                <DateField
                  {...props}
                  label="Start Date"
                  helperText="When this tool usage begins"
                />
              )}
            </SecuredField>
          ) : (
            <DateField
              key={dateFieldKey}
              name="startDate"
              label="Start Date"
              helperText="When this tool usage begins"
            />
          )}
        </>
      )}
    </DialogForm>
  );
};
