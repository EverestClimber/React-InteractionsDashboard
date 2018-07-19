/**
 * Helper for making action creator functions with the action type set as an
 * attribute on the action creator function itself.
 *
 * It takes a type and a function which takes some params and returns a
 * partial action object *without* a type field, and returns an augmented
 * function that (1) returns the same result but with the type field set to
 * the given type, and (2) has an extra attribute type with this type set on
 * the function itself for easier use of the same object in action matching
 * contexts too.
 *
 * Eg.
 *    makeActionCreator('SET_USER', (user) => ({ payload: user }))
 * returns:
 *    a function that:
 *    1. has type: 'SET_USER' set on it
 *    2. returns the same result *plus* a type field, eg.
 *        { payload: user, type: 'SET_USER' }
 *
 * @param type
 * @param maker
 * @returns {function}
 */
export function makeActionCreator(type, maker) {
  const wrappedMaker = (...args) => ({
    ...maker(...args),
    type,
  });
  wrappedMaker.type = type;
  return wrappedMaker;
}


/**
 * Helper for easy making of action of multiple action creator function that have
 * the action type as an attribute on the function itself.
 *
 * Eg.
 *    makeActionCreators('FETCH_COMMON_DATA', {
 *        request: () => {},
 *        success: (payload) => { payload },
 *        error: (message) => { message },
 *    })
 * returns:
 *    {
 *        request: () => { type: 'FETCH_COMMON_DATA_REQUEST'},
 *        success: (payload) => { type: 'FETCH_COMMON_DATA_SUCCESS',
 *                                payload },
 *        error: (message) => { type: 'FETCH_COMMON_DATA_ERROR',
 *                              message },
 *    }
 *
 * @param type
 * @param makers
 * @returns {object}
 */
export function makeActionCreators(type, makers) {
  const r = {};
  for (const [name, maker] of Object.entries(makers)) {
    r[name] = makeActionCreator(
      `${type}_${name.toUpperCase()}`,
      maker
    );
  }
  return r;
}


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
