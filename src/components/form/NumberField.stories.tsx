import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import { Form } from 'react-final-form';
import { Code } from '../Debug';
import { NumberField } from './NumberField';
import { SubmitButton } from './SubmitButton';
import { max, min } from './validators';

export default { title: 'Components/Forms/Fields' };

export const Number = () => (
  <Form onSubmit={action('submit')}>
    {({ handleSubmit, values }) => {
      const alignRight = boolean('alignRight', true);
      const allowNegative = boolean('allowNegative', true);
      return (
        <form onSubmit={handleSubmit}>
          <NumberField
            name="integer"
            label="Integer"
            autoComplete="off"
            alignRight={alignRight}
            allowNegative={allowNegative}
            validate={[min(5), max(50_000)]}
          />
          <NumberField
            name="decimal"
            label="floating decimal"
            autoComplete="off"
            alignRight={alignRight}
            allowNegative={allowNegative}
            maximumFractionDigits={2}
          />
          <NumberField
            name="fixedDecimal"
            label="fixed decimal"
            autoComplete="off"
            alignRight={alignRight}
            allowNegative={allowNegative}
            minimumFractionDigits={2}
            maximumFractionDigits={2}
          />
          <NumberField
            name="currency"
            label="currency"
            autoComplete="off"
            alignRight={alignRight}
            allowNegative={allowNegative}
            prefix="$"
            minimumFractionDigits={2}
            maximumFractionDigits={2}
          />
          <NumberField
            name="squareMeters"
            label="Square Meters"
            autoComplete="off"
            alignRight={alignRight}
            allowNegative={allowNegative}
            suffix=" m²"
            maximumFractionDigits={1}
          />
          <Code json={values} />
          <SubmitButton />
        </form>
      );
    }}
  </Form>
);
