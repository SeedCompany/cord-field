import { firstLettersOfWords } from './firstLettersOfWords';

describe('firstLettersOfWords', () => {
  const cases = [
    [`Ma'di South 2`, 'MS2'],
    ['Ruruuli-Runyala', 'RR'],
    ['Ñandeva (Nandeva)', 'ÑN'],
    ['Pame, Northern', 'PN'],
    ['Zapoteco de SBA', 'ZS'],
    ['New-Est Cluster', 'NEC'],
    ['Guina-ang Kalinga', 'GK'],
    [`Fa d'Ambu NT`, 'FAN'],
    ['Aramaic M-South OT', 'AMSO'],
    ['Ḛramaic 2 Ḛouth', 'Ḛ2Ḛ']
  ];
  for (const [words, letters] of cases) {
    it(`${words} -> ${letters}`, () => {
      expect(firstLettersOfWords(words, null)).toBe(letters);
    });
  }
});
