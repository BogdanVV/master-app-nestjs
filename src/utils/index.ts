export const omitProp = (
  object: Record<string, any>,
  propsToOmit: string[],
) => {
  return Object.fromEntries(
    Object.entries(object).filter((p) => !propsToOmit.includes(p[0])),
  );
};
