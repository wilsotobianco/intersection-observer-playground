import { state } from '../state';
import { units } from './units';
import { animateScroll } from '../scroll';
import { globals } from './globals';
import { setCssCustomProperty } from './ui';

const { requestAnimationFrame } = globals;

const {
  rootMarginTopControl,
  rootMarginTopControlOutput,
  rootMarginBottomControl,
  rootMarginBottomControlOutput,
  unitControls,
  showDebuggerControl,
  scrollSpeedControl,
  thresholdControl,
  jsScrollers,
} = state;

const refreshSlider = (target, { step, value, max }) => {
  target.step = step;
  target.max = max;
  target.value = value;
};

export const debounce = (callback) => {
  let isTicking = false;

  return () => {
    if (isTicking) {
      return;
    }

    isTicking = true;
    requestAnimationFrame(() => {
      callback();
      isTicking = false;
    });
  };
};

export const addEventListeners = (refresh) => {
  document.documentElement.addEventListener('click', (event) => {
    if (!jsScrollers.includes(event.target)) {
      return;
    }

    event.preventDefault();
    animateScroll(event.target.dataset.direction, scrollSpeedControl);
  });

  rootMarginTopControl.addEventListener(
    'input',
    debounce(() => {
      state.rootMarginTop = `${rootMarginTopControl.value}${state.unit}`;
      setCssCustomProperty(
        document.documentElement,
        '--root-margin-top',
        state.rootMarginTop
      );
      rootMarginTopControlOutput.textContent = `${
        rootMarginTopControl.value * -1
      }${state.unit}`;
      refresh({
        rootMarginTop: state.rootMarginTop,
        rootMarginBottom: state.rootMarginBottom,
        threshold: state.threshold,
      });
    })
  );

  rootMarginBottomControl.addEventListener(
    'input',
    debounce(() => {
      state.rootMarginBottom = `${rootMarginBottomControl.value}${state.unit}`;
      setCssCustomProperty(
        document.documentElement,
        '--root-margin-bottom',
        state.rootMarginBottom
      );
      rootMarginBottomControlOutput.textContent = `${
        rootMarginBottomControl.value * -1
      }${state.unit}`;
      refresh({
        rootMarginTop: state.rootMarginTop,
        rootMarginBottom: state.rootMarginBottom,
        threshold: state.threshold,
      });
    })
  );

  showDebuggerControl.addEventListener('change', (event) => {
    if (event.target.checked) {
      document.documentElement.classList.add('debugger-active');
    } else {
      document.documentElement.classList.remove('debugger-active');
    }
  });

  thresholdControl.addEventListener('change', (event) => {
    state.threshold = event.target.value;
    refresh({
      rootMarginTop: state.rootMarginTop,
      rootMarginBottom: state.rootMarginBottom,
      threshold: state.threshold,
    });
  });

  unitControls.addEventListener('change', (event) => {
    let newConfig = { step: 10, value: 250, max: 500 };

    state.unit = units[event.target.value] ?? units.pixel;

    if (state.unit === units.percentage) {
      newConfig = { step: 5, value: 25, max: 100 };
    }

    refreshSlider(rootMarginTopControl, newConfig);
    refreshSlider(rootMarginBottomControl, newConfig);

    state.rootMarginTop = `${rootMarginTopControl.value}${state.unit}`;
    state.rootMarginBottom = `${rootMarginBottomControl.value}${state.unit}`;
    setCssCustomProperty(
      document.documentElement,
      '--root-margin-top',
      state.rootMarginTop
    );
    setCssCustomProperty(
      document.documentElement,
      '--root-margin-bottom',
      state.rootMarginBottom
    );
    rootMarginTopControlOutput.textContent = `${
      rootMarginTopControl.value * -1
    }${state.unit}`;
    rootMarginBottomControlOutput.textContent = `${
      rootMarginBottomControl.value * -1
    }${state.unit}`;
    refresh({
      rootMarginTop: state.rootMarginTop,
      rootMarginBottom: state.rootMarginBottom,
      threshold: state.threshold,
    });
  });
};
