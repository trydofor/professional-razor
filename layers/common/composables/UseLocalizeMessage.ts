/**
 * localize i18n message and its args, return empty if got null or undefined.
 * @see localizeMessage
 */
export function useLocalizeMessage() {
  const { t } = useI18n();
  return localizeMessage(t);
}
