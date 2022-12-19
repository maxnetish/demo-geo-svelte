export function markByPositions(
  val: string,
  positions: { start: number, end: number }[] = [],
  markerStart = '<mark>',
  markerEnd = '</mark>',
) {
  if (!val) {
    return val;
  }

  if (!(positions && positions.length)) {
    return val;
  }

  const result: string[] = [];
  for (let ind = 0, len = val.length; ind < len; ind++) {
    if (positions.some(({start}) => {
      return start === ind;
    })) {
      result.push(`${markerStart}${val[ind]}`);
    } else if (positions.some(({end}) => {
      return end === ind;
    })) {
      result.push(`${markerEnd}${val[ind]}`);
    } else {
      result.push(val[ind]);
    }
  }
  return result.join('');
}