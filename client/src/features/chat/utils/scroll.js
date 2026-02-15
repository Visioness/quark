const SCROLL_THRESHOLD = 900;

export const isNearBottom = (element, threshold = SCROLL_THRESHOLD) =>
  element.scrollHeight - element.scrollTop - element.clientHeight < threshold;
