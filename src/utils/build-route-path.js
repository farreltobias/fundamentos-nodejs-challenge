export const buildRoutePath = (path) => {
  const routeParametersRegex = /:(\w+)/g;
  const paramsWithRegex = path.replaceAll(
    routeParametersRegex,
    '(?<$1>[a-z0-9-_]+)'
  );

  const pathRegex = new RegExp(`^${paramsWithRegex}(?<query>\\?(.*))?$`);

  return pathRegex;
};
