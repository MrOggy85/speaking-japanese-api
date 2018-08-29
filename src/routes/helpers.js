
export const asyncUtil = fn =>
function asyncUtilWrap(...args) {
  const fnReturn = fn(...args)
  const next = args[args.length-1]
  return Promise.resolve(fnReturn).catch(next)
}

export function parseId(req) {
  const id = req.params.id;
  if (!id) {
    const err = new Error('no id provided');
    err.status = 400;
    throw err;
  }
  return id;
}

export function parseJson(req) {
  const json = req.body;
  if (!json) {
    const err = new Error('no json body provided');
    err.status = 400;
    throw err;
  }
  return json;
}
