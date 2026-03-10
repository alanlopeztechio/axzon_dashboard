export function getColorFromText(text: string): [number, number, number] {
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = text.charCodeAt(index) + ((hash << 5) - hash);
  }

  const red = (hash >> 0) & 255;
  const green = (hash >> 8) & 255;
  const blue = (hash >> 16) & 255;

  return [Math.abs(red), Math.abs(green), Math.abs(blue)];
}
