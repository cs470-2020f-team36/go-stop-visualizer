export const roundFloat = (a: number) => {
  const f = Math.round(a * 10000) / 10000;
  if (Math.floor(f) === f) {
    return `${f}.`.padEnd(6, "0");
  }
  return `${Math.round(f * 10000) / 10000}`.padEnd(6, "0");
};
