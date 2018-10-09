import { firstLettersOfWords } from './firstLettersOfWords';

describe('firstLettersOfWords', () => {
  const cases = [
    // uppercase letters
    [`Ma'di South 2`, 'MS2'],
    ['Ruruuli-Runyala', 'RR'],
    ['Ñandeva (Nandeva)', 'ÑN'],
    ['Pame, Northern', 'PN'],
    ['Zapoteco de SBA', 'ZS'],
    ['New-Est Cluster', 'NEC'],
    ['Guina-ang Kalinga', 'GK'],
    [`Fa d'Ambu NT`, 'FAN'],
    ['Aramaic M-South OT', 'AMSO'],
    ['Ḛramaic 2 Ḛouth', 'Ḛ2Ḛ'],
    // lowercase letters
    [`ma'di south 2`, 'mds2'],
    ['ruruuli-runyala', 'rr'],
    ['ñandeva (nandeva)', 'ñn'],
    ['pame, northern', 'pn'],
    ['zapoteco de sba', 'zds'],
    ['new-est cluster', 'nec'],
    ['guina-ang kalinga', 'gak'],
    [`fa d'ambu nt`, 'fdan'],
    ['aramaic m-south ot', 'amso'],
    ['ḛramaic 2 ḛouth', 'ḛ2ḛ']
  ];
  for (const [words, letters] of cases) {
    it(`${words} -> ${letters}`, () => {
      expect(firstLettersOfWords(words, null)).toBe(letters);
    });
  }
});
