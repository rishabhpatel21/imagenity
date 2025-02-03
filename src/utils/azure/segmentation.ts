import { AzureApiError } from './errors';
import { azureConfig } from './config';
import { AzureError } from './types';

export async function segmentForeground(imageData: ArrayBuffer): Promise<Blob> {
  const endpoint = `${azureConfig.endpoint}/computervision/imageanalysis:segment?api-version=2023-02-01-preview&mode=backgroundRemoval`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': azureConfig.apiKey
      },
      body: imageData
    });

    if (!response.ok) {
      const errorData = await response.json() as AzureError;
      throw new AzureApiError(
        errorData.error?.message || 'Segmentation failed',
        errorData.error?.code || 'SEGMENTATION_ERROR',
        response.status
      );
    }

    // The response is directly the image blob
    return await response.blob();
  } catch (error) {
    if (error instanceof AzureApiError) {
      throw error;
    }
    throw new AzureApiError(
      'Failed to segment image',
      'UNKNOWN_ERROR'
    );
  }
}