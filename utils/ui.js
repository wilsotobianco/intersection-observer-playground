export const getElement = (element, selector) => {
  if (!element || !selector) {
    throw new Error('Element and selector need to have a value');
  }

  return element.querySelector(selector);
};

export const getElements = (element, selector) => {
  if (!element || !selector) {
    throw new Error('Element and selector need to have a value');
  }

  return [...element.querySelectorAll(selector)];
};

export const setCssCustomProperty = (element, key, value) => {
  element.style.setProperty(key, value);
};
