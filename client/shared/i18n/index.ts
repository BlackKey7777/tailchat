import i18next, {
  StringMap,
  TFunctionKeys,
  TOptions,
  TOptionsBase,
} from 'i18next';
import {
  useTranslation as useI18NTranslation,
  initReactI18next,
} from 'react-i18next';
import { crc32 } from 'crc';
import { defaultLanguage, languageDetector } from './language';
import { useState, useEffect } from 'react';
import HttpApi from 'i18next-http-backend';

/** Supported interface languages. */
export type AllowedLanguage = 'zh-CN' | 'en-US' | 'ru-RU';

i18next
  .use(languageDetector)
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en-US',
    load: 'currentOnly',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      allowMultiLoading: false,
      addPath: (...args: any[]) => {
        console.log('Lost translate:', ...args);
      },
    },
    react: {
      hashTransKey(defaultValue: string) {
        return `k${crc32(defaultValue).toString(16)}`;
      },
    },
  } as any);

type TFunctionResult = string | React.ReactNode;

interface TFunction {
  <TKeys extends TFunctionKeys = string>(key: TKeys): string;
  <
    TResult extends TFunctionResult = string,
    TKeys extends TFunctionKeys = string,
    TInterpolationMap extends object = StringMap
  >(
    key: TKeys,
    options?: TOptions<TInterpolationMap> | string
  ): TResult;
  <
    TResult extends TFunctionResult = string,
    TKeys extends TFunctionKeys = string,
    TInterpolationMap extends object = StringMap
  >(
    key: TKeys,
    defaultValue?: string,
    options?: TOptions<TInterpolationMap> | string
  ): TResult;
}

/** Internationalized translation helper. */
export const t: TFunction = (
  key: string,
  defaultValue?: string,
  options?: TOptionsBase & Record<string, unknown>
) => {
  try {
    const hashKey = `k${crc32(key).toString(16)}`;
    let words = i18next.t(hashKey, defaultValue, options);
    if (words === hashKey) {
      words = key;
      console.info(`[i18n] Missing translation: [${hashKey}]${key}`);
    }
    return words;
  } catch (err) {
    console.error(err);
    return key;
  }
};

/** Localized text for the active interface language. */
export function localTrans(trans: Record<AllowedLanguage, string>) {
  const lang = i18next.language as AllowedLanguage;
  return trans[lang] ?? trans['en-US'] ?? trans['zh-CN'];
}

/** Change i18next language. */
export async function setLanguage(lang: AllowedLanguage): Promise<void> {
  return new Promise((resolve, reject) => {
    i18next.changeLanguage(lang, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

/** Get current i18n language. */
export function getLanguage(): AllowedLanguage {
  return i18next.language as AllowedLanguage;
}

/** Subscribe to language resource loading. */
export function onLanguageLoaded(
  cb: (loaded: { [language: string]: { [namespace: string]: boolean } }) => void
) {
  i18next.on('loaded', cb);
}

/** Subscribe to language changes. */
export function onLanguageChanged(cb: (lang: string) => void) {
  i18next.on('languageChanged', cb);
}

/** React hook wrapper for i18next. */
export function useTranslation() {
  const { t: i18nT, ready } = useI18NTranslation();
  const [_t, _setT] = useState<TFunction>(() => t);
  useEffect(() => {
    _setT(() => (...args: any[]) => (t as any)(...args));
  }, [i18nT]);
  return { t: _t, ready };
}
