
export function createActionTypes(action) {
  const actionConstant = action
    .split(' ')
    .map((word) => word.toUpperCase())
    .join('_');

  return [
    'request',
    'success',
    'error',
  ].reduce((result, current) => ({
    ...result,
    [current]: `${actionConstant}_${current.toUpperCase()}`,
  }), {});
}
