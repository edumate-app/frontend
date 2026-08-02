const displayNames = new Intl.DisplayNames(['pl'], { type: 'language' });

export function languageLabel(code: string): string {
  try {
    return displayNames.of(code) ?? code;
  } catch {
    return code;
  }
}
