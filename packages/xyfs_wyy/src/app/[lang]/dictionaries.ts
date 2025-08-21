import 'server-only';
import { Lang } from '../../middleware';

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  zh: () => import('./dictionaries/zh.json').then((module) => module.default),
};

export const getDictionary = async (locale: Lang) =>
  dictionaries[locale]();