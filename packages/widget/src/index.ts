import { App } from './App';
import { configureReactI18next } from './i18n';

export * from './types';

configureReactI18next();
// ClassNameGenerator.configure((componentName) => componentName.replace('Mui', ''));

export const LiFiWidget = App;
