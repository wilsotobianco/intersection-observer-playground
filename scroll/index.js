import { linear } from "../utils/easings";
import { globals } from "../utils/globals";

let rafFrame;
const {
  document,
  requestAnimationFrame,
  cancelAnimationFrame,
  global,
} = globals;

const getProgress = (elapsed, total) => Math.min(elapsed / total, 1);

const stopScroll = () => {
  cancelAnimationFrame(rafFrame);
  document.documentElement.classList.remove("scrolling-automatically");
};

export const animateScroll = (direction, scrollSpeedControl) => {
  const isScrollDown = direction === "down";
  stopScroll();

  if (direction === "stop") {
    return;
  }

  global.addEventListener("wheel", () => stopScroll(), {
    passive: true,
    once: true,
  });

  document.documentElement.classList.add("scrolling-automatically");

  rafFrame = requestAnimationFrame((start) => {
    const { scrollY, innerHeight } = global;
    const { scrollHeight } = document.documentElement;
    const distance = isScrollDown
      ? scrollHeight - (scrollY + innerHeight)
      : scrollY * -1;

    const step = () =>
      requestAnimationFrame((now) => {
        const progress = getProgress(
          now - start,
          Math.abs((scrollSpeedControl.value / 1000) * distance)
        );

        if (progress >= 1) {
          stopScroll();
          return;
        }
        const easing = linear(progress);
        const position = distance * easing;
        global.scrollTo(0, scrollY + position);
        rafFrame = step();
      });
    rafFrame = step();
  });
};
