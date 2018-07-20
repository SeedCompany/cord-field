import * as XRegExp from 'xregexp';

// https://regex101.com/r/63P0Hw (make sure you are viewing the latest version)
// Using XRegExp for unicode property support
const lettersPattern = XRegExp(
  // Match word boundary - \b fails in some cases, so also match start of string, and space before letter
  '(?:^|\\b|\\s)' +
  // Capture uppercase unicode letter or number
  '([\\p{Lu}\\p{N}])',
  'g'
);

function matchAll(str: string, pattern: RegExp, captureGroup = 1): string[] {
  const output = [];

  let match;
  while (match = pattern.exec(str)) {
    output.push(match[captureGroup]);
  }

  return output;
}

export function firstLettersOfWords(words: string, limit: number | null = 3): string {
  const letters = matchAll(words, lettersPattern).join('');
  return limit === Infinity || limit == null ? letters : letters.substr(0, limit);
}
