import * as XRegExp from 'xregexp';

// Using XRegExp for unicode property support
const hasUppercaseLettersPattern = XRegExp('\\p{Lu}', 'g');

// https://regex101.com/r/63P0Hw (make sure you are viewing the latest version)
const uppercasePattern = XRegExp(
  // Match word-like boundaries
  // \b fails in some cases, so also match start of string, and space before letter
  '(?:^|\\b|\\s)' +
  // Capture uppercase unicode letter or number
  '([\\p{Lu}\\p{N}])',
  'g'
);

// https://regex101.com/r/t2xf5O (make sure you are viewing the latest version)
const lowercasePattern = XRegExp(
  // Match word-like boundaries
  // \b can't be used here has it will match lowercase char after a unicode lowercase char
  // So match some punctuation, start of string, and spaces instead
  `(?:^|'|\\(|-|\\s)` +
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
  // If the string has uppercase characters we use the uppercase pattern which
  // will ignore lowercase characters after word-like boundaries.
  // If the string doesn't have any uppercase characters we fallback to the lowercase pattern
  // which is less ideal but gives something instead of an empty string.
  // See tests for differences in the two patterns.
  const pattern = words.match(hasUppercaseLettersPattern) ? uppercasePattern : lowercasePattern;
  const letters = matchAll(words, pattern).join('');
  return limit === Infinity || limit == null ? letters : letters.substr(0, limit);
}
