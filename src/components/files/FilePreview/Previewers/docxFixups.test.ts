import {
  applyNumberingStartOverrides,
  clearAutoCellShading,
  formatNumbersLikeText,
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

describe('formatNumbersLikeText', () => {
  it('gives list numbers the typography of their paragraph style', () => {
    const styles = document.createElement('style');
    styles.textContent =
      ".docx span {\r\n  font-family: 'Times New Roman';\r\n  border: none;}\r\n" +
      'p.docx_listparagraph span {\r\n  font-family: Calibri;\r\n  color: #636466;\r\n  min-height: 11.00pt;\r\n  font-size: 11.00pt;}\r\n';
    const numberingComment = document.createComment(
      'docxjs document numbering styles'
    );
    const numbering = document.createElement('style');
    numbering.textContent = 'p.docx-num-6-0:before { content: counter(x); }';
    const nodes: Node[] = [styles, numberingComment, numbering];

    formatNumbersLikeText(nodes);

    expect(nodes).toHaveLength(4);
    const companion = nodes[1] as HTMLStyleElement;
    expect(companion.nodeName).toBe('STYLE');
    expect(companion.textContent).toBe(
      ".docx p:before { font-family: 'Times New Roman'; }\n" +
        'p.docx_listparagraph:before { font-family: Calibri; color: #636466; font-size: 11.00pt; }'
    );
    expect(nodes[2]).toBe(numberingComment);
  });
});
