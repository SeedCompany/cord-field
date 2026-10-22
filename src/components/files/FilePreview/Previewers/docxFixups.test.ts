import {
  applyNumberingStartOverrides,
  clearAutoCellShading,
} from './docxFixups';

describe('applyNumberingStartOverrides', () => {
  it('starts a list level where its override says', () => {
    const document = {
      numberingPart: {
        numberings: [
          { id: '6', overrides: [] },
          { id: '8', overrides: [{ level: 0, start: 2 }] },
          { id: '10', overrides: [{ level: 0, start: 3 }] },
        ],
        domNumberings: [
          { id: '6', level: 0, start: 1 },
          { id: '8', level: 0, start: 1 },
          { id: '8', level: 1, start: 1 },
          { id: '10', level: 0, start: 1 },
        ],
      },
    };
    applyNumberingStartOverrides(document);
    expect(document.numberingPart.domNumberings.map((n) => n.start)).toEqual([
      1, 2, 1, 3,
    ]);
  });
});

describe('clearAutoCellShading', () => {
  it('paints auto-shaded cells white inside a shaded table', () => {
    const table = document.createElement('table');
    table.style.backgroundColor = '#d0ddef';
    table.innerHTML =
      '<tr><td style="background-color: #d9d9d9">header</td></tr>' +
      '<tr><td style="background-color: inherit">body</td></tr>';
    clearAutoCellShading([table]);
    const [header, body] = [...table.querySelectorAll('td')];
    expect(header!.style.backgroundColor).toBe('rgb(217, 217, 217)');
    expect(body!.style.backgroundColor).toBe('white');
  });
});
