/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

import { getParentLocale, normalizeLocale } from './locales';
import { Locale } from './types';

export interface LocaleEntry {
  locale: string;
  parentLocale?: string;
}

// Language tags have a hierarchical meaning which this function uses to expand
// the specified `locales` up to their root locales. This returns a collection
// of objects with a `locale` property and `parentLocale` property pointing to
// the locale's parent language tag, if it has one.
export default function expandLocales(
  locales: Locale | Locale[]
): Record<Locale, LocaleEntry> {
  if (!Array.isArray(locales)) {
    throw new Error('locales must be an array of strings');
  }

  // Traverses the specified `locales` and adds an entry for each one and its
  // hierarchy.
  return locales.reduce((locales: Record<Locale, LocaleEntry>, inputLocale) => {
    if (typeof inputLocale !== 'string') {
      throw new Error('locales must be an array of strings');
    }

    let locale: Locale | undefined = normalizeLocale(inputLocale);

    let parentLocale: string | undefined;
    let entry: LocaleEntry;

    // Creates an entry for each locale in the current `locale`'s hierarchy.
    // The "root" locale is ignored because the built-in `Intl` libraries in
    // JavaScript have no notion of a "root" locale; instead they use the
    // IANA Language Subtag Registry.
    while (locale && locale !== 'root') {
      entry = { locale };
      parentLocale = getParentLocale(locale);

      if (parentLocale && parentLocale !== 'root') {
        entry.parentLocale = parentLocale;
      }

      locales[locale] = entry;

      locale = parentLocale;
    }

    return locales;
  }, {});
}
