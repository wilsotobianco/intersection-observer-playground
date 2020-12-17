((global) => {
  const {
    document,
    requestAnimationFrame,
    Math,
    cancelAnimationFrame,
  } = global;
  let globalObserver = null;
  let rafFrame;

  const units = {
    pixel: "px",
    percentage: "%",
  };

  let debuggerHasBeenShown = false;
  let rootMarginTop = "250px";
  let rootMarginBottom = "250px";
  let unit = units.pixel;
  let threshold = 0;

  document.documentElement.style.setProperty(
    "--root-margin-top",
    rootMarginTop
  );
  document.documentElement.style.setProperty(
    "--root-margin-bottom",
    rootMarginBottom
  );

  const articles = [...document.querySelectorAll(".tracked-element")];
  const jsBottomScroller = [...document.querySelectorAll(".js-scroller")];

  // const easeOut = (t) => (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2;
  const easeOut = (t) => t * t;

  const getProgress = (elapsed, total) => Math.min(elapsed / total, 1);

  const stopScroll = () => {
    cancelAnimationFrame(rafFrame);
    document.documentElement.classList.remove("scrolling-automatically");
  };

  const scrollToDirection = (direction) => {
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
          const easing = easeOut(progress);
          const position = distance * easing;
          global.scrollTo(0, scrollY + position);
          rafFrame = step();
        });
      rafFrame = step();
    });
  };

  document.documentElement.addEventListener("click", (event) => {
    if (!jsBottomScroller.includes(event.target)) {
      return;
    }

    event.preventDefault();
    scrollToDirection(event.target.dataset.direction);
  });

  const rootMarginTopControl = document.querySelector("#root-margin-top");
  const rootMarginTopControlOutput = document.querySelector(
    "#root-margin-top-output"
  );
  const rootMarginBottomControl = document.querySelector("#root-margin-bottom");
  const rootMarginBottomControlOutput = document.querySelector(
    "#root-margin-bottom-output"
  );
  const unitControls = document.querySelector(".units");
  const showDebuggerControl = document.querySelector("#show-debugger");
  const thresholdControl = document.querySelector("#threshold");
  const scrollSpeedControl = document.querySelector("#scroll-speed");
  const intersectionObserverConfig = document.querySelector("textarea");
  const rootMarginTopUi = document.querySelector(".root-margin--top span");
  const rootMarginBottomUi = document.querySelector(
    ".root-margin--bottom span"
  );

  const debounce = (callback) => {
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

  rootMarginTopControl.addEventListener(
    "input",
    debounce(() => {
      rootMarginTop = `${rootMarginTopControl.value}${unit}`;
      document.documentElement.style.setProperty(
        "--root-margin-top",
        rootMarginTop
      );
      rootMarginTopControlOutput.textContent = `${
        rootMarginTopControl.value * -1
      }${unit}`;
      updateIntersectionObserver({
        rootMarginTop,
        rootMarginBottom,
        threshold,
      });
    })
  );

  rootMarginBottomControl.addEventListener(
    "input",
    debounce(() => {
      rootMarginBottom = `${rootMarginBottomControl.value}${unit}`;
      document.documentElement.style.setProperty(
        "--root-margin-bottom",
        rootMarginBottom
      );
      rootMarginBottomControlOutput.textContent = `${
        rootMarginBottomControl.value * -1
      }${unit}`;
      updateIntersectionObserver({
        rootMarginTop,
        rootMarginBottom,
        threshold,
      });
    })
  );

  showDebuggerControl.addEventListener("change", (event) => {
    if (event.target.checked) {
      document.documentElement.classList.add("debugger-active");
    } else {
      document.documentElement.classList.remove("debugger-active");
    }
  });

  const refreshSlider = (target, { step, value, max }) => {
    target.step = step;
    target.max = max;
    target.value = value;
  };

  thresholdControl.addEventListener("change", (event) => {
    threshold = event.target.value;
    updateIntersectionObserver({ rootMarginTop, rootMarginBottom, threshold });
  });

  unitControls.addEventListener("change", (event) => {
    let newConfig = { step: 10, value: 250, max: 500 };

    unit = units[event.target.value] ?? units.pixel;

    if (unit === units.percentage) {
      newConfig = { step: 5, value: 25, max: 100 };
    }

    refreshSlider(rootMarginTopControl, newConfig);
    refreshSlider(rootMarginBottomControl, newConfig);

    rootMarginTop = `${rootMarginTopControl.value}${unit}`;
    rootMarginBottom = `${rootMarginBottomControl.value}${unit}`;
    document.documentElement.style.setProperty(
      "--root-margin-top",
      rootMarginTop
    );
    document.documentElement.style.setProperty(
      "--root-margin-bottom",
      rootMarginBottom
    );
    rootMarginTopControlOutput.textContent = `${
      rootMarginTopControl.value * -1
    }${unit}`;
    rootMarginBottomControlOutput.textContent = `${
      rootMarginBottomControl.value * -1
    }${unit}`;
    updateIntersectionObserver({ rootMarginTop, rootMarginBottom, threshold });
  });

  const updateIntersectionObserver = ({
    rootMarginTop,
    rootMarginBottom,
    threshold,
  }) => {
    globalObserver?.disconnect();
    globalObserver = createIntersectionObserver({
      rootMarginTop,
      rootMarginBottom,
      threshold,
    });
  };

  const callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("tracked-element--visible");
        if (
          !debuggerHasBeenShown &&
          entry.target.classList.contains("tracked-element--activator")
        ) {
          debuggerHasBeenShown = true;
          document.documentElement.classList.add("show-debugger");
          global.setTimeout(() => showDebuggerControl.click(), 300);
        }
      } else {
        entry.target.classList.remove("tracked-element--visible");
      }
    });
  };

  const createIntersectionObserver = ({
    rootMarginTop,
    rootMarginBottom,
    threshold,
  }) => {
    rootMarginTopUi.textContent = rootMarginTop;
    rootMarginBottomUi.textContent = rootMarginBottom;
    const config = {
      rootMargin: `-${rootMarginTop} 0${unit} -${rootMarginBottom} 0${unit}`,
      threshold,
    };
    const observer = new IntersectionObserver(callback, config);
    intersectionObserverConfig.value = JSON.stringify(config, null, 2);
    articles.forEach((article) => {
      observer.observe(article);
    });
    return observer;
  };

  globalObserver = createIntersectionObserver({
    rootMarginTop,
    rootMarginBottom,
  });
})(window);
