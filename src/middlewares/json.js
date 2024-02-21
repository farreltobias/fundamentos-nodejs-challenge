export const json = async (req, res) => {
  const buffers = [];

  for await (const data of req) {
    buffers.push(data);
  }

  const body = Buffer.concat(buffers).toString();

  try {
    req.body = JSON.parse(body);
  } catch (error) {
    req.body = null;
  }

  res.setHeader('Content-Type', 'application/json');
};
