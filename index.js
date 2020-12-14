((global) => {
  const {document} = global;
  let globalObserver = null;

  const units = {
    pixel: 'px',
    percentage: '%'
  };

  let rootMarginTop = '250px';
  let rootMarginBottom = '250px';
  let unit = units.pixel;

  document.documentElement.style.setProperty('--root-margin-top', rootMarginTop);
  document.documentElement.style.setProperty('--root-margin-bottom', rootMarginBottom);

  const articles = [...document.querySelectorAll('article')];

  const rootMarginTopControl = document.querySelector('#root-margin-top');
  const rootMarginTopControlOutput = document.querySelector('#root-margin-top-output');
  const rootMarginBottomControl = document.querySelector('#root-margin-bottom');
  const rootMarginBottomControlOutput = document.querySelector('#root-margin-bottom-output');
  const unitControls = document.querySelector('.units');
  const showDebuggerControl = document.querySelector('#show-debugger');

  rootMarginTopControl.addEventListener('input', () => {
    rootMarginTop = `${rootMarginTopControl.value}${unit}`;
    document.documentElement.style.setProperty('--root-margin-top', rootMarginTop);
    rootMarginTopControlOutput.textContent = rootMarginTopControl.value * -1;
    updateIntersectionObserver({rootMarginTop, rootMarginBottom});
  });

  rootMarginBottomControl.addEventListener('input', () => {
    rootMarginBottom = `${rootMarginBottomControl.value}${unit}`;
    document.documentElement.style.setProperty('--root-margin-bottom', rootMarginBottom);
    rootMarginBottomControlOutput.textContent = rootMarginBottomControl.value * -1;
    updateIntersectionObserver({rootMarginTop, rootMarginBottom});
  });

  showDebuggerControl.addEventListener('change', (event) => {
    if (event.target.checked) {
      document.documentElement.classList.add('show-debugger');
    } else {
      document.documentElement.classList.remove('show-debugger');
    }
  });
  unitControls.addEventListener('change', (event) => {
    unit = units[event.target.value] ?? units.pixel;
    if (unit === units.percentage) {
      rootMarginTopControl.step = 5;
      rootMarginTopControl.value = 25;
      rootMarginTopControl.max = 100;
      rootMarginBottomControl.step = 5;
      rootMarginBottomControl.value = 25;
      rootMarginBottomControl.max = 100;
    } else {
      rootMarginTopControl.step = 10;
      rootMarginTopControl.max = 500;
      rootMarginTopControl.value = 250;
      rootMarginBottomControl.step = 10;
      rootMarginBottomControl.max = 500;
      rootMarginBottomControl.value = 250;
    }

    rootMarginTop = `${rootMarginTopControl.value}${unit}`;
    rootMarginBottom = `${rootMarginBottomControl.value}${unit}`;
    document.documentElement.style.setProperty('--root-margin-top', rootMarginTop);
    document.documentElement.style.setProperty('--root-margin-bottom', rootMarginBottom);
    rootMarginTopControlOutput.textContent = rootMarginTopControl.value * -1;
    rootMarginBottomControlOutput.textContent = rootMarginBottomControl.value * -1;
    updateIntersectionObserver({rootMarginTop, rootMarginBottom});
  });

  const updateIntersectionObserver = ({rootMarginTop, rootMarginBottom}) => {
    globalObserver?.disconnect();
    globalObserver = createIntersectionObserver({rootMarginTop, rootMarginBottom});
  };

  const callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }

  const createIntersectionObserver = ({rootMarginTop, rootMarginBottom}) => {
    const observer = new IntersectionObserver(callback, {
      rootMargin: `-${rootMarginTop} 0${unit} -${rootMarginBottom} 0${unit}`,
      threshold: 0
    });
    articles.forEach((article) => {
      observer.observe(article);
    });
    return observer;
  };

  globalObserver = createIntersectionObserver({rootMarginTop, rootMarginBottom});
})(window);

