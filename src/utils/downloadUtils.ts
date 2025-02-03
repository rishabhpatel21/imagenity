import { useCanvasStore } from '../stores/canvasStore';
import html2canvas from 'html2canvas';
import { adjustTextPosition } from './download/textPosition';

interface DownloadOptions {
  width?: number;
  height?: number;
  quality?: number;
  label?: string;
}

export async function downloadImage(options: DownloadOptions = {}) {
  try {
    const container = document.getElementById('canvas-container');
    if (!container) throw new Error('Canvas container not found');

    const { image, layers } = useCanvasStore.getState();
    if (!image?.original) throw new Error('No image to download');

    // Wait for fonts to load
    await document.fonts.ready;

    // Create canvas with proper dimensions
    const canvas = await html2canvas(container, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      width: container.offsetWidth,
      height: container.offsetHeight,
      scale: window.devicePixelRatio || 1,
      logging: false,
      onclone: (clonedDoc) => {
        const clonedContainer = clonedDoc.getElementById('canvas-container');
        if (!clonedContainer) return;

        // Process each layer in order
        layers.forEach((layer, index) => {
          if (!layer.isVisible) return;

          if (layer.type === 'text' && layer.data) {
            const clonedElement = clonedContainer.querySelector(`[data-text-id="${layer.data.id}"]`);
            const originalElement = container.querySelector(`[data-text-id="${layer.data.id}"]`);
            
            if (clonedElement instanceof HTMLElement && originalElement instanceof HTMLElement) {
              // Set absolute positioning with adjusted vertical position
              clonedElement.style.position = 'absolute';
              clonedElement.style.left = `${layer.data.x}px`;
              clonedElement.style.top = `${adjustTextPosition(layer.data.y)}px`; // Apply vertical adjustment
              clonedElement.style.transform = 'none'; // Remove transform
              clonedElement.style.zIndex = index.toString();
              clonedElement.style.margin = '0';
              clonedElement.style.padding = '0';
              clonedElement.style.fontFamily = `"${layer.data.fontFamily}", sans-serif`;
              clonedElement.style.fontSize = `${layer.data.fontSize}px`;
              clonedElement.style.fontWeight = layer.data.isBold ? 'bold' : 'normal';
              clonedElement.style.fontStyle = layer.data.isItalic ? 'italic' : 'normal';
              clonedElement.style.textDecoration = layer.data.isUnderline ? 'underline' : 'none';
              clonedElement.style.lineHeight = '1';
              clonedElement.style.whiteSpace = 'pre';
              clonedElement.style.display = 'inline-block';
              clonedElement.style.color = layer.data.color;
              clonedElement.style.pointerEvents = 'none';

              // Handle effects
              if (layer.data.effects) {
                // Shadow effect
                if (layer.data.effects.shadow) {
                  const { color, blur, offsetX, offsetY } = layer.data.effects.shadow;
                  clonedElement.style.textShadow = `${offsetX}px ${offsetY}px ${blur}px ${color}`;
                }

                // Outline effect
                if (layer.data.effects.outline) {
                  const { width, color } = layer.data.effects.outline;
                  clonedElement.style.webkitTextStroke = `${width}px ${color}`;
                }

                // Gradient effect
                if (layer.data.effects.gradient) {
                  const { colors, angle = 45 } = layer.data.effects.gradient;
                  clonedElement.style.backgroundImage = `linear-gradient(${angle}deg, ${colors.join(', ')})`;
                  clonedElement.style.webkitBackgroundClip = 'text';
                  clonedElement.style.webkitTextFillColor = 'transparent';
                }
              }

              // Remove drag handle
              const dragHandle = clonedElement.querySelector('.drag-handle');
              if (dragHandle) dragHandle.remove();
            }
          } else if (layer.type === 'image' && layer.data) {
            const clonedElement = clonedContainer.querySelector(`[data-image-id="${layer.data.id}"]`);
            if (clonedElement instanceof HTMLElement) {
              clonedElement.style.position = 'absolute';
              clonedElement.style.left = `${layer.data.x}px`;
              clonedElement.style.top = `${layer.data.y}px`;
              clonedElement.style.width = `${layer.data.width}px`;
              clonedElement.style.height = `${layer.data.height}px`;
              clonedElement.style.transform = 'none';
              clonedElement.style.zIndex = index.toString();
              clonedElement.style.pointerEvents = 'none';
            }
          } else if (layer.type === 'background' && image.original) {
            const img = clonedContainer.querySelector('img');
            if (img) {
              img.style.position = 'absolute';
              img.style.top = '0';
              img.style.left = '0';
              img.style.width = '100%';
              img.style.height = '100%';
              img.style.objectFit = 'contain';
              img.style.zIndex = index.toString();
            }
          } else if (layer.type === 'foreground' && image.foreground) {
            const fgImg = clonedContainer.querySelector('img:last-child');
            if (fgImg) {
              fgImg.style.position = 'absolute';
              fgImg.style.top = '0';
              fgImg.style.left = '0';
              fgImg.style.width = '100%';
              fgImg.style.height = '100%';
              fgImg.style.objectFit = 'contain';
              fgImg.style.zIndex = index.toString();
            }
          }
        });
      }
    });

    // Create and trigger download
    const filename = `text-behind-image${options.label ? `-${options.label}` : ''}.png`;
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png', options.quality || 1.0);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
}