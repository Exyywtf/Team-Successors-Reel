/** Clamp a value between min and max */
export const clamp = (val: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, val));

/** Remap val from [inMin,inMax] to [outMin,outMax], clamped */
export const remap = (
  val: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  const t = clamp((val - inMin) / (inMax - inMin), 0, 1);
  return outMin + t * (outMax - outMin);
};

/** Ease out cubic — useful for manual interpolation */
export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/** Ease out expo */
export const easeOutExpo = (t: number): number =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
