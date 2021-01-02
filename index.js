import { globals } from './utils/globals';
import { state } from './state';
import { setCssCustomProperty } from './utils/ui';
import { addEventListeners } from './utils/events';

const { document, setTimeout } = globals;

const {
  showDebuggerControl,
  intersectionObserverConfig,
  rootMarginTopUi,
  rootMarginBottomUi,
  articles,
} = state;

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

const updateIntersectionObserver = ({
  rootMarginTop,
  rootMarginBottom,
  threshold,
}) => {
  state.globalObserver?.disconnect();
  state.globalObserver = createIntersectionObserver({
    rootMarginTop,
    rootMarginBottom,
    threshold,
  });
};

const callback = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('tracked-element--visible');
      if (
        !state.debuggerHasBeenShown &&
        entry.target.classList.contains('tracked-element--activator')
      ) {
        state.debuggerHasBeenShown = true;
        document.documentElement.classList.add('show-debugger');
        setTimeout(() => showDebuggerControl.click(), 300);
      }
    } else {
      entry.target.classList.remove('tracked-element--visible');
    }
  });
};

const createIntersectionObserver = ({
  rootMarginTop,
  rootMarginBottom,
  threshold,
}) => {
  rootMarginTopUi.textContent = `-${rootMarginTop}`;
  rootMarginBottomUi.textContent = `-${rootMarginBottom}`;
  const config = {
    rootMargin: `-${rootMarginTop} 0${state.unit} -${rootMarginBottom} 0${state.unit}`,
    threshold,
  };
  const observer = new IntersectionObserver(callback, config);
  intersectionObserverConfig.value = JSON.stringify(config, null, 2);
  articles.forEach((article) => {
    observer.observe(article);
  });
  return observer;
};

addEventListeners(updateIntersectionObserver);

state.globalObserver = createIntersectionObserver({
  rootMarginTop: state.rootMarginTop,
  rootMarginBottom: state.rootMarginBottom,
});
