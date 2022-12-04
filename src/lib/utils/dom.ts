export async function waitForNextAnimationFrame(count = 1) {
  for (let i = 0; i < count; i++) {
    await new Promise((resolve) => window.requestAnimationFrame(resolve));
  }
}

export function measureElementDimension(elem: HTMLElement, dimension: 'width' | 'height' = 'height') {
  if (elem) {
    return elem.getBoundingClientRect()[dimension];
  } else {
    return 0;
  }
}

export async function measureHiddenElementDimension(elem: HTMLElement, dimension: 'width' | 'height' = 'height') {

  if (elem) {
    const {style} = elem;
    const initialStyle = {
      position: style.getPropertyValue('position'),
      visibility: style.getPropertyValue('visibility'),
    };
    style.setProperty('position', 'absolute');
    style.setProperty('visibility', 'hidden');
    // wait render
    await waitForNextAnimationFrame(2);
    // measure
    let result = measureElementDimension(elem, dimension);
    // restore style
    Object.entries(initialStyle).forEach(([key, value]) => {
      style.setProperty(key, value);
    })
    return result;
  } else {
    return 0;
  }
}