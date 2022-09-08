function hexToRGB(hex: string) {
  const hexColor = hex.replace('#', '');

  return {
    r: parseInt(hexColor.substr(0, 2), 16),
    g: parseInt(hexColor.substr(2, 2), 16),
    b: parseInt(hexColor.substr(4, 2), 16),
  };
}

export function getTextContrast(hex: string) {
  const { r, g, b } = hexToRGB(hex);
  const lum = (r * 299 + g * 587 + b * 114) / 1000;

  return lum >= 80 ? 'black' : 'white';
}

export function getBoxShadow(rawShadow: any[]) {
  return rawShadow
    .map(({ radius, offset, color, opacity }) => {
      const { r, g, b } = hexToRGB(color);

      return `${offset.x}px ${offset.y}px ${radius}px rgba(${r}, ${g}, ${b}, ${opacity})`;
    })
    .join(',');
}

export function cleanTokenName(name: string) {
  return name.replace(/\.\[default\]/g, '');
}