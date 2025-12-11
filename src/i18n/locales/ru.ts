export const messages = {
  // Detect command
  detect: {
    result: 'Обнаружен предпочитаемый язык: {languageName} ({language})',
    source: 'Источник: {source}',
    confidence: 'Достоверность: {confidence}'
  },

  // List command
  list: {
    title: 'Поддерживаемые языки:',
    usage: 'Использование: pnl set <код-языка>'
  },

  // Set command
  set: {
    success: '✅ Языковая настройка установлена на: {languageName} ({language})',
    configSaved: 'Конфигурация сохранена в: {path}',
    errorMissingCode: 'Ошибка: Укажите код языка. Пример: pnl set ru',
    commonLanguages: 'Распространенные языки: {languages}...',
    errorUnsupported: 'Ошибка: Неподдерживаемый код языка "{language}"',
    errorUnsupportedHint: 'Используйте "pnl list" для просмотра поддерживаемых языков.',
    errorSaveFailed: 'Не удалось сохранить конфигурацию: {error}'
  },

  // Show command
  show: {
    title: '─ Детали языковой настройки ─────────────────────',
    preferredLanguage: 'Предпочитаемый язык:',
    languageCode: 'Код языка:',
    detectionSource: 'Источник обнаружения:',
    confidence: 'Достоверность:'
  },

  // General errors
  error: {
    unknown: 'Неизвестная ошибка',
    generic: 'Ошибка: {message}'
  },

  // Low confidence fallback
  fallback: {
    lowConfidenceNote: '(Низкая достоверность обнаружения - двуязычный вывод)'
  }
};

export type Messages = typeof messages;
