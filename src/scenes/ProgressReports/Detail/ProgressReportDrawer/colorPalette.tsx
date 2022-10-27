import { PromptVariant } from '../../ProgressReportContext';

interface ColorPalette {
  stepperCard: {
    headerBackground: {
      [key in PromptVariant]: string;
    };
    iconBackground: {
      [key in PromptVariant]: string;
    };
  };
  header: {
    [key: string]: string;
  };
}

export const colorPalette: ColorPalette = {
  header: {
    border: '#D1DADF',
  },
  stepperCard: {
    headerBackground: {
      Partner: '#E0F7FA',
      Translation: '#FFF3E0',
      'FPM Notes': '#F3E5F5',
      'Communications Edit': '#F1F8E9',
    },
    iconBackground: {
      Partner: '#B2EBF2',
      Translation: '#FFE0B2',
      'FPM Notes': '#E1BEE7',
      'Communications Edit': '#DCEDC8',
    },
  },
};
