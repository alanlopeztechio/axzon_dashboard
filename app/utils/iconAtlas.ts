export function createIconAtlas(): string {
  const canvas = document.createElement('canvas');
  const size = 128;
  const icons = 6;
  canvas.width = size * icons;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 8;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = 'bold 80px sans-serif';

  const half = size / 2;

  // Círculo
  ctx.beginPath();
  ctx.arc(0 * size + half, half, 40, 0, Math.PI * 2);
  ctx.fill();

  // Triángulo
  ctx.beginPath();
  ctx.moveTo(1 * size + half, 24);
  ctx.lineTo(1 * size + 24, size - 24);
  ctx.lineTo(1 * size + size - 24, size - 24);
  ctx.closePath();
  ctx.fill();

  // X
  ctx.fillText('✘', 2 * size + half, half + 5);

  // i (info)
  ctx.font = 'bold 90px serif';
  ctx.fillText('i', 3 * size + half, half);
  ctx.font = 'bold 80px sans-serif';

  // Check
  ctx.fillText('✔', 4 * size + half, half + 5);

  // ?
  ctx.fillText('?', 5 * size + half, half + 5);

  return canvas.toDataURL();
}
