# Supported Languages

This tool supports 70+ languages and regional variants with BCP-47 compliant language codes.

## Supported Languages

### Primary Languages

| Language | Code | Native Name | Region |
|----------|------|-------------|---------|
| English (United States) | `en-US` | English | United States |
| English (United Kingdom) | `en-GB` | English | United Kingdom |
| Chinese (Simplified) | `zh-CN` | 简体中文 | China |
| Chinese (Traditional) | `zh-TW` | 繁體中文 | Taiwan |
| Chinese (Hong Kong) | `zh-HK` | 繁體中文 | Hong Kong |
| Japanese | `ja-JP` | 日本語 | Japan |
| Korean | `ko-KR` | 한국어 | South Korea |
| Spanish (Spain) | `es-ES` | Español | Spain |
| Spanish (Mexico) | `es-MX` | Español | Mexico |
| Spanish (Argentina) | `es-AR` | Español | Argentina |
| French (France) | `fr-FR` | Français | France |
| French (Canada) | `fr-CA` | Français | Canada |
| German (Germany) | `de-DE` | Deutsch | Germany |
| German (Austria) | `de-AT` | Deutsch | Austria |
| Portuguese (Brazil) | `pt-BR` | Português | Brazil |
| Portuguese (Portugal) | `pt-PT` | Português | Portugal |
| Italian (Italy) | `it-IT` | Italiano | Italy |
| Russian | `ru-RU` | Русский | Russia |
| Arabic (Egypt) | `ar-EG` | العربية | Egypt |
| Arabic (Saudi Arabia) | `ar-SA` | العربية | Saudi Arabia |
| Hindi | `hi-IN` | हिन्दी | India |
| Thai | `th-TH` | ไทย | Thailand |
| Vietnamese | `vi-VN` | Tiếng Việt | Vietnam |
| Indonesian | `id-ID` | Bahasa Indonesia | Indonesia |
| Malay | `ms-MY` | Bahasa Melayu | Malaysia |
| Turkish | `tr-TR` | Türkçe | Turkey |
| Polish | `pl-PL` | Polski | Poland |
| Dutch (Netherlands) | `nl-NL` | Nederlands | Netherlands |
| Swedish | `sv-SE` | Svenska | Sweden |
| Norwegian | `nb-NO` | Norsk | Norway |
| Danish | `da-DK` | Dansk | Denmark |
| Finnish | `fi-FI` | Suomi | Finland |
| Greek | `el-GR` | Ελληνικά | Greece |
| Hebrew | `he-IL` | עברית | Israel |
| Czech | `cs-CZ` | Čeština | Czech Republic |
| Hungarian | `hu-HU` | Magyar | Hungary |
| Romanian | `ro-RO` | Română | Romania |
| Bulgarian | `bg-BG` | Български | Bulgaria |
| Croatian | `hr-HR` | Hrvatski | Croatia |
| Serbian | `sr-RS` | Српски | Serbia |
| Slovenian | `sl-SI` | Slovenščina | Slovenia |
| Estonian | `et-EE` | Eesti | Estonia |
| Latvian | `lv-LV` | Latviešu | Latvia |
| Lithuanian | `lt-LT` | Lietuvių | Lithuania |
| Ukrainian | `uk-UA` | Українська | Ukraine |
| Catalan | `ca-ES` | Català | Spain |
| Basque | `eu-ES` | Euskara | Spain |
| Galician | `gl-ES` | Galego | Spain |
| Slovak | `sk-SK` | Slovenčina | Slovakia |
| Icelandic | `is-IS` | Íslenska | Iceland |

### Regional Variants

| Language | Code | Native Name | Region |
|----------|------|-------------|---------|
| English (Australia) | `en-AU` | English | Australia |
| English (Canada) | `en-CA` | English | Canada |
| English (India) | `en-IN` | English | India |
| English (Ireland) | `en-IE` | English | Ireland |
| English (New Zealand) | `en-NZ` | English | New Zealand |
| English (Singapore) | `en-SG` | English | Singapore |
| English (South Africa) | `en-ZA` | English | South Africa |
| French (Switzerland) | `fr-CH` | Français | Switzerland |
| German (Switzerland) | `de-CH` | Deutsch | Switzerland |
| Italian (Switzerland) | `it-CH` | Italiano | Switzerland |
| Portuguese (Angola) | `pt-AO` | Português | Angola |
| Spanish (Chile) | `es-CL` | Español | Chile |
| Spanish (Colombia) | `es-CO` | Español | Colombia |
| Spanish (Peru) | `es-PE` | Español | Peru |
| Spanish (Venezuela) | `es-VE` | Español | Venezuela |

## Language Code Format

All language codes follow the [BCP-47](https://www.rfc-editor.org/info/bcp47) standard format:

```
language-code[-script-code][-country-code]
```

### Examples

- `en-US` - English in United States
- `zh-CN` - Chinese (Simplified) in China
- `ja-JP` - Japanese in Japan
- `pt-BR` - Portuguese in Brazil

## Adding New Languages

To add support for a new language:

1. Add the language code and name to `src/languageNames.ts`
2. Add appropriate test cases to `__tests__/unit/languageNames.test.ts`
3. Run tests to ensure everything works correctly
4. Submit a pull request

## Language Detection Priority

The tool detects language preferences in this order:

1. **Configuration File** (`.preferred-language.json`)
2. **Custom Environment Variables** (`*_NATURAL_LANGUAGE`)
3. **OS Locale Settings**
4. **Standard Environment Variables** (`LANGUAGE`, `LC_*`, `LANG`)
5. **HTTP Accept-Language Header**
6. **Fallback** (`en-US`)

For more details, see the [main README](../README.md).