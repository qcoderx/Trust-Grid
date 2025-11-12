// components/Favicon.jsx
import { useEffect } from 'react';

const Favicon = () => {
  useEffect(() => {
    // Create a canvas to generate the favicon
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    // Set background
    ctx.fillStyle = '#10b981'; // Primary green color
    ctx.fillRect(0, 0, 32, 32);

    // Draw "</>" text
    ctx.fillStyle = '#000000'; // Black text
    ctx.font = 'bold 16px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('</>', 16, 16);

    // Convert to favicon
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = canvas.toDataURL('image/x-icon');
    document.head.appendChild(link);

    return () => {
      // Cleanup on unmount
      document.head.removeChild(link);
    };
  }, []);

  return null;
};

export default Favicon;