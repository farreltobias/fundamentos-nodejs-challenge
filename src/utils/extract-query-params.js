// query: ?name=ferret&color=purple

export const extractQueryParams = (query) => {
  return query
    .substr(1)
    .split('&')
    .reduce((acc, param) => {
      const [key, value] = param.split('=');

      acc[key] = value;
      return acc;
    }, {});
};
