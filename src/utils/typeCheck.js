export const isObject = (value) =>
  typeof value === 'object' && value !== null && Reflect.getPrototypeOf(value) !== null;
