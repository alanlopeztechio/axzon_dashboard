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

export const AXZON_PALETTE: [number, number, number][] = [
  [220, 38, 38],
  [239, 68, 68],
  [251, 113, 133],
  [71, 85, 105],
  [148, 163, 184],
  [30, 41, 59],
  [14, 165, 233],
  [20, 184, 166],
];

export function getAxzonColor(text: string): [number, number, number] {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AXZON_PALETTE.length;
  return AXZON_PALETTE[index];
}
