import { ConfettiOptions } from './ConfettiContext';

export const explosionFromElement = (el: HTMLElement) =>
  ({
    confettiSource: sourceFromElement(el),
    numberOfPieces: 100,
    initialVelocityX: 5,
    initialVelocityY: 6,
    tweenDuration: 500,
  } satisfies ConfettiOptions);

const sourceFromElement = (el: HTMLElement) => {
  const { x, y, width, height } = el.getBoundingClientRect();
  const initialSize = { w: width / 2, h: height / 2 };
  return {
    x: x + (width - initialSize.w) / 2,
    y: y + (height - initialSize.h) / 2,
    ...initialSize,
  };
};
