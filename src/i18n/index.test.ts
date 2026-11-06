import { describe, expect, it } from 'vitest';
import { getLanguageCode } from './index';

describe('getLanguageCode', () => {
  it('uses the base language for regional browser language codes', () => {
    expect(getLanguageCode('en-US')).toBe('en');
    expect(getLanguageCode('ar-SA')).toBe('ar');
  });

  it('defaults to English when the language is unsupported', () => {
    expect(getLanguageCode('xx-YY')).toBe('en');
  });
});