import { units } from './utils/units';
import { getElement, getElements } from './utils/ui';

const rootMarginTopControl = getElement(document, '#root-margin-top');
const rootMarginTopControlOutput = getElement(
  document,
  '#root-margin-top-output'
);
const rootMarginBottomControl = getElement(document, '#root-margin-bottom');
const rootMarginBottomControlOutput = getElement(
  document,
  '#root-margin-bottom-output'
);
const unitControls = getElement(document, '.units');
const showDebuggerControl = getElement(document, '#show-debugger');
const thresholdControl = getElement(document, '#threshold');
const scrollSpeedControl = getElement(document, '#scroll-speed');
const intersectionObserverConfig = getElement(document, 'textarea');
const rootMarginTopUi = getElement(document, '.root-margin--top span');
const rootMarginBottomUi = getElement(document, '.root-margin--bottom span');

const articles = getElements(document, '.tracked-element');
const jsScrollers = getElements(document, '.js-scroller');

export const state = {
  globalObserver: null,
  rafFrame: false,
  debuggerHasBeenShown: false,
  rootMarginTop: '250px',
  rootMarginBottom: '250px',
  unit: units.pixel,
  threshold: 0,
  rootMarginTopControl,
  rootMarginTopControlOutput,
  rootMarginBottomControl,
  rootMarginBottomControlOutput,
  unitControls,
  showDebuggerControl,
  thresholdControl,
  scrollSpeedControl,
  intersectionObserverConfig,
  rootMarginTopUi,
  rootMarginBottomUi,
  articles,
  jsScrollers,
};
