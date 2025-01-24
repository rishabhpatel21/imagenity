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

    // Create a temporary canvas for gradient text rendering
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) throw new Error('Failed to get canvas context');

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
              // Handle gradient effect
              if (layer.data.effects?.gradient) {
                const { colors, angle = 45 } = layer.data.effects.gradient;
                
                // Get text metrics from original element
                const computedStyle = window.getComputedStyle(originalElement);
                const fontString = `${layer.data.isBold ? 'bold' : ''} ${layer.data.fontSize}px "${layer.data.fontFamily}"`;
                
                // Measure text dimensions
                tempCtx.font = fontString;
                const metrics = tempCtx.measureText(layer.data.text);
                const textWidth = metrics.width;
                const textHeight = layer.data.fontSize;

                // Set up temporary canvas with proper dimensions
                tempCanvas.width = textWidth;
                tempCanvas.height = textHeight;
                tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
                
                // Calculate gradient coordinates based on angle
                const angleRad = (angle - 90) * Math.PI / 180; // Adjust angle to match CSS gradient
                const gradientLength = Math.max(textWidth, textHeight);
                const endX = Math.cos(angleRad) * gradientLength;
                const endY = Math.sin(angleRad) * gradientLength;
                
                // Create gradient
                const gradient = tempCtx.createLinearGradient(
                  textWidth / 2 - endX / 2,
                  textHeight / 2 - endY / 2,
                  textWidth / 2 + endX / 2,
                  textHeight / 2 + endY / 2
                );
                
                // Add color stops
                colors.forEach((color, i) => {
                  gradient.addColorStop(i / (colors.length - 1), color);
                });

                // Set up text styles
                tempCtx.fillStyle = gradient;
                tempCtx.font = fontString;
                tempCtx.textBaseline = 'top';
                tempCtx.textAlign = 'left';
                
                // Draw text with gradient
                tempCtx.fillText(layer.data.text, 0, 0);
                
                // Create an image from the gradient text
                const gradientTextImage = document.createElement('img');
                gradientTextImage.src = tempCanvas.toDataURL('image/png');
                gradientTextImage.style.position = 'absolute';
                gradientTextImage.style.left = `${layer.data.x}px`;
                gradientTextImage.style.top = `${adjustTextPosition(layer.data.y)}px`;
                gradientTextImage.style.zIndex = index.toString();
                gradientTextImage.style.pointerEvents = 'none';
                
                // Replace original element with gradient image
                clonedElement.replaceWith(gradientTextImage);
              } else {
                // Handle non-gradient text
                clonedElement.style.position = 'absolute';
                clonedElement.style.left = `${layer.data.x}px`;
                clonedElement.style.top = `${adjustTextPosition(layer.data.y)}px`;
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
              }

              // Handle shadow effect
              if (layer.data.effects?.shadow) {
                const { color, blur, offsetX, offsetY } = layer.data.effects.shadow;
                clonedElement.style.textShadow = `${offsetX}px ${offsetY}px ${blur}px ${color}`;
              }

              // Handle outline effect
              if (layer.data.effects?.outline) {
                const { width, color } = layer.data.effects.outline;
                clonedElement.style.webkitTextStroke = `${width}px ${color}`;
              }

              // Remove drag handle
              const dragHandle = clonedElement.querySelector('.drag-handle');
              if (dragHandle) dragHandle.remove();
            }
          } else if (layer.type === 'image' && layer.data) {
            // Handle added images
            const clonedElement = clonedContainer.querySelector(`[data-image-id="${layer.data.id}"]`);
            const originalElement = container.querySelector(`[data-image-id="${layer.data.id}"]`);

            if (clonedElement instanceof HTMLElement && originalElement instanceof HTMLElement) {
              clonedElement.style.position = 'absolute';
              clonedElement.style.left = `${layer.data.x}px`;
              clonedElement.style.top = `${layer.data.y}px`;
              clonedElement.style.width = `${layer.data.width}px`;
              clonedElement.style.height = `${layer.data.height}px`;
              clonedElement.style.transform = 'none';
              clonedElement.style.zIndex = index.toString();

              const img = clonedElement.querySelector('img');
              const originalImg = originalElement.querySelector('img');
              if (img && originalImg) {
                img.src = originalImg.src;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'contain';
              }
            }
          } else if (layer.type === 'background' && image.original) {
            const img = clonedContainer.querySelector('img');
            if (img) {
              img.src = image.original;
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
              fgImg.src = image.foreground;
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