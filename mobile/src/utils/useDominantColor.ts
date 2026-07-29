import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { getColors } from 'react-native-image-colors';

// Sul web la libreria calcola swatch fotografici (vibrant/muted/dominant, quest'ultimo bacato in
// module.web.js) pensati per foto con soggetto+sfondo, non per icone piatte: per icone quasi
// monocolore restituiscono un accento saturo (es. becco) invece del colore reale dello sfondo.
// Calcoliamo quindi la media reale dei pixel via canvas, molto più prevedibile per questo caso d'uso.
function getAverageColorWeb(imageUri: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const size = 32;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(null);
      ctx.drawImage(img, 0, 0, size, size);
      const { data } = ctx.getImageData(0, 0, size, size);
      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] === 0) continue;
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }
      if (count === 0) return resolve(null);
      const toHex = (v: number) => Math.round(v / count).toString(16).padStart(2, '0');
      resolve(`#${toHex(r)}${toHex(g)}${toHex(b)}`);
    };
    img.onerror = () => resolve(null);
    img.src = imageUri;
  });
}

export function useDominantColor(imageUri: string, fallbackColor: string) {
  const [color, setColor] = useState(fallbackColor);

  useEffect(() => {
    let isMounted = true;

    const resolveColor = async () => {
      if (Platform.OS === 'web') {
        const average = await getAverageColorWeb(imageUri);
        if (isMounted) setColor(average ?? fallbackColor);
        return;
      }

      const result = await getColors(imageUri, { fallback: fallbackColor, cache: false });
      if (!isMounted) return;
      const dominant = result.platform === 'android' ? result.dominant : result.platform === 'ios' ? result.background : fallbackColor;
      setColor(dominant ?? fallbackColor);
    };

    resolveColor();

    return () => {
      isMounted = false;
    };
  }, [imageUri, fallbackColor]);

  return color;
}
