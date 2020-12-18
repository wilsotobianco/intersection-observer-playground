export const easeOut = (t) => (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2;
export const easeInQuad = (t) => t * t;
export const linear = (t) => t;
