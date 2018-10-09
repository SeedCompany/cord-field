import * as XRegExp from 'xregexp';

// Using XRegExp for unicode property support
const hasUppercaseLettersPattern = XRegExp('\\p{Lu}', 'g');

// https://regex101.com/r/63P0Hw (make sure you are viewing the latest version)
const uppercasePattern = XRegExp(
  // Match word boundary - \b fails in some cases, so also match start of string, and space before letter
  '(?:^|\\b|\\s)' +
  // Capture uppercase unicode letter or number
  '([\\p{Lu}\\p{N}])',
  'g'
);

const lowercasePattern = XRegExp(
  // Match word boundary - \b fails in some cases, so also match start of string, and space before letter
  '(?:^|\\b|\\s)' +
  // Capture lower case unicode letter or number
  '([\\p{Ll}\\p{N}])',
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
  const pattern = words.match(hasUppercaseLettersPattern) ? uppercasePattern : lowercasePattern;
  const letters = matchAll(words, pattern).join('');
  return limit === Infinity || limit == null ? letters : letters.substr(0, limit);
}
