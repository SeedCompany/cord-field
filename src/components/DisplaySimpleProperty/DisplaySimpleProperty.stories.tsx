import { boolean, select, text } from '@storybook/addon-knobs';
import { DisplaySimpleProperty as DSP } from './DisplaySimpleProperty';

export default {
  title: 'Components/Property',
};

export const Property = () => (
  <>
    <DSP
      label={text('Label', 'Proper Property')}
      LabelProps={{
        color: select(
          'Label Color',
          [
            'initial',
            'inherit',
            'primary',
            'secondary',
            'textPrimary',
            'textSecondary',
            'error',
          ],
          'initial'
        ),
      }}
      value={text('Value', 'Valued Value')}
      ValueProps={{
        color: select(
          'Value Color',
          [
            'initial',
            'inherit',
            'primary',
            'secondary',
            'textPrimary',
            'textSecondary',
            'error',
          ],
          'textSecondary'
        ),
      }}
      loading={boolean('Loading', false)}
      loadingWidth={select(
        'Loading Width',
        ['5%', '10%', '15%', '20%', '25%', '30%'],
        '10%'
      )}
    />
    <br></br>
    <br></br>
    <a href="https://material-ui.com/api/typography/">MUI Docs</a>
  </>
);
