/** Set to false to let visitors switch to Hindi without the easter egg notice. */
export const HINDI_EASTER_EGG_ENABLED = true;

export function shouldShowHindiUnavailableNotice(
  languageCode: string,
  enabled = HINDI_EASTER_EGG_ENABLED,
): boolean {
  return enabled && languageCode.toLowerCase().split('-')[0] === 'hi';
}