export function createEnumObjectFromType<T extends string>(o: { [P in T]: P }) {
  return o;
}
