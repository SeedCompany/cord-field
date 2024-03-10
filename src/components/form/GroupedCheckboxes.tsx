import { CheckboxField } from './CheckboxField';
import { FieldGroup } from './FieldGroup';

export interface FieldData {
  id: string;
  displayName: string;
  [key: string]: any;
}

export const LanguageOfConsultingCheckboxes = ({
  fieldsData,
  labelPlacement,
}: {
  fieldsData: FieldData[];
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
}) => {
  return (
    <div>
      <FieldGroup prefix="languageOfConsultingCheckboxes">
        {fieldsData.map((field) => {
          return (
            <CheckboxField
              key={field.id}
              name={field.id}
              label={field.displayName}
              labelPlacement={labelPlacement}
            />
          );
        })}
      </FieldGroup>
    </div>
  );
};
