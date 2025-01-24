import WebFont from 'webfontloader';
import { DEFAULT_FONTS } from '../../config/fonts';

export async function loadFonts(fonts: string[]): Promise<void> {
  if (fonts.length === 0) return;

  return new Promise((resolve) => {
    WebFont.load({
      google: {
        families: fonts.map(font => `${font}:400,700`)
      },
      active: () => {
        console.log('Fonts loaded successfully');
        resolve();
      },
      inactive: () => {
        console.warn('Failed to load some fonts, using fallbacks');
        resolve();
      },
      timeout: 3000
    });
  });
}

export function getFallbackFonts(): string[] {
  return DEFAULT_FONTS;
}