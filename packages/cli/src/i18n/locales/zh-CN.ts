export const messages = {
  // Detect command
  detect: {
    result: '检测到首选语言: {languageName} ({language})',
    source: '来源: {source}',
    confidence: '置信度: {confidence}'
  },

  // List command
  list: {
    title: '支持的语言:',
    usage: '使用方法: pnl set <语言代码>'
  },

  // Set command
  set: {
    success: '✅ 语言偏好已设置为: {languageName} ({language})',
    configSaved: '配置文件已保存到: {path}',
    errorMissingCode: '错误: 请提供语言代码。例如: pnl set zh-CN',
    commonLanguages: '常用语言: {languages}...',
    errorUnsupported: '错误: 不支持的语言代码 "{language}"',
    errorUnsupportedHint: '使用 "pnl list" 查看支持的语言。',
    errorSaveFailed: '保存配置失败: {error}'
  },

  // Show command
  show: {
    title: '─ 语言偏好详情 ──────────────────────────────',
    preferredLanguage: '首选语言:',
    languageCode: '语言代码:',
    detectionSource: '检测来源:',
    confidence: '置信度:'
  },

  // General errors
  error: {
    unknown: '未知错误',
    generic: '错误: {message}'
  },

  // Low confidence fallback
  fallback: {
    lowConfidenceNote: '(置信度较低 - 显示双语输出)'
  }
};

export type Messages = typeof messages;
