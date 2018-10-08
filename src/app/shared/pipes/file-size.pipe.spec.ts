import { FileSizePipe } from './file-size.pipe';

describe('FileSizePipe', () => {

  const pipe = new FileSizePipe();

  const sizes: Array<[number, string]> = [
    [0, '0 Bytes'],
    [123, '123 Bytes'],
    [123_443, '121 KB'],
    [123_443_000, '118 MB'],
    [123_443_000_000, '115 GB'],
    [123_443_000_000_000, '112 TB'],
    [123_443_000_000_000_000, '110 PB']
  ];
  for (const [raw, formatted] of sizes) {
    it(`${raw} => ${formatted}`, () => {
      expect(pipe.transform(raw)).toEqual(formatted);
    });
  }
});
