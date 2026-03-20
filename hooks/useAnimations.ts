import { useEffect, useState, useCallback, useRef } from 'react';
import { animate } from 'popmotion';

/**
 * Hook para manejar el tiempo de animación con requestAnimationFrame
 */
export function useAnimationTime() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let animFrame: number;

    const tick = () => {
      setTime(performance.now() / 1000);
      animFrame = requestAnimationFrame(tick);
    };

    animFrame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animFrame);
  }, []);

  return time;
}

/**
 * Hook para manejar rotación continua
 */
export function useRotation(duration: number = 3000) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const animation = animate({
      from: 0,
      to: 360,
      duration,
      repeat: Infinity,
      repeatType: 'loop',
      onUpdate: setRotation,
    });

    return () => animation.stop();
  }, [duration]);

  return rotation;
}

/**
 * Hook para manejar escala con animación spring al hacer hover
 */
export function useHoverScale(isHovered: boolean) {
  const [scale, setScale] = useState(1);
  const animationRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    // Detener animación anterior si existe
    animationRef.current?.stop();

    animationRef.current = animate({
      from: scale,
      to: isHovered ? 2.5 : 1,
      type: 'spring',
      stiffness: isHovered ? 400 : 300,
      damping: isHovered ? 10 : 15,
      onUpdate: setScale,
    });

    return () => {
      animationRef.current?.stop();
    };
  }, [isHovered]); // Solo depende de isHovered, no de scale

  return scale;
}

/**
 * Hook combinado para todas las animaciones del mapa
 */
export function useMapAnimations(hoveredId: string | null) {
  const time = useAnimationTime();
  const rotation = useRotation();
  const hoverScale = useHoverScale(!!hoveredId);

  return {
    time,
    rotation,
    hoverScale,
  };
}
