export const messages = {
  // Detect command
  detect: {
    result: '감지된 선호 언어: {languageName} ({language})',
    source: '출처: {source}',
    confidence: '신뢰도: {confidence}'
  },

  // List command
  list: {
    title: '지원되는 언어:',
    usage: '사용법: pnl set <언어코드>'
  },

  // Set command
  set: {
    success: '✅ 언어 설정이 다음으로 설정되었습니다: {languageName} ({language})',
    configSaved: '구성이 저장되었습니다: {path}',
    errorMissingCode: '오류: 언어 코드를 제공하십시오. 예: pnl set ko',
    commonLanguages: '일반적인 언어: {languages}...',
    errorUnsupported: '오류: 지원되지 않는 언어 코드 "{language}"',
    errorUnsupportedHint: '"pnl list"를 사용하여 지원되는 언어를 확인하십시오.',
    errorSaveFailed: '구성 저장 실패: {error}'
  },

  // Show command
  show: {
    title: '─ 언어 설정 세부정보 ────────────────────────────',
    preferredLanguage: '선호 언어:',
    languageCode: '언어 코드:',
    detectionSource: '감지 출처:',
    confidence: '신뢰도:'
  },

  // General errors
  error: {
    unknown: '알 수 없는 오류',
    generic: '오류: {message}'
  },

  // Low confidence fallback
  fallback: {
    lowConfidenceNote: '(낮은 신뢰도 감지 - 이중 언어 출력 표시)'
  }
};

export type Messages = typeof messages;
