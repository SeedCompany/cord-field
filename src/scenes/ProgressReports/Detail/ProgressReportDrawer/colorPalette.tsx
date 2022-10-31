interface ColorPalette {
  stepperCard: {
    headerBackground: {
      [key: string]: string;
    };
    iconBackground: {
      [key: string]: string;
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
      FieldPartner: '#E0F7FA',
      Translator: '#FFF3E0',
      ProjectManager: '#F3E5F5',
      Marketing: '#F1F8E9',
    },
    iconBackground: {
      FieldPartner: '#B2EBF2',
      Translator: '#FFE0B2',
      ProjectManager: '#E1BEE7',
      Marketing: '#DCEDC8',
    },
  },
};
