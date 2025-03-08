import { describe, it, expect, vi } from 'vitest';

describe('localizeMessage', () => {
  const mockTranslator = vi.fn((code: string) => (code === 'exist' ? 'Translated' : undefined));
  const localize = localizeMessage(mockTranslator);

  it('should return translated message when code exists', () => {
    expect(localize('exist')).toBe('Translated');
  });

  it('should return default value when translation is missing', () => {
    expect(localize('missing', 'Default')).toBe('Default');
  });

  it('should return the code itself when translation is missing and no default is provided', () => {
    expect(localize('missing')).toBe(undefined);
  });

  it('should return message when elze is true', () => {
    const i18n: I18nMessage = { i18nCode: 'exist', message: 'Default Message' };
    expect(localize(i18n, true)).toBe('Translated');
  });

  it('should return i18n.message when translation is missing and elze is true', () => {
    const i18n: I18nMessage = { i18nCode: 'missing', message: 'Default Message' };
    expect(localize(i18n, true)).toBe('Default Message');
  });

  it('should return i18nCode when translation is missing and elze is false', () => {
    const i18n: I18nMessage = { i18nCode: 'missing', message: 'Default Message' };
    expect(localize(i18n, false)).toBe('missing');
  });

  it('should return provided elze string when translation is missing', () => {
    expect(localize('missing', 'Fallback')).toBe('Fallback');
  });

  it('should return undefined when input is undefined and no elze is provided', () => {
    expect(localize(undefined)).toBe(undefined);
  });

  it('should return elze when input is undefined and elze is string', () => {
    expect(localize(undefined, 'Default')).toBe('Default');
  });

  it('should return undefined when input is an empty string', () => {
    expect(localize('')).toBe(undefined);
  });

  it('should return default message when i18nCode is empty', () => {
    const i18n: I18nMessage = { i18nCode: '', message: 'Fallback Message' };
    expect(localize(i18n, true)).toBe('Fallback Message');
  });

  it('should return i18nCode when elze is false and message is undefined', () => {
    const i18n: I18nMessage = { i18nCode: 'missing', message: undefined as unknown as string };
    expect(localize(i18n, false)).toBe('missing');
  });

  it('should not modify args if present', () => {
    const mockTranslatorWithArgs = vi.fn((code: string, args?: unknown[]) => (args ? `Translated ${args[0]}` : 'Translated'));
    const localizeWithArgs = localizeMessage(mockTranslatorWithArgs);

    const i18nWithArgs: I18nMessage = { i18nCode: 'exist', message: 'Message', i18nArgs: ['Arg'] };
    expect(localizeWithArgs(i18nWithArgs)).toBe('Translated Arg');
  });

  it('should return undefined when translation function returns null', () => {
    const mockTranslatorNull = vi.fn(() => null);
    const localizeNull = localizeMessage(mockTranslatorNull);
    expect(localizeNull('exist')).toBe(undefined);
  });

  it('should return default value when translation function returns code itself', () => {
    const mockTranslatorEcho = vi.fn((code: string) => code);
    const localizeEcho = localizeMessage(mockTranslatorEcho);
    expect(localizeEcho('exist', 'Fallback')).toBe('Fallback');
  });
});
