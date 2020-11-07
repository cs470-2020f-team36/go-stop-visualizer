export function assert(condition: boolean, errorMessage?: any) {
  if (!condition) {
    throw new Error(errorMessage);
  }
}
