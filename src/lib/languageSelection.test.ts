import { describe, expect, it } from 'vitest';
import { HINDI_EASTER_EGG_ENABLED, shouldShowHindiUnavailableNotice } from './languageSelection';

describe('Hindi language easter egg', () => {
  it('is enabled by default and only intercepts Hindi', () => {
    expect(HINDI_EASTER_EGG_ENABLED).toBe(true);
    expect(shouldShowHindiUnavailableNotice('hi')).toBe(true);
    expect(shouldShowHindiUnavailableNotice('ur')).toBe(false);
  });

  it('can be disabled without changing other language selections', () => {
    expect(shouldShowHindiUnavailableNotice('hi', false)).toBe(false);
    expect(shouldShowHindiUnavailableNotice('ur', false)).toBe(false);
  });
});