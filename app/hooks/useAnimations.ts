import { useEffect, useState, useCallback, useRef } from 'react';
import { animate } from 'popmotion';

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

export function useHoverScale(isHovered: boolean) {
  const [scale, setScale] = useState(1);
  const animationRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
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
  }, [isHovered]);

  return scale;
}

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
