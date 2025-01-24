import { FONTS_API_URL, POPULAR_GOOGLE_FONTS } from '../../config/fonts';

interface GoogleFont {
  family: string;
  variants: string[];
  category: string;
}

interface FontsResponse {
  items: GoogleFont[];
}

export async function fetchGoogleFonts(apiKey: string): Promise<string[]> {
  try {
    const url = `${FONTS_API_URL}?key=${apiKey}&sort=popularity`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch fonts from Google API');
    }

    const data: FontsResponse = await response.json();
    return data.items.slice(0, 50).map(font => font.family);
  } catch (error) {
    console.error('Error fetching Google Fonts:', error);
    return POPULAR_GOOGLE_FONTS;
  }
}