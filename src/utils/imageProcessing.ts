import { AzureApiError } from './azure/errors';
import { segmentForeground } from './azure/segmentation';

export class ImageProcessingError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'ImageProcessingError';
  }
}

export interface RemoveBgOptions {
  size?: 'regular' | 'medium' | 'hd' | '4k';
}

export async function removeBackground(imageFile: File, options: RemoveBgOptions = {}): Promise<string> {
  try {
    // Validate file size (max 4MB for Azure's free tier)
    if (imageFile.size > 4 * 1024 * 1024) {
      throw new ImageProcessingError(
        'Image size must be less than 4MB',
        'FILE_TOO_LARGE'
      );
    }

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      throw new ImageProcessingError(
        'Invalid file type. Please upload an image.',
        'INVALID_FILE_TYPE'
      );
    }

    // Convert File to ArrayBuffer
    const imageData = await imageFile.arrayBuffer();
    
    // Process with Azure Computer Vision
    const foregroundBlob = await segmentForeground(imageData);
    
    // Create URL for the foreground image
    return URL.createObjectURL(foregroundBlob);
  } catch (error) {
    if (error instanceof AzureApiError) {
      throw new ImageProcessingError(
        `Azure API Error: ${error.message}`,
        error.code
      );
    }
    if (error instanceof ImageProcessingError) {
      throw error;
    }
    throw new ImageProcessingError(
      'Failed to process image. Please try again.',
      'UNKNOWN_ERROR'
    );
  }
}

export function revokeImageUrls(urls: string[]) {
  urls.forEach(url => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });
}